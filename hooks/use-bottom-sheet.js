import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFooter } from '@gorhom/bottom-sheet';
//import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SheetFooterCancel, SheetFooterDone } from "components/Sheet/SheetFooter";

import useStyles from "hooks/useStyles";

const BottomSheetContext = createContext(null);

const DEFAULT_OPTIONS = {
  snapPoints: ['33%','50%','65%','95%'],
  index: -1,
  multiple: false,
  renderContent: () => null,
  onDone: () => null,
  onDismiss: () => null,
};

export const BottomSheetProvider = ({ children }) => {

  const { globalStyles } = useStyles();
  //const insets = useSafeAreaInsets();

  const EXPAND = "expand";
  const COLLAPSE = "collapse";

  const optionsReducer = (state, action) => {
    switch (action.type) {
      case EXPAND:
        return { ...state, ...action };
      case COLLAPSE:
        return { ...DEFAULT_OPTIONS };
      default:
        return state;
    };
  };

  const bottomSheetRef = useRef(null);
  const [options, dispatch] = useReducer(optionsReducer, { ...DEFAULT_OPTIONS });
  const snapPoints = useMemo(() => options.snapPoints || [], [options]);
  const [snapIndex, setSnapIndex] = useState(-1);
  const [multiSelectValues, setMultiSelectValues] = useState(null);

  const collapseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close(); //collapse();
    dispatch({ type: COLLAPSE });
  }, []);

  const delayedClose = () => {
    setTimeout(() => {
      collapseBottomSheet();
    }, 100);
  };

  const bottomSheetContext = useMemo(
    () => ({
      expand: (opts) => {
        bottomSheetRef.current?.snapToIndex(opts?.defaultIndex ?? snapPoints?.length-1), //.expand();
        dispatch({ type: EXPAND, ...opts });
      },
      collapse: collapseBottomSheet,
      snapPoints,
      snapIndex,
      snapToIndex: (index) => bottomSheetRef.current?.snapToIndex(index),
      delayedClose,
      setMultiSelectValues,
    }),
    [collapseBottomSheet, snapIndex],
  );

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props}>
        {options?.multiple ? (
          <SheetFooterDone onDone={() => options?.onDone(multiSelectValues)} />
        ) : (
          <SheetFooterCancel onDismiss={options?.onDismiss} />
        )}
      </BottomSheetFooter>
    ),
    [options]
  );

  const onChange = (idx) => {
    if (idx === -1) dispatch({ type: COLLAPSE });
    setSnapIndex(idx);
  };

  return (
    <BottomSheetContext.Provider value={bottomSheetContext}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={onChange}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
        backgroundStyle={globalStyles.background}
      >
        { options?.renderContent() }
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

const useBottomSheet = () => useContext(BottomSheetContext);

export default useBottomSheet