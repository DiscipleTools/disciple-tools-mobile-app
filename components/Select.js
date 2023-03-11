import React from "react";
import { Pressable, View } from "react-native";

import { CaretIcon } from "components/Icon";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Select.styles";

const Select = ({ onOpen, items, renderItem, style, optionStyle }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return (
    <Pressable
      onPress={onOpen}
      style={[globalStyles.rowContainer, styles.container, style]}
    >
      <View
        style={[globalStyles.rowContainer, styles.optionContainer, optionStyle]}
      >
        {Array.isArray(items) &&
          items?.map((item, idx) => renderItem(item, idx))}
      </View>
      {onOpen && <CaretIcon />}
    </Pressable>
  );
};
export default Select;
