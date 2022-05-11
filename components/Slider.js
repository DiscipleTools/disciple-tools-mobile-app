import React from "react";
import { Text, View } from "react-native";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Slider.styles";

const Slider = ({ value, onValueChange }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return(
    <View style={styles.container}>
      <Text>SLIDER</Text>
    </View>
  )
};
export default Slider;