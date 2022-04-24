//import './wdyr';
import React, { useEffect } from "react";
import { LogBox, Text } from "react-native";
import AppNavigator from "navigation/AppNavigator";

import { store, persistor } from "store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import * as SplashScreen from "expo-splash-screen";

import Toast from "react-native-toast-message";

import { enableScreens } from 'react-native-screens';

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AuthProvider } from "hooks/use-auth";
import useStyles from "hooks/use-styles";

import { AppConstants } from "constants";

import { SWRConfig } from "swr";

enableScreens();

const App = () => {


  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, [])

  // Ignore YellowBox warnings in DEV 
  LogBox.ignoreAllLogs();

  // Keep the splash screen visible until we are ready to render the app
  // navigation/AppNavigator.js
  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  // NOTE: Necessary bc our chain of hooks depends on Redux and we need to be inside the Redux Provider
  const StyledApp = () => {
    // set default text styles
    const { globalStyles } = useStyles();
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { ...globalStyles.text };
    return <AppNavigator />;
  };

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SWRConfig
            value={{
              revalidateOnFocus: true,
              refreshInterval: AppConstants.REFRESH_INTERVAL,
              shouldRetryOnError: false,
              dedupingInterval: 2000,
              focusThrottleInterval: 5000,
              loadingTimeout: 10000,
            }}
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <AuthProvider>
                  <StyledApp />
                </AuthProvider>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </SWRConfig>
        </PersistGate>
      </Provider>
      <Toast/>
    </>
  );
};
export default App;
