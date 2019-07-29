import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  TouchableHighlight,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { Fab, Container } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';

import PropTypes from 'prop-types';
import Colors from '../../constants/Colors';
import { getAll } from '../../store/actions/contacts.actions';
import i18n from '../../languages';

const styles = StyleSheet.create({
  flatListItem: {
    height: 90,
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
});

let toastError;

class ContactsScreen extends React.Component {
  static navigationOptions = {
    title: i18n.t('contactsScreen.contacts'),
    headerLeft: null,
  };

  state = {
    contacts: [],
  };

  componentDidMount() {
    this.onRefresh();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {
      ...prevState,
      loading: nextProps.loading,
      contacts: nextProps.contacts,
    };
    return newState;
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (prevProps.error !== error && error) {
      toastError.show(
        <View>
          <Text style={{ fontWeight: 'bold' }}>{i18n.t('global.error.code')}</Text>
          <Text>{error.code}</Text>
          <Text style={{ fontWeight: 'bold' }}>{i18n.t('global.error.message')}</Text>
          <Text>{error.message}</Text>
        </View>,
        3000,
      );
    }
  }

  renderRow = contact => (
    <TouchableHighlight
      onPress={() => this.goToContactDetailScreen(contact)}
      style={styles.flatListItem}
      key={contact.toString()}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>{contact.post_title}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={styles.contactSubtitle}>
            {i18n.t(`global.contactOverallStatus.${contact.overall_status.key}`)}
          </Text>
          <Text style={styles.contactSubtitle}>
            {' • '}
          </Text>
          <Text style={styles.contactSubtitle}>
            {i18n.t(`global.seekerPath.${contact.seeker_path.key}`)}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  flatListItemSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#dddddd',
      }}
    />
  );

  onRefresh = () => {
    this.props.getAllContacts(this.props.user.domain, this.props.user.token);
  };

  goToContactDetailScreen = (contactData = null) => {
    if (contactData) {
      // Detail
      this.props.navigation.push('ContactDetail', {
        contactId: contactData.ID,
        onlyView: true,
        contactName: contactData.post_title,
      });
    } else {
      // Create
      this.props.navigation.push('ContactDetail');
    }
  };

  render() {
    return (
      <Container>
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.contacts}
            renderItem={item => this.renderRow(item.item)}
            ItemSeparatorComponent={this.flatListItemSeparator}
            refreshControl={(
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this.onRefresh}
              />
            )}
            keyExtractor={item => item.ID.toString()}
          />
          <Fab
            style={{ backgroundColor: Colors.tintColor }}
            position="bottomRight"
            onPress={() => this.goToContactDetailScreen()}
          >
            <Icon name="md-add" />
          </Fab>
          <Toast
            ref={(toast) => {
              toastError = toast;
            }}
            style={{ backgroundColor: Colors.errorBackground }}
            position="center"
          />
        </View>
      </Container>
    );
  }
}

ContactsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  getAllContacts: PropTypes.func.isRequired,
  /* eslint-disable */
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number
    })
  ).isRequired,
  /* eslint-enable */
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};
ContactsScreen.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  user: state.userReducer,
  contacts: state.contactsReducer.contacts,
  loading: state.contactsReducer.loading,
  error: state.contactsReducer.error,
});
const mapDispatchToProps = dispatch => ({
  getAllContacts: (domain, token) => {
    dispatch(getAll(domain, token));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactsScreen);
