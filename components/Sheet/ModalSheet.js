import React, { forwardRef, useCallback } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  SheetFooterCancel,
  SheetFooterDone,
} from "components/Sheet/SheetFooter";

import SheetHeader from "components/Sheet/SheetHeader";

import useStyles from "hooks/use-styles";

import { localStyles } from "./ModalSheet.styles";

const snapPoints = ["15%", "33%", "50%", "66%", "85%", "95%"];

export const getDefaultIndex = ({ items, itemHeight } = {}) => {
  const optionsCount = items?.length;
  if (!optionsCount) return snapPoints.length - 2;
  //if (optionsCount < 2) return 0;
  if (optionsCount < 3) return 1;
  if (optionsCount < 5) return 2;
  if (optionsCount < 9) return 3;
  return snapPoints.length - 1;
};

const ModalSheet = forwardRef(
  (
    { dismissable, expandable, children, name, title, defaultIndex, onDone },
    bottomSheetModalRef
  ) => {
    const { globalStyles } = useStyles(localStyles);

    const { dismiss } = useBottomSheetModal();

    const renderBackdrop = useCallback(
      (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />,
      []
    );

    const renderFooter = useCallback(
      (props) => (
        <BottomSheetFooter {...props}>
          {onDone ? (
            <SheetFooterDone onDone={onDone ? onDone : () => dismiss(name)} />
          ) : (
            <SheetFooterCancel onDismiss={() => dismiss(name)} />
          )}
        </BottomSheetFooter>
      ),
      [name]
    );

    return (
      <BottomSheetModal
        name={name}
        ref={bottomSheetModalRef}
        index={defaultIndex ?? 0}
        snapPoints={snapPoints}
        //onChange={handleSheetChanges ?? null}
        enablePanDownToClose={dismissable ?? true}
        backdropComponent={
          dismissable === false ? null : renderBackdrop ?? null
        }
        footerComponent={dismissable === false ? null : renderFooter ?? null}
        backgroundStyle={globalStyles.background}
        handleIndicatorStyle={globalStyles.divider}
        keyboardBehavior="interactive"
        //keyboardBehavior="extend"
        //keyboardBehavior="fullScreen"
        //keyboardBehavior="fillParent"
        keyboardBlurBehavior="restore"
      >
        <SheetHeader
          expandable={expandable}
          dismissable={dismissable}
          title={title}
          modalName={name}
        />
        {children}
      </BottomSheetModal>
    );
  }
);
export default ModalSheet;
