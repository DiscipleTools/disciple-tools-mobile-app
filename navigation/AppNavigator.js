import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from "expo-splash-screen";

import PINScreen from 'screens/PINScreen';

const Stack = createNativeStackNavigator();

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

  const PINStack = () => {
    return(
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          headerShown: false
        })}
      >
        <Stack.Screen
          name="PIN"
          component={PINScreen}
          initialParams={{ type: "validate" }}
        />
      </Stack.Navigator>
    );
  };

  const LoginStack = () => {
    return(
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          headerShown: false
        })}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            // when logging out, a pop animation feels intuitive
            //animationTypeForReplace: state.hasValidLoginCNonces ? 'push' : 'pop',
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer onReady={onReady}>
        <PINStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default AppNavigator;
