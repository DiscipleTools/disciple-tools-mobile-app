import React from "react";
import { Linking, Pressable, Text, View } from "react-native";

import useI18N from "hooks/use-i18n";

import { styles } from "./PluginRequired.styles";

const PluginRequired = ({ enabled, label, link }) => {
  const { i18n, locale } = useI18N();
  if (enabled) return null;
  return(
    <Pressable onPress={() => Linking.openURL(link)}>
      <View style={styles.pluginAlert}>
        <Text>
          {i18n.t("loginScreen.errors.mobileAppPluginRequiredOne", { locale })}
        </Text>
        <Text style={styles.pluginLink}>
          {i18n.t("loginScreen.errors.mobileAppPluginRequiredTwo", { locale })}
        </Text>
      </View>
    </Pressable>
  );
};
export default PluginRequired;
