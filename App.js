import React, { useEffect, useRef, useState } from "react";

// TODO: necessary with React Navigation 6?
//import { enableScreens } from 'react-native-screens';
//enableScreens();

import { LogBox } from "react-native";

import { Root } from 'native-base';

import NetInfo from "@react-native-community/netinfo";

import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

// TODO: should this be a hook?
import useConfig from "hooks/useConfig";
//import useInterval from "hooks/useInterval";
import { AuthProvider } from "hooks/useAuth";
import { NonceProvider } from "hooks/useNonce";

import AppNavigator from "navigation/AppNavigator";
import { store, persistor } from "store/store";
//import axios from "services/axios";

//import PropTypes from 'prop-types';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { SWRConfig } from "swr";

import {
  setNetworkStatus,
  setNetworkConnectivity,
} from "store/actions/network.actions";

const App = () => {
  const { timeout, refreshInterval } = useConfig();
  const [notifications, setNotification] = useState(false);
  console.log(notifications);
  const notificationListener = useRef();
  const responseListener = useRef();

  /*
  useInterval(() => {
    console.log("^^^^^ useInterval");
  }, 10000);
  */

  // Push Notification Listeners
  useEffect(() => {
    // Show incoming notifications when the app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    // Notification is received while the app is running
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    // User interacted with notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // TODO: Navigate to the appropriate screen on Notification click
        console.log(response);
      });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Network Connectivity Listeners
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      handleConnectivityChange(state.isConnected);
    });
    /*
    unsubscribe = NetInfo.addEventListener((state) =>
      utils.onlyExecuteLastCall(state.isConnected, handleConnectivityChange, 1000),
    );
    */
    return () => {
      //unsubscribe();
    };
  }, []);

  const handleConnectivityChange = (isConnected) => {
    if (isConnected) {
      // check if the phone has internet
      fetch("https://8.8.8.8")
        .then(() => {
          store.dispatch(setNetworkConnectivity(true));
          store.dispatch(setNetworkStatus(true));
        })
        .catch(() => {
          store.dispatch(setNetworkConnectivity(false));
          store.dispatch(setNetworkStatus(false));
        });
    } else {
      store.dispatch(setNetworkConnectivity(false));
      store.dispatch(setNetworkStatus(false));
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Artificially delay for two seconds to simulate a slow load
        //await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      }
    };
    init();
  }, []);

  // NOTE: Native Base <Root> required for components like <Toast>
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SWRConfig
          value={{
            revalidateOnFocus: true,
            refreshInterval: 0,
            shouldRetryOnError: false,
            dedupingInterval: 2000,
            focusThrottleInterval: 5000,
            loadingTimeout: 10000,
            //errorRetryCount: 2,
            //fetcher: async (...args) => axios(...args).then((res) => res.data),
          }}
        >
          <AuthProvider>
            <NonceProvider>
              <Root>
                <AppNavigator />
              </Root>
            </NonceProvider>
          </AuthProvider>
        </SWRConfig>
      </PersistGate>
    </Provider>
  );
};
export default App;

LogBox.ignoreLogs([
  "Warning:",
  "Animated:",
  "VirtualizedLists",
  "console.disableYellowBox",
]);
