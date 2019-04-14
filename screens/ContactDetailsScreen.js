import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import PropTypes from 'prop-types';

import { deleteContact } from '../store/actions/contacts.actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  contactContainer: {},
  contactItem: {
    height: 90,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  contactSubtitle: {
    paddingTop: 6,
    fontWeight: '200',
    color: 'rgba(0,0,0,0.6)',
  },
  errorText: {
    textAlign: 'center',
    height: 100,
    padding: 20,
    color: 'rgba(0,0,0,0.4)',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

class ContactDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Contact Details',
      headerRight: 
        <TouchableOpacity style={ [{ paddingHorizontal:15 }] }
          onPress={navigation.getParam('onEditPress')}>
          <Icon 
            name="md-create" 
            style={{fontSize: 26}}
          />
        </TouchableOpacity>,    
      headerLeft:
        <Icon name="md-arrow-back"
          onPress={() => navigation.push('Contacts')}
          style={ [{ paddingHorizontal:15 }, { fontSize: 26 }] } 
        />
    };
  };
  
  constructor(props) {
    super(props)
    var contact = props.navigation.getParam('contact')
    // TODO: implement support for multi-select sources
    if (Array.isArray(contact.sources)) {
      contact.sources = contact.sources[0]
    }
    // TODO: implement support for multi-select locations 
    if (Array.isArray(contact.locations)) {
      contact.locations = contact.locations[0]
    }
    this.state = {
      key: contact.key || '',
      name: contact.name || '',
      contact_phone: contact.contact_phone || '',
      contact_email: contact.contact_email || '',
      sources: contact.sources || '',
      locations: contact.locations || '',
      initial_comment: contact.initial_comment || ''
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ onEditPress: this._onEditPress });
  }

  _onEditPress = () => {
    this.props.navigation.push('NewEditContact', { headerTitleParam: 'Edit Contact', contact: this.state, isEdit: true })
  };

  _deleteContact = async () => {
    this.props.deleteContact(this.props.user, this.state)
    this.refs.toast.show('Contact Deleted', 100, () => {
      this.props.navigation.push('Contacts')
    });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ margin: 20, color: 'rgba(0,0,0,0.4)' }}>
          Name: 
          <Text style={{ fontWeight: 'bold' }}>
            {this.state.name}
          </Text>
        </Text>
        <Button style={{ padding: 50 }} title="Delete Contact" onPress={this._deleteContact} />
        <Toast ref="toast" position={'center'}/>
      </View>
    )
  }
}

/*
ContactDetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  contacts: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  getContacts: PropTypes.func.isRequired,
};
ContactsScreen.defaultProps = {
  error: null,
};
*/
const mapStateToProps = state => ({
  user: state.userReducer,
});
const mapDispatchToProps = dispatch => ({
  deleteContact: (user, contact) => {
    dispatch(deleteContact(user, contact));
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(ContactDetailsScreen);
