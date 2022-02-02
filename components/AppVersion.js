import React from "react";
import { Text } from "react-native";

import useApp from "hooks/useApp";
import useStyles from "hooks/useStyles";

import { localStyles } from "./AppVersion.styles";

const AppVersion = () => {
  const { styles } = useStyles(localStyles);
  const { version } = useApp();
  return <Text style={styles.versionText}>{version}</Text>;
};
export default AppVersion;