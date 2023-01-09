import "./wdyr";
import React, { useEffect } from "react";
import { LogBox, Platform, Text } from "react-native";

import * as SplashScreen from "expo-splash-screen";

import AppNavigator from "navigation/AppNavigator";

import { store, persistor } from "store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SWRConfig } from "swr";

import Toast from "react-native-toast-message";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { AuthProvider } from "hooks/use-auth";
//import useApp from "hooks/use-app";
import useAppState from "hooks/use-app-state";
import useStyles from "hooks/use-styles";
import { toastConfig } from "hooks/use-toast";

//import { AppConstants } from "constants";

import { enableScreens } from "react-native-screens";
enableScreens();

const StyledApp = () => {
  // set default text styles
  const { globalStyles } = useStyles();
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { ...globalStyles.text };
  return <AppNavigator />;
};

const App = () => {
  // Initialize the app
  //useApp();

  // https://github.com/react-navigation/react-navigation/issues/10432#issuecomment-1081942421
  useEffect(() => {
    if (Platform.OS === "ios") {
      enableScreens(false);
    }
  }, []);

  // Dispay splash screen (keep visible until iniital screens ready to render)
  useEffect(() => {
    try {
      (async () => {
        await SplashScreen.preventAutoHideAsync();
      })();
    } catch (e) {
      console.warn(e);
    }
    return;
  }, []);

  // Persist SWR in-memory cache to device storage on an interval
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`Persist cache (runs every ${CacheConstants.INTERVAL} ms) -`, new Date());
      (async () => {
        await persistCache();
      })();
    }, CacheConstants.INTERVAL);
    return () => clearInterval(interval);
  }, []);
  */

  // Handle App State change(s)
  useAppState();

  LogBox.ignoreAllLogs();

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SWRConfig
              value={{
                revalidateOnFocus: true,
                refreshInterval: 0, //5000, //AppConstants.REFRESH_INTERVAL,
                shouldRetryOnError: false,
                dedupingInterval: 2000,
                focusThrottleInterval: 5000,
                loadingTimeout: 10000,
              }}
            >
              <AuthProvider>
                <BottomSheetModalProvider>
                  <StyledApp />
                </BottomSheetModalProvider>
              </AuthProvider>
            </SWRConfig>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
      <Toast config={toastConfig} />
    </>
  );
};
export default App;
