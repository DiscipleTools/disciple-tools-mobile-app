import React from "react";
import { Pressable } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useStyles from "hooks/useStyles";

const Icon = ({ icon, onPress }) => {
  if (onPress) return(
    <Pressable onPress={onPress}>
      {icon}
    </Pressable>
  );
  return icon;
};

export const CaretIcon = () => {
  const { globalStyles } = useStyles();
  return(
    <MaterialCommunityIcons
      name="chevron-down"
      style={[globalStyles.icon, globalStyles.caret]}
    />
  );
};

export const ClearIcon = ({ onPress }) => {
  const { globalStyles } = useStyles();
  const icon = (
    <MaterialIcons
      name="clear"
      style={[globalStyles.icon]}
    />
  );
  return <Icon icon={icon} onPress={onPress} />;
};

export const SaveIcon = ({ onPress }) => {
  const { globalStyles } = useStyles();
  const icon = (
    <MaterialIcons
      name="save"
      style={[globalStyles.icon]}
    />
  );
  return <Icon icon={icon} onPress={onPress} />;
};