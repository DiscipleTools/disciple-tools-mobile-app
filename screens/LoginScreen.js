import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PropTypes from "prop-types";
// component library (native base)
import { Button, Icon } from "native-base";
// expo
import Constants from "expo-constants";
// TODO: move to StyleSheet
import Colors from "constants/Colors";

// custom hooks
import { useAuth } from "hooks/useAuth";
import useI18N from "hooks/useI18N";
import usePlugins from "hooks/usePlugins";
import useToast from "hooks/useToast";

// custom components
//import Locale from 'components/Locale';
import LabeledTextInput from "components/LabeledTextInput";
import LanguagePicker from "components/LanguagePicker";
// third-party components
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// styles/assets
import { styles } from "./LoginScreen.styles";

const LoginScreen = ({ navigation, route }) => {
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$$$$          LOGIN SCREEN                   $$$$$");
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

  const { user, rememberLoginDetails, signIn } = useAuth();
  const { i18n, isRTL, locale, setLocale } = useI18N();
  const { mobileAppPluginEnabled, mobileAppPluginLink } = usePlugins();
  const toast = useToast();

  const [state, setState] = useState({
    domainValidation: null,
    userValidation: null,
    passwordValidation: null,
  });

  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (rememberLoginDetails) {
      // TODO: batch update?
      if (user?.domain) setDomain(user.domain);
      if (user?.username) setUsername(user.username);
    };
    setDomain('dtappdemo.wpengine.com');
    setUsername('zdmc23');
    setPassword('fmZ%yM9sn8qv!A$9');
  }, [])

  const cleanDomain = (domain) => {
    // trim leading/trailing whitespace and remove protocol
    return domain.trim().replace("http://", "").replace("https://", "");
  };

  // TODO: add legit validation
  const onLoginPress = () => {
    Keyboard.dismiss();
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

  const MobileAppPluginRequired = () => {
    return (
      <TouchableOpacity activeOpacity={0.8} style={{}} onPress={mobileAppPluginLink}>
        <View
          style={{
            borderColor: "#c2e0ff",
            borderWidth: 1,
            backgroundColor: "#ecf5fc",
            borderRadius: 2,
            padding: 10,
          }}
        >
          <Text>
            {i18n.t("loginScreen.errors.mobileAppPluginRequiredOne", {
              locale,
            })}
          </Text>
          <Text style={{ fontWeight: "bold" }}>
            {i18n.t("loginScreen.errors.mobileAppPluginRequiredTwo", {
              locale,
            })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const DomainField = () => {
    const domainErrorMessage = state.domainValidation ? (
      <Text style={styles.validationErrorMessage}>
        {i18n.t("loginScreen.domain.error", { locale })}
      </Text>
    ) : null;
    return(
      <View>
        <LabeledTextInput
          editing
          accessibilityLabel={i18n.t("loginScreen.domain.label", { locale })}
          label={i18n.t("loginScreen.domain.label", { locale })}
          containerStyle={[styles.textField, state.domainValidation && styles.validationErrorInput]}
          iconName="ios-globe"
          onChangeText={setDomain}
          textAlign={isRTL ? "right" : "left"}
          autoCapitalize="none"
          autoCorrect={false}
          value={domain}
          returnKeyType="next"
          textContentType="URL"
          keyboardType="url"
          disabled={loading}
          placeholder={i18n.t("loginScreen.domain.placeholder", { locale })}
        />
        {domainErrorMessage}
      </View>
    );
  };

  const UsernameField = () => {
    const userErrorMessage = state.userValidation ? (
      <Text style={styles.validationErrorMessage}>
        {i18n.t("loginScreen.username.error", { locale })}
      </Text>
    ) : null;
    return(      
      <View>
        <LabeledTextInput
          editing
          accessibilityLabel={i18n.t("loginScreen.username.label", {
            locale,
          })}
          label={i18n.t("loginScreen.username.label", { locale })}
          containerStyle={[styles.textField, state.usernameValidation && styles.validationErrorInput]}
          iconName={Platform.OS === "ios" ? "ios-person" : "md-person"}
          value={username}
          onChangeText={setUsername}
          textAlign={isRTL ? "right" : "left"}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          textContentType="emailAddress"
          keyboardType="email-address"
          disabled={loading}
        />
        {userErrorMessage}
      </View>
    );
  };

  const PasswordField = () => {
    const passwordErrorMessage = state.passwordValidation ? (
      <Text style={styles.validationErrorMessage}>
        {i18n.t("loginScreen.password.error", { locale })}
      </Text>
    ) : null;
    return(
      <View>
        <LabeledTextInput
          editing
          accessibilityLabel={i18n.t("loginScreen.password.label", {
            locale,
          })}
          label={i18n.t("loginScreen.password.label", { locale })}
          containerStyle={[styles.textField, state.passwordValidation && styles.validationErrorInput]}
          iconName={Platform.OS === "ios" ? "ios-key" : "md-key"}
          value={password}
          onChangeText={setPassword}
          underlineColorAndroid="transparent"
          secureTextEntry={showPassword}
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
              showPassword ?  { opacity: 0.3 } : { opacity: null },
            ]}
          />
        </TouchableOpacity>
        {passwordErrorMessage}
      </View>
    );
  };

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

  const AppVersion = () => {
    return <Text style={styles.versionText}>{Constants.manifest.version}</Text>;
  };

  // TODO: is KeyboardAwareScrollView necessary?
  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll
      enableOnAndroid
      keyboardOpeningTime={0}
      extraScrollHeight={0}
      keyboardShouldPersistTaps={"always"}
    >
      <View style={styles.container}>
        <Header />
        <View style={styles.formContainer}>
          { mobileAppPluginEnabled && <MobileAppPluginRequired /> }
          <DomainField />
          <UsernameField />
          <PasswordField />
          { loading ? <LoadingSpinner /> : <LoginButton /> }
          <AppVersion />
        </View>
        <LanguagePicker />
      </View>
    </KeyboardAwareScrollView>
  );
};
LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};
export default LoginScreen;