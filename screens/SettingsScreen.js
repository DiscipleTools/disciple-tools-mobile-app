import React from 'react';
import { connect } from 'react-redux';
import {
  I18nManager,
  StyleSheet,
  Text,
} from 'react-native';
import {
  Body,
  Button as NbButton,
  Container,
  Content,
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

import { Updates } from 'expo';
import Colors from '../constants/Colors';
import { setLanguage } from '../store/actions/i18n.actions';
import { logout } from '../store/actions/user.actions';
import { toggleNetworkConnectivity } from '../store/actions/networkConnectivity.actions';
import i18n from '../languages';
import locales from '../languages/locales';

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
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.canvas,
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
});

class SettingsScreen extends React.Component {
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
    const toastMsg = this.props.isConnected ? i18n.t('settingsScreen.networkUnavailable') : i18n.t('settingsScreen.networkAvailable');
    this.toast.show(toastMsg, 3000);
    this.props.toggleNetworkConnectivity(this.props.isConnected);
  }

  render() {
    const languagePickerItems = locales.map(locale => (
      <Picker.Item label={locale.name} value={locale.code} key={locale.code} />
    ));

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
          { __DEV__ && (
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
          {/* === Language === */}
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
              >
                {languagePickerItems}
              </Picker>
            </Right>
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
        <Toast ref={(c) => { this.toast = c; }} position="center" />
      </Container>
    );
  }
}

SettingsScreen.propTypes = propTypes;

const mapStateToProps = state => ({
  i18n: state.i18nReducer,
  isConnected: state.networkConnectivityReducer.isConnected,
  userData: state.userReducer.userData,
});
const mapDispatchToProps = dispatch => ({
  toggleNetworkConnectivity: (isConnected) => {
    dispatch(toggleNetworkConnectivity(isConnected));
  },
  setLanguage: (locale, isRTL) => {
    dispatch(setLanguage(locale, isRTL));
  },
  logout: () => {
    dispatch(logout());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
