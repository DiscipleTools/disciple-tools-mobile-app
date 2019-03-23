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
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Button, Form, Item, Icon, Input, Label,
} from 'native-base';

import i18n from '../languages';
import Colors from '../constants/Colors';
import { login } from '../store/actions/user.actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: Colors.tintColor,
    width: '100%',
    paddingTop: 100,
    // flex: 1,
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
    width: '100%',
    padding: 20,
  },
  formField: {
    marginLeft: 0,
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

        <View style={styles.header}>
          <Image
            source={require('../assets/images/dt-logo2.png')}
            style={styles.welcomeImage}
          />
        </View>

        <Form style={styles.formContainer}>
          <Item floatingLabel style={styles.formField}>
            <Icon active name="globe" />
            <Label>{i18n.t('login.domain.label')}</Label>
            <Input
              style={styles.input}
              onChangeText={text => this.setState({ domain: text })}
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.domain}
              returnKeyType="next"
              textContentType="URL"
              disabled={user.isLoading}
            />
          </Item>

          <Item floatingLabel style={styles.formField}>
            <Icon active name="person" />
            <Label>{i18n.t('login.username.label')}</Label>
            <Input
              style={styles.input}
              onChangeText={text => this.setState({ username: text })}
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.username}
              returnKeyType="next"
              textContentType="emailAddress"
              disabled={user.isLoading}
            />
          </Item>

          <Item floatingLabel style={styles.formField}>
            <Icon active name="key" />
            <Label>{i18n.t('login.password.label')}</Label>
            <Input
              style={styles.input}
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
          </Item>

          {
            !user.isLoading && (
              <Button style={styles.signInButton} onPress={this.onLoginPress} block>
                <Text style={styles.signInButtonText}>
                  {i18n.t('login.login')}
                </Text>
              </Button>
            )
          }
        </Form>

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
