import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import useStyles from "hooks/use-styles";

import { localStyles } from "./ListItem.styles";

const ListItem = ({
  hoverable,
  label,
  startComponent,
  endComponent,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  style,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={() => {
        if (hoverable) setPressed(false);
        if (onPress) {
          onPress();
          return;
        }
        return null;
      }}
      onPressIn={() => {
        if (hoverable) setPressed(true);
        if (onPressIn) {
          onPressIn();
          return;
        }
        return null;
      }}
      onPressOut={() => {
        if (hoverable) setPressed(false);
        if (onPressOut) {
          onPressOut();
          return;
        }
        return null;
      }}
      onLongPress={() => {
        if (hoverable) setPressed(false);
        if (onLongPress) {
          onLongPress();
          return;
        }
        return null;
      }}
    >
      <View
        style={[
          globalStyles.rowContainer,
          styles.container({ active: hoverable && pressed }),
          style,
        ]}
      >
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
