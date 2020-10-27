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
  ScrollView,
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Localization from 'expo-localization';
import { Row } from 'react-native-easy-grid';

import i18n from '../languages';
import locales from '../languages/locales';
import Colors from '../constants/Colors';
import { login, getUserInfo } from '../store/actions/user.actions';
import { setLanguage, cancelSetLanguage } from '../store/actions/i18n.actions';
import TextField from '../components/TextField';
import {
  getLocations,
  getPeopleGroups,
  getGroupSettings,
  getAll as getAllGroups,
  getLocationListLastModifiedDate,
} from '../store/actions/groups.actions';
import { getUsers, getContactFilters, getGroupFilters } from '../store/actions/users.actions';
import { getContactSettings, getAll as getAllContacts } from '../store/actions/contacts.actions';
import { logout } from '../store/actions/user.actions';
import { getActiveQuestionnaires } from '../store/actions/questionnaire.actions';
import { getNotificationsCount } from '../store/actions/notifications.actions';
//
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    backgroundColor: Colors.canvas,
    minHeight: Dimensions.get('window').height,
  },
  header: {
    backgroundColor: Colors.tintColor,
    width: '100%',
    padding: 35,
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
    marginTop: 10,
    backgroundColor: Colors.tintColor,
    borderRadius: 10,
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
  dialogBackground: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
  },
  dialogBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  dialogButton: {
    backgroundColor: Colors.tintColor,
    borderRadius: 5,
    width: 150,
    alignSelf: 'center',
    marginTop: 20,
  },
  dialogContent: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.grayDark,
    marginBottom: 5,
  },
});
let toastError;
const { height, width } = Dimensions.get('window');
class LoginScreen extends React.Component {
  state = {
    loading: false,
    modalVisible: false,
    offset: 0,
    limit: 5000,
    sort: '-last_modified',
    toggleShowPIN: false,
    pin: '',
    incorrectPin: false,
    geonamesLastModifiedDate: null,
    userData: {
      token: null,
    },
    geonamesLength: 0,
    toggleRestartDialog: false,
    contactSettingsRetrieved: false,
    groupSettingsRetrieved: false,
    peopleGroupsRetrieved: false,
    usersRetrieved: false,
    appLanguageSet: false,
    userDataRetrieved: false,
    geonamesRetrieved: false,
    contactFiltersRetrieved: false,
    groupFiltersRetrieved: false,
    notificationsCountRetrieved: false,
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

    // Set locale in APP
    if (props.i18n.locale) {
      // Set locale and RTL in i18n Library
      i18n.setLocale(props.i18n.locale, props.i18n.isRTL);
    } else {
      // On first time app launch
      let locale = locales.find((item) => {
        return (
          item.code === Localization.locale ||
          item.code.substring(0, 2) === Localization.locale.substring(0, 2)
        );
      });
      // If phone locale does not exist, set English locale
      if (!locale) locale = locales[0];
      // Set locale and RTL in i18n Library
      i18n.setLocale(locale.code, locale.rtl);
      // Set locale and RTL in State
      this.props.setLanguage(locale.code, locale.rtl);
    }
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
      geonamesLastModifiedDate,
      geonamesLength,
      contactFilters,
      groupFilters,
      notificationsCount,
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
      if (contactFilters) {
        newState = {
          ...newState,
          contactFiltersRetrieved: true,
        };
      }
      if (groupFilters) {
        newState = {
          ...newState,
          groupFiltersRetrieved: true,
        };
      }
      if (notificationsCount !== null) {
        newState = {
          ...newState,
          notificationsCountRetrieved: true,
        };
      }
    }

    const error =
      userReducerError || groupsReducerError || usersReducerError || contactsReducerError;
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
        contactSettingsRetrieved: false,
        groupSettingsRetrieved: false,
        peopleGroupsRetrieved: false,
        usersRetrieved: false,
        appLanguageSet: false,
        userDataRetrieved: false,
        geonamesRetrieved: false,
        contactFiltersRetrieved: false,
        groupFiltersRetrieved: false,
        notificationsCountRetrieved: false,
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
    if (this.props.userData && this.props.userData.token !== null) {
      if (this.props.rememberPassword) {
        if (this.props.isConnected) {
          if (this.props.pinCode.enabled) {
            this.toggleShowPIN();
          } else {
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
                peopleGroupsRetrieved: true,
                usersRetrieved: true,
                appLanguageSet: true,
                userDataRetrieved: true,
                geonamesRetrieved: true,
                contactFiltersRetrieved: true,
                groupFiltersRetrieved: true,
                notificationsCountRetrieved: true,
              });
            },
          );
        }
      } else {
        // Clear previous user's stored data (User closed app with rememberPassword: false)
        this.props.logout();
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
      geonamesLastModifiedDate,
    } = this.props;
    const {
      contactSettingsRetrieved,
      groupSettingsRetrieved,
      appLanguageSet,
      geonamesRetrieved,
      peopleGroupsRetrieved,
      usersRetrieved,
      contactFiltersRetrieved,
      groupFiltersRetrieved,
      notificationsCountRetrieved,
      userDataRetrieved,
    } = this.state;

    // User logged successfully
    if (userData && userData.token && prevProps.userData.token !== userData.token) {
      this.getDataLists();
      this.getUserInfo();
    }

    // User locale retrieved
    if (userData && userData.locale && prevProps.userData.locale !== userData.locale) {
      this.changeLanguage(userData.locale.replace('_', '-'), true);
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
      peopleGroupsRetrieved &&
      usersRetrieved &&
      appLanguageSet &&
      userDataRetrieved &&
      geonamesRetrieved &&
      contactFiltersRetrieved &&
      groupFiltersRetrieved &&
      notificationsCountRetrieved
    ) {
      let listsLastUpdate = new Date().toString();
      listsLastUpdate = new Date(listsLastUpdate).toISOString();
      ExpoFileSystemStorage.setItem('listsLastUpdate', listsLastUpdate);
      this.props.navigation.navigate('ContactList');
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
    this.props.getContactFilters(this.props.userData.domain, this.props.userData.token);
    this.props.getActiveQuestionnaires(this.props.userData.domain, this.props.userData.token);
    this.props.getGroupFilters(this.props.userData.domain, this.props.userData.token);
    this.props.getNotificationsCount(this.props.userData.domain, this.props.userData.token);
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
    const { domain, username, password } = this.state;
    if (domain && username && password) {
      const cleanedDomain = (domain || '').replace('http://', '').replace('https://', '');
      this.props.loginDispatch(cleanedDomain, username, password);
    } else {
      this.setState({
        domainValidation: !domain,
        userValidation: !username,
        passwordValidation: !password,
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

  changeLanguage(languageCode, logIn = false) {
    let locale = locales.find((item) => {
      return item.code === languageCode;
    });
    // Set locale and RTL in i18n Library
    i18n.setLocale(locale.code, locale.rtl);
    // Set locale and RTL in State
    this.props.setLanguage(locale.code, locale.rtl);
    if (locale.rtl !== this.props.i18n.isRTL) {
      this.showRestartDialog();
    } else if (logIn) {
      this.setState({
        appLanguageSet: true,
      });
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

  showRestartDialog = () => {
    this.setState({
      toggleRestartDialog: true,
    });
  };

  restartApp = () => {
    setTimeout(() => {
      Updates.reload();
    }, 1000);
  };

  cancelSetLanguage = () => {
    i18n.setLocale(this.props.i18n.previousLocale, this.props.i18n.previousIsRTL);
    this.props.cancelSetLanguage();
    this.setState({
      toggleRestartDialog: false,
    });
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
      <KeyboardAwareScrollView
        enableAutomaticScroll
        enableOnAndroid
        keyboardOpeningTime={0}
        extraScrollHeight={0}
        keyboardShouldPersistTaps={'always'}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={'always'}>
          <View style={styles.header}>
            <Image source={require('../assets/images/dt-icon.png')} style={styles.welcomeImage} />
          </View>
          <View style={styles.formContainer}>
            <TextField
              containerStyle={domainStyle}
              iconName="ios-globe"
              label={i18n.t('loginScreen.domain.label')}
              onChangeText={(text) => this.cleanDomainWiteSpace(text)}
              textAlign={this.props.i18n.isRTL ? 'right' : 'left'}
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
              textAlign={this.props.i18n.isRTL ? 'right' : 'left'}
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
                <Text style={{ textAlign: 'left', color: '#555555' }}>
                  {i18n.t('loginScreen.password.label')}
                </Text>
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
            {this.state.loading ? (
              <ActivityIndicator color={Colors.tintColor} style={{ margin: 20 }} size="small" />
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
            style={[
              styles.dialogBackground,
              {
                width: width,
                height: height,
              },
            ]}>
            <View style={styles.dialogBox}>
              <Text style={styles.dialogContent}>
                {this.props.pinCode.enabled
                  ? i18n.t('settingsScreen.enterPin')
                  : i18n.t('settingsScreen.setPin')}
              </Text>
              {this.state.incorrectPin ? (
                <Text
                  style={{
                    color: Colors.errorBackground,
                    textAlign: 'center',
                    fontSize: 14,
                    marginBottom: 5,
                  }}>
                  {i18n.t('settingsScreen.incorrectPin')}
                </Text>
              ) : null}
              <SmoothPinCodeInput
                password
                mask="﹡"
                cellSize={42}
                codeLength={6}
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
              <Button block style={styles.dialogButton} onPress={this.toggleShowPIN}>
                <Text style={{ color: '#FFFFFF' }}>{i18n.t('global.close')}</Text>
              </Button>
            </View>
          </BlurView>
        ) : null}
        {this.state.toggleRestartDialog ? (
          <BlurView
            tint="dark"
            intensity={50}
            style={[
              styles.dialogBackground,
              {
                width: width,
                height: height,
              },
            ]}>
            <View style={styles.dialogBox}>
              <Text style={styles.dialogContent}>{i18n.t('appRestart.message')}</Text>
              <Text style={styles.dialogContent}>
                {i18n.t('appRestart.selectedLanguage') +
                  ': ' +
                  locales.find((item) => item.code === this.props.i18n.locale).name}
              </Text>
              <Text style={styles.dialogContent}>
                {i18n.t('appRestart.textDirection') +
                  ': ' +
                  (this.props.i18n.isRTL ? 'RTL' : 'LTR')}
              </Text>
              <Row style={{ height: 60 }}>
                <Button
                  block
                  style={[
                    styles.dialogButton,
                    {
                      backgroundColor: '#ffffff',
                      width: 120,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    },
                  ]}
                  onPress={this.cancelSetLanguage}>
                  <Text style={{ color: Colors.tintColor }}>{i18n.t('global.cancel')}</Text>
                </Button>
                <Button
                  block
                  style={[
                    styles.dialogButton,
                    { width: 120, marginLeft: 'auto', marginRight: 'auto' },
                  ]}
                  onPress={this.restartApp}>
                  <Text style={{ color: '#FFFFFF' }}>{i18n.t('appRestart.button')}</Text>
                </Button>
              </Row>
            </View>
          </BlurView>
        ) : null}
      </KeyboardAwareScrollView>
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
  logout: PropTypes.func.isRequired,
  getNotificationsCount: PropTypes.func.isRequired,
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
  geonamesLastModifiedDate: state.groupsReducer.geonamesLastModifiedDate,
  geonamesLength: state.groupsReducer.geonamesLength,
  contactFilters: state.usersReducer.contactFilters,
  groupFilters: state.usersReducer.groupFilters,
  notificationsCount: state.notificationsReducer.notificationsCount,
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
  getLocationModifiedDate: (domain, token) => {
    dispatch(getLocationListLastModifiedDate(domain, token));
  },
  logout: () => {
    dispatch(logout());
  },
  getContactFilters: (domain, token) => {
    dispatch(getContactFilters(domain, token));
  },
  getActiveQuestionnaires: (domain, token) => {
    dispatch(getActiveQuestionnaires(domain, token));
  },
  getGroupFilters: (domain, token) => {
    dispatch(getGroupFilters(domain, token));
  },
  getNotificationsCount: (domain, token) => {
    dispatch(getNotificationsCount(domain, token));
  },
  cancelSetLanguage: () => {
    dispatch(cancelSetLanguage());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
