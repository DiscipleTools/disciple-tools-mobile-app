import React from "react";
import { Text, View } from "react-native";
import * as RootNavigation from "navigation/RootNavigation";

import useStyles from "hooks/use-styles";

import { truncate } from "utils";

import { localStyles } from "./TitleBar.styles";

const TitleBar = ({ border, center, startIcon, title, endIcon, style }) => {
  const { styles, globalStyles } = useStyles(localStyles); 
  const route = RootNavigation.getRoute();
  if (!title && route) title = route.params?.name ?? null;
  return(
    <View style={[
      globalStyles.rowContainer,
      styles.container(border, center),
      style
    ]}>
      {startIcon}
      <Text style={styles.title(center)}>
        {truncate(title, { maxLength: 35 })}
      </Text>
      <View style={{
        marginStart: "auto",
        marginBottom: "auto",
      }}>
        {endIcon}
      </View>
    </View>
  );
};
export default TitleBar;