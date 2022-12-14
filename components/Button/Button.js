import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Button.styles";

const Button = ({
  title,
  loading,
  onPress,
  startIcon,
  endIcon,
  containerStyle,
  style
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return (
    <>
      {loading ? (
        <ActivityIndicator style={[globalStyles.icon, styles.spinner]} />
      ) : (
        <Pressable
          onPress={onPress ?? null}
          style={[globalStyles.rowContainer, styles.container, containerStyle]}
          accessible={true}
          accessibilityLabel={title}
        >
          {startIcon}
          <Text style={[styles.text, style]}>{title}</Text>
          {endIcon}
        </Pressable>
      )}
    </>
  );
};
export default Button;
