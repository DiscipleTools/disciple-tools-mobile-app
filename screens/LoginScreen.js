import React from 'react';
import { ScrollView, View, 
	Text, Button, AsyncStorage, TextInput, 
  	StyleSheet, Image, TouchableOpacity } from 'react-native';
import DataStore from '../bus/DataStore';
import Colors from '../constants/Colors';

const opaqueGrey = 'rgba(255,255,255,0.4)';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
  		username: '',
  		password: '',
    }
  }

  componentDidMount() {
  	this._getStoredValues();
  }

  _getStoredValues = async () => {
    console.log('getting stored values...');
	try {
		const username = await AsyncStorage.getItem('@KeyStore:username');
		if (username !== null) {
		  	// We have data!!
		  	console.log("username "+ username);
			this.setState({username: username});
		}
	} catch (error) {
		console.log("error getting username: "+error);
		// Error retrieving data
	}


  }

  render() {
    return (
      <View style={styles.container}>

      <Image
        source={require('../assets/images/dt-logo2.png')}
        style={styles.welcomeImage}
      />

	    <TextInput
	        style={styles.inputBox}
	        onChangeText={(text) => this.setState({username: text})}
          placeholder="username"
          placeholderTextColor= { opaqueGrey }
	        value={this.state.username}
	    />
	    <TextInput
        	style={styles.inputBox}
        	onChangeText={(text) => this.setState({password: text})}
          placeholder="password"
          placeholderTextColor= { opaqueGrey }
        	value={this.state.password}
      	/>
        <TouchableOpacity style = {styles.signInButton} onPress={this._signInAsync}> 
           <Text style = {{color: Colors.tintColor}}>
               Log In
           </Text>
        </TouchableOpacity >
        <TouchableOpacity style = {styles.forgotButton} onPress={this._goToForgotPassword}> 
           <Text style = {{color: opaqueGrey }}>
               Forgot password?
           </Text>
        </TouchableOpacity >
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('@KeyStore:username', this.state.username);
    await AsyncStorage.setItem('@KeyStore:password', this.state.password);
    this.props.navigation.navigate('Home');
  };

  _goToForgotPassword() {
    console.log('forgot password');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tintColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeImage: {
    height: 60,
    width: 200,
    resizeMode: 'contain',
    padding: 20,
  },
	inputBox: {
    alignSelf: 'stretch',
		height: 40,
		marginTop: 20,
		marginLeft: 20,
		marginRight: 20,
		padding: 8,
		borderColor: 'rgba(255,255,255,0.4)',
		borderBottomWidth: 1,
    color: 'white',
	},
  signInButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 12,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  forgotButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 12,
    marginLeft: 20,
    marginRight: 20,
  },
});