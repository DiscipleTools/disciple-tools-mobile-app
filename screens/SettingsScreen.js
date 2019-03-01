import React from 'react';
import { View, Button, AsyncStorage, Text } from 'react-native';

export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
    }
  }

  static navigationOptions = {
    title: 'Settings',
  };


  componentDidMount() {
    AsyncStorage.getItem('@KeyStore:username').then(username => this.setState({username:username}));
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
	    <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}> 
        <Text style={{margin:20, color: 'rgba(0,0,0,0.4)'}}> {'Signed in as: '+this.state.username} </Text>
        <Button style={{padding: 50}} title="Sign out" onPress={this._signOutAsync} />
	    </View>
    )
  }

  _signOutAsync = async () => {
    await AsyncStorage.removeItem("@KeyStore:password");
    this.props.navigation.navigate('Auth');
  };
}
