import React from "react";
import { Text, View } from "react-native";

import { AlertIcon } from "components/Icon";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Alert.styles";

const Alert = ({ title, subtitle, icon }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return (
    <View style={styles.container}>
      <View style={globalStyles.rowContainer}>
        {icon ? <>{icon}</> : <AlertIcon style={styles.icon} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};
export default Alert;
