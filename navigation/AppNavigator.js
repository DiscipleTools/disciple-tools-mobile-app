import React, { useCallback, useEffect, useState } from "react";

import * as SplashScreen from "expo-splash-screen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import PINScreen from "screens/PINScreen";
import LoginScreen from "screens/LoginScreen";
import MainTabNavigator from "./MainTabNavigator";

import usePIN from "hooks/usePIN";
import { useAuth } from "hooks/useAuth";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$$$$          APP NAVIGATOR                  $$$$$");
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

  const { PINConstants, hasPIN, validCNoncePIN } = usePIN();
  const { authenticated, isAutoLogin } = useAuth();

  const onReady = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  const PINStack = () => {
    return (
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
        })}
      >
        <Stack.Screen
          name="PIN"
          component={PINScreen}
          initialParams={{ type: PINConstants.VALIDATE }}
        />
      </Stack.Navigator>
    );
  };

  const LoginStack = () => {
    return (
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
        })}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          // when logging out, a pop animation feels intuitive
          //options={{ animationTypeForReplace: authenticated ? 'push' : 'pop' } }
        />
      </Stack.Navigator>
    );
  };

  const RenderLogin = () => {
    console.log(".......... RENDER LOGIN ....................");
    if (authenticated) return <MainTabNavigator />;
    return <LoginStack />;
  };

  const RenderStack = () => {
    console.log("authenticated?", authenticated);
    console.log("isAutoLogin?", isAutoLogin);
    console.log("hasPIN?", hasPIN);
    console.log("validCNoncePIN?", validCNoncePIN);

    // Auth Flow 4. Most Secure, Least Convenient
    // PIN->Login->Main
    if (hasPIN && !isAutoLogin) {
      console.log("*** AUTH 4 - PIN->Login->Main ***");
      if (validCNoncePIN) return <RenderLogin />;
      return <PINStack />;
    }
    // Auth Flow 3. More Secure, Less Convenient
    // Login->Main
    if (!hasPIN && !isAutoLogin) {
      console.log("*** AUTH 3 - Login ***");
      return <RenderLogin />;
    }
    // Auth Flow 2. Less Secure, More Convenient
    // PIN->Main
    if (hasPIN && isAutoLogin) {
      console.log("*** AUTH 2 - PIN->Main ***");
      if (validCNoncePIN) return <RenderLogin />;
      return <PINStack />;
    }
    // Auth Flow 1. Least Secure, Most Convenient
    // Main
    // Login (following Logout, reinstall, delete cache/data)
    if (!hasPIN && isAutoLogin) {
      console.log("*** AUTH 1 - Main ***");
      return <RenderLogin />;
    }
    console.warn("Unknown Auth condition occurred!");
    return <LoginStack />;
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer onReady={onReady}>
        <RenderStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default AppNavigator;