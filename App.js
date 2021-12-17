import React, { useEffect } from "react";
import { LogBox } from "react-native";
import AppNavigator from "navigation/AppNavigator";
//import PropTypes from 'prop-types';

import { store, persistor } from "store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import * as SplashScreen from "expo-splash-screen";

import { Root } from 'native-base';

import { AuthProvider } from "hooks/useAuth";
import usePushNotifications from "hooks/usePushNotifications";

import { AppConstants } from "constants";

import { SWRConfig } from "swr";

const App = () => {

  // Ignore YellowBox warnings in DEV 
  LogBox.ignoreAllLogs();

  // Register Push Notification Listeners
  usePushNotifications();

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

  // NOTE: Native-Base <Root> required for some components
  return (
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
          <AuthProvider>
            <Root>
              <AppNavigator />
            </Root>
          </AuthProvider>
        </SWRConfig>
      </PersistGate>
    </Provider>
  );
};
export default App;