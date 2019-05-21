import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'native-base';

import i18n from '../languages';
import Colors from '../constants/Colors';
import { login, clearError } from '../store/actions/user.actions';
import TextField from '../components/TextField';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.canvas,
  },
  header: {
    backgroundColor: Colors.tintColor,
    width: '100%',
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  welcomeImage: {
    height: 60,
    width: 250,
    resizeMode: 'contain',
    padding: 20,
  },
  formContainer: {
    alignSelf: 'stretch',
    flexGrow: 1,
    padding: 20,
  },
  signInButton: {
    marginTop: 20,
    backgroundColor: Colors.tintColor,
    borderRadius: 2,
  },
  signInButtonText: {
    color: 'white',
  },
  forgotButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 12,
    marginLeft: 20,
    marginRight: 20,
  },
  forgotButtonText: {
    color: Colors.tintColor,
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
  textField: {
    backgroundColor: '#ffffff',
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

  componentDidMount() {
    this.props.clearError();
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

  /* eslint-disable class-methods-use-this, no-console */
  goToForgotPassword() {
    console.log('forgot password');
  }
  /* eslint-enable class-methods-use-this, no-console */

  // TODO: How to disable iCloud save password feature?
  render() {
    const { user } = this.props;
    user.isLoading = false;
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

        <View style={styles.header}>
          <Image
            source={require('../assets/images/dt-logo2.png')}
            style={styles.welcomeImage}
          />
        </View>

        <View style={styles.formContainer}>
          <TextField
            containerStyle={styles.textField}
            iconName="ios-globe"
            label={i18n.t('login.domain.label')}
            onChangeText={text => this.setState({ domain: text })}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.domain}
            returnKeyType="next"
            textContentType="URL"
            disabled={user.isLoading}
            placeholder={i18n.t('login.domain.placeholder')}
          />

          <TextField
            containerStyle={styles.textField}
            iconName={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
            label={i18n.t('login.username.label')}
            onChangeText={text => this.setState({ username: text })}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.username}
            returnKeyType="next"
            textContentType="emailAddress"
            disabled={user.isLoading}
          />

          <TextField
            containerStyle={styles.textField}
            iconName={Platform.OS === 'ios' ? 'ios-key' : 'md-key'}
            label={i18n.t('login.password.label')}
            onChangeText={text => this.setState({ password: text })}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            value={this.state.password}
            returnKeyType="go"
            selectTextOnFocus
            onSubmitEditing={this.signInAsync}
            blurOnSubmit
            textContentType="password"
            disabled={user.isLoading}
          />

          {
            !user.isLoading && (
              <Button style={styles.signInButton} onPress={this.onLoginPress} block>
                <Text style={styles.signInButtonText}>
                  {i18n.t('login.login')}
                </Text>
              </Button>
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
                <Text style={styles.forgotButtonText}>
                  {i18n.t('login.forgotPassword')}
                </Text>
              </TouchableOpacity>
            )
          }
          {
            !!user.isLoading
            && <ActivityIndicator style={{ margin: 20 }} size="small" />
          }
        </View>
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
  clearError: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.userReducer,
});
const mapDispatchToProps = dispatch => ({
  loginDispatch: (domain, username, password) => {
    dispatch(login(domain, username, password));
  },
  clearError: () => {
    dispatch(clearError());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
