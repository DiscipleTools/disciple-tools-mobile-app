import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Button.styles";

const Button = ({ title, loading, onPress, containerStyle, style }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return(
    <>
      {loading ? (
        <ActivityIndicator
          style={[
            globalStyles.icon,
            styles.spinner
          ]}
        />
      ) : (
        <Pressable
          onPress={onPress ?? null}
          style={[
            styles.container,
            containerStyle
          ]}
          accessible={true}
          accessibilityLabel={title}
        >
          <Text
            style={[
              styles.text,
              style
            ]}
          >
            {title}
          </Text>
        </Pressable>
      )}
     </>
  );
};
export default Button;