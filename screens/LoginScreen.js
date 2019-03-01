import React from 'react';
import { ScrollView, View, 
	Text, Button, AsyncStorage, TextInput, 
  	StyleSheet, Image, TouchableOpacity, 
    Keyboard, ActivityIndicator } from 'react-native';
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
      errorMsg: '',
      isLoading: false,
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

  //TODO: How to disable iCloud save password feature?
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
          autoCorrect = {false}
	        value={this.state.username}
          returnKeyType='next'
          textContentType='emailAddress'
          disabled={this.state.isLoading}
	    />
	    <TextInput
        	style={styles.inputBox}
        	onChangeText={(text) => this.setState({password: text})}
          placeholder="password"
          placeholderTextColor= { opaqueGrey }
          autoCorrect = {false}
          secureTextEntry = {true}
        	value={this.state.password}
          returnKeyType='go'
          selectTextOnFocus = {true}
          onSubmitEditing={this._signInAsync}
          blurOnSubmit={true}
          textContentType='none'
          disabled={this.state.isLoading}
      	/>

        {
          !!!this.state.isLoading &&
          <TouchableOpacity style = {styles.signInButton} onPress={this._signInAsync}> 
             <Text style = {{color: Colors.tintColor}}>
                 Log In
             </Text>
          </TouchableOpacity >
        }

        { !!this.state.errorMsg &&
          <Text style= {{color: Colors.warningText, marginLeft: 10, marginRight: 10}}> {this.state.errorMsg} </Text>
        }

        {
          !!!this.state.isLoading &&
          <TouchableOpacity style = {styles.forgotButton} onPress={this._goToForgotPassword} disabled={this.state.isLoading}> 
            <Text style = {{color: opaqueGrey }}> 
                Forgot password?
            </Text>
          </TouchableOpacity >
        }
        {
          !!this.state.isLoading &&
            <ActivityIndicator style={{margin:20}} size='small' />
        }

        </View>

    );
  }

  _signInAsync = async () => {
    Keyboard.dismiss();
    this.setState({errorMsg: '', isLoading: true});

    await AsyncStorage.setItem('@KeyStore:username', this.state.username);
    token = await this._getToken(this.state.username, this.state.password);


    if (token) {
      await AsyncStorage.setItem('@KeyStore:token', token);
      this.props.navigation.navigate('Home');
    } else {
      this.setState({isLoading: false});
    }


  };

  _goToForgotPassword() {
    console.log('forgot password');
  }


  _getToken = async (username, password) => {
    console.log('getting token...');

    var token = "";
    try {
      token = await DataStore.getTokenAsync({
          username: username,
          password: password
      });
    } catch (error) {
      console.log(error);
      this.setState({errorMsg: error.toString()});
      return;
    }

    console.log('token is: '+token);
    return token;
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});