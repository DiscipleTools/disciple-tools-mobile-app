import React from "react";
import { Pressable, Text, View } from "react-native";

import { CaretIcon } from "components/Icon";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Picker.styles";

const Picker = ({ onOpen, icon, label, style, optionStyle }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return (
    <Pressable onPress={onOpen}>
      <View style={[globalStyles.rowContainer, styles.container, style]}>
        <View style={[globalStyles.icon, optionStyle]}>{icon}</View>
        <View style={[optionStyle]}>
          <Text>{label}</Text>
        </View>
        <CaretIcon />
      </View>
    </Pressable>
  );
};
export default Picker;
