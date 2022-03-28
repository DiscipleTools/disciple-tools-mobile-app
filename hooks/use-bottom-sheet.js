import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFooter, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
//import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SheetFooterCancel, SheetFooterDone } from "components/Sheet/SheetFooter";

import useDevice from "hooks/use-device";
import useStyles from "hooks/use-styles";

const BottomSheetContext = createContext(null);

const DEFAULT_OPTIONS = {
  snapPoints: ['33%','50%','65%','95%'],
  defaultIndex: -1,
  renderHeader: () => null,
  renderContent: () => null,
  onDismiss: () => null,
};

export const BottomSheetProvider = ({ children }) => {

  const { isAndroid } = useDevice();
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

  const renderFooter = (props) => {
    if (options?.renderFooter) return(
      <BottomSheetFooter {...props}>
        { options?.renderFooter(props) }
      </BottomSheetFooter>
    );
    if (options?.onDone) return(
      <BottomSheetFooter {...props}>
        <SheetFooterDone onDone={() => options.onDone(multiSelectValues)} />
      </BottomSheetFooter>
    );
    return(
      <BottomSheetFooter {...props}>
        <SheetFooterCancel onDismiss={options?.onDismiss} />
      </BottomSheetFooter>
    );
  };

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
        footerComponent={options?.hideFooter ? null : renderFooter}
        backgroundStyle={globalStyles.background}
      >
        { options?.renderHeader() }
        { isAndroid ? (
          <BottomSheetScrollView>
            { options?.renderContent() }
          </BottomSheetScrollView>
        ) : (
          <>
            { options?.renderContent() }
          </>
        )}
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};
/*
        { options?.scrollable ? (
          <BottomSheetScrollView>
            { options?.renderContent() }
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView>
            { options?.renderContent() }
          </BottomSheetView>
        )}
*/

const useBottomSheet = () => useContext(BottomSheetContext);

export default useBottomSheet