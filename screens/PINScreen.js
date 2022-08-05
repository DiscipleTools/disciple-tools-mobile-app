import React, { useState, useRef } from "react";
import { Image, Text, View } from "react-native";

import { LockIcon } from "components/Icon";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";

import useI18N from "hooks/use-i18n";
import usePIN from "hooks/use-pin";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";

import { PINConstants } from "constants";

import { localStyles } from "./PINScreen.styles";

const PINScreen = ({ navigation, route }) => {
  const [state, setState] = useState({
    code: "",
    tmpCode: null,
  });

  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { getPIN, setPIN, deletePIN, setCNoncePIN, activateDistress } =
    usePIN();
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
      // "000000",
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

  const handleFulfill = async (code) => {
    if (isValidate || isDelete) {
      const secretCode = await getPIN();

      if (isValidate && code === "000000") {
        // Support for "distress"
        activateDistress();
      } else if (secretCode === null) {
        toast(i18n.t("global.error.pinExisting"), true);
        pinInput.current.shake().then(() => setState({ ...state, code: "" }));
      } else if (code === secretCode) {
        if (isValidate) {
          await setCNoncePIN();
        } else if (isDelete) {
          deletePIN();
          navigation.goBack();
          toast(
            i18n.t("global.pinCodeAction", {
              action: i18n.t("global.deleted"),
            }),
            true
          );
        } else {
          console.warn(`Unknown PINScreen type: ${type}`);
          navigation.goBack();
        }
      } else {
        pinInput.current.shake().then(() => setState({ ...state, code: "" }));
      }
    } else if (isSet && state.tmpCode === null) {
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
        toast(i18n.t("global.error.pinRepeating"), true);
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
        toast(
          i18n.t("global.pinCodeAction", { action: i18n.t("global.saved") })
        );
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
        // TODO: do not ask to confirm PIN when incorrect
        return i18n.t("global.pinConfirm");
      } else if (isSet) {
        return i18n.t("global.pinEnter");
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
      <View style={styles.iconContainer}>
        <LockIcon style={styles.icon} />
      </View>
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
