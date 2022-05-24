import React from "react";
import { Pressable, Text, View } from "react-native";

import useStyles from "hooks/use-styles";

import { localStyles } from "./ListItem.styles";

const ListItem = ({ label, startComponent, endComponent, onPress, style }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return (
    <Pressable onPress={onPress ?? null}>
      <View style={[globalStyles.rowContainer, styles.container, style]}>
        <View style={styles.start}>{startComponent}</View>
        <View style={styles.label}>
          <Text>{label}</Text>
        </View>
        <View style={styles.end}>{endComponent}</View>
      </View>
    </Pressable>
  );
};
export default ListItem;
