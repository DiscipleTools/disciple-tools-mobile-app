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
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'native-base';
import Toast from 'react-native-easy-toast';

import i18n from '../languages';
import Colors from '../constants/Colors';
import {
  login,
  USER_LOGIN_START,
  USER_LOGIN_SUCCESS,
} from '../store/actions/user.actions';
import TextField from '../components/TextField';
import {
  getUsersAndContacts,
  GROUPS_GET_USERS_CONTACTS_SUCCESS,
  getLocations,
  GROUPS_GET_LOCATIONS_SUCCESS,
  getPeopleGroups,
  GROUPS_GET_PEOPLE_GROUPS_SUCCESS,
  searchGroups,
  GROUPS_SEARCH_SUCCESS,
} from '../store/actions/groups.actions';
import { getUsers, GET_USERS_SUCCESS } from '../store/actions/users.actions';

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
    borderWidth: 2,
    borderColor: '#fff',
  },
  validationErrorInput: {
    backgroundColor: '#FFE6E6',
    borderWidth: 2,
    borderColor: Colors.errorBackground,
  },
  validationErrorMessage: {
    color: Colors.errorBackground,
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
  };

  constructor(props) {
    super(props);
    // User is authenticated (logged)
    if (props.user && props.user.token) {
      this.state = {
        ...this.state,
        // loading: true,
      };
      this.getDataLists();
    }

    this.state = {
      ...this.state,
      username: props.user.username || '',
      password: '',
      domain: props.user.domain || '',
      domainIsInvalid: false,
      userIsInvalid: false,
      passwordIsInvalid: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      userReducerResponse,
      userReducerError,
      groupsReducerResponse,
      groupsReducerError,
      usersReducerResponse,
      usersReducerError,
    } = nextProps;
    let newState = {
      ...prevState,
    };
    let error = null;

    switch (userReducerResponse) {
      case USER_LOGIN_START:
        newState = {
          ...newState,
          // loading: true,
        };
        break;
      default:
        break;
    }
    switch (groupsReducerResponse) {
      case GROUPS_GET_USERS_CONTACTS_SUCCESS:
        newState = {
          ...newState,
          listsRetrieved: --newState.listsRetrieved,
        };
        break;
      case GROUPS_GET_LOCATIONS_SUCCESS:
        newState = {
          ...newState,
          listsRetrieved: --newState.listsRetrieved,
        };
        break;
      case GROUPS_GET_PEOPLE_GROUPS_SUCCESS:
        newState = {
          ...newState,
          listsRetrieved: --newState.listsRetrieved,
        };
        break;
      case GROUPS_SEARCH_SUCCESS:
        newState = {
          ...newState,
          listsRetrieved: --newState.listsRetrieved,
        };
        break;
      default:
        break;
    }
    switch (usersReducerResponse) {
      case GET_USERS_SUCCESS:
        newState = {
          ...newState,
          listsRetrieved: --newState.listsRetrieved,
        };
        break;
      default:
        break;
    }

    if (userReducerError) {
      error = userReducerError;
    }
    if (groupsReducerError) {
      error = groupsReducerError;
    }
    if (usersReducerError) {
      error = usersReducerError;
    }
    if (newState.listsRetrieved === 0 || error) {
      newState = {
        ...newState,
        loading: false,
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const {
      userReducerResponse,
      groupsReducerResponse,
      usersReducerResponse,
      userReducerError,
      groupsReducerError,
      usersReducerError,
      usersContacts,
      geonames,
      peopleGroups,
      search,
      users,
    } = this.props;
    const { listsRetrieved } = this.state;
    let error = null;

    if (prevProps.userReducerResponse !== userReducerResponse) {
      switch (userReducerResponse) {
        case USER_LOGIN_SUCCESS:
          this.getDataLists();
          break;
        default:
          break;
      }
    }
    if (prevProps.groupsReducerResponse !== groupsReducerResponse) {
      switch (groupsReducerResponse) {
        case GROUPS_GET_USERS_CONTACTS_SUCCESS: {
          AsyncStorage.setItem(
            'usersAndContactsList',
            JSON.stringify(usersContacts),
          );
          break;
        }
        case GROUPS_GET_LOCATIONS_SUCCESS: {
          AsyncStorage.setItem('locationsList', JSON.stringify(geonames));
          break;
        }
        case GROUPS_GET_PEOPLE_GROUPS_SUCCESS: {
          AsyncStorage.setItem(
            'peopleGroupsList',
            JSON.stringify(peopleGroups),
          );
          break;
        }
        case GROUPS_SEARCH_SUCCESS: {
          AsyncStorage.setItem('searchGroupsList', JSON.stringify(search));
          break;
        }
        default:
          break;
      }
    }
    if (prevProps.usersReducerResponse !== usersReducerResponse) {
      switch (usersReducerResponse) {
        case GET_USERS_SUCCESS:
          AsyncStorage.setItem('usersList', JSON.stringify(users));
          break;
        default:
          break;
      }
    }

    if (listsRetrieved === 0) {
      let listsLastUpdate = new Date().toString();
      listsLastUpdate = new Date(listsLastUpdate);
      AsyncStorage.setItem('listsLastUpdate', listsLastUpdate);
      this.props.navigation.navigate('ContactList');
    }

    if (prevProps.userReducerError !== userReducerError) {
      error = userReducerError;
    }
    if (prevProps.groupsReducerError !== groupsReducerError) {
      error = groupsReducerError;
    }
    if (prevProps.usersReducerError !== usersReducerError) {
      error = usersReducerError;
    }
    if (error) {
      toastError.show(
        <View>
          <Text style={{ fontWeight: 'bold' }}>Code: </Text>
          <Text>{error.code}</Text>
          <Text style={{ fontWeight: 'bold' }}>Message: </Text>
          <Text>{error.message}</Text>
        </View>,
        3000,
      );
    }
  }

  getDataLists = async () => {
    this.props.getUsersAndContacts(
      this.props.user.domain,
      this.props.user.token,
    );
    this.props.getLocations(this.props.user.domain, this.props.user.token);
    this.props.getPeopleGroups(this.props.user.domain, this.props.user.token);
    this.props.getUsers(this.props.user.domain, this.props.user.token);
    this.props.searchGroups(this.props.user.domain, this.props.user.token);
  };

  onLoginPress = () => {
    Keyboard.dismiss();
    const {
      domain, username, password,
    } = this.state;
    if (domain && username && password) {
      const cleanedDomain = (domain || '')
        .replace('http://', '')
        .replace('https://', '');
      this.props.loginDispatch(cleanedDomain, username, password);
    } else {
      this.setState({
        domainValidation: !domain,
        userValidation: !username,
        passwordValidation: !password,
      });
    }
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
    const { domainValidation, userValidation, passwordValidation } = this.state;

    const domainStyle = domainValidation
      ? [styles.textField, styles.validationErrorInput]
      : styles.textField;
    const userStyle = userValidation
      ? [styles.textField, styles.validationErrorInput]
      : styles.textField;
    const passwordStyle = passwordValidation
      ? [styles.textField, styles.validationErrorInput]
      : styles.textField;

    const domainErrorMessage = domainValidation ? <Text style={styles.validationErrorMessage}>{i18n.t('login.domain.error')}</Text> : null;
    const userErrorMessage = userValidation ? <Text style={styles.validationErrorMessage}>{i18n.t('login.username.error')}</Text> : null;
    const passwordErrorMessage = passwordValidation ? <Text style={styles.validationErrorMessage}>{i18n.t('login.password.error')}</Text> : null;

    return (
      <KeyboardAvoidingView behavior="padding">
          <ScrollView>
            <View style={styles.header}>
              <Image
                source={require('../assets/images/dt-logo2.png')}
                style={styles.welcomeImage}
              />
            </View>

            <View style={styles.formContainer}>
              <TextField
                containerStyle={domainStyle}
                iconName="ios-globe"
                label={i18n.t('login.domain.label')}
                onChangeText={text => this.setState({ domain: text })}
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.domain}
                returnKeyType="next"
                textContentType="URL"
                disabled={this.state.loading}
                placeholder={i18n.t('login.domain.placeholder')}
              />
              {domainErrorMessage}

              <TextField
                containerStyle={userStyle}
                iconName={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
                label={i18n.t('login.username.label')}
                onChangeText={text => this.setState({ username: text })}
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.username}
                returnKeyType="next"
                textContentType="emailAddress"
                disabled={this.state.loading}
              />
              {userErrorMessage}

              <TextField
                containerStyle={passwordStyle}
                iconName={Platform.OS === 'ios' ? 'ios-key' : 'md-key'}
                label={i18n.t('login.password.label')}
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
              {passwordErrorMessage}

                <Button
                  style={styles.signInButton}
                  onPress={this.onLoginPress}
                  block
                >
                  <Text style={styles.signInButtonText}>
                    {i18n.t('login.login')}
                  </Text>
                </Button>
              {!this.state.loading && (
                <TouchableOpacity
                  style={styles.forgotButton}
                  onPress={this.goToForgotPassword}
                  disabled={this.state.loading}
                >
                  <Text style={styles.forgotButtonText}>
                    {i18n.t('login.forgotPassword')}
                  </Text>
                </TouchableOpacity>
              )}
              {!!this.state.loading && (
                <ActivityIndicator style={{ margin: 20 }} size="small" />
              )}
            </View>
            {errorToast}
          </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    username: PropTypes.string,
    token: PropTypes.string,
    error: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string,
    }),
  }).isRequired,
  loginDispatch: PropTypes.func.isRequired,
  getUsersAndContacts: PropTypes.func.isRequired,
  getLocations: PropTypes.func.isRequired,
  getPeopleGroups: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  searchGroups: PropTypes.func.isRequired,
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
  /* eslint-disable */
  userReducerResponse: PropTypes.string,
  groupsReducerResponse: PropTypes.string,
  usersReducerResponse: PropTypes.string,
  /* eslint-enable */
  usersContacts: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ).isRequired,
  geonames: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ).isRequired,
  peopleGroups: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ).isRequired,
  search: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ).isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ).isRequired,
};
LoginScreen.defaultProps = {
  userReducerError: {
    code: null,
    message: null,
  },
  groupsReducerError: {
    code: null,
    message: null,
  },
  usersReducerError: {
    code: null,
    message: null,
  },
};
const mapStateToProps = state => ({
  user: state.userReducer,
  userReducerResponse: state.userReducer.type,
  userReducerError: state.userReducer.error,
  users: state.usersReducer.users,
  usersReducerResponse: state.usersReducer.type,
  usersReducerError: state.usersReducer.error,
  usersContacts: state.groupsReducer.usersContacts,
  geonames: state.groupsReducer.geonames,
  peopleGroups: state.groupsReducer.peopleGroups,
  search: state.groupsReducer.search,
  groupsReducerResponse: state.groupsReducer.type,
  groupsReducerError: state.groupsReducer.error,
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
  getUsers: (domain, token) => {
    dispatch(getUsers(domain, token));
  },
  searchGroups: (domain, token) => {
    dispatch(searchGroups(domain, token));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);
