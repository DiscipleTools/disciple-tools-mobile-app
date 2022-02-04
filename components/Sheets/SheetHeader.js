import React from "react";
import { Pressable, View, Text } from "react-native";
import { Icon } from "native-base";

import useBottomSheet from 'hooks/useBottomSheet';
import useStyles from "hooks/useStyles";

import { localStyles } from "./SheetHeader.styles";

const SheetHeader = ({ expandable, dismissable, title, onDismiss }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { expand, collapse, snapPoints, snapIndex, snapToIndex } = useBottomSheet();
  // TODO: lazy initialize
  const lastIdx = snapPoints?.length-1;
  const isExpanded = snapIndex === lastIdx;
  const onPressExpand = isExpanded ? () => snapToIndex(0) : () => snapToIndex(lastIdx);
  const onPressDismiss = () => {
    if (onDismiss) onDismiss();
    collapse();
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
            style={styles.closeIcon}
          />
        </Pressable>
      )}
    </View>
  );
};
export default SheetHeader;