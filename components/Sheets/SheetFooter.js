import React from "react";
import { Pressable, View, Text } from "react-native";
import { Icon } from "native-base";
import { useBottomSheet } from '@gorhom/bottom-sheet';

import useI18N from "hooks/useI18N";
import useStyles from "hooks/useStyles";

import { localStyles } from "./SheetFooter.styles";

const SheetFooter = ({ label, renderIcon, onPress }) => {
  const { styles } = useStyles(localStyles);
  return(
    <Pressable onPress={() => onPress()}>
      <View style={styles.container}>
        { renderIcon }
        <Text>{label}</Text>
      </View>
    </Pressable>
  );
};

export const SheetFooterCancel = ({ onDismiss }) => {
  const { close } = useBottomSheet();
  const { i18n } = useI18N();
  const { globalStyles } = useStyles();
  const label = i18n.t("global.cancel");
  let onPress = () => close();
  if (onDismiss) {
    onPress = () => {
      onDismiss();
      close();
    };
  };
  const renderIcon = (
    <Icon
      type="MaterialIcons"
      name="clear"
      style={globalStyles.icon}
    />
  );
  return <SheetFooter label={label} renderIcon={renderIcon} onPress={onPress} />;
};

export const SheetFooterDone = ({ onDone }) => {
  const { close } = useBottomSheet();
  const { i18n } = useI18N();
  const { globalStyles } = useStyles();
  const label = i18n.t("global.done");
  let onPress = () => close();
  if (onDone) {
    onPress = () => {
      onDone();
      close();
    };
  };
  const renderIcon = (
    <Icon
      type="MaterialIcons"
      name="check"
      style={globalStyles.icon}
    />
  );
  return <SheetFooter label={label} renderIcon={renderIcon} onPress={onPress} />;
};

export default SheetFooter;