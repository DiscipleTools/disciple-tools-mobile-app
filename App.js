import React, { useState, useRef, useEffect } from 'react';
import { LogBox, Platform, StatusBar, StyleSheet, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Icon from '@expo/vector-icons';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
//import Reactotron from 'reactotron-react-native';
//import * as Sentry from 'sentry-expo';

import AppNavigator from './navigation/AppNavigator';
import { store, persistor } from './store/store';
import sharedTools from './shared';

// notifications

import { networkStatus, setNetworkConnectivity } from './store/actions/networkConnectivity.actions';

/*Sentry.init({
  dsn: 'https://aaa9d833ba5942d59c69e290ffbd3f36@o424480.ingest.sentry.io/5356329',
  enableInExpoDevelopment: true,
  debug: true,
});*/

import { styles } from './App.styles';

export default function App() {
  const [state, setState] = useState({
    isLoadingComplete: false,
  });
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // push notification listeners
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('********** NOTIFICATION RESPONSE RECEIVED **********');
      console.log(response);
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // network connectivity listeners
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      handleConnectivityChange(state.isConnected);
    });
    unsubscribe = NetInfo.addEventListener((state) =>
      sharedTools.onlyExecuteLastCall(state.isConnected, handleConnectivityChange, 1000),
    );
    //if (__DEV__) {
    // Reactotron can be used to see AsyncStorage data and API requests
    // If Reactotron gets no connection, this is the solution that worked for me (cairocoder01: 2019-08-15)
    // https://github.com/expo/expo-cli/issues/153#issuecomment-358925525
    // May need to then run this before `npm start`: `adb reverse tcp:9090 tcp:9090`
    //Reactotron.configure() // controls connection & communication settings
    //  .useReactNative() // add all built-in react native plugins
    //  .connect(); // let's connect!
    //}
    return () => {
      unsubscribe();
    };
  }, []);

  handleConnectivityChange = (isConnected) => {
    // detect conectivity change (This only says if a device has an active connection, not that it is able to reach the internet)
    if (isConnected) {
      // Check if the phone has internet
      fetch('https://8.8.8.8')
        .then(() => {
          store.dispatch(setNetworkConnectivity(true));
          store.dispatch(networkStatus(true));
        })
        .catch(() => {
          store.dispatch(setNetworkConnectivity(false));
          store.dispatch(networkStatus(false));
        });
    } else {
      store.dispatch(setNetworkConnectivity(false));
      store.dispatch(networkStatus(false));
    }
  };

  loadResourcesAsync = async () => {
    /*
    Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
    */
  };

  handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    // eslint-disable-next-line no-console
    console.warn(error);
  };

  handleFinishLoading = () => {
    setState({ isLoadingComplete: true });

    // Initialize language from redux store after it has been hydrated
    // const state = store.getState();
    // i18n.setLocale(state.i18nReducer.locale);
  };

  if (!state.isLoadingComplete) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={handleFinishLoading}
      />
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </PersistGate>
    </Provider>
  );
}

//LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Warning:', 'Animated:', 'VirtualizedLists', 'console.disableYellowBox']);
