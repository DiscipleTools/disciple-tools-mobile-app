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
  TextInput,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { Button, Icon } from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Updates } from 'expo';
import Constants from 'expo-constants';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { BlurView } from 'expo-blur';
import i18n from '../languages';
import locales from '../languages/locales';
import Colors from '../constants/Colors';
import { login, getUserInfo, cancelLogin } from '../store/actions/user.actions';
import { setLanguage } from '../store/actions/i18n.actions';
import TextField from '../components/TextField';
import {
  getLocations,
  getPeopleGroups,
  getGroupSettings,
  getAll as getAllGroups,
  getLocationListLastModifiedDate,
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
  versionText: {
    color: Colors.grayDark,
    fontSize: 12,
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  headerText: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  textBoxContainer: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  textBox: {
    fontSize: 16,
    height: 45,
    paddingRight: 30,
    paddingLeft: 8,
    paddingVertical: 0,
    flex: 1,
  },
  touachableButton: {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    padding: 2,
  },
  buttonImage: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  cancelButtonText: {
    color: Colors.tintColor,
  },
});
let toastError;
const { height, width } = Dimensions.get('window');
class LoginScreen extends React.Component {
  state = {
    loading: false,
    modalVisible: false,
    contactSettingsRetrieved: false,
    groupSettingsRetrieved: false,
    geonamesRetrieved: false,
    peopleGroupsRetrieved: false,
    usersRetrieved: false,
    appLanguageSet: false,
    offset: 0,
    limit: 5000,
    sort: '-last_modified',
    toggleShowPIN: false,
    pin: '',
    incorrectPin: false,
    showCancelButton: false,
    geonamesLastModifiedDate: null,
    userData: {
      token: null,
    },
    userDataRetrieved: false,
    geonamesLength: 0,
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
      hidePassword: true,
    };
    i18n.setLocale(props.i18n.locale, props.i18n.isRTL);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      userReducerLoading,
      userData,
      groupsReducerLoading,
      contactSettings,
      groupSettings,
      geonames,
      peopleGroups,
      users,
      userReducerError,
      groupsReducerError,
      usersReducerError,
      contactsReducerLoading,
      contactsReducerError,
      loginCanceled,
      geonamesLastModifiedDate,
      geonamesLength,
    } = nextProps;
    let newState = {
      ...prevState,
      userData,
      loading: userReducerLoading || groupsReducerLoading || contactsReducerLoading,
      geonamesLength,
    };
    if (userData.token) {
      if (contactSettings) {
        newState = {
          ...newState,
          contactSettingsRetrieved: true,
        };
      }
      if (groupSettings) {
        newState = {
          ...newState,
          groupSettingsRetrieved: true,
        };
      }
      if (geonames && geonames.length > 0) {
        newState = {
          ...newState,
          geonamesRetrieved: true,
        };
      }
      if (peopleGroups) {
        newState = {
          ...newState,
          peopleGroupsRetrieved: true,
        };
      }
      if (users) {
        newState = {
          ...newState,
          usersRetrieved: true,
        };
      }
      if (userData) {
        newState = {
          ...newState,
          userDataRetrieved: true,
        };
      }
      // geonamesLastModifiedDate same as stored date and previous geonames are persisted in storage
      if (
        geonamesLastModifiedDate &&
        geonamesLastModifiedDate === newState.geonamesLastModifiedDate &&
        newState.geonamesLength > 0
      ) {
        newState = {
          ...newState,
          geonamesRetrieved: true,
        };
      }
    }

    const error =
      userReducerError || groupsReducerError || usersReducerError || contactsReducerError;
    if (error) {
      newState = {
        ...newState,
        loading: false,
        showCancelButton: false,
      };
    }

    if (loginCanceled) {
      newState = {
        ...newState,
        loading: false,
        showCancelButton: false,
      };
    }

    return newState;
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        contactSettingsRetrieved: false,
        groupSettingsRetrieved: false,
        peopleGroupsRetrieved: false,
        usersRetrieved: false,
        appLanguageSet: false,
        userDataRetrieved: false,
        geonamesRetrieved: false,
      });
    });
    this.initLoginScreen();
  }

  initLoginScreen = async () => {
    if (this.props.geonamesLastModifiedDate !== null) {
      this.setState(
        {
          geonamesLastModifiedDate: this.props.geonamesLastModifiedDate,
        },
        () => {
          this.userIsAuthenticated();
        },
      );
    } else {
      this.userIsAuthenticated();
    }
  };

  userIsAuthenticated = () => {
    // User is authenticated (logged)
    if (this.props.userData && this.props.userData.token && this.props.rememberPassword) {
      if (this.props.isConnected) {
        if (this.props.pinCode.enabled) {
          this.toggleShowPIN();
        } else {
          if (this.props)
            this.props.loginDispatch(
              this.props.userData.domain,
              this.props.userData.username,
              this.props.userData.password,
            );
        }
      } else {
        this.setState(
          {
            loading: true,
          },
          () => {
            this.setState({
              contactSettingsRetrieved: true,
              groupSettingsRetrieved: true,
              geonamesRetrieved: true,
              peopleGroupsRetrieved: true,
              usersRetrieved: true,
              appLanguageSet: true,
              userDataRetrieved: true,
            });
          },
        );
      }
    }
  };

  componentDidUpdate(prevProps) {
    const {
      userData,
      geonames,
      peopleGroups,
      users,
      userReducerError,
      groupsReducerError,
      usersReducerError,
      contactsReducerError,
      loginCanceled,
      geonamesLastModifiedDate,
    } = this.props;
    const {
      contactSettingsRetrieved,
      groupSettingsRetrieved,
      appLanguageSet,
      geonamesRetrieved,
      peopleGroupsRetrieved,
      usersRetrieved,
    } = this.state;
    // If the RTL value in the store does not match what is
    // in I18nManager (which controls content flow), call
    // forceRTL(...) to set it in I18nManager and reload app
    // so that new RTL value is used for content flow.
    /* if (this.props.i18n.isRTL !== I18nManager.isRTL) {
      I18nManager.forceRTL(this.props.i18n.isRTL);
      // a bit of a hack to wait and make sure the reducer is persisted to storage
      setTimeout(() => {
        Updates.reloadFromCache();
      }, 500);
    } */

    // User logged successfully
    if (userData && prevProps.userData.token !== userData.token && !loginCanceled) {
      this.getDataLists();
      this.getUserInfo();
    }
    // User locale retrieved
    if (userData && userData.locale && prevProps.userData.locale !== userData.locale) {
      this.setAppLanguage();
    }

    // peopleGroupsList retrieved
    if (peopleGroups && prevProps.peopleGroups !== peopleGroups) {
      ExpoFileSystemStorage.setItem('peopleGroupsList', JSON.stringify(peopleGroups));
    }

    // usersList retrieved
    if (users && prevProps.users !== users) {
      ExpoFileSystemStorage.setItem('usersList', JSON.stringify(users));
    }

    // geonamesLastModifiedDate modified
    if (
      geonamesLastModifiedDate &&
      prevProps.geonamesLastModifiedDate !== geonamesLastModifiedDate
    ) {
      this.getLocations();
    }

    // geonamesList retrieved
    if (geonames && prevProps.geonames !== geonames) {
      ExpoFileSystemStorage.setItem('locationsList', JSON.stringify(geonames));
    }
    if (
      contactSettingsRetrieved &&
      groupSettingsRetrieved &&
      appLanguageSet &&
      geonamesRetrieved &&
      peopleGroupsRetrieved &&
      usersRetrieved
    ) {
      let listsLastUpdate = new Date().toString();
      listsLastUpdate = new Date(listsLastUpdate).toISOString();
      ExpoFileSystemStorage.setItem('listsLastUpdate', listsLastUpdate);
      this.props.navigation.navigate('ContactList');
    }

    if (this.props.i18n && prevProps.i18n !== this.props.i18n) {
      i18n.setLocale(this.props.i18n.locale, this.props.i18n.isRTL);
      if (prevProps.i18n.isRTL !== this.props.i18n.isRTL) {
        I18nManager.forceRTL(this.props.i18n.isRTL);
        setTimeout(() => {
          Updates.reload();
        }, 1000);
      } else {
        // TODO: refactor this code so this force re-render is no longer necessary
        this.forceUpdate();
      }
    }

    const userError = prevProps.userReducerError !== userReducerError && userReducerError;
    let groupsError = prevProps.groupsReducerError !== groupsReducerError;
    groupsError = groupsError && groupsReducerError;
    const usersError = prevProps.usersReducerError !== usersReducerError && usersReducerError;
    const contactsError =
      prevProps.contactsReducerError !== contactsReducerError && contactsReducerError;
    if (userError || groupsError || usersError || contactsError) {
      const error = userError || groupsError || usersError;
      if (error.code === '[jwt_auth] incorrect_password') {
        toastError.show(
          <View>
            <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
              {i18n.t('global.error.code')}
            </Text>
            <Text style={{ color: Colors.errorText }}>{error.code}</Text>
            <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
              {i18n.t('global.error.message')}
            </Text>
            <Text style={{ color: Colors.errorText }}>
              {i18n.t('loginScreen.errors.incorrectPassword')}
            </Text>
          </View>,
          3000,
        );
      } else if (error.code === '[jwt_auth] invalid_username') {
        toastError.show(
          <View>
            <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
              {i18n.t('global.error.code')}
            </Text>
            <Text style={{ color: Colors.errorText }}>{error.code}</Text>
            <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
              {i18n.t('global.error.message')}
            </Text>
            <Text style={{ color: Colors.errorText }}>
              {i18n.t('loginScreen.errors.invalidUsername')}
            </Text>
          </View>,
          3000,
        );
      } else {
        toastError.show(
          <View>
            <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
              {i18n.t('global.error.code')}
            </Text>
            <Text style={{ color: Colors.errorText }}>{error.code}</Text>
            <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
              {i18n.t('global.error.message')}
            </Text>
            <Text style={{ color: Colors.errorText }}>{error.message}</Text>
          </View>,
          3000,
        );
      }
    }
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  setAppLanguage = () => {
    const localeCode = this.props.userData.locale.substring(0, 2);
    this.changeLanguage(localeCode);
    this.setState({
      appLanguageSet: true,
    });
  };

  getDataLists = () => {
    this.props.getContactSettings(this.props.userData.domain, this.props.userData.token);
    this.props.getGroupSettings(this.props.userData.domain, this.props.userData.token);
    this.props.getContacts(
      this.props.userData.domain,
      this.props.userData.token,
      this.state.offset,
      this.state.limit,
      this.state.sort,
    );
    this.props.getGroups(
      this.props.userData.domain,
      this.props.userData.token,
      this.state.offset,
      this.state.limit,
      this.state.sort,
    );
    this.props.getPeopleGroups(this.props.userData.domain, this.props.userData.token);
    this.props.getLocationModifiedDate(this.props.userData.domain, this.props.userData.token);
    this.props.getUsers(this.props.userData.domain, this.props.userData.token);
  };

  getUserInfo = () => {
    this.props.getUserInfo(this.props.userData.domain, this.props.userData.token);
  };

  getLocations = () => {
    this.props.getLocations(this.props.userData.domain, this.props.userData.token);
  };

  setPasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };

  onLoginPress = () => {
    Keyboard.dismiss();
    if (this.props.pinCode.enabled) {
      // User with PIN=true and AutoLogin=FALSE
      this.toggleShowPIN();
    } else {
      const { domain, username, password } = this.state;
      if (domain && username && password) {
        const cleanedDomain = (domain || '').replace('http://', '').replace('https://', '');
        this.props.loginDispatch(cleanedDomain, username, password);
        this.toggleCancelButton();
      } else {
        this.setState({
          domainValidation: !domain,
          userValidation: !username,
          passwordValidation: !password,
        });
      }
    }
  };

  toggleCancelButton = (userTap = false) => {
    if (userTap) {
      this.props.cancelLogin();
    } else {
      this.setState({
        showCancelButton: true,
      });
    }
  };

  static navigationOptions = {
    headerShown: false,
  };

  /* eslint-disable class-methods-use-this, no-console */
  goToForgotPassword = () => {
    const { domain } = this.state;
    if (domain !== '') {
      Linking.openURL(`https://${domain}/wp-login.php?action=lostpassword`);
    } else {
      this.refs.toastWithStyle.show(
        i18n.t('loginScreen.domain.errorForgotPass'),
        DURATION.LENGTH_LONG,
      );
    }
  };
  /* eslint-enable class-methods-use-this, no-console */

  changeLanguage(languageCode) {
    const locale = locales.find((item) => item.code === languageCode);
    if (locale) {
      const isRTL = locale.direction === 'rtl';
      this.props.setLanguage(locale.code, isRTL);
    }
  }

  cleanDomainWiteSpace(text) {
    if (text[text.length - 1] === ' ') {
      text = text.replace(/ /g, '');
      this.setState({ domain: text });
    } else if (text[0] === ' ') {
      text = text.replace(/ /g, '');
      this.setState({ domain: text });
    } else {
      this.setState({ domain: text });
    }
  }

  toggleShowPIN = () => {
    this.setState((prevState) => ({
      toggleShowPIN: !prevState.toggleShowPIN,
      pin: '',
      incorrectPin: false,
    }));
  };

  // TODO: How to disable iCloud save password feature?
  render() {
    const errorToast = (
      <Toast
        ref={(toast) => {
          toastError = toast;
        }}
        style={{ backgroundColor: Colors.errorBackground }}
        positionValue={210}
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
    const domainErrorMessage = domainValidation ? (
      <Text style={styles.validationErrorMessage}>{i18n.t('loginScreen.domain.error')}</Text>
    ) : null;
    const userErrorMessage = userValidation ? (
      <Text style={styles.validationErrorMessage}>{i18n.t('loginScreen.username.error')}</Text>
    ) : null;
    const passwordErrorMessage = passwordValidation ? (
      <Text style={styles.validationErrorMessage}>{i18n.t('loginScreen.password.error')}</Text>
    ) : null;
    const languagePickerItems = locales.map((locale) => (
      <Picker.Item label={locale.name} value={locale.code} key={locale.code} />
    ));
    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Image source={require('../assets/images/dt-icon.png')} style={styles.welcomeImage} />
          </View>
          <View style={styles.formContainer}>
            <TextField
              containerStyle={domainStyle}
              iconName="ios-globe"
              label={i18n.t('loginScreen.domain.label')}
              onChangeText={(text) => this.cleanDomainWiteSpace(text)}
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.domain}
              returnKeyType="next"
              textContentType="URL"
              keyboardType="url"
              disabled={this.state.loading}
              placeholder={i18n.t('loginScreen.domain.placeholder')}
            />
            {domainErrorMessage}
            <TextField
              containerStyle={userStyle}
              iconName={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
              label={i18n.t('loginScreen.username.label')}
              onChangeText={(text) => this.setState({ username: text })}
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.username}
              returnKeyType="next"
              textContentType="emailAddress"
              keyboardType="email-address"
              disabled={this.state.loading}
            />
            {userErrorMessage}
            <View style={[passwordStyle]}>
              <View style={{ margin: 10 }}>
                <Text style={{ textAlign: 'left' }}>{i18n.t('loginScreen.password.label')}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Icon
                    type="Ionicons"
                    name="md-key"
                    style={{ marginBottom: 'auto', marginTop: 'auto' }}
                  />
                  <TextInput
                    underlineColorAndroid="transparent"
                    secureTextEntry={this.state.hidePassword}
                    style={styles.textBox}
                    onChangeText={(text) => this.setState({ password: text })}
                    textAlign={this.props.i18n.isRTL ? 'right' : 'left'}
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.touachableButton}
                    onPress={this.setPasswordVisibility}>
                    {this.state.hidePassword ? (
                      <Icon
                        type="FontAwesome"
                        name="eye"
                        style={{
                          marginBottom: 'auto',
                          marginTop: 'auto',
                          opacity: 0.3,
                          fontSize: 22,
                        }}
                      />
                    ) : (
                      <Icon
                        type="FontAwesome"
                        name="eye"
                        style={{ marginBottom: 'auto', marginTop: 'auto', fontSize: 22 }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {passwordErrorMessage}
            {this.state.showCancelButton && (
              <Button
                style={styles.cancelButton}
                onPress={() => {
                  this.toggleCancelButton(true);
                }}
                block>
                <Text style={styles.cancelButtonText}>{i18n.t('global.cancel')}</Text>
              </Button>
            )}
            {this.state.loading ? (
              <ActivityIndicator style={{ margin: 20 }} size="small" />
            ) : (
              <View>
                <Button style={styles.signInButton} onPress={this.onLoginPress} block>
                  <Text style={styles.signInButtonText}>{i18n.t('loginScreen.logIn')}</Text>
                </Button>
                <TouchableOpacity
                  style={styles.forgotButton}
                  onPress={this.goToForgotPassword}
                  disabled={this.state.loading}>
                  <Text style={styles.forgotButtonText}>
                    {i18n.t('loginScreen.forgotPassword')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.versionText}>{Constants.manifest.version}</Text>
          </View>
          <View style={styles.languagePickerContainer}>
            <Icon type="FontAwesome" name="language" style={styles.languageIcon} />
            <Picker
              selectedValue={this.props.i18n.locale}
              style={styles.languagePicker}
              onValueChange={(itemValue) => {
                this.changeLanguage(itemValue);
              }}>
              {languagePickerItems}
            </Picker>
          </View>
          {errorToast}
          <Toast
            ref="toastWithStyle"
            style={{ backgroundColor: Colors.errorBackground }}
            position="bottom"
          />
        </ScrollView>
        {this.state.toggleShowPIN ? (
          <BlurView
            tint="dark"
            intensity={50}
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              top: 0,
              left: 0,
              width: width,
              height: height,
            }}>
            <KeyboardAvoidingView
              behavior={'position'}
              contentContainerStyle={{
                height: height / 2 + 35,
              }}>
              <View style={{ backgroundColor: '#FFFFFF', padding: 20 }}>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    color: Colors.gray,
                    marginBottom: 5,
                  }}>
                  {this.props.pinCode.enabled ? 'Enter PIN' : 'Set new PIN'}
                </Text>
                {this.state.incorrectPin ? (
                  <Text
                    style={{
                      color: Colors.errorBackground,
                      textAlign: 'center',
                      fontSize: 14,
                      marginBottom: 5,
                    }}>
                    {'Incorrect PIN'}
                  </Text>
                ) : null}
                <SmoothPinCodeInput
                  password
                  mask="﹡"
                  cellSize={60}
                  ref={this.pinInput}
                  value={this.state.pin}
                  onTextChange={(pin) => {
                    this.setState({
                      pin,
                      incorrectPin: this.state.incorrectPin ? false : undefined,
                    });
                  }}
                  onFulfill={(pin) => {
                    if (pin === this.props.pinCode.value) {
                      this.props.loginDispatch(
                        this.props.userData.domain,
                        this.props.userData.username,
                        this.props.userData.password,
                      );
                      this.toggleShowPIN();
                    } else {
                      this.setState({
                        incorrectPin: true,
                        pin: '',
                      });
                    }
                  }}
                  autoFocus={true}
                />
                <Button
                  block
                  style={{
                    backgroundColor: Colors.tintColor,
                    borderRadius: 5,
                    width: 150,
                    alignSelf: 'center',
                    marginTop: 20,
                  }}
                  onPress={this.toggleShowPIN}>
                  <Text style={{ color: '#FFFFFF' }}>{'Close'}</Text>
                </Button>
              </View>
            </KeyboardAvoidingView>
          </BlurView>
        ) : null}
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
  getLocations: PropTypes.func.isRequired,
  getPeopleGroups: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  setLanguage: PropTypes.func.isRequired,
  /* eslint-disable */
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
const mapStateToProps = (state) => ({
  userData: state.userReducer.userData,
  userReducerLoading: state.userReducer.loading,
  userReducerError: state.userReducer.error,
  rememberPassword: state.userReducer.rememberPassword,
  groupsReducerLoading: state.groupsReducer.loading,
  geonames: state.groupsReducer.geonames,
  peopleGroups: state.groupsReducer.peopleGroups,
  groupSettings: state.groupsReducer.settings,
  groupsReducerError: state.groupsReducer.error,
  groups: state.groupsReducer.groups,
  usersReducerLoading: state.usersReducer.loading,
  users: state.usersReducer.users,
  usersReducerError: state.usersReducer.error,
  i18n: state.i18nReducer,
  isConnected: state.networkConnectivityReducer.isConnected,
  contactSettings: state.contactsReducer.settings,
  contactsReducerLoading: state.contactsReducer.loading,
  contactsReducerError: state.contactsReducer.error,
  contacts: state.contactsReducer.contacts,
  pinCode: state.userReducer.pinCode,
  loginCanceled: state.userReducer.loginCanceled,
  geonamesLastModifiedDate: state.groupsReducer.geonamesLastModifiedDate,
  geonamesLength: state.groupsReducer.geonamesLength,
});
const mapDispatchToProps = (dispatch) => ({
  loginDispatch: (domain, username, password) => {
    dispatch(login(domain, username, password));
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
  setLanguage: (locale, isRTL) => {
    dispatch(setLanguage(locale, isRTL));
  },
  getContactSettings: (domain, token) => {
    dispatch(getContactSettings(domain, token));
  },
  getGroupSettings: (domain, token) => {
    dispatch(getGroupSettings(domain, token));
  },
  getContacts: (domain, token, offset, limit, sort) => {
    dispatch(getAllContacts(domain, token, offset, limit, sort));
  },
  getGroups: (domain, token, offset, limit, sort) => {
    dispatch(getAllGroups(domain, token, offset, limit, sort));
  },
  getUserInfo: (domain, token, offset, limit, sort) => {
    dispatch(getUserInfo(domain, token, offset, limit, sort));
  },
  cancelLogin: () => {
    dispatch(cancelLogin());
  },
  getLocationModifiedDate: (domain, token) => {
    dispatch(getLocationListLastModifiedDate(domain, token));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
