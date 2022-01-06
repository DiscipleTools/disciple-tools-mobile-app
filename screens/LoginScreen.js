import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
//import PropTypes from "prop-types";

import { Button, Icon } from "native-base";

import PluginRequired from "components/PluginRequired";
import LabeledTextInput from "components/LabeledTextInput";
import LanguagePicker from "components/LanguagePicker";
import AppVersion from "components/AppVersion";

import { useAuth } from "hooks/useAuth";
import useDevice from "hooks/useDevice";
import useI18N from "hooks/useI18N";
import usePlugins from "hooks/usePlugins";
import useToast from "hooks/useToast";

import Colors from "constants/Colors";
import { styles } from "./LoginScreen.styles";

const LoginScreen = () => {

  const { user, rememberLoginDetails, signIn } = useAuth();
  const { isIOS } = useDevice();
  const { i18n, isRTL, locale } = useI18N();
  const { mobileAppPlugin } = usePlugins();
  const toast = useToast();

  const [state, setState] = useState({
    domainValidation: null,
    userValidation: null,
    passwordValidation: null,
  });

  const [loading, setLoading] = useState(false);

  const domainRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const usernameFieldRef = useRef();
  const passwordFieldRef = useRef();

  const cleanDomain = (domain) => {
    // trim leading/trailing whitespace and remove protocol
    return domain?.trim()?.replace("http://", '')?.replace("https://", '');
  };

  // TODO: add legit validation
  const onLoginPress = () => {
    Keyboard.dismiss();
    const domain = domainRef.current;
    const username = usernameRef.current;
    const password = passwordRef.current;
    if (domain && username && password) {
      const cleanedDomain = cleanDomain(domain);
      signIn(cleanedDomain, username, password);
      setLoading(true);
    } else {
      // if any of the required fields are not set, then update state to show error
      setState({
        ...state,
        domainValidation: !domain,
        userValidation: !username,
        passwordValidation: !password,
      });
    }
  };

  const goToForgotPassword = () => {
    if (domain !== "") {
      Linking.openURL(
        `https://${domain}/wp-login.php?action=lostpassword`
      );
    } else {
      toast(i18n.t("loginScreen.domain.errorForgotPass", { locale }), true);
    }
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <Image
          source={require("assets/dt-icon.png")}
          style={styles.welcomeImage}
        />
      </View>
    );
  };

  const DomainField = () => {
    useEffect(() => {
      if (rememberLoginDetails && user?.domain) {
        setDomain(user.domain);
        domainRef.current = user.domain;
      };
    }, [])
    const [domain, setDomain] = useState(null);
    const domainErrorMessage = state.domainValidation ? (
      <Text style={styles.validationErrorMessage}>
        {i18n.t("loginScreen.domain.error", { locale })}
      </Text>
    ) : null;
    return(
      <>
        <LabeledTextInput
          editing
          onChangeText={text => {
            setDomain(text);
            domainRef.current = text;
          }}
          value={domain}
          accessibilityLabel={i18n.t("loginScreen.domain.label", { locale })}
          label={i18n.t("loginScreen.domain.label", { locale })}
          style={styles.inputRowTextInput}
          containerStyle={[styles.textField, state.domainValidation && styles.domainErrorInput]}
          // TODO: LabeledTextInput currently hardcoded to Ionicons
          iconName={isIOS ? "ios-link" : "md-link"}
          textAlign={isRTL ? "right" : "left"}
          autoCapitalize="none"
          autoCorrect={false}
          //returnKeyType="next"
          //onSubmitEditing={() => usernameFieldRef.current.focus()}
          //blurOnSubmit={false}
          textContentType="URL"
          keyboardType="url"
          disabled={loading}
        />
        {domainErrorMessage}
      </>
    );
  };

  const UsernameField = () => {
    useEffect(() => {
      if (rememberLoginDetails && user?.username) {
        setUsername(user.username);
        usernameRef.current = user.username;
      };
    }, [])
    const [username, setUsername] = useState(null);
    const userErrorMessage = state.userValidation ? (
      <Text style={styles.validationErrorMessage}>
        {i18n.t("loginScreen.username.error", { locale })}
      </Text>
    ) : null;
    return(      
      <>
        <LabeledTextInput
          editing
          value={username}
          onChangeText={text => {
            setUsername(text);
            usernameRef.current = text;
          }}
          accessibilityLabel={i18n.t("loginScreen.username.label", { locale })}
          label={i18n.t("loginScreen.username.label", { locale })}
          containerStyle={[styles.textField, state.usernameValidation && styles.validationErrorInput]}
          iconName={isIOS ? "ios-person" : "md-person"}
          textAlign={isRTL ? "right" : "left"}
          autoCapitalize="none"
          autoCorrect={false}
          //ref={usernameFieldRef}
          //returnKeyType="next"
          //onSubmitEditing={() => passwordFieldRef.current.focus()}
          //blurOnSubmit={false}
          textContentType="emailAddress"
          keyboardType="email-address"
          disabled={loading}
        />
        {userErrorMessage}
      </>
    );
  };

  const PasswordField = () => {
    const [password, setPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const passwordErrorMessage = state.passwordValidation ? (
      <Text style={styles.validationErrorMessage}>
        {i18n.t("loginScreen.password.error", { locale })}
      </Text>
    ) : null;
    return(
      <View>
        <LabeledTextInput
          editing
          value={password}
          onChangeText={text => {
            setPassword(text);
            passwordRef.current = text;
          }}
          ref={passwordFieldRef}
          accessibilityLabel={i18n.t("loginScreen.password.label", { locale })}
          label={i18n.t("loginScreen.password.label", { locale })}
          containerStyle={[styles.textField, state.passwordValidation && styles.validationErrorInput]}
          iconName={isIOS ? "ios-key" : "md-key"}
          underlineColorAndroid="transparent"
          secureTextEntry={!showPassword}
          textAlign={isRTL ? "right" : "left"}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.touchableButton}
          onPress={()=>setShowPassword(!showPassword)}
        >
          <Icon
            type="FontAwesome"
            name="eye"
            style={[
              { marginBottom: "auto", marginTop: "auto", fontSize: 24 },
              !showPassword ?  { opacity: 0.3 } : { opacity: null },
            ]}
          />
        </TouchableOpacity>
        {passwordErrorMessage}
      </View>
    );
  };

  // TODO: implement timeout
  const LoginButton = () => (
    <View>
      <Button
        accessibilityLabel={i18n.t("loginScreen.logIn", { locale })}
        style={styles.signInButton}
        onPress={onLoginPress}
        block
      >
        <Text style={styles.signInButtonText}>
          {i18n.t("loginScreen.logIn", { locale })}
        </Text>
      </Button>
      <TouchableOpacity
        style={styles.forgotButton}
        onPress={goToForgotPassword}
        disabled={loading}
      >
        <Text style={styles.forgotButtonText}>
          {i18n.t("loginScreen.forgotPassword", { locale })}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const LoadingSpinner = () => {
    return (
      <ActivityIndicator
        color={Colors.tintColor}
        style={{ margin: 20 }}
        size="small"
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.formContainer}>
        <PluginRequired {...mobileAppPlugin} /> 
        <DomainField />
        <UsernameField />
        <PasswordField />
        { loading ? <LoadingSpinner /> : <LoginButton /> }
        <AppVersion />
      </View>
      <LanguagePicker />
    </View>
  );
};
//LoginScreen.propTypes = {};
//LoginScreen.whyDidYouRender = true
export default LoginScreen;