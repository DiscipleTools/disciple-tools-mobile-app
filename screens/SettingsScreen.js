import React from 'react';
import { View, Button, AsyncStorage } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
	    <View> 
        	<Button style={{padding: 50}} title="Sign out" onPress={this._signOutAsync} />
	    </View>
    )
  }

  _signOutAsync = async () => {
    await AsyncStorage.removeItem("@KeyStore:password");
    this.props.navigation.navigate('Auth');
  };
}
