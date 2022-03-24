import React, { useState, useRef } from "react";
import { Image, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { LockIcon } from "components/Icon";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";

import useI18N from "hooks/use-i18n";
import usePIN from "hooks/use-pin";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";

import { localStyles } from "./PINScreen.styles";

const PINScreen = ({ navigation, route }) => {
  const [state, setState] = useState({
    code: "",
    tmpCode: null,
  });

  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { PINConstants, getPIN, setPIN, deletePIN, setCNoncePIN } = usePIN();
  const toast = useToast();

  const type = route?.params?.type ? route.params.type : null;
  const isValidate = type === PINConstants.VALIDATE ? true : false;
  const isDelete = type === PINConstants.DELETE ? true : false;
  const isSet = type === PINConstants.SET ? true : false;

  const pinInput = useRef();

  const isRepeating = (code) => {
    return [
      "111111",
      "222222",
      "333333",
      "444444",
      "555555",
      "666666",
      "777777",
      "888888",
      "999999",
      "000000",
    ].includes(code);
  };

  const isSequential = (code) => {
    return [
      "012345",
      "123456",
      "234567",
      "345678",
      "456789",
      "567890",
      "678901",
      "789012",
      "890123",
      "901234",
    ].includes(code);
  };

  // TODO: add support for "distress"
  const handleFulfill = async (code) => {
    console.log(`code: ${code}`);
    if (isValidate || isDelete) {
      console.log("*** VALIDATE OR DELETE ***");
      const secretCode = await getPIN();
      // TODO: translate
      if (secretCode === null) {
        toast(
          "Error: Unable to retrieve existing PIN. Please reinstall app, and if the problem persists then please contact your Disciple Tools Administrator for assistance",
          true
        );
        pinInput.current.shake().then(() => setState({ ...state, code: "" }));
      } else if (code === secretCode) {
        if (isValidate) {
          await setCNoncePIN();
        } else if (isDelete) {
          deletePIN();
          navigation.goBack();
          toast(i18n.t("settingsScreen.removedPinCode"));
        } else {
          console.warn(`Unknown PINScreen type: ${type}`);
          navigation.goBack();
        }
      } else {
        pinInput.current.shake().then(() => setState({ ...state, code: "" }));
      }
    } else if (isSet && state.tmpCode === null) {
      console.log("*** SET ***");
      const isCompliant = !isRepeating(code) && !isSequential(code);
      if (isCompliant) {
        setState({
          ...state,
          code: "",
          tmpCode: code,
        });
      } else if (isRepeating || isSequential) {
        pinInput.current.shake().then(() =>
          setState({
            ...state,
            code: "",
          })
        );
        // TODO: translate
        toast(
          "Error: Repeating (i.e., 444444) or Sequential (i.e., 234567) values are not permitted",
          true
        );
      } else {
        // unknown issue: retry
        pinInput.current.shake().then(() =>
          setState({
            ...state,
            code: "",
          })
        );
      }
    } else if (isSet && state.tmpCode !== null) {
      if (code === state.tmpCode) {
        setPIN(code);
        setState({ code: "", tmpCode: null });
        navigation.goBack();
        toast(i18n.t("settingsScreen.savedPinCode"));
      } else {
        pinInput.current.shake().then(() =>
          setState({
            ...state,
            code: "",
          })
        );
      }
    } else {
      console.warn(`Unknown PINScreen type: ${type}`);
      navigation.goBack();
    }
  };

  const DisplayText = () => {
    const getDisplayText = () => {
      if (isValidate || isDelete || (isSet && state.tmpCode !== null)) {
        return i18n.t("settingsScreen.confirmPin");
      } else if (isSet) {
        return i18n.t("settingsScreen.enterPin");
      } else {
        return "";
      }
    };
    return <Text style={styles.text}>{getDisplayText()}</Text>;
  };

  return (
    <View style={styles.container}>
      <Image source={require("assets/dt-icon.png")} style={styles.logo} />
      <DisplayText />
      <LockIcon style={styles.icon} />
      <SmoothPinCodeInput
        ref={pinInput}
        autoFocus
        password
        mask="﹡"
        codeLength={6}
        restrictToNumbers
        cellStyle={styles.cellStyle}
        cellStyleFocused={styles.cellStyleFocused}
        textStyle={styles.textStyle}
        textStyleFocused={styles.textStyleFocused}
        value={state.code}
        onTextChange={(code) => {
          setState({
            ...state,
            code,
          });
        }}
        onFulfill={handleFulfill}
      />
    </View>
  );
};
export default PINScreen;
