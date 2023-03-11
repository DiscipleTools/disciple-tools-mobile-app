import React, { useState } from "react";
import { Image, Keyboard, View } from "react-native";
import { EyeIcon, KeyIcon } from "components/Icon";
import PluginRequired from "components/PluginRequired";
import { LabeledTextInput } from "components/LabeledTextInput";
import Button from "components/Button";

import { useAuth } from "hooks/use-auth";
import usePlugins from "hooks/use-plugins";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";

import { localStyles } from "./LoginScreen.styles";

const ValidateOtpScreen = (props) => {
  const { domain, username, password, userData } =
    props?.route?.params?.paramsData ?? {};

  const { styles, globalStyles } = useStyles(localStyles);
  const { persistUser, validateOtp } = useAuth();

  const { mobileAppPlugin } = usePlugins();
  const toast = useToast();

  const [state, setState] = useState({
    otpValidation: null,
  });

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [loading, setLoading] = useState(false);

  // TODO: add validation
  const onSubmitPress = async () => {
    Keyboard.dismiss();
    // setLoading(true);

    if (otp?.trim().length > 0) {
      setLoading(true);
      setState({
        ...state,
        otpValidation: null,
      });
      try {
        let response = await validateOtp(domain, username, password, otp);

        if (response?.token) {
          // PERSIST USER
          await persistUser(domain, username, response);
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

  const SubmitButton = () => (
    <Button title={"Submit"} loading={loading} onPress={onSubmitPress} />
  );

  return (
    <View style={globalStyles.screenContainer}>
      <Header />
      <View style={styles.formContainer}>
        <PluginRequired {...mobileAppPlugin} />
        <LabeledTextInput
          editing
          maxLength={8}
          value={otp}
          onChangeText={(text) => {
            setOtp(text);
          }}
          i18nKey="global.otp"
          keyboardType="number-pad"
          startIcon={<KeyIcon />}
          endIcon={
            <EyeIcon
              onPress={() => setShowOtp(!showOtp)}
              style={styles.showPasswordIcon(showOtp)}
            />
          }
          secureTextEntry={!showOtp}
          error={state.otpValidation}
        />
        <SubmitButton />
      </View>
    </View>
  );
};
export default ValidateOtpScreen;
