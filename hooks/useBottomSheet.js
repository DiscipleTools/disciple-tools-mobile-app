import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState } from "react";
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import useStyles from "hooks/useStyles";

const BottomSheetContext = createContext(null);

const DEFAULT_OPTIONS = {
  snapPoints: ['50%', '95%'],
  index: -1,
  renderContent: () => null,
};

export const BottomSheetProvider = ({ children }) => {

  const { globalStyles } = useStyles();

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
        bottomSheetRef.current?.snapToIndex(opts?.index ?? snapPoints?.length-1), //.expand();
        dispatch({ type: EXPAND, ...opts });
      },
      collapse: collapseBottomSheet,
      snapPoints,
      snapIndex,
      snapToIndex: (index) => bottomSheetRef.current?.snapToIndex(index),
      delayedClose
    }),
    [collapseBottomSheet, snapIndex],
  );

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        //appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheetContext.Provider value={bottomSheetContext}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={setSnapIndex}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={globalStyles.background}
      >
        { options?.renderContent() }
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

const useBottomSheet = () => useContext(BottomSheetContext);

export default useBottomSheet