import React from "react";
import { View, Text } from "react-native";

import { CloseIcon, ExpandIcon } from "components/Icon";

import { useBottomSheetModal } from "@gorhom/bottom-sheet";

import useStyles from "hooks/use-styles";

import { titleize } from "utils";

import { localStyles } from "./SheetHeader.styles";

const SheetHeader = ({
  expandable,
  dismissable,
  title,
  onDismiss,
  modalName,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { dismiss } = useBottomSheetModal();
  // TODO:
  /*
  const { expand, collapse, snapPoints, snapIndex, snapToIndex } =
    useBottomSheet();
  // TODO: lazy initialize
  const lastIdx = snapPoints?.length - 1;
  const isExpanded = snapIndex === lastIdx;
  const onPressExpand = isExpanded
    ? () => snapToIndex(0)
    : () => snapToIndex(lastIdx);
  */
  const onPressDismiss = () => {
    if (onDismiss) onDismiss();
    dismiss(modalName);
  };
  return (
    <View style={[globalStyles.rowContainer, styles.container]}>
      {title?.length > 0 && (
        <View>
          <Text style={globalStyles.title}>{titleize(title)}</Text>
        </View>
      )}
      <View style={[globalStyles.rowContainer, styles.controls]}>
        {/* {expandable && (
        <ExpandIcon
          onPress={() => onPressExpand()}
          style={[
            globalStyles.icon,
          ]}
        />
      )} */}
        {dismissable !== false && (
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
