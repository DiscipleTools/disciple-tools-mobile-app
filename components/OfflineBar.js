import React from "react";
import { Text, View } from "react-native";

import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";

import { styles } from "./OfflineBar.styles";

const OfflineBar = () => {
  const { isConnected } = useNetworkStatus();
  const { i18n } = useI18N();
  if (isConnected) return null;
  return (
    <View style={styles.offlineBar}>
      <Text style={styles.offlineBarText}>
        {i18n.t("global.offline")}
      </Text>
    </View>
  );
};
export default OfflineBar;