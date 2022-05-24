import React from "react";
import { Text, View } from "react-native";

import i18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import { localStyles } from "./Placeholder.styles";

const Placeholder = ({ placeholder, type }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = i18N();
  const { postType } = useType();
  const getDefaultPlaceholder = () => {
    if (type) return type;
    if (!type && postType) return postType;
    return i18n.t("global.items");
  };
  const items = getDefaultPlaceholder();
  const defaultPlaceholder = i18n.t("global.placeholder", { items });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{placeholder ?? defaultPlaceholder}</Text>
    </View>
  );
};
export default Placeholder;
