import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";

const AppNavigator = () => {
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$$$$          APP NAVIGATOR                  $$$$$");
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

  const [state, setState] = useState({
    appIsReady: false,
  });

  const init = async () => {
    setState({
      ...state,
      appIsReady: true,
    });
  };

  useEffect(() => {
    console.log("*** INIT ");
    init();
    //}, [cnonceLogin, cnoncePIN]);
  }, []);

  const onReady = useCallback(async () => {
    if (state.appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [state.appIsReady]);

  if (!state.appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer onReady={onReady}>
        <View style={styles.container}>
          <Text>D.T v1.10.0</Text>
          <StatusBar style="auto" />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default AppNavigator;
