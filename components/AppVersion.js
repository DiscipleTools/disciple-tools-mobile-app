import React from "react";
import { Text } from "react-native";

import useApp from "hooks/useApp";

import { styles } from "./AppVersion.styles";

const AppVersion = () => {
  const { version } = useApp();
  return <Text style={styles.versionText}>{version}</Text>;
};
export default AppVersion;