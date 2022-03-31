import React, { forwardRef, useLayoutEffect } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFooter, BottomSheetScrollView } from "@gorhom/bottom-sheet";

//import { SheetFooterCancel, SheetFooterDone } from "components/Sheet/SheetFooter";

import useDevice from "hooks/use-device";
import useStyles from "hooks/use-styles";


const CustomBottomSheet = forwardRef(({
  dismissable,
  modal,
  defaultIndex,
  snapPoints,
  onChange,
  header,
  footer,
  children
}, ref) => {

  const { isAndroid } = useDevice();
  const { globalStyles } = useStyles();

  if (!snapPoints) snapPoints = [0.25, 0.33, 0.5, 0.66, 0.95];
  if (!defaultIndex && defaultIndex !== 0) defaultIndex = -1;

  // NOTE: required before we can interact with the component (eg, snapToIndex)
  useLayoutEffect(() => {
    if (ref?.current) ref.current?.expand(); //ref.current?.present();
    return () => {
      if (ref?.current) ref.current?.close();
    };
  }, []);

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop
      {...props}
      //disappearsOnIndex={-1}
    />
  );

  const renderFooter = (props) => {
    if (footer) return(
      <BottomSheetFooter {...props}>
        { footer }
      </BottomSheetFooter>
    );
    return null;
  };

  const _onChange = (index) => {
    if (onChange) onChange(index);
  };

  return(
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      index={defaultIndex}
      onChange={_onChange}
      enablePanDownToClose={dismissable === false ? false : true}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backdropComponent={modal === false ? null : renderBackdrop}
      footerComponent={renderFooter}
      backgroundStyle={globalStyles.background}
    >
      { header }
      { isAndroid ? (
        <BottomSheetScrollView>
          { children }
        </BottomSheetScrollView>
      ) : (
        <>
          { children }
        </>
      )}
    </BottomSheet>
  );
});
export default CustomBottomSheet;