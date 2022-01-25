import React from "react";
import { Pressable, View, Text } from "react-native";
import { Icon } from "native-base";
import { useBottomSheet } from '@gorhom/bottom-sheet';

import useStyles from "hooks/useStyles";

import { localStyles } from "./SheetHeader.styles";

const SheetHeader = ({ expandable, dismissable, title, snapPoints, snapIndex, onDismiss }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { snapToIndex, expand, close } = useBottomSheet();
  // TODO: lazy initialize
  const lastIdx = snapPoints.length-1;
  const isExpanded = snapIndex === lastIdx;
  const onPressExpand = isExpanded ? () => snapToIndex(0) : () => expand();
  const onPressDismiss = () => {
    if (onDismiss) onDismiss();
    close();
  };
  const truncatedTitle = title?.length > 35 ? `${title.substring(0, 35)}...` : title;
  return(
    <View style={styles.container}>
      { title?.length > 0 && (
        <Text style={globalStyles.title}>{truncatedTitle}</Text>
      )}
      {expandable && (
        <Pressable onPress={() => onPressExpand()}>
          <Icon
            type="MaterialCommunityIcons"
            name="arrow-expand"
            style={globalStyles.icon}
          />
        </Pressable>
      )}
      {dismissable && (
        <Pressable onPress={() => onPressDismiss()}>
          <Icon
            type="MaterialIcons"
            name="clear"
            style={[
              globalStyles.icon,
              { fontSize: 32 }
            ]}
          />
        </Pressable>
      )}
    </View>
  );
};
export default SheetHeader;