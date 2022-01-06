import React from "react";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

import { styles } from "./TitleBar.styles";

const TitleBar = () => {
  const route = useRoute();
  let title = route.params?.name ?? null;
  const charThreshold = 35;
  if (title?.length > charThreshold) {
    title = title.substring(0, charThreshold) + "...";
  };
  return(
    <View style={styles.titleBar}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
export default TitleBar;