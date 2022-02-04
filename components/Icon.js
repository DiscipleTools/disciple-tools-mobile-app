import React from "react";
import { Pressable } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useStyles from "hooks/useStyles";

const Icon = ({ icon, onPress }) => (
  <Pressable
    disabled={!onPress}
    onPress={onPress}
    style={{ marginStart: "auto" }}
  >
    {icon}
  </Pressable>
);

const MaterialIcon = ({ name, onPress }) => {
  const { globalStyles } = useStyles();
  const icon = (
    <MaterialIcons
      name={name}
      style={globalStyles.icon}
    />
  );
  return <Icon icon={icon} onPress={onPress} />;
};

const MaterialCommunityIcon = ({ name, onPress }) => {
  const { globalStyles } = useStyles();
  const icon = (
    <MaterialCommunityIcons
      name={name}
      style={globalStyles.icon}
    />
  );
  return <Icon icon={icon} onPress={onPress} />;
};

const FontAwesomeIcon = ({ name, onPress }) => {
  const { globalStyles } = useStyles();
  const icon = (
    <FontAwesome
      name={name}
      style={globalStyles.icon}
    />
  );
  return <Icon icon={icon} onPress={onPress} />;
};

export const CaretIcon = () => <MaterialCommunityIcon name="chevron-down" />;

export const ClearIcon = ({ onPress }) => <MaterialIcon name="clear" onPress={onPress} />;
export const EditIcon = ({ onPress }) => <MaterialIcon name="edit" onPress={onPress} />;
export const SaveIcon = ({ onPress }) => <MaterialIcon name="save" onPress={onPress} />;

// TabBarIcons
export const SettingsIcon = ({ onPress }) => <FontAwesomeIcon name="cog" onPress={onPress} />;