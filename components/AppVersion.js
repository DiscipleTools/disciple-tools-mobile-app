import React from "react";
import { Text } from "react-native";

import useStyles from "hooks/use-styles";

import { APP_VERSION } from "constants";

import { localStyles } from "./AppVersion.styles";

const AppVersion = () => {
  const { styles } = useStyles(localStyles);
  return <Text style={styles.versionText}>{APP_VERSION}</Text>;
};
export default AppVersion;
