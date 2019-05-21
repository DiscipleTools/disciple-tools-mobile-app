import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Button,
  Text,
} from 'react-native';
import { Fab, Icon } from 'native-base';
import Toast from 'react-native-easy-toast';
import PropTypes from 'prop-types';

import { logout } from '../store/actions/user.actions';
import { toggleNetworkConnectivity } from '../store/actions/networkConnectivity.actions';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isConnected: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  logout: PropTypes.func.isRequired,
  toggleNetworkConnectivity: PropTypes.func.isRequired,
};

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor() {
    super();
    this.state = { iconName: 'ios-flash' };
  }

  componentDidMount() {
    this.setNetworkConnectivityIcon(this.props.isConnected);
  }


  setNetworkConnectivityIcon = (isConnected) => {
    this.setState({ iconName: isConnected ? 'ios-flash' : 'ios-flash-off' });
  }

  toggleNetworkConnectivityIcon = (isConnected) => {
    this.setNetworkConnectivityIcon(!isConnected);
  }

  signOutAsync = async () => {
    this.props.logout();
    // await AsyncStorage.removeItem('@KeyStore:token');
    this.props.navigation.navigate('Auth');
  };

  onFABPress = () => {
    this.toggleNetworkConnectivityIcon(this.props.isConnected);
    const toastMsg = this.props.isConnected ? 'Network unavailable. Now in OFFLINE mode' : 'Network detected. Back to ONLINE mode';
    this.toast.show(toastMsg);
    this.props.toggleNetworkConnectivity(this.props.isConnected);
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ margin: 20, color: 'rgba(0,0,0,0.4)' }}>
          Domain:
          {this.props.user.domain}
        </Text>
        <Text style={{ margin: 20, color: 'rgba(0,0,0,0.4)' }}>
          Signed in as:
          {this.props.user.username}
        </Text>
        <Button style={{ padding: 50 }} title="Sign out" onPress={this.signOutAsync} />
        <Fab
          style={{ backgroundColor: '#E74C3C' }}
          position="bottomRight"
          onPress={() => this.onFABPress()}
        >
          <Icon name={this.state.iconName} />
        </Fab>
        <Toast ref={(c) => { this.toast = c; }} position="center" />
      </View>
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
