import React, { forwardRef, useCallback, useMemo } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { localStyles } from "./SelectSheet.styles";

const ModalSheet = forwardRef((props, ref) => {
  const { styles } = useStyles(localStyles);
  const { height } = useWindowDimensions();
  const bottomInset = Math.floor(height*0.5);
  const snapPoints = useMemo(() => ["25%", "30%"], []);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
      />
    ), []);
  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      detached={true}
      bottomInset={bottomInset}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <Text>Help! 🎉</Text>
      </View>
    </BottomSheet>
  );
});

export const HelpSheet = forwardRef((props, ref)  => <ModalSheet ref={ref} />);

export default ModalSheet;