import { useEffect, useRef } from "react";
import { AppState } from "react-native";

import { AppStateConstants } from "constants";

const useAppState = ({ onAppForegroundCallback, onAppBackgroundCallback }) => {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(
            new RegExp(
              `${AppStateConstants.INACTIVE}|${AppStateConstants.BACKGROUND}`
            )
          ) &&
          nextAppState === AppStateConstants.ACTIVE
        ) {
          if (onAppForegroundCallback) {
            onAppForegroundCallback();
          }
        }
        if (
          appState.current.match(new RegExp(AppStateConstants.ACTIVE)) &&
          nextAppState !== AppStateConstants.ACTIVE
        ) {
          if (onAppBackgroundCallback) {
            onAppBackgroundCallback();
          }
        }
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
