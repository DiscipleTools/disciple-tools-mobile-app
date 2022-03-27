import React, { useState, useEffect, useRef, forwardRef } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import { AccountIcon, EyeIcon, KeyIcon, LinkIcon } from "components/Icon";
import PluginRequired from "components/PluginRequired";
import LabeledTextInput from "components/LabeledTextInput";
import LanguagePicker from "components/Picker/LanguagePicker";
import AppVersion from "components/AppVersion";

import { useAuth } from "hooks/use-auth";
import useDevice from "hooks/use-device";
import useI18N from "hooks/use-i18n";
import usePlugins from "hooks/use-plugins";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";

import { localStyles } from "./LoginScreen.styles";

const LoginScreen = () => {
  const { styles, globalStyles } = useStyles(localStyles);
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

  //const usernameFieldRef = useRef();
  //const passwordFieldRef = useRef();

  const cleanDomain = (domain) => {
    // trim leading/trailing whitespace and remove protocol
    return domain?.trim()?.replace("http://", "")?.replace("https://", "");
  };

  // TODO: add validation
  const onLoginPress = async () => {
    Keyboard.dismiss();
    setLoading(true);
    const domain = domainRef.current;
    const username = usernameRef.current;
    const password = passwordRef.current;
    if (domain && username && password) {
      const cleanedDomain = cleanDomain(domain);
      try {
        await signIn(cleanedDomain, username, password);
      } catch (error) {
        toast(error.message, true);
      } finally {
        setLoading(false);
      }
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
      Linking.openURL(`https://${domain}/wp-login.php?action=lostpassword`);
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

  const DomainField = forwardRef((props, ref) => {
    useEffect(() => {
      if (rememberLoginDetails && user?.domain) {
        ref.current = user.domain;
        setDomain(user.domain);
      }
    }, []);
    const [domain, setDomain] = useState(ref?.current);
    const domainErrorMessage = state.domainValidation ? (
      <Text style={styles.validationErrorMessage}>
        {i18n.t("loginScreen.domain.error", { locale })}
      </Text>
    ) : null;
    return (
      <>
        <LabeledTextInput
          editing
          onChangeText={(text) => {
            ref.current = text;
            setDomain(text);
          }}
          value={domain}
          accessibilityLabel={i18n.t("loginScreen.domain.label", { locale })}
          label={i18n.t("loginScreen.domain.label", { locale })}
          containerStyle={[
            styles.textField,
            state.domainValidation && styles.domainErrorInput,
          ]}
          startIcon={<LinkIcon />}
          // TODO: is this necessary (using rowContainer in component?)
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
  });

  const UsernameField = forwardRef((props, ref) => {
    useEffect(() => {
      if (rememberLoginDetails && user?.username) {
        ref.current = user.username;
        setUsername(user.username);
      }
    }, []);
    const [username, setUsername] = useState(ref?.current);
    const userErrorMessage = state.userValidation ? (
      <Text style={styles.validationErrorMessage}>
        {i18n.t("loginScreen.username.error", { locale })}
      </Text>
    ) : null;
    return (
      <>
        <LabeledTextInput
          editing
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            ref.current = text;
          }}
          accessibilityLabel={i18n.t("loginScreen.username.label", { locale })}
          label={i18n.t("loginScreen.username.label", { locale })}
          containerStyle={[
            styles.textField,
            state.usernameValidation && styles.validationErrorInput,
          ]}
          //iconName={isIOS ? "ios-person" : "md-person"}
          startIcon={<AccountIcon />}
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
  });

  const PasswordField = forwardRef((props, ref) => {
    const [password, setPassword] = useState(ref?.current);
    const [showPassword, setShowPassword] = useState(false);
    const passwordErrorMessage = state.passwordValidation ? (
      <Text style={styles.validationErrorMessage}>
        {i18n.t("loginScreen.password.error", { locale })}
      </Text>
    ) : null;
    return (
      <View>
        <LabeledTextInput
          editing
          value={password}
          onChangeText={(text) => {
            ref.current = text;
            setPassword(text);
          }}
          ref={ref}
          accessibilityLabel={i18n.t("loginScreen.password.label", { locale })}
          label={i18n.t("loginScreen.password.label", { locale })}
          //style={styles.inputText}
          containerStyle={[
            styles.textField,
            state.passwordValidation && styles.validationErrorInput,
          ]}
          //iconName={isIOS ? "ios-key" : "md-key"}
          startIcon={<KeyIcon />}
          endIcon={
            <EyeIcon
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPasswordIcon(showPassword)}
            />
          }
          underlineColorAndroid="transparent"
          secureTextEntry={!showPassword}
          textAlign={isRTL ? "right" : "left"}
        />
        {passwordErrorMessage}
      </View>
    );
  });

  const LoginButton = () => (
    <>
      <Pressable onPress={onLoginPress}>
        <View style={styles.signInButton}>
          <Text style={styles.signInButtonText}>
            {i18n.t("global.logIn", { locale })}
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={goToForgotPassword} disabled={loading}>
        <View style={styles.forgotButton}>
          <Text style={globalStyles.link}>
            {i18n.t("global.forgotPassword", { locale })}
          </Text>
        </View>
      </Pressable>
    </>
  );

  const LoadingSpinner = () => {
    return <ActivityIndicator style={[globalStyles.icon, styles.spinner]} />;
  };

  return (
    <View style={globalStyles.screenContainer}>
      <Header />
      <View style={styles.formContainer}>
        <PluginRequired {...mobileAppPlugin} />
        <DomainField ref={domainRef} />
        <UsernameField ref={usernameRef} />
        <PasswordField ref={passwordRef} />
        {loading ? <LoadingSpinner /> : <LoginButton />}
        <LanguagePicker />
        <AppVersion />
      </View>
    </View>
  );
};
export default LoginScreen;
