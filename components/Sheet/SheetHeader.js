import React from "react";
import { View, Text } from "react-native";

import { CloseIcon, ExpandIcon } from "components/Icon";

import useBottomSheet from 'hooks/use-bottom-sheet';
import useStyles from "hooks/use-styles";

import { truncate } from "utils";

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
  return(
    <View style={[
      globalStyles.rowContainer,
      styles.container
    ]}>
      <View>
      { title?.length > 0 && (
        <Text style={globalStyles.title}>{truncate(title, { maxLength: 35 })}</Text>
      )}
      </View>
      <View style={[
        globalStyles.rowContainer,
        styles.controls
      ]}>
      {/* {expandable && (
        <ExpandIcon
          onPress={() => onPressExpand()}
          style={[
            globalStyles.icon,
          ]}
        />
      )} */}
      {dismissable && (
        <CloseIcon
          onPress={() => onPressDismiss()}
          style={styles.closeIcon}
        />
      )}
      </View>
    </View>
  );
};
export default SheetHeader;