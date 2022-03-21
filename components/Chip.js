import React from "react";
import { Pressable, Text, View } from "react-native";

import useStyle from "hooks/use-styles";

import { localStyles } from "./Chip.styles";

// TODO: handle isLink better
const Chip = ({ isLink, selected, disabled, label, onPress, startIcon, endIcon, style }) => {
  const { styles, globalStyles } = useStyle(localStyles);
  return(
    <Pressable onPress={!onPress || disabled ? null : onPress}>
      <View
        style={[
          globalStyles.rowContainer,
          styles.container(selected),
          style
        ]}
      >
        { startIcon }
        <Text style={styles.label(selected, isLink)}>
          { label }
        </Text>
        { endIcon }
      </View>
    </Pressable>
  );
};
export default Chip;