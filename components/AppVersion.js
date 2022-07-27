import React from "react";
import { Text } from "react-native";

import useApp from "hooks/use-app";
import useStyles from "hooks/use-styles";

import { localStyles } from "./AppVersion.styles";

const AppVersion = () => {
  const { styles } = useStyles(localStyles);
  const { version } = useApp();
  return <Text style={styles.versionText}>{version}</Text>;
};
export default AppVersion;
