import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Form, Item, Icon, Input, Label, Picker,
} from 'native-base';
import Toast from 'react-native-easy-toast';
import Colors from '../constants/Colors';

import { saveContact } from '../store/actions/contacts.actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: Colors.tintColor,
    width: '100%',
    paddingTop: 100,
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  welcomeImage: {
    height: 60,
    width: 250,
    resizeMode: 'contain',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    padding: 20,
  },
  formField: {
    marginLeft: 0,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: Colors.tintColor,
    borderRadius: 2,
  },
  submitButtonText: {
    color: 'white',
  },
});

class NewEditContactScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('headerTitleParam', 'Contact'),
    headerRight:
  <TouchableOpacity
    style={[{ paddingHorizontal: 15 }]}
    onPress={navigation.getParam('onSavePress')}
  >
    <Icon name="md-checkmark" />
  </TouchableOpacity>,
    headerLeft:
  <Icon
    name="md-arrow-back"
    onPress={() => navigation.push('Contacts')}
    style={[{ paddingHorizontal: 15 }]}
  />,
  });

  constructor(props) {
    super(props);
    if (props.navigation.getParam('isEdit')) {
      const contact = props.navigation.getParam('contact');
      // TODO: implement support for multi-select sources
      if (Array.isArray(contact.sources)) {
        /* eslint-disable-next-line prefer-destructuring */
        contact.sources = contact.sources[0];
      }
      // TODO: implement support for multi-select locations
      if (Array.isArray(contact.locations)) {
        /* eslint-disable-next-line prefer-destructuring */
        contact.locations = contact.locations[0];
      }
      this.state = {
        key: contact.key || '',
        name: contact.name || '',
        contact_phone: contact.contact_phone || '',
        contact_email: contact.contact_email || '',
        sources: contact.sources || '',
        locations: contact.locations || '',
        initial_comment: contact.initial_comment || '',
      };
    } else {
      this.state = {
        key: '',
        name: '',
        contact_phone: '',
        contact_email: '',
        sources: '',
        locations: '',
        initial_comment: '',
      };
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSavePress: this.onSavePress });
  }

  onSavePress = () => {
    Keyboard.dismiss();
    this.props.saveContact(this.props.user, this.state);
    this.toast.show('Contact Saved!', 100, () => {
      this.props.navigation.push('ContactDetails', { contact: this.state });
    });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Form style={styles.formContainer}>
            <Item stackedLabel style={styles.formField}>
              <Icon name="person" />
              <Label>Name</Label>
              <Input
                style={styles.input}
                onChangeText={text => this.setState({ name: text })}
                placeholder="e.g., Jane Doe"
                value={this.state.name}
                returnKeyType="next"
                textContentType="name"
                keyboardType="default"
                // disabled={user.isLoading}
              />
            </Item>
            <Item stackedLabel style={styles.formField}>
              <Icon name="ios-call" />
              <Label>Phone</Label>
              <Input
                style={styles.input}
                onChangeText={text => this.setState({ contact_phone: text })}
                placeholder="e.g., +1 412-255-1212"
                value={this.state.contact_phone}
                returnKeyType="next"
                textContentType="telephoneNumber"
                keyboardType="phone-pad"
                // disabled={user.isLoading}
              />
            </Item>
            <Item stackedLabel style={styles.formField}>
              <Icon name="mail" />
              <Label>Email</Label>
              <Input
                style={styles.input}
                onChangeText={text => this.setState({ contact_email: text })}
                placeholder="e.g., jane.doe@protonmail.com"
                value={this.state.contact_email}
                returnKeyType="next"
                textContentType="emailAddress"
                keyboardType="email-address"
                // disabled={user.isLoading}
              />
            </Item>
            <Item picker style={styles.formField}>
              <Icon name="md-git-branch" />
              <Picker
                mode="dropdown"
                placeholder="Source"
                placeholderStyle={{ color: '#bfc6ea' }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.sources.toLowerCase()}
                onValueChange={value => this.setState({ sources: value })}
              >
                <Picker.Item label="Source" value="" />
                <Picker.Item label="Advertisement" value="advertisement" />
                <Picker.Item label="Facebook" value="facebook" />
                <Picker.Item label="LinkedIn" value="linkedin" />
                <Picker.Item label="Partner" value="partner" />
                <Picker.Item label="Personal" value="personal" />
                <Picker.Item label="Phone" value="phone" />
                <Picker.Item label="Referral" value="referral" />
                <Picker.Item label="Twitter" value="twitter" />
                <Picker.Item label="Web" value="web" />
              </Picker>
            </Item>
            <Item stackedLabel style={styles.formField}>
              <Icon name="globe" />
              <Label>Locations</Label>
              <Input
                style={styles.input}
                onChangeText={text => this.setState({ locations: text })}
                placeholder="e.g., Portugal"
                value={this.state.locations}
                returnKeyType="next"
                textContentType="none"
                keyboardType="default"
                // disabled={user.isLoading}
              />
            </Item>
            <Item stackedLabel style={styles.formField}>
              <Icon name="md-create" />
              <Label>Initial Comments</Label>
              <Input
                style={styles.input}
                onChangeText={text => this.setState({ initial_comment: text })}
                placeholder=""
                value={this.state.initial_comment}
                returnKeyType="next"
                textContentType="none"
                keyboardType="default"
                // disabled={user.isLoading}
              />
            </Item>
          </Form>
          <Toast ref={(c) => { this.toast = c; }} position="center" />
        </View>
      </ScrollView>
    );
  }
}
NewEditContactScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  /*
  contacts: PropTypes.shape({
    contact: PropTypes.shape({
      name: PropTypes.string,
      error: PropTypes.shape({
        code: PropTypes.string,
        message: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
  */
  saveContact: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  user: state.userReducer,
});
const mapDispatchToProps = dispatch => ({
  saveContact: (user, contact) => {
    dispatch(saveContact(user, contact));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(NewEditContactScreen);
