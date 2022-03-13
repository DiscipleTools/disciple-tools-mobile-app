import React from "react";
import { Pressable } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useStyles from "hooks/use-styles";

const Icon = ({ icon, onPress }) => (
  <Pressable
    disabled={!onPress}
    onPress={onPress}
    style={{ marginStart: "auto" }}
  >
    {icon}
  </Pressable>
);

const MaterialIcon = ({ name, onPress, style }) => {
  const { globalStyles } = useStyles();
  const icon = (
    <MaterialIcons
      name={name}
      style={[globalStyles.icon, style]}
    />
  );
  return <Icon icon={icon} onPress={onPress} />;
};

const MaterialCommunityIcon = ({ name, onPress, style }) => {
  const { globalStyles } = useStyles();
  const icon = (
    <MaterialCommunityIcons
      name={name}
      style={[globalStyles.icon, style]}
    />
  );
  return <Icon icon={icon} onPress={onPress} />;
};

export const AccountIcon = ({ onPress, style }) => <MaterialCommunityIcon name="account" onPress={onPress} style={style} />;
export const AddIcon = ({ onPress, style }) => <MaterialIcon name="add" onPress={onPress} style={style} />;
export const ArrowLeftIcon = ({ onPress, style }) => <MaterialCommunityIcon name="arrow-left" onPress={onPress} style={style} />;
export const ArrowRightIcon = ({ onPress, style }) => <MaterialCommunityIcon name="arrow-right" onPress={onPress} style={style} />;
export const CaretIcon = ({ onPress, style }) => <MaterialCommunityIcon name="chevron-down" onPress={onPress} style={style} />;
export const CheckIcon = ({ onPress, style }) => <MaterialCommunityIcon name="check" onPress={onPress} style={style} />;
export const ClearIcon = ({ onPress, style }) => <MaterialIcon name="clear" onPress={onPress} style={style} />;
export const ClearFiltersIcon = ({ onPress, style }) => <MaterialCommunityIcon name="filter-variant-remove" onPress={onPress} style={style} />;
export const CircleIcon = ({ onPress, style }) => <MaterialCommunityIcon name="circle" onPress={onPress} style={style} />;
export const CircleOutlineIcon = ({ onPress, style }) => <MaterialCommunityIcon name="circle-outline" onPress={onPress} style={style} />;
export const EditIcon = ({ onPress, style }) => <MaterialIcon name="edit" onPress={onPress} style={style} />;
export const ExpandIcon = ({ onPress, style }) => <MaterialCommunityIcon name="arrow-expand" onPress={onPress} style={style} />;
export const EyeIcon = ({ onPress, style }) => <MaterialCommunityIcon name="eye" onPress={onPress} style={style} />;
export const KeyIcon = ({ onPress, style }) => <MaterialCommunityIcon name="key-variant" onPress={onPress} style={style} />;
export const LinkIcon = ({ onPress, style }) => <MaterialCommunityIcon name="link" onPress={onPress} style={style} />;
export const MapIcon = ({ onPress, style }) => <MaterialCommunityIcon name="earth" onPress={onPress} style={style} />;
export const RemoveIcon = ({ onPress, style }) => <MaterialIcon name="remove" onPress={onPress} style={style} />;
export const SaveIcon = ({ onPress, style }) => <MaterialIcon name="save" onPress={onPress} style={style} />;
export const SearchIcon = ({ onPress, style }) => <MaterialIcon name="search" onPress={onPress} style={style} />;
export const SendIcon = ({ onPress, style }) => <MaterialCommunityIcon name="send-circle" onPress={onPress} style={style} />;
export const SortIcon = ({ onPress, style }) => <MaterialCommunityIcon name="sort" onPress={onPress} style={style} />;
export const SquareIcon = ({ onPress, style }) => <MaterialCommunityIcon name="square" onPress={onPress} style={style} />;

// Notifications
export const CommentIcon = ({ onPress, style }) => <MaterialCommunityIcon name="comment-outline" onPress={onPress} style={style} />;
export const CommentAlertIcon = ({ onPress, style }) => <MaterialCommunityIcon name="comment-alert" onPress={onPress} style={style} />;
export const CommentEditIcon = ({ onPress, style }) => <MaterialCommunityIcon name="comment-edit-outline" onPress={onPress} style={style} />;
export const MentionIcon = ({ onPress, style }) => <MaterialCommunityIcon name="at" onPress={onPress} style={style} />;

// Sort
export const SortAscIcon = ({ onPress, style }) => <MaterialCommunityIcon name="sort-reverse-variant" onPress={onPress} style={style} />;
export const SortDescIcon = ({ onPress, style }) => <MaterialCommunityIcon name="sort-variant" onPress={onPress} style={style} />;

// Nav Tab Bar
export const SettingsIcon = ({ onPress, style }) => <MaterialIcon name="settings" onPress={onPress} style={style} />;