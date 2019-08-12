import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Platform,
  AsyncStorage,
} from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'native-base';
import Toast from 'react-native-easy-toast';

import i18n from '../languages';
import Colors from '../constants/Colors';
import {
  login,
} from '../store/actions/user.actions';
import TextField from '../components/TextField';
import {
  getUsersAndContacts,
  getLocations,
  getPeopleGroups,
  searchGroups,
} from '../store/actions/groups.actions';
import { getUsers } from '../store/actions/users.actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.canvas,
  },
  header: {
    backgroundColor: Colors.tintColor,
    width: '100%',
    paddingTop: 100,
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
    alignSelf: 'stretch',
    flexGrow: 1,
    padding: 20,
  },
  signInButton: {
    marginTop: 20,
    backgroundColor: Colors.tintColor,
    borderRadius: 2,
  },
  signInButtonText: {
    color: 'white',
  },
  forgotButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 12,
    marginLeft: 20,
    marginRight: 20,
  },
  forgotButtonText: {
    color: Colors.tintColor,
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
  textField: {
    backgroundColor: '#ffffff',
  },
});
const listLength = 5;
let toastError;

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    listsRetrieved: listLength,
    loading: false,
    domain: '',
    username: '',
    password: '',
  };

  constructor(props) {
    super(props);

    // User is authenticated (logged)
    if (props.userData && props.userData.token) {
      this.state = {
        ...this.state,
        loading: true,
      };
      this.getDataLists();
    }

    this.state = {
      ...this.state,
      username: props.userData.username || '',
      password: '',
      domain: props.userData.domain || '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      userReducerLoading,
      userData,
      groupsReducerLoading,
      usersContacts,
      geonames,
      peopleGroups,
      search,
      usersReducerLoading,
      users,
      userReducerError,
      groupsReducerError,
      usersReducerError,
    } = nextProps;
    let newState = {
      ...prevState,
      userData,
      loading: userReducerLoading || groupsReducerLoading || usersReducerLoading,
    };
    if (usersContacts || geonames || peopleGroups || search || users) {
      newState = {
        ...newState,
        listsRetrieved: --newState.listsRetrieved,
      };
    }

    const error = (userReducerError || groupsReducerError || usersReducerError);
    if (error) {
      newState = {
        ...newState,
        loading: false,
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const {
      userData, usersContacts, geonames, peopleGroups, search,
    } = this.props;
    const {
      users, userReducerError, groupsReducerError, usersReducerError,
    } = this.props;
    const { listsRetrieved } = this.state;

    // User logged successfully
    if (userData && prevProps.userData !== userData) {
      this.getDataLists();
    }

    // usersContactsList retrieved
    if (usersContacts && prevProps.usersContacts !== usersContacts) {
      AsyncStorage.setItem(
        'usersAndContactsList',
        JSON.stringify(usersContacts),
      );
    }

    // geonamesList retrieved
    if (geonames && prevProps.geonames !== geonames) {
      AsyncStorage.setItem(
        'locationsList',
        JSON.stringify(geonames),
      );
    }

    // peopleGroupsList retrieved
    if (peopleGroups && prevProps.peopleGroups !== peopleGroups) {
      AsyncStorage.setItem(
        'peopleGroupsList',
        JSON.stringify(peopleGroups),
      );
    }

    // peopleGroupsList retrieved
    if (search && prevProps.search !== search) {
      AsyncStorage.setItem(
        'searchGroupsList',
        JSON.stringify(search),
      );
    }

    // usersList retrieved
    if (users && prevProps.users !== users) {
      AsyncStorage.setItem(
        'usersList',
        JSON.stringify(users),
      );
    }

    if (listsRetrieved === 0) {
      let listsLastUpdate = new Date().toString();
      listsLastUpdate = new Date(listsLastUpdate).toISOString();
      AsyncStorage.setItem('listsLastUpdate', listsLastUpdate);
      this.props.navigation.navigate('ContactList');
    }

    const userError = (prevProps.userReducerError !== userReducerError && userReducerError);
    let groupsError = (prevProps.groupsReducerError !== groupsReducerError);
    groupsError = (groupsError && groupsReducerError);
    const usersError = (prevProps.usersReducerError !== usersReducerError && usersReducerError);
    if (userError || groupsError || usersError) {
      const error = userError || groupsError || usersError;
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

  getDataLists = () => {
    this.props.getUsersAndContacts(
      this.props.userData.domain,
      this.props.userData.token,
    );
    this.props.getLocations(this.props.userData.domain, this.props.userData.token);
    this.props.getPeopleGroups(this.props.userData.domain, this.props.userData.token);
    this.props.getUsers(this.props.userData.domain, this.props.userData.token);
    this.props.searchGroups(this.props.userData.domain, this.props.userData.token);
  };

  onLoginPress = () => {
    Keyboard.dismiss();
    const { domain, username, password } = this.state;
    const cleanedDomain = (domain || '')
      .replace('http://', '')
      .replace('https://', '');
    this.props.loginDispatch(cleanedDomain, username, password);
  };

  /* eslint-disable class-methods-use-this, no-console */
  goToForgotPassword() {
    console.log('forgot password');
  }
  /* eslint-enable class-methods-use-this, no-console */

  // TODO: How to disable iCloud save password feature?
  render() {
    const errorToast = (
      <Toast
        ref={(toast) => {
          toastError = toast;
        }}
        style={{ backgroundColor: Colors.errorBackground }}
        position="center"
      />
    );

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../assets/images/dt-logo2.png')}
            style={styles.welcomeImage}
          />
        </View>
        <View style={styles.formContainer}>
          <TextField
            containerStyle={styles.textField}
            iconName="ios-globe"
            label={i18n.t('loginScreen.domain.label')}
            onChangeText={text => this.setState({ domain: text })}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.domain}
            returnKeyType="next"
            textContentType="URL"
            disabled={this.state.loading}
            placeholder={i18n.t('loginScreen.domain.placeholder')}
          />
          <TextField
            containerStyle={styles.textField}
            iconName={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
            label={i18n.t('loginScreen.username')}
            onChangeText={text => this.setState({ username: text })}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.username}
            returnKeyType="next"
            textContentType="emailAddress"
            disabled={this.state.loading}
          />
          <TextField
            containerStyle={styles.textField}
            iconName={Platform.OS === 'ios' ? 'ios-key' : 'md-key'}
            label={i18n.t('loginScreen.password')}
            onChangeText={text => this.setState({ password: text })}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            value={this.state.password}
            returnKeyType="go"
            selectTextOnFocus
            onSubmitEditing={this.signInAsync}
            blurOnSubmit
            textContentType="password"
            disabled={this.state.loading}
          />
          {!this.state.loading && (
            <Button
              style={styles.signInButton}
              onPress={this.onLoginPress}
              block
            >
              <Text style={styles.signInButtonText}>
                {i18n.t('loginScreen.logIn')}
              </Text>
            </Button>
          )}
          {!this.state.loading && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={this.goToForgotPassword}
              disabled={this.state.loading}
            >
              <Text style={styles.forgotButtonText}>
                {i18n.t('loginScreen.forgotPassword')}
              </Text>
            </TouchableOpacity>
          )}
          {this.state.loading && (
            <ActivityIndicator style={{ margin: 20 }} size="small" />
          )}
        </View>
        {errorToast}
      </View>
    );
  }
}

LoginScreen.propTypes = {
  loginDispatch: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
    username: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
  }),
  getUsersAndContacts: PropTypes.func.isRequired,
  getLocations: PropTypes.func.isRequired,
  getPeopleGroups: PropTypes.func.isRequired,
  searchGroups: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  /* eslint-disable */
  usersContacts: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ),
  geonames: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ),
  peopleGroups: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ),
  search: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ),
  /* eslint-enable */
  userReducerError: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
  }),
  groupsReducerError: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
  }),
  usersReducerError: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
  }),
};
LoginScreen.defaultProps = {
  userData: {
    domain: null,
    token: null,
    username: null,
    displayName: null,
    email: null,
  },
  userReducerError: null,
  groupsReducerError: null,
  usersReducerError: null,
};
const mapStateToProps = state => ({
  userData: state.userReducer.userData,
  userReducerLoading: state.userReducer.loading,
  userReducerError: state.userReducer.error,
  groupsReducerLoading: state.groupsReducer.loading,
  usersContacts: state.groupsReducer.usersContacts,
  geonames: state.groupsReducer.geonames,
  peopleGroups: state.groupsReducer.peopleGroups,
  search: state.groupsReducer.search,
  groupsReducerError: state.groupsReducer.error,
  usersReducerLoading: state.usersReducer.loading,
  users: state.usersReducer.users,
  usersReducerError: state.usersReducer.error,
});
const mapDispatchToProps = dispatch => ({
  loginDispatch: (domain, username, password) => {
    dispatch(login(domain, username, password));
  },
  getUsersAndContacts: (domain, token) => {
    dispatch(getUsersAndContacts(domain, token));
  },
  getLocations: (domain, token) => {
    dispatch(getLocations(domain, token));
  },
  getPeopleGroups: (domain, token) => {
    dispatch(getPeopleGroups(domain, token));
  },
  searchGroups: (domain, token) => {
    dispatch(searchGroups(domain, token));
  },
  getUsers: (domain, token) => {
    dispatch(getUsers(domain, token));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);
