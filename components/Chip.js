import React from "react";
import { Pressable, Text, View } from "react-native";

import useStyle from "hooks/use-styles";

import { localStyles } from "./Chip.styles";

// TODO: handle isLink better
const Chip = ({
  isLink,
  selected,
  disabled,
  label,
  onPress,
  startIcon,
  endIcon,
  style,
  color,
  containerStyle,
  labelStyle,
}) => {
  const { styles, globalStyles } = useStyle(localStyles);
  const statusBorderSize = styles.container.height / 2;
  const adjustStylePadding = color ? { ...style, paddingStart: 0 } : style;
  return (
    <Pressable onPress={!onPress || disabled ? null : onPress}>
      <View
        style={[
          globalStyles.rowContainer,
          styles.containerColor(selected),
          styles.container,
          adjustStylePadding,
          ,
          containerStyle,
        ]}
      >
        {color && <ChipStatusBorder size={statusBorderSize} color={color} />}
        {startIcon}
        <Text style={[styles.label(selected, isLink), labelStyle]}>
          {label}
        </Text>
        {endIcon}
      </View>
    </Pressable>
  );
};
export default Chip;

function ChipStatusBorder({ size, color }) {
  const colorStyle = {
    borderStartColor: color ?? "transparent",
    borderStartWidth: size,
    borderRadius: size,
    width: 2 * size,
    height: "100%",
    marginEnd: -size + 5,
  };
  return <View style={colorStyle} />;
}
