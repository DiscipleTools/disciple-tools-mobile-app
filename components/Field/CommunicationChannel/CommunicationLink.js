import { Linking, Pressable, Text, View } from "react-native";

import useStyles from "hooks/use-styles";

import { isValidEmail, isValidPhone, isValidURL } from "utils";

import { localStyles } from "./CommunicationLink.styles";

const getProtocol = ({ key, value }) => {
  if (isValidEmail({ value })) return "mailto:";
  // be lenient with phone numbers and let the phone app handle it
  if (typeof key === "string" && key?.toLowerCase()?.includes("phone"))
    return "tel:";
  if (isValidPhone({ value })) return "tel:";
  if (isValidURL({ value })) {
    if (!value.includes("http")) return "https://";
    return "";
  }
  return null;
};

const CommunicationLink = ({ entryKey, value }) => {
  const { styles } = useStyles(localStyles);

  let protocol = getProtocol({ key: entryKey, value });
  const url = `${protocol}${value}`;
  const isLink = protocol !== null;
  return (
    <Pressable
      onPress={() => {
        isLink ? Linking.openURL(url) : null;
      }}
    >
      <View style={styles.container}>
        <Text style={isLink ? styles.linkingText : styles.unlinkingText}>
          {value}
        </Text>
      </View>
    </Pressable>
  );
};
export default CommunicationLink;
