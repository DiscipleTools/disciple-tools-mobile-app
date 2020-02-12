import React from 'react';
import { connect } from 'react-redux';
import {
  I18nManager,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import {
  Body,
  Button as NbButton,
  Container,
  Content,
  Icon,
  Left,
  ListItem,
  //    Picker,
  Right,
  Switch,
  Thumbnail,
} from 'native-base';
import Toast from 'react-native-easy-toast';
import PropTypes from 'prop-types';

import { Updates } from 'expo';
import Constants from 'expo-constants';
import * as MailComposer from 'expo-mail-composer';
import Colors from '../constants/Colors';
import { setLanguage } from '../store/actions/i18n.actions';
import {
  logout,
  toggleRememberPassword,
  savePINCode,
  removePINCode,
} from '../store/actions/user.actions';
import { toggleNetworkConnectivity } from '../store/actions/networkConnectivity.actions';
import i18n from '../languages';
//  import locales from '../languages/locales';
import CodePin from 'react-native-pin-code';
import { BlurView } from 'expo-blur';

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
  //    setLanguage: PropTypes.func.isRequired,
  toggleNetworkConnectivity: PropTypes.func.isRequired,
  pinCode: PropTypes.shape({
    enabled: PropTypes.bool,
    value: PropTypes.string,
  }),
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.canvas,
    height: 100,
  },
  header: {
    borderBottomWidth: 1,
    backgroundColor: Colors.tabBar,
    paddingBottom: 10,
    marginBottom: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  headerBody: {
    borderBottomWidth: 0,
    alignItems: 'flex-start',
  },
  username: {
    fontSize: 24,
    fontWeight: '500',
  },
  domain: {
    fontStyle: 'italic',
    color: '#888',
  },
  text: {
    writingDirection: i18n.isRTL ? 'rtl' : 'ltr',
    textAlign: i18n.isRTL ? 'right' : 'left',
  },
  body: {
    alignItems: 'flex-start',
  },
  versionText: {
    color: Colors.grayDark,
    fontSize: 12,
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
});
let toastError;
let codePinRef;
const { height, width } = Dimensions.get('window');
class SettingsScreen extends React.Component {
  state = {
    toggleShowPIN: false,
  };

  constructor(props) {
    super(props);

    this.onFABPress = this.onFABPress.bind(this);
  }

  componentDidUpdate() {
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
  }

  signOutAsync = async () => {
    this.props.logout();
    // await AsyncStorage.removeItem('@KeyStore:token');
    this.props.navigation.navigate('Auth');
  };

  onFABPress = () => {
    const toastMsg = this.props.isConnected
      ? i18n.t('settingsScreen.networkUnavailable')
      : i18n.t('settingsScreen.networkAvailable');
    this.toast.show(toastMsg, 3000);
    this.props.toggleNetworkConnectivity(this.props.isConnected);
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

  render() {
    // const languagePickerItems = locales.map((locale) => (
    //   <Picker.Item label={locale.name} value={locale.code} key={locale.code} />
    // ));

    return (
      <Container style={styles.container}>
        <Content>
          <ListItem itemHeader first avatar style={styles.header}>
            <Left>
              <Thumbnail source={require('../assets/images/gravatar-default.png')} />
            </Left>
            <Body style={styles.headerBody}>
              <Text style={[styles.text, styles.username]}>{this.props.userData.displayName}</Text>
              <Text style={[styles.text, styles.domain]}>{this.props.userData.domain}</Text>
            </Body>
          </ListItem>

          {/* === Storybook === */}
          {__DEV__ && (
            <ListItem icon onPress={() => this.props.navigation.navigate('Storybook')}>
              <Left>
                <NbButton onPress={() => this.props.navigation.navigate('Storybook')}>
                  <Icon active name="flask" />
                </NbButton>
              </Left>
              <Body style={styles.body}>
                <Text style={styles.text}>{i18n.t('settingsScreen.storybook')}</Text>
              </Body>
              <Right>
                <Icon active name={i18n.isRTL ? 'arrow-back' : 'arrow-forward'} />
              </Right>
            </ListItem>
          )}
          {/* === Online === */}
          {__DEV__ && (
            <ListItem icon onPress={this.onFABPress}>
              <Left>
                <NbButton onPress={this.onFABPress}>
                  <Icon active name="ios-flash" />
                </NbButton>
              </Left>
              <Body style={styles.body}>
                <Text style={styles.text}>{i18n.t('global.online')}</Text>
              </Body>
              <Right>
                <Switch value={this.props.isConnected} onChange={this.onFABPress} />
              </Right>
            </ListItem>
          )}
          {/* === Language === */}
          {/*
          <ListItem icon>
            <Left>
              <NbButton onPress={this.onFABPress}>
                <Icon active type="FontAwesome" name="language" />
              </NbButton>
            </Left>
            <Body style={styles.body}>
              <Text style={styles.text}>{i18n.t('global.language')}</Text>
            </Body>
            <Right>
              <Picker

                style={{ width: 120 }}
                selectedValue={this.props.i18n.locale}
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
                enabled={false}
              >
                {languagePickerItems}
              </Picker>
            </Right>
          </ListItem>
          */}
          {/* === Remember password === */}
          <ListItem icon>
            <Left>
              <NbButton>
                <Icon active type="MaterialCommunityIcons" name="onepassword" />
              </NbButton>
            </Left>
            <Body style={styles.body}>
              <Text style={styles.text}>{i18n.t('settingsScreen.rememberPassword')}</Text>
            </Body>
            <Right>
              <Switch value={this.props.rememberPassword} onChange={this.toggleRememberPassword} />
            </Right>
          </ListItem>
          {/* === PIN Code === */}
          <ListItem icon onPress={this.toggleShowPIN}>
            <Left>
              <NbButton>
                <Icon active type="MaterialCommunityIcons" name="security" />
              </NbButton>
            </Left>
            <Body style={styles.body}>
              <Text style={styles.text}>{`${
                this.props.pinCode.enabled ? 'Remove' : 'Set'
              } PIN code`}</Text>
            </Body>
          </ListItem>
          {/* === Help / Support === */}
          <ListItem icon onPress={this.draftNewSupportEmail}>
            <Left>
              <NbButton>
                <Icon active name="help-circle" />
              </NbButton>
            </Left>
            <Body style={styles.body}>
              <Text style={styles.text}>{i18n.t('settingsScreen.helpSupport')}</Text>
            </Body>
          </ListItem>
          {/* === Logout === */}
          <ListItem icon onPress={this.signOutAsync}>
            <Left>
              <NbButton onPress={this.signOutAsync}>
                <Icon active name="log-out" />
              </NbButton>
            </Left>
            <Body style={styles.body}>
              <Text style={styles.text}>{i18n.t('settingsScreen.logout')}</Text>
            </Body>
            <Right>
              <Icon active name={i18n.isRTL ? 'arrow-back' : 'arrow-forward'} />
            </Right>
          </ListItem>
        </Content>
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
                borderRadius: 10,
                height: height / 2,
                width: width - 30,
              }}>
              <View>
                <NbButton
                  onPress={this.toggleShowPIN}
                  style={{
                    backgroundColor: '#FFF',
                  }}>
                  <Text>{'Close'}</Text>
                </NbButton>
              </View>
              <CodePin
                ref={(ref) => (this.codePinRef = ref)}
                number={4}
                checkPinCode={(code, callback) => {
                  let result = false;
                  if (!this.props.pinCode.value) {
                    //New code
                    result = true;
                    this.savePINCode(code);
                    this.showToast('PIN code saved succesfully!.');
                    this.toggleShowPIN();
                  } else if (code === this.props.pinCode.value) {
                    //input correct code
                    result = true;
                    this.removePINCode();
                    this.showToast('PIN code removed succesfully!.');
                    this.toggleShowPIN();
                  } else {
                    result = false;
                  }
                  return callback(result);
                }}
                text={this.props.pinCode.enabled ? 'Enter PIN' : 'Set new PIN'}
                error={'Incorrect PIN'}
                autoFocusFirst={true}
                containerStyle={{
                  height: 220,
                  alignItems: 'center',
                }}
                pinStyle={{
                  backgroundColor: '#F0F0F0',
                  textAlign: 'center',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flex: 1,
                  borderRadius: 5,
                  height: 70,
                  fontSize: 25,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
                textStyle={{
                  textAlign: 'center',
                  color: 'gray',
                  fontSize: 20,
                  marginTop: 30,
                }}
                errorStyle={{
                  textAlign: 'center',
                  color: 'red',
                }}
                keyboardType="numeric"
              />
            </KeyboardAvoidingView>
          </BlurView>
        ) : null}
      </Container>
    );
  }
}

SettingsScreen.propTypes = propTypes;

const mapStateToProps = (state) => ({
  i18n: state.i18nReducer,
  isConnected: state.networkConnectivityReducer.isConnected,
  userData: state.userReducer.userData,
  rememberPassword: state.userReducer.rememberPassword,
  pinCode: state.userReducer.pinCode,
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
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
