import React from 'react';
import {
  View,
  Button,
  AsyncStorage,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      domain: '',
    };
  }


  componentDidMount() {
    AsyncStorage.getItem('@KeyStore:username').then(username => this.setState({ username }));
    AsyncStorage.getItem('@KeyStore:domain').then(domain => this.setState({ domain }));
  }

  signOutAsync = async () => {
    await AsyncStorage.removeItem('@KeyStore:token');
    this.props.navigation.navigate('Auth');
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ margin: 20, color: 'rgba(0,0,0,0.4)' }}>
          Domain:
          {this.state.domain}
        </Text>
        <Text style={{ margin: 20, color: 'rgba(0,0,0,0.4)' }}>
          Signed in as:
          {this.state.username}
        </Text>
        <Button style={{ padding: 50 }} title="Sign out" onPress={this.signOutAsync} />
      </View>
    );
  }
}

SettingsScreen.propTypes = propTypes;
export default SettingsScreen;
