import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Fab } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import PropTypes from 'prop-types';

import { getAll as getAllContacts } from '../store/actions/contacts.actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
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

class ContactsScreen extends React.Component {
  static navigationOptions = {
    title: 'Contacts',
    headerLeft: null
  };

  constructor(props) {
    super(props)
    this.state = { refreshing: false }
  }

  static makeSubtitle(contact) {
    // +
    // " • "+contact.faithMilestones+
    // " • "+contact.assignedTo+
    // " • "+contact.locations}</Text>
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text style={styles.contactSubtitle}>{contact.overall_status}</Text>
        { !!contact.overall_status
        && <Text style={styles.contactSubtitle}>{` • ${contact.overall_status}`}</Text>
        }
        { !!contact.seeker_path
        && <Text style={styles.contactSubtitle}>{` • ${contact.seeker_path}`}</Text>
        }
        { !!contact.milestones
        && <Text style={styles.contactSubtitle}>{` • ${contact.milestones}`}</Text>
        }
        { !!contact.assigned_to
        && <Text style={styles.contactSubtitle}>{` • ${contact.assigned_to}`}</Text>
        }
        { !!contact.locations && contact.locations.length > 1
        && <Text style={styles.contactSubtitle}>{` • ${contact.locations}`}</Text>
        }
      </View>
    );
  }

  componentDidMount() {
    this._onRefresh()
  }

  onFABPress = () => {
    this.props.navigation.push('NewEditContact', { headerTitleParam: 'Add New Contact'})
  }

  /* eslint-disable class-methods-use-this */
  onSelectItem(item) {
    // navigate to ContactDetails screen (using params in case state is updated in background when coming online)
    this.props.navigation.push('ContactDetails', { contact: item })
  }
  /* eslint-enable class-methods-use-this */

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.getAllContacts(this.props.user.domain, this.props.user.token);
    var that = this;
    setTimeout(function() { 
      that.setState({ refreshing: false });
    }, 1000);
  };

  FlatListItemSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#dddddd',
      }}
    />
  )

  renderRow = (contact, separators) => (
    <TouchableHighlight
      onPress={() => this.onSelectItem(contact)}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}
      style={styles.contactContainer}
      key={contact.key}
    >
      <View style={styles.contactItem}>
        <Text style={{ fontWeight: 'bold' }}>{contact.name}</Text>
        { ContactsScreen.makeSubtitle(contact) }
      </View>
    </TouchableHighlight>
  )

  render() {
    return (
      <View style={styles.container}>
        { !this.props.error
          ? (
            <View style={styles.container}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
                ItemSeparatorComponent={this.FlatListItemSeparator}
                data={this.props.contacts}
                renderItem={({ item, separators }) => this.renderRow(item, separators)}
              />
              <Fab
                style={{ backgroundColor: Colors.tintColor }}
                position="bottomRight"
                onPress={() => this.onFABPress()}
              >
                <Icon name="md-add" />
              </Fab>
            </View>
          )
          : (
            <Text style={styles.errorText}>
              {this.props.error.message}
            </Text>
          )
        }
      </View>
    );
  }
}

ContactsScreen.propTypes = {
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
  getAllContacts: PropTypes.func.isRequired,
};
ContactsScreen.defaultProps = {
  error: null,
};
const mapStateToProps = state => ({
  contacts: state.contactsReducer.items,
  isLoading: state.contactsReducer.isLoading,
  isConnected: state.networkConnectivityReducer.isConnected,
  error: state.contactsReducer.error,
  user: state.userReducer
});
const mapDispatchToProps = dispatch => ({
  getAllContacts: (domain, token) => {
    dispatch(getAllContacts(domain, token));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
