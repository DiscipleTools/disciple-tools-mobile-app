import React, { useState, useRef, forwardRef } from "react";
import { Image, Keyboard, Text, View } from "react-native";
import { EyeIcon, KeyIcon } from "components/Icon";
import PluginRequired from "components/PluginRequired";
import LabeledTextInput from "components/LabeledTextInput";
import Button from "components/Button";

import { useAuth } from "hooks/use-auth";
import useDevice from "hooks/use-device";
import useI18N from "hooks/use-i18n";
import usePlugins from "hooks/use-plugins";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";

import { localStyles } from "./LoginScreen.styles";

const ValidateOtpScreen = (props) => {
  const { domain, username, password, userData } =
    props.route.params.paramsData;

  const { styles, globalStyles } = useStyles(localStyles);
  const { persistUser, validateOtp } = useAuth();
  const { isIOS } = useDevice();
  const { i18n, isRTL, locale } = useI18N();
  const { mobileAppPlugin } = usePlugins();
  const toast = useToast();

  const [state, setState] = useState({
    otpValidation: null,
  });

  const [loading, setLoading] = useState(false);

  const otpRef = useRef(null);

  // TODO: add validation
  const onSubmitPress = async () => {
    Keyboard.dismiss();
    // setLoading(true);

    const otp = otpRef.current;
    if (otp) {
      setLoading(true);
      try {
        let response = await validateOtp(domain, username, password, otp);
        console.log("------onSubmitPress validateOtp------", response);

        if (response?.token) {
          // PERSIST USER
          await persistUser(domain, username, response);
        }
      } catch (error) {
        console.log("------ERROR------", error);
        toast(error.message, true);
      } finally {
        setLoading(false);
      }
    } else {
      // if any of the required fields are not set, then update state to show error
      setState({
        ...state,
        otpValidation: !otp,
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

  const OtpField = forwardRef((props, ref) => {
    const [otp, setOtp] = useState(ref?.current);
    const [showOtp, setShowOtp] = useState(false);
    const otpErrorMessage = state.otpValidation ? (
      <Text style={styles.validationErrorMessage}>Please enter OTP</Text>
    ) : null;
    return (
      <View>
        <LabeledTextInput
          maxLength={6}
          editing
          value={otp}
          onChangeText={(text) => {
            ref.current = text;
            setOtp(text);
          }}
          ref={ref}
          accessibilityLabel={i18n.t("loginScreen.otp.label", { locale })}
          label="OTP"
          //style={styles.inputText}
          containerStyle={[
            styles.textField,
            state.otpValidation && styles.validationErrorInput,
          ]}
          //iconName={isIOS ? "ios-key" : "md-key"}
          startIcon={<KeyIcon />}
          endIcon={
            <EyeIcon
              onPress={() => setShowOtp(!showOtp)}
              style={styles.showPasswordIcon(showOtp)}
            />
          }
          underlineColorAndroid="transparent"
          secureTextEntry={!showOtp}
          // textAlign={isRTL ? "right" : "left"}
        />
        {otpErrorMessage}
      </View>
    );
  });

  const SubmitButton = () => (
    <Button title={"Submit"} loading={loading} onPress={onSubmitPress} />
  );

  return (
    <View style={globalStyles.screenContainer}>
      <Header />
      <View style={styles.formContainer}>
        <PluginRequired {...mobileAppPlugin} />
        <OtpField ref={otpRef} />
        <SubmitButton />
      </View>
    </View>
  );
};
export default ValidateOtpScreen;
