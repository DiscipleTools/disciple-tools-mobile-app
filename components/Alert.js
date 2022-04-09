import React from "react";
import { Text, View } from "react-native";

import { AlertIcon } from "components/Icon";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Alert.styles";

const Alert = ({ title, subtitle }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return(
    <View style={styles.container}>
      <View style={globalStyles.rowContainer}>
        <AlertIcon />
        <Text style={styles.title}>
          {title}
        </Text>
      </View>
      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
};
export default Alert;