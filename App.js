import './wdyr';
import React, { useEffect } from "react";
import { LogBox, Text } from "react-native";
import AppNavigator from "navigation/AppNavigator";
//import PropTypes from 'prop-types';

import { store, persistor } from "store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import * as SplashScreen from "expo-splash-screen";

import { Root } from 'native-base';

import { AuthProvider } from "hooks/useAuth";
import usePushNotifications from "hooks/usePushNotifications";
import useStyles from "hooks/useStyles";

import { AppConstants } from "constants";

import { SWRConfig } from "swr";

const App = () => {


  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, [])

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

  // NOTE: Necessary bc our chain of hooks depends on Redux and we need to be inside the Redux Provider
  const StyledApp = () => {
    // set default text styles
    const { globalStyles } = useStyles();
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { ...globalStyles.text };
    return <AppNavigator />;
  };

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
              <StyledApp />
            </Root>
          </AuthProvider>
        </SWRConfig>
      </PersistGate>
    </Provider>
  );
};
export default App;
