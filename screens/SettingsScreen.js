import React from 'react';
import { connect } from 'react-redux';
import {
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
  Right,
  Switch,
  Thumbnail,
} from 'native-base';
import Toast from 'react-native-easy-toast';
import PropTypes from 'prop-types';

import colors from '../constants/Colors';
import { logout } from '../store/actions/user.actions';
import { toggleNetworkConnectivity } from '../store/actions/networkConnectivity.actions';
import i18n from '../languages';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isConnected: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    displayName: PropTypes.string,
  }).isRequired,
  logout: PropTypes.func.isRequired,
  toggleNetworkConnectivity: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.canvas,
  },
  header: {
    borderBottomWidth: 1,
    backgroundColor: colors.tabBar,
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
    title: i18n.t('settings.navigation.title'),
  };

  constructor(props) {
    super(props);

    this.onFABPress = this.onFABPress.bind(this);
  }

  signOutAsync = async () => {
    this.props.logout();
    // await AsyncStorage.removeItem('@KeyStore:token');
    this.props.navigation.navigate('Auth');
  };

  onFABPress = () => {
    const toastMsg = this.props.isConnected ? 'Network unavailable. Now in OFFLINE mode' : 'Network detected. Back to ONLINE mode';
    this.toast.show(toastMsg);
    this.props.toggleNetworkConnectivity(this.props.isConnected);
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <Container style={styles.container}>
        <Content>
          <ListItem itemHeader first avatar style={styles.header}>
            <Left>
              <Thumbnail source={require('../assets/images/gravatar-default.png')} />
            </Left>
            <Body style={styles.headerBody}>
              <Text style={[styles.text, styles.username]}>{this.props.user.displayName}</Text>
              <Text style={[styles.text, styles.domain]}>{this.props.user.domain}</Text>
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
                <Text style={styles.text}>{i18n.t('settings.storybook')}</Text>
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
              <Text style={styles.text}>{i18n.t('settings.online')}</Text>
            </Body>
            <Right>
              <Switch value={this.props.isConnected} onChange={this.onFABPress} />
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
              <Text style={styles.text}>{i18n.t('settings.logout')}</Text>
            </Body>
            <Right>
              <Icon active name={i18n.isRTL ? 'arrow-back' : 'arrow-forward'} />
            </Right>
          </ListItem>

          <Toast ref={(c) => { this.toast = c; }} position="center" />
        </Content>
      </Container>
    );
  }
}

SettingsScreen.propTypes = propTypes;

const mapStateToProps = state => ({
  isConnected: state.networkConnectivityReducer.isConnected,
  user: state.userReducer,
});
const mapDispatchToProps = dispatch => ({
  toggleNetworkConnectivity: (isConnected) => {
    dispatch(toggleNetworkConnectivity(isConnected));
  },
  logout: () => {
    dispatch(logout());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
