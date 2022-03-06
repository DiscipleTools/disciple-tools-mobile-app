import React from "react";
import { Pressable, View, Text } from "react-native";

import { ClearIcon, ExpandIcon } from "components/Icon";

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
      <View>
      { title?.length > 0 && (
        <Text style={globalStyles.title}>{truncatedTitle}</Text>
      )}
      </View>
      <View style={[
        globalStyles.rowContainer,
        styles.controls
      ]}>
      {expandable && (
        <ExpandIcon
          onPress={() => onPressExpand()}
          style={[
            globalStyles.icon,
          ]}
        />
      )}
      {dismissable && (
        <ClearIcon
          onPress={() => onPressDismiss()}
          style={styles.closeIcon}
        />
      )}
      </View>
    </View>
  );
};
export default SheetHeader;