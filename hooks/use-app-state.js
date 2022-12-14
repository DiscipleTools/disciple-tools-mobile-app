import { useEffect, useRef } from "react";
import { AppState } from "react-native";

import { persistCache } from "helpers";

import { AppStateConstants } from "constants";

const useAppState = () => {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        // ON APP FOREGROUND
        /*
        if (
          appState.current.match(
            new RegExp(
              `${AppStateConstants.INACTIVE}|${AppStateConstants.BACKGROUND}`
            )
          ) &&
          nextAppState === AppStateConstants.ACTIVE
        ) {
          //...
        }
        */
        // ON APP BACKGROUND
        if (
          appState.current.match(new RegExp(AppStateConstants.ACTIVE)) &&
          nextAppState !== AppStateConstants.ACTIVE
        ) {
          (async () => {
            await persistCache();
          })();
        };
        appState.current = nextAppState;
      }
    );
    return () => {
      subscription.remove();
    };
  }, []);
  return appState?.current;
};
export default useAppState;