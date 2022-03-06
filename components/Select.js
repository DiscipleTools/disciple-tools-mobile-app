import React from "react";
import { Pressable, View } from "react-native";

import { CaretIcon } from "components/Icon";

import useStyles from "hooks/useStyles";

import { localStyles } from "./Select.styles";

const Select = ({ onOpen, items, renderItem, style, optionStyle }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return(
    <Pressable onPress={onOpen}>
      <View style={[
        globalStyles.rowContainer,
        styles.container,
        style
      ]}>
        <View style={[
          globalStyles.rowContainer,
          styles.optionContainer,
          optionStyle
        ]}>
          {items?.map(renderItem)}
        </View>
        <CaretIcon />
      </View>
    </Pressable>
  );
};
export default Select;