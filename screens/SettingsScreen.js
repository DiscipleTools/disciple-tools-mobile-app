import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, KeyboardAvoidingView, Dimensions } from 'react-native';
import {
  Body,
  Button as NbButton,
  Container,
  Icon,
  Left,
  ListItem,
  Picker,
  Right,
  Switch,
  Thumbnail,
} from 'native-base';
import Toast from 'react-native-easy-toast';
import PropTypes from 'prop-types';

import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import * as MailComposer from 'expo-mail-composer';
import Colors from '../constants/Colors';
import { setLanguage, cancelSetLanguage, setCancelFalse } from '../store/actions/i18n.actions';
import {
  logout,
  toggleRememberPassword,
  savePINCode,
  removePINCode,
  updateUserInfo,
} from '../store/actions/user.actions';
import { toggleNetworkConnectivity } from '../store/actions/networkConnectivity.actions';
import i18n from '../languages';
import locales from '../languages/locales';
import { BlurView } from 'expo-blur';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { Row } from 'react-native-easy-grid';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  i18n: PropTypes.shape({
    locale: PropTypes.string,
    isRTL: PropTypes.bool,
  }).isRequired,
  isConnected: PropTypes.bool.isRequired,
  userData: PropTypes.shape({
    domain: PropTypes.string,
    displayName: PropTypes.string,
  }).isRequired,
  logout: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  toggleNetworkConnectivity: PropTypes.func.isRequired,
  pinCode: PropTypes.shape({
    enabled: PropTypes.bool,
    value: PropTypes.string,
  }),
};

import { styles } from './SettingsScreen.styles';

let toastError;
const { height, width } = Dimensions.get('window');
class SettingsScreen extends React.Component {
  state = {
    toggleShowPIN: false,
    pin: '',
    confirmPin: false,
    confirmPinValue: '',
    incorrectPin: false,
    toggleRestartDialog: false,
    selectedNewRTLDirection: false,
    i18n: {
      ...this.props.i18n,
    },
  };

  constructor(props) {
    super(props);

    this.onFABPress = this.onFABPress.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { userData, i18n } = nextProps;

    let newState = {
      ...prevState,
      ...i18n,
    };

    if (userData) {
      newState = {
        ...newState,
        selectedNewRTLDirection: prevState.i18n.isRTL !== i18n.isRTL,
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const { rememberPassword, userData, userReducerError } = this.props;

    // Updated user locale setting
    if (userData && prevProps.userData !== userData && userData.locale !== this.props.i18n.locale) {
      // Only update app language on user profile language update (not cancel language change)
      if (!this.props.i18n.canceledLocaleChange) {
        this.changeLanguage(userData.locale.replace('_', '-'));
      }
    } else {
      if (this.props.i18n.canceledLocaleChange) {
        this.props.setCancelFalse();
        this.updateUserInfo({
          locale: prevProps.i18n.previousLocale.replace('-', '_'),
        });
      }
    }

    // Updated locale on store
    if (prevProps.i18n.locale !== this.props.i18n.locale && !this.props.i18n.canceledLocaleChange) {
      this.showRestartDialog();
    }

    if (rememberPassword !== undefined && prevProps.rememberPassword !== rememberPassword) {
      this.showToast(
        rememberPassword
          ? i18n.t('settingsScreen.rememberPasswordActive')
          : i18n.t('settingsScreen.rememberPasswordInactive'),
      );
    }

    const userError = prevProps.userReducerError !== userReducerError && userReducerError;
    if (userError) {
      toastError.show(
        <View>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.code')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{userError.code}</Text>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.message')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{userError.message}</Text>
        </View>,
        3000,
      );
    }
  }

  signOutAsync = async () => {
    this.props.logout();
    // await AsyncStorage.removeItem('@KeyStore:token');
    this.props.navigation.navigate('Auth');
  };

  onFABPress = () => {
    if (this.props.networkStatus) {
      const toastMsg = this.props.isConnected
        ? i18n.t('settingsScreen.networkUnavailable')
        : i18n.t('settingsScreen.networkAvailable');
      this.toast.show(toastMsg, 3000);
      this.props.toggleNetworkConnectivity(this.props.isConnected);
    }
  };

  draftNewSupportEmail = () => {
    MailComposer.composeAsync({
      recipients: ['appsupport@disciple.tools'],
      subject: `DT App Support: v${Constants.manifest.version}`,
      body: '',
    }).catch((onrejected) => {
      toastError.show(
        <View>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.message')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{onrejected.toString()}</Text>
        </View>,
        3000,
      );
    });
  };

  toggleRememberPassword = () => {
    this.props.toggleRememberPassword();
  };

  toggleShowPIN = () => {
    this.setState((prevState) => ({
      toggleShowPIN: !prevState.toggleShowPIN,
      pin: '',
      incorrectPin: false,
      confirmPin: false,
      confirmPinValue: '',
    }));
  };

  showToast = (message, error = false) => {
    if (error) {
      toastError.show(
        <View>
          <Text style={{ color: Colors.errorText }}>{message}</Text>
        </View>,
        3000,
      );
    } else {
      this.toast.show(message, 3000);
    }
  };

  savePINCode = (value) => {
    this.props.savePINCode(value);
  };

  removePINCode = () => {
    this.props.removePINCode();
  };

  static navigationOptions = {
    title: i18n.t('settingsScreen.settings'),
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  offlineBarRender = () => (
    <View style={[styles.offlineBar]}>
      <Text style={[styles.offlineBarText]}>{i18n.t('global.offline')}</Text>
    </View>
  );

  renderLanguagePickerItems = () =>
    locales.map((locale) => (
      <Picker.Item label={locale.name} value={locale.code} key={locale.code} />
    ));

  selectLanguage = (languageCode) => {
    // Set language in Server
    this.updateUserInfo({
      locale: languageCode.replace('-', '_'),
    });
  };

  updateUserInfo = (userInfo) => {
    this.props.updateUserInfo(this.props.userData.domain, this.props.userData.token, userInfo);
  };

  changeLanguage(locale) {
    const localeObj = i18n.setLocale(locale);
    this.props.setLanguage(localeObj.code, localeObj.rtl);
  }

  showRestartDialog = () => {
    this.setState({
      toggleRestartDialog: true,
    });
  };

  restartApp = () => {
    setTimeout(() => {
      Updates.reloadAsync();
    }, 1000);
  };

  cancelSetLanguage = () => {
    this.props.cancelSetLanguage();
    this.setState({
      toggleRestartDialog: false,
    });
  };

  render() {
    return (
      <Container style={styles.container}>
        {!this.props.isConnected && this.offlineBarRender()}
        <ListItem itemHeader first avatar style={styles.header}>
          <Left>
            <Thumbnail source={require('../assets/images/gravatar-default.png')} />
          </Left>
          <Body style={styles.headerBody}>
            <Text
              style={[
                {
                  writingDirection: this.props.i18n.isRTL ? 'rtl' : 'ltr',
                  textAlign: this.props.i18n.isRTL ? 'right' : 'left',
                },
                styles.username,
              ]}>
              {this.props.userData.displayName}
            </Text>
            <Text
              style={[
                {
                  writingDirection: this.props.i18n.isRTL ? 'rtl' : 'ltr',
                  textAlign: this.props.i18n.isRTL ? 'right' : 'left',
                },
                styles.domain,
              ]}>
              {this.props.userData.domain}
            </Text>
          </Body>
        </ListItem>

        {/* === Storybook === */}
        {__DEV__ && (
          <ListItem icon onPress={() => this.props.navigation.navigate('Storybook')}>
            <Left>
              <NbButton
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Storybook')}>
                <Icon active name="flask" />
              </NbButton>
            </Left>
            <Body style={styles.body}>
              <Text
                style={{
                  writingDirection: this.props.i18n.isRTL ? 'rtl' : 'ltr',
                  textAlign: this.props.i18n.isRTL ? 'right' : 'left',
                }}>
                {i18n.t('settingsScreen.storybook')}
              </Text>
            </Body>
            <Right>
              <Icon active name={this.props.i18n.isRTL ? 'arrow-back' : 'arrow-forward'} />
            </Right>
          </ListItem>
        )}
        {/* === Online === */}
        <ListItem icon onPress={this.onFABPress}>
          <Left>
            <NbButton style={styles.button} onPress={this.onFABPress}>
              <Icon name="ios-flash" />
            </NbButton>
          </Left>
          <Body style={styles.body}>
            <Text
              style={{
                writingDirection: this.props.i18n.isRTL ? 'rtl' : 'ltr',
                textAlign: this.props.i18n.isRTL ? 'right' : 'left',
              }}>
              {i18n.t('global.online')}
            </Text>
          </Body>
          <Right>
            <Switch
              value={this.props.isConnected}
              onChange={this.onFABPress}
              disabled={!this.props.networkStatus}
            />
          </Right>
        </ListItem>
        {/* === Language === */}
        <ListItem icon>
          <Left>
            <NbButton style={styles.button}>
              <Icon active type="FontAwesome" name="language" />
            </NbButton>
          </Left>
          <Body style={styles.body}>
            <Text
              style={{
                writingDirection: this.props.i18n.isRTL ? 'rtl' : 'ltr',
                textAlign: this.props.i18n.isRTL ? 'right' : 'left',
              }}>
              {i18n.t('global.language')}
            </Text>
          </Body>
          <Right>
            <Picker
              iosIcon={<Icon style={styles.pickerIosIcon} name="caret-down" />}
              style={Platform.OS === 'ios' ? null : { width: 150 }}
              selectedValue={this.props.i18n.locale}
              onValueChange={this.selectLanguage}>
              {this.renderLanguagePickerItems()}
            </Picker>
          </Right>
        </ListItem>
        {/* === Remember password === */}
        <ListItem icon>
          <Left>
            <NbButton style={styles.button}>
              <Icon active type="MaterialCommunityIcons" name="onepassword" />
            </NbButton>
          </Left>
          <Body style={styles.body}>
            <Text
              style={{
                writingDirection: this.props.i18n.isRTL ? 'rtl' : 'ltr',
                textAlign: this.props.i18n.isRTL ? 'right' : 'left',
              }}>
              {i18n.t('settingsScreen.rememberPassword')}
            </Text>
          </Body>
          <Right>
            <Switch value={this.props.rememberPassword} onChange={this.toggleRememberPassword} />
          </Right>
        </ListItem>
        {/* === PIN Code === */}
        <ListItem icon onPress={this.toggleShowPIN}>
          <Left>
            <NbButton style={styles.button}>
              <Icon active type="MaterialCommunityIcons" name="security" />
            </NbButton>
          </Left>
          <Body style={styles.body}>
            <Text
              style={{
                writingDirection: this.props.i18n.isRTL ? 'rtl' : 'ltr',
                textAlign: this.props.i18n.isRTL ? 'right' : 'left',
              }}>
              {`${
                this.props.pinCode.enabled
                  ? i18n.t('settingsScreen.remove')
                  : i18n.t('settingsScreen.set')
              } ${i18n.t('settingsScreen.pinCode')}`}
            </Text>
          </Body>
        </ListItem>
        {/* === Help / Support === */}
        <ListItem icon onPress={this.draftNewSupportEmail}>
          <Left>
            <NbButton style={styles.button}>
              <Icon active name="help-circle" />
            </NbButton>
          </Left>
          <Body style={styles.body}>
            <Text
              style={{
                writingDirection: this.props.i18n.isRTL ? 'rtl' : 'ltr',
                textAlign: this.props.i18n.isRTL ? 'right' : 'left',
              }}>
              {i18n.t('settingsScreen.helpSupport')}
            </Text>
          </Body>
        </ListItem>
        {/* === Logout === */}
        <ListItem icon onPress={this.signOutAsync}>
          <Left>
            <NbButton style={styles.button}>
              <Icon active name="log-out" />
            </NbButton>
          </Left>
          <Body style={styles.body}>
            <Text
              style={{
                writingDirection: this.props.i18n.isRTL ? 'rtl' : 'ltr',
                textAlign: this.props.i18n.isRTL ? 'right' : 'left',
              }}>
              {i18n.t('settingsScreen.logout')}
            </Text>
          </Body>
          <Right>
            <Icon active name={this.props.i18n.isRTL ? 'arrow-back' : 'arrow-forward'} />
          </Right>
        </ListItem>
        <Text style={styles.versionText}>{Constants.manifest.version}</Text>
        <Toast
          ref={(c) => {
            this.toast = c;
          }}
          position="center"
        />
        <Toast
          ref={(toast) => {
            toastError = toast;
          }}
          style={{ backgroundColor: Colors.errorBackground }}
          positionValue={210}
        />
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
                  {this.state.confirmPin
                    ? i18n.t('settingsScreen.confirmPin')
                    : this.props.pinCode.enabled
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
                    if (!this.props.pinCode.value) {
                      //New code
                      if (this.state.confirmPin) {
                        if (this.state.confirmPinValue === pin) {
                          // PIN Confirmation success
                          this.setState(
                            {
                              confirmPin: false,
                              confirmPinValue: '',
                            },
                            () => {
                              this.savePINCode(pin);
                              this.showToast(i18n.t('settingsScreen.savedPinCode'));
                              this.toggleShowPIN();
                            },
                          );
                        } else {
                          // Error on confirm PIN
                          this.setState({
                            incorrectPin: true,
                            pin: '',
                          });
                        }
                      } else {
                        // Enable PIN confirmation
                        this.setState({
                          confirmPin: true,
                          confirmPinValue: pin,
                          pin: '',
                        });
                      }
                    } else if (pin === this.props.pinCode.value) {
                      // Remove PIN
                      this.removePINCode();
                      this.showToast(i18n.t('settingsScreen.removedPinCode'));
                      this.toggleShowPIN();
                    } else {
                      // Error on set PIN
                      this.setState({
                        incorrectPin: true,
                        pin: '',
                      });
                    }
                  }}
                  autoFocus={true}
                />
                <NbButton block style={styles.dialogButton} onPress={this.toggleShowPIN}>
                  <Text style={{ color: '#FFFFFF' }}>{i18n.t('settingsScreen.close')}</Text>
                </NbButton>
              </View>
            </KeyboardAvoidingView>
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
              <Text style={styles.dialogContent}>
                {i18n.t('appRestart.message', { locale: this.props.i18n.previousLocale })}
              </Text>
              <Text style={styles.dialogContent}>
                {i18n.t('appRestart.selectedLanguage', { locale: this.props.i18n.previousLocale }) +
                  ': ' +
                  i18n.getLocaleObj(this.props.i18n.locale).name}
              </Text>
              {this.state.selectedNewRTLDirection ? (
                <Text style={styles.dialogContent}>
                  {i18n.t('appRestart.textDirection', { locale: this.props.i18n.previousLocale }) +
                    ': ' +
                    (this.props.i18n.isRTL ? 'RTL' : 'LTR')}
                </Text>
              ) : null}
              <Row style={{ height: 60 }}>
                <NbButton
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
                  <Text style={{ color: Colors.tintColor }}>
                    {i18n.t('global.cancel', { locale: this.props.i18n.previousLocale })}
                  </Text>
                </NbButton>
                <NbButton
                  block
                  style={[
                    styles.dialogButton,
                    { width: 120, marginLeft: 'auto', marginRight: 'auto' },
                  ]}
                  onPress={this.restartApp}>
                  <Text style={{ color: '#FFFFFF' }}>
                    {i18n.t('appRestart.button', { locale: this.props.i18n.previousLocale })}
                  </Text>
                </NbButton>
              </Row>
            </View>
          </BlurView>
        ) : null}
      </Container>
    );
  }
}

SettingsScreen.propTypes = propTypes;
SettingsScreen.defaultProps = {
  userReducerError: null,
};
const mapStateToProps = (state) => ({
  i18n: state.i18nReducer,
  isConnected: state.networkConnectivityReducer.isConnected,
  userData: state.userReducer.userData,
  rememberPassword: state.userReducer.rememberPassword,
  pinCode: state.userReducer.pinCode,
  userReducerError: state.userReducer.error,
  networkStatus: state.networkConnectivityReducer.networkStatus,
});
const mapDispatchToProps = (dispatch) => ({
  toggleNetworkConnectivity: (isConnected) => {
    dispatch(toggleNetworkConnectivity(isConnected));
  },
  setLanguage: (locale, isRTL) => {
    dispatch(setLanguage(locale, isRTL));
  },
  logout: () => {
    dispatch(logout());
  },
  toggleRememberPassword: () => {
    dispatch(toggleRememberPassword());
  },
  savePINCode: (value) => {
    dispatch(savePINCode(value));
  },
  removePINCode: () => {
    dispatch(removePINCode());
  },
  updateUserInfo: (domain, token, userInfo) => {
    dispatch(updateUserInfo(domain, token, userInfo));
  },
  cancelSetLanguage: () => {
    dispatch(cancelSetLanguage());
  },
  setCancelFalse: () => {
    dispatch(setCancelFalse());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
