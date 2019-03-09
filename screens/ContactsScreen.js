import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

import { getAll as getAllContacts } from '../store/actions/contacts.actions';

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
});

class ContactsScreen extends React.Component {
  static navigationOptions = {
    title: 'Contacts',
  };

  static makeSubtitle(contact) {
    // +
    // " • "+contact.faithMilestones+
    // " • "+contact.assignedTo+
    // " • "+contact.locations}</Text>
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text style={styles.contactSubtitle}>{contact.status}</Text>
        { !!contact.status
        && <Text style={styles.contactSubtitle}>{` • ${contact.status}`}</Text>
        }
        { !!contact.seekerPath
        && <Text style={styles.contactSubtitle}>{` • ${contact.seekerPath}`}</Text>
        }
        { !!contact.faithMilestones
        && <Text style={styles.contactSubtitle}>{` • ${contact.faithMilestones}`}</Text>
        }
        { !!contact.assignedTo
        && <Text style={styles.contactSubtitle}>{` • ${contact.assignedTo}`}</Text>
        }
        { contact.locations.length > 1
        && <Text style={styles.contactSubtitle}>{` • ${contact.locations}`}</Text>
        }
      </View>
    );
  }

  componentDidMount() {
    // get contacts
    this.props.getContacts(this.props.user.domain, this.props.user.token);
  }

  /* eslint-disable class-methods-use-this */
  onSelectItem(item) {
    console.log(item);
  }
  /* eslint-enable class-methods-use-this */

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
            <FlatList
              ItemSeparatorComponent={this.FlatListItemSeparator}
              data={this.props.contacts}
              renderItem={({ item, separators }) => this.renderRow(item, separators)}
            />
          )
          : (
            <Text style={styles.errorText}>
              {this.props.error.message}
            </Text>
          )
        }
        { !!this.props.isLoading
          && <ActivityIndicator style={styles.loading} size="small" />
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
  getContacts: PropTypes.func.isRequired,
};
ContactsScreen.defaultProps = {
  error: null,
};
const mapStateToProps = state => ({
  contacts: state.contacts.items,
  isLoading: state.contacts.isLoading,
  error: state.contacts.error,
  user: state.user,
});
const mapDispatchToProps = dispatch => ({
  getContacts: (domain, token) => {
    dispatch(getAllContacts(domain, token));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
