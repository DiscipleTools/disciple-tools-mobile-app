import React from "react";
import { Text } from "react-native";
// TODO: remove
import { Row } from "native-base";

import { useNavigation } from "@react-navigation/native";

import KeySelectField from "components/Field/KeySelect/KeySelectField";

import useStyles from "hooks/use-styles";

import { localStyles } from "./PostItemHidden.styles";

const PostItemHidden = ({ item, loading }) => {

  const navigation = useNavigation();
  const { styles } = useStyles(localStyles);

  return null;
  //if (!item || loading) return null;
};
export default PostItemHidden;