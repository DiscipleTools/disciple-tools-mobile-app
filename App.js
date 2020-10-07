import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import { AppLoading, Notifications } from 'expo';
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// App
let unsubscribe;
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoadingComplete: false,
      notification: {},
    };
  }

  componentDidMount() {
    // initial detection
    NetInfo.fetch().then((state) => {
      this.handleConnectivityChange(state.isConnected);
    });
    // add network connectivity handler
    unsubscribe = NetInfo.addEventListener((state) =>
      sharedTools.onlyExecuteLastCall(state.isConnected, this.handleConnectivityChange, 1000),
    );

    if (__DEV__) {
      // Reactotron can be used to see AsyncStorage data and API requests
      // If Reactotron gets no connection, this is the solution that worked for me (cairocoder01: 2019-08-15)
      // https://github.com/expo/expo-cli/issues/153#issuecomment-358925525
      // May need to then run this before `npm start`: `adb reverse tcp:9090 tcp:9090`
      //Reactotron.configure() // controls connection & communication settings
      //  .useReactNative() // add all built-in react native plugins
      //  .connect(); // let's connect!
    }

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this.notificationSubscription = Notifications.addListener(this.handleNotification);
  }

  componentWillUnmount() {
    // remove network connectivity handler
    unsubscribe();
  }

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

  handleNotification = (notification) => {
    this.setState({ notification });
    console.log(`received notification: ${JSON.stringify(this.state.notification)}`);
  };

  loadResourcesAsync = async () =>
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

  handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    // eslint-disable-next-line no-console
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });

    // Initialize language from redux store after it has been hydrated
    // const state = store.getState();
    // i18n.setLocale(state.i18nReducer.locale);
  };

  render() {
    const AppContainer = (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );

    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {AppContainer}
        </PersistGate>
      </Provider>
    );
  }
}

App.propTypes = {
  skipLoadingScreen: PropTypes.bool,
};
App.defaultProps = {
  skipLoadingScreen: false,
};
console.disableYellowBox = true;
export default App;
