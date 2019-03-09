import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../constants/Colors';
import { login } from '../store/actions/user.actions';

const opaqueGrey = 'rgba(255,255,255,0.4)';

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

    if (props.user && props.user.token) {
      props.navigation.navigate('Home');
    }

    this.state = {
      username: props.user.username || '',
      password: '',
      domain: props.user.domain || '',
    };
  }

  componentDidUpdate() {
    if (this.props.user) {
      if (this.props.user.token) {
        this.props.navigation.navigate('Home');
      }
    }
  }

  onLoginPress = () => {
    Keyboard.dismiss();
    const {
      domain,
      username,
      password,
    } = this.state;
    this.props.loginDispatch(domain, username, password);
  };

  /* eslint-disable class-methods-use-this */
  goToForgotPassword() {
    console.log('forgot password');
  }
  /* eslint-enable class-methods-use-this */

  // TODO: How to disable iCloud save password feature?
  render() {
    const { user } = this.props;
    let errorMessage;
    if (user && user.error && user.error.message) {
      errorMessage = (
        <Text style={{ color: Colors.warningText, marginLeft: 10, marginRight: 10 }}>
          {user.error.message}
        </Text>
      );
    }
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
          disabled={user.isLoading}
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
          disabled={user.isLoading}
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
          disabled={user.isLoading}
        />

        {
          !user.isLoading && (
            <TouchableOpacity style={styles.signInButton} onPress={this.onLoginPress}>
              <Text style={{ color: Colors.tintColor }}>
                Log In
              </Text>
            </TouchableOpacity>
          )
        }

        {errorMessage}

        {
          !user.isLoading && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={this.goToForgotPassword}
              disabled={user.isLoading}
            >
              <Text style={{ color: opaqueGrey }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          )
        }
        {
          !!user.isLoading
          && <ActivityIndicator style={{ margin: 20 }} size="small" />
        }
      </View>

    );
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    username: PropTypes.string,
    token: PropTypes.string,
    isLoading: PropTypes.bool,
    error: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string,
    }),
  }).isRequired,
  loginDispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => ({
  loginDispatch: (domain, username, password) => {
    dispatch(login(domain, username, password));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
