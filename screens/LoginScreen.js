import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Image, Keyboard, Linking, Text, View } from "react-native";
import { UsernameIcon, EyeIcon, KeyIcon, LinkIcon } from "components/Icon";
import Button from "components/Button";
import Link from "components/Link";
import PluginRequired from "components/PluginRequired";
import LabeledTextInput from "components/LabeledTextInput";
import LanguagePicker from "components/Picker/LanguagePicker";
import AppVersion from "components/AppVersion";

import { useAuth } from "hooks/use-auth";
import useI18N from "hooks/use-i18n";
import usePlugins from "hooks/use-plugins";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";

import { localStyles } from "./LoginScreen.styles";

const LoginScreen = (props) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const {
    user,
    rememberLoginDetails,
    signInO365,
    check2FaEnabled,
    persistUser,
  } = useAuth();
  const { i18n, isRTL } = useI18N();
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
        // await signIn(cleanedDomain, username, password);
        let response = await check2FaEnabled(cleanedDomain, username, password);
        // console.log("------onLoginPress check2FaEnabled------", response);
        // console.log("------TOKEN?------", response.token);
        // console.log("------wp_2fa_totp_key?------", response.wp_2fa_totp_key);
        if (response?.token) {
          await persistUser(cleanedDomain, username, response);
        } else if (response?.wp_2fa_totp_key) {
          // NAVIGATE TO ValidateOtp SCREEN, PASS Params
          props.navigation.navigate("ValidateOtp", {
            paramsData: {
              domain: cleanedDomain,
              username,
              password,
              userData: response,
            },
          });
        }
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
      setLoading(false);
    }
  };

  const onLoginPressO365 = async () => {
    Keyboard.dismiss();
    const domain = domainRef.current;
    if (domain) {
      const cleanedDomain = cleanDomain(domain);
      setLoading(true);
      try {
        await signInO365(cleanedDomain);
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
        userValidation: null,
        passwordValidation: null,
      });
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
        {i18n.t("global.error.isRequired", { item: i18n.t("global.url") })}
      </Text>
    ) : null;
    const label = i18n.t("global.url");
    return (
      <>
        <LabeledTextInput
          editing
          onChangeText={(text) => {
            ref.current = text;
            setDomain(text);
          }}
          value={domain}
          accessibilityLabel={label}
          label={label}
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
        {i18n.t("global.error.isRequired", { item: i18n.t("global.username") })}
      </Text>
    ) : null;
    const label = i18n.t("global.username");
    return (
      <>
        <LabeledTextInput
          editing
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            ref.current = text;
          }}
          accessibilityLabel={label}
          label={label}
          containerStyle={[
            styles.textField,
            state.usernameValidation && styles.validationErrorInput,
          ]}
          startIcon={<UsernameIcon />}
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
        {i18n.t("global.error.isRequired", { item: i18n.t("global.password") })}
      </Text>
    ) : null;
    const label = i18n.t("global.password");
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
          accessibilityLabel={label}
          label={label}
          //style={styles.inputText}
          containerStyle={[
            styles.textField,
            state.passwordValidation && styles.validationErrorInput,
          ]}
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

  const ForgotPasswordLink = () => (
    <Link
      disabled={loading}
      title={i18n.t("global.forgotPassword")}
      onPress={() => {
        const domain = domainRef?.current;
        if (domain?.length > 0) {
          Linking.openURL(`https://${domain}/wp-login.php?action=lostpassword`);
        } else {
          toast(i18n.t("loginScreen.domain.errorForgotPass"), true);
        }
      }}
      containerStyle={styles.forgotPasswordLink}
    />
  );

  const LoginButton = () => (
    <Button
      title={i18n.t("global.login")}
      loading={loading}
      onPress={onLoginPress}
    />
  );

  const O365LoginButton = () => (
    <Button
      title={i18n.t("global.login") + " O365"}
      loading={loading}
      onPress={onLoginPressO365}
    />
  );

  return (
    <View style={globalStyles.screenContainer}>
      <Header />
      <View style={styles.formContainer}>
        <PluginRequired {...mobileAppPlugin} />
        <DomainField ref={domainRef} />
        <UsernameField ref={usernameRef} />
        <PasswordField ref={passwordRef} />
        <LoginButton />
        <ForgotPasswordLink />
        <O365LoginButton />
        <LanguagePicker />
        <AppVersion />
      </View>
    </View>
  );
};
export default LoginScreen;
