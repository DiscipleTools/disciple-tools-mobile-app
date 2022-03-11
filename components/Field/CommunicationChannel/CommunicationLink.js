import React from "react";
import { Linking, Pressable, Text, View } from "react-native";

import useStyles from "hooks/use-styles";

import { localStyles } from "./CommunicationLink.styles";

const CommunicationLink = ({ key, value, fieldName }) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const isValidPhone = (fieldName) => {
    // TODO: phone regex
    return fieldName?.includes("phone");
  };

  const isValidEmail = (fieldName) => {
    // TODO: email regex
    return fieldName?.includes("email");
  };

  const isValidHttp = (value) => {
    const lowerCaseValue = value?.toLowerCase();
    return lowerCaseValue?.includes("http");
  };

  const isValidTLD = (value) => {
    const lowerCaseValue = value?.toLowerCase();
    return (
      lowerCaseValue?.includes(".com") ||
      lowerCaseValue?.includes(".net") ||
      lowerCaseValue?.includes(".org") ||
      lowerCaseValue?.includes(".me")
    );
  };

  const isValidURL = (value) => {
    // TODO: URL regex
    return (
      isValidHttp(value) ||
      isValidTLD(value)
    );
  };

  const getProtocol = (fieldName, value) => {
    if (isValidPhone(fieldName)) return "tel:";
    if (isValidEmail(fieldName)) return "mailto:";
    if (isValidHttp(value)) return '';
    return null;
  };

  let protocol = getProtocol(fieldName, value);
  const url = `${protocol}${value}`;
  return(
    <Pressable key={key} onPress={() => { protocol ? Linking.openURL(url) : null }}>
      <View style={styles.container}>
        <Text style={styles.linkingText}>
          {value}
        </Text>
      </View>
    </Pressable>
  );
};
export default CommunicationLink;