import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Button,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import { logout } from '../store/actions/user.actions';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  logout: PropTypes.func.isRequired,
};

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  signOutAsync = async () => {
    this.props.logout();
    // await AsyncStorage.removeItem('@KeyStore:token');
    this.props.navigation.navigate('Auth');
  };

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
      </View>
    );
  }
}

SettingsScreen.propTypes = propTypes;

const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
