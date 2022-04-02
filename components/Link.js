import React from "react";
import { Pressable, Text } from "react-native";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Link.styles";

const Link = ({ disabled, title, onPress, containerStyle, style }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return(
    <Pressable
      disabled={disabled}
      onPress={onPress ?? null}
      style={[
        styles.container,
        containerStyle
      ]}
      accessible={true}
      accessibilityLabel={title}
    >
      <Text style={globalStyles.link}>
        {title}
      </Text>
    </Pressable>
  );
};
export default Link;