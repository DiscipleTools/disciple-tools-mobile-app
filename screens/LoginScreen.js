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
  KeyboardAvoidingView,
  ScrollView,
  I18nManager,
  Picker,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
} from 'native-base';
import Toast from 'react-native-easy-toast';
import { Updates } from 'expo';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import i18n from '../languages';
import locales from '../languages/locales';
import Colors from '../constants/Colors';
import {
  login, getUserInfo,
} from '../store/actions/user.actions';
import { setLanguage } from '../store/actions/i18n.actions';
import TextField from '../components/TextField';
import {
  getUsersAndContacts,
  getLocations,
  getPeopleGroups,
  searchGroups,
  getGroupSettings,
  getAll as getAllGroups,
} from '../store/actions/groups.actions';
import { getUsers } from '../store/actions/users.actions';
import { getContactSettings, getAll as getAllContacts } from '../store/actions/contacts.actions';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    backgroundColor: Colors.canvas,
    minHeight: Dimensions.get('window').height,
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
    marginBottom: 20,
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
  languagePickerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray,
    padding: 5,
    alignItems: 'center',
  },
  languagePicker: {
    flex: 1,
  },
  languageIcon: {
    marginHorizontal: 20,
  },
});
let toastError;

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    loading: false,
    modalVisible: false,
    contactSettingsListRetrieved: false,
    groupSettingsListRetrieved: false,
    appLanguageSet: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      username: props.userData.username || '',
      password: '',
      domain: props.userData.domain || '',
      domainIsInvalid: false,
      userIsInvalid: false,
      passwordIsInvalid: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      userReducerLoading,
      userData,
      groupsReducerLoading,
      contactSettings,
      groupSettings,
      userReducerError,
      groupsReducerError,
      usersReducerError,
      contactsReducerLoading,
      contactsReducerError,
    } = nextProps;
    let newState = {
      ...prevState,
      userData,
      loading: userReducerLoading || groupsReducerLoading || contactsReducerLoading,
    };

    if (contactSettings) {
      newState = {
        ...newState,
        contactSettingsListRetrieved: true,
      };
    }
    if (groupSettings) {
      newState = {
        ...newState,
        groupSettingsListRetrieved: true,
      };
    }

    const error = (userReducerError || groupsReducerError || usersReducerError || contactsReducerError);
    if (error) {
      newState = {
        ...newState,
        loading: false,
      };
    }

    return newState;
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        contactSettingsListRetrieved: false,
        groupSettingsListRetrieved: false,
        appLanguageSet: false,
      });
    });
    // User is authenticated (logged)
    if (this.props.userData && this.props.userData.token) {
      if (this.props.isConnected) {
        this.setState({ loading: true }, () => {
          this.getDataLists();
          this.getUserInfo();
        });
      } else {
        this.setState({
          loading: true,
        }, () => {
          this.setState({
            contactSettingsListRetrieved: true,
            groupSettingsListRetrieved: true,
            appLanguageSet: true,
          });
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      userData, usersContacts, geonames, peopleGroups, search, contactSettings, groupSettings,
    } = this.props;
    const {
      users, userReducerError, groupsReducerError, usersReducerError, contactsReducerError,
    } = this.props;
    const {
      contactSettingsListRetrieved,
      groupSettingsListRetrieved,
      appLanguageSet,
    } = this.state;
    // If the RTL value in the store does not match what is
    // in I18nManager (which controls content flow), call
    // forceRTL(...) to set it in I18nManager and reload app
    // so that new RTL value is used for content flow.
    if (this.props.i18n.isRTL !== I18nManager.isRTL) {
      I18nManager.forceRTL(this.props.i18n.isRTL);
      // a bit of a hack to wait and make sure the reducer is persisted to storage
      setTimeout(() => {
        Updates.reloadFromCache();
      }, 500);
    }

    // User logged successfully
    if (userData && prevProps.userData !== userData) {
      this.getDataLists();
      this.getUserInfo();
      // User locale retrieved
      if (userData.locale) {
        this.setAppLanguage();
      }
    }

    // usersContactsList retrieved
    if (usersContacts && prevProps.usersContacts !== usersContacts) {
      ExpoFileSystemStorage.setItem(
        'usersAndContactsList',
        JSON.stringify(usersContacts),
      );
    }

    // geonamesList retrieved
    if (geonames && prevProps.geonames !== geonames) {
      ExpoFileSystemStorage.setItem(
        'locationsList',
        JSON.stringify(geonames),
      );
    }

    // peopleGroupsList retrieved
    if (peopleGroups && prevProps.peopleGroups !== peopleGroups) {
      ExpoFileSystemStorage.setItem(
        'peopleGroupsList',
        JSON.stringify(peopleGroups),
      );
    }

    // peopleGroupsList retrieved
    if (search && prevProps.search !== search) {
      ExpoFileSystemStorage.setItem(
        'searchGroupsList',
        JSON.stringify(search),
      );
    }

    // usersList retrieved
    if (users && prevProps.users !== users) {
      ExpoFileSystemStorage.setItem(
        'usersList',
        JSON.stringify(users),
      );
    }

    // contactSettings retrieved
    if (contactSettings && prevProps.contactSettings !== contactSettings) {
      ExpoFileSystemStorage.setItem(
        'contactSettings',
        JSON.stringify(contactSettings),
      );
    }

    // groupSettings retrieved
    if (groupSettings && prevProps.groupSettings !== groupSettings) {
      ExpoFileSystemStorage.setItem(
        'groupSettings',
        JSON.stringify(groupSettings),
      );
    }

    if (contactSettingsListRetrieved && groupSettingsListRetrieved && appLanguageSet) {
      let listsLastUpdate = new Date().toString();
      listsLastUpdate = new Date(listsLastUpdate).toISOString();
      ExpoFileSystemStorage.setItem('listsLastUpdate', listsLastUpdate);
      this.props.navigation.navigate('ContactList');
    }

    const userError = (prevProps.userReducerError !== userReducerError && userReducerError);
    let groupsError = (prevProps.groupsReducerError !== groupsReducerError);
    groupsError = (groupsError && groupsReducerError);
    const usersError = (prevProps.usersReducerError !== usersReducerError && usersReducerError);
    const contactsError = (prevProps.contactsReducerError !== contactsReducerError && contactsReducerError);
    if (userError || groupsError || usersError || contactsError) {
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

  componentWillUnmount() {
    this.focusListener.remove();
  }

  setAppLanguage = () => {
    const userLocaleConfig = this.props.userData.locale.substring(0, 2);
    const locale = locales.find(item => item.code === userLocaleConfig);
    if (locale) {
      const isRTL = locale.direction === 'rtl';
      // store locale/rtl instore for next load of app
      this.props.setLanguage(locale.code, isRTL);
      // set current locale for all language strings
      i18n.setLocale(locale.code, isRTL);
      this.setState({
        appLanguageSet: true,
      });
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
    this.props.getContactSettings(this.props.userData.domain, this.props.userData.token);
    this.props.getGroupSettings(this.props.userData.domain, this.props.userData.token);
    this.props.getContacts(this.props.userData.domain, this.props.userData.token);
    this.props.getGroups(this.props.userData.domain, this.props.userData.token);
  };

  getUserInfo = () => {
    this.props.getUserInfo(this.props.userData.domain, this.props.userData.token);
  }

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

    const domainErrorMessage = domainValidation ? <Text style={styles.validationErrorMessage}>{i18n.t('loginScreen.domain.error')}</Text> : null;
    const userErrorMessage = userValidation ? <Text style={styles.validationErrorMessage}>{i18n.t('loginScreen.username.error')}</Text> : null;
    const passwordErrorMessage = passwordValidation ? <Text style={styles.validationErrorMessage}>{i18n.t('loginScreen.password.error')}</Text> : null;

    const languagePickerItems = locales.map(locale => (
      <Picker.Item label={locale.name} value={locale.code} key={locale.code} />
    ));
    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('../assets/images/dt-icon.png')}
              style={styles.welcomeImage}
            />
          </View>
          <View style={styles.formContainer}>
            <TextField
              containerStyle={domainStyle}
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
            {domainErrorMessage}
            <TextField
              containerStyle={userStyle}
              iconName={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
              label={i18n.t('loginScreen.username.label')}
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
              label={i18n.t('loginScreen.password.label')}
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
          <View style={styles.languagePickerContainer}>
            <Icon type="FontAwesome" name="language" style={styles.languageIcon} />
            <Picker
              selectedValue={this.props.i18n.locale}
              style={styles.languagePicker}
              onValueChange={(itemValue) => {
                const locale = locales.find(item => item.code === itemValue);
                if (locale) {
                  const isRTL = locale.direction === 'rtl';
                  // store locale/rtl instore for next load of app
                  this.props.setLanguage(locale.code, isRTL);
                  // set current locale for all language strings
                  i18n.setLocale(locale.code, isRTL);
                }
              }}
            >
              {languagePickerItems}
            </Picker>
          </View>
          {errorToast}
        </ScrollView>
      </KeyboardAvoidingView>
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
    locale: PropTypes.string,
  }),
  getUsersAndContacts: PropTypes.func.isRequired,
  getLocations: PropTypes.func.isRequired,
  getPeopleGroups: PropTypes.func.isRequired,
  searchGroups: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  setLanguage: PropTypes.func.isRequired,
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
    code: PropTypes.any,
    message: PropTypes.string,
  }),
  groupsReducerError: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
  usersReducerError: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
  i18n: PropTypes.shape({
    locale: PropTypes.string,
    isRTL: PropTypes.bool,
    init: PropTypes.func,
  }).isRequired,
  isConnected: PropTypes.bool,
  contactSettings: PropTypes.shape({}),
  contactsReducerError: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
  getContactSettings: PropTypes.func.isRequired,
  getGroupSettings: PropTypes.func.isRequired,
  groupSettings: PropTypes.shape({}),
  getContacts: PropTypes.func.isRequired,
  getGroups: PropTypes.func.isRequired,
  getUserInfo: PropTypes.func.isRequired,
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
  isConnected: null,
  contactsReducerError: null,
  contactSettings: null,
  groupSettings: null,
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
  groupSettings: state.groupsReducer.settings,
  groupsReducerError: state.groupsReducer.error,
  usersReducerLoading: state.usersReducer.loading,
  users: state.usersReducer.users,
  usersReducerError: state.usersReducer.error,
  i18n: state.i18nReducer,
  isConnected: state.networkConnectivityReducer.isConnected,
  contactSettings: state.contactsReducer.settings,
  contactsReducerLoading: state.contactsReducer.loading,
  contactsReducerError: state.contactsReducer.error,
  contacts: state.contactsReducer.contacts,
  groups: state.groupsReducer.groups,
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
  setLanguage: (locale, isRTL) => {
    dispatch(setLanguage(locale, isRTL));
  },
  getContactSettings: (domain, token) => {
    dispatch(getContactSettings(domain, token));
  },
  getGroupSettings: (domain, token) => {
    dispatch(getGroupSettings(domain, token));
  },
  getContacts: (domain, token) => {
    dispatch(getAllContacts(domain, token));
  },
  getGroups: (domain, token) => {
    dispatch(getAllGroups(domain, token));
  },
  getUserInfo: (domain, token) => {
    dispatch(getUserInfo(domain, token));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);
