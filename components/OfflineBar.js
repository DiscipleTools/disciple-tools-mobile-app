import React from "react";
import { Text, View } from "react-native";

import useNetwork from "hooks/use-network";
import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { localStyles } from "./OfflineBar.styles";

const OfflineBar = () => {
  const { isInitializing, isConnected } = useNetwork();
  const { styles } = useStyles(localStyles);
  const { i18n } = useI18N();
  if (isInitializing || isConnected) return null;
  return (
    <View style={styles.offlineBar}>
      <Text style={styles.offlineBarText}>
        {i18n.t("global.offline")}
      </Text>
    </View>
  );
};
export default OfflineBar;