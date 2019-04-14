import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  NetInfo
} from 'react-native';
import PropTypes from 'prop-types';
import {
  AppLoading,
  Asset,
  Font,
  Icon,
} from 'expo';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import AppNavigator from './navigation/AppNavigator';
import store from './store/store';

import { setNetworkConnectivity } from './store/actions/networkConnectivity.actions';

const persistor = persistStore(store);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// App
class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoadingComplete: false,
    };
  }

  componentDidMount() {
    // add network connectivity handler
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange)
    // initial detection
    NetInfo.isConnected.fetch().done((isConnected) => {
      store.dispatch(setNetworkConnectivity(isConnected))
    })
  }

  componentWillUnmount() {
    // remove network connectivity handler
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange)
  }

  handleConnectivityChange = (isConnected) => { 
    // dispatch network connectivity action 
    store.dispatch(setNetworkConnectivity(isConnected))
  }

  loadResourcesAsync = async () => Promise.all([
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
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
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
export default App;
