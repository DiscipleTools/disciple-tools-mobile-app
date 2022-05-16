//import './wdyr';
import React from "react";
import { Text } from "react-native";
import AppNavigator from "navigation/AppNavigator";

import { store, persistor } from "store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SWRConfig } from "swr";

import Toast from "react-native-toast-message";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { AuthProvider } from "hooks/use-auth";
import useApp from "hooks/use-app";
import useStyles from "hooks/use-styles";

import { AppConstants } from "constants";

import { enableScreens } from 'react-native-screens';
enableScreens();

const App = () => {

  // Initialize the app
  useApp();

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
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
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
                  <StyledApp />
                </AuthProvider>
              </SWRConfig>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
      <Toast/>
    </>
  );
};
export default App;
