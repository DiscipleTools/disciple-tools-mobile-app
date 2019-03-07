import React from 'react';
import {
  View,
  Text,
  AsyncStorage,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import DataStore from '../bus/DataStore';
import Colors from '../constants/Colors';

const opaqueGrey = 'rgba(255,255,255,0.4)';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};


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

class LoginScreen extends React.Component {
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
      domain: '',
    };
  }

  componentDidMount() {
    this.getStoredValues();
  }

  getStoredValues = async () => {
    console.log('getting stored values...');
    try {
      await AsyncStorage.getItem('@KeyStore:username').then(username => this.setState({ username }));
      await AsyncStorage.getItem('@KeyStore:domain').then(domain => this.setState({ domain }));
    } catch (error) {
      console.log(`error getting username or domain: ${error}`);
      // Error retrieving data
    }
  }

  signInAsync = async () => {
    Keyboard.dismiss();
    this.setState({ errorMsg: '', isLoading: true });

    await AsyncStorage.setItem('@KeyStore:username', this.state.username);
    await AsyncStorage.setItem('@KeyStore:domain', this.state.domain);
    const token = await this.getToken(this.state.domain, this.state.username, this.state.password);


    if (token) {
      await AsyncStorage.setItem('@KeyStore:token', token);
      this.props.navigation.navigate('Home');
    } else {
      this.setState({ isLoading: false });
    }
  };

  getToken = async (domain, username, password) => {
    console.log('getting token...');

    let token = '';
    try {
      await DataStore.setBaseUrl(domain);
      token = await DataStore.getTokenAsync({
        username,
        password,
      });
    } catch (error) {
      console.log(error);
      this.setState({ errorMsg: error.toString() });
      return null;
    }

    console.log(`token is: ${token}`);
    return token;
  }

  /* eslint-disable class-methods-use-this */
  goToForgotPassword() {
    console.log('forgot password');
  }
  /* eslint-enable class-methods-use-this */

  // TODO: How to disable iCloud save password feature?
  render() {
    return (
      <View style={styles.container}>

        <Image
          source={require('../assets/images/dt-logo2.png')}
          style={styles.welcomeImage}
        />

        <TextInput
          style={styles.inputBox}
          onChangeText={text => this.setState({ domain: text })}
          placeholder="domain"
          placeholderTextColor={opaqueGrey}
          autoCorrect={false}
          value={this.state.domain}
          returnKeyType="next"
          textContentType="URL"
          disabled={this.state.isLoading}
        />

        <TextInput
          style={styles.inputBox}
          onChangeText={text => this.setState({ username: text })}
          placeholder="username"
          placeholderTextColor={opaqueGrey}
          autoCorrect={false}
          value={this.state.username}
          returnKeyType="next"
          textContentType="emailAddress"
          disabled={this.state.isLoading}
        />
        <TextInput
          style={styles.inputBox}
          onChangeText={text => this.setState({ password: text })}
          placeholder="password"
          placeholderTextColor={opaqueGrey}
          autoCorrect={false}
          secureTextEntry
          value={this.state.password}
          returnKeyType="go"
          selectTextOnFocus
          onSubmitEditing={this.signInAsync}
          blurOnSubmit
          textContentType="none"
          disabled={this.state.isLoading}
        />

        {
          !this.state.isLoading && (
            <TouchableOpacity style={styles.signInButton} onPress={this.signInAsync}>
              <Text style={{ color: Colors.tintColor }}>
                Log In
              </Text>
            </TouchableOpacity>
          )
        }

        {!!this.state.errorMsg && (
          <Text style={{ color: Colors.warningText, marginLeft: 10, marginRight: 10 }}>
            {this.state.errorMsg}
          </Text>
        )
        }

        {
          !this.state.isLoading && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={this.goToForgotPassword}
              disabled={this.state.isLoading}
            >
              <Text style={{ color: opaqueGrey }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          )
        }
        {
          !!this.state.isLoading
          && <ActivityIndicator style={{ margin: 20 }} size="small" />
        }

      </View>

    );
  }
}

LoginScreen.propTypes = propTypes;
export default LoginScreen;
