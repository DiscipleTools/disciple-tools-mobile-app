import React, { useCallback } from "react";

import * as SplashScreen from "expo-splash-screen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import PINScreen from "screens/PINScreen";
import LoginScreen from 'screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';

import usePIN from 'hooks/usePIN';
import { useAuth } from 'hooks/useAuth';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$$$$          APP NAVIGATOR                  $$$$$");
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

  const { PINConstants, hasPIN, cnoncePIN } = usePIN();
  const { authenticated, isAutoLogin, rememberLoginDetails } = useAuth();

  const onReady = useCallback(async() => {
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
          name='PIN'
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
          options={
            {
              // when logging out, a pop animation feels intuitive
              //animationTypeForReplace: state.hasValidLoginCNonces ? 'push' : 'pop',
            }
          }
        />
      </Stack.Navigator>
    );
  };

  const hasValidCNonce = (cnonce) => {
    return true;
    //return false;
  };

  const RenderLogin = () => {
    if (authenticated) return <MainTabNavigator/>;
    return <LoginStack/>;
  };

  const RenderStack = () => {
    console.log(`hasPIN? ${hasPIN}`);
    console.log(`isAutoLogin? ${isAutoLogin}`);
    console.log(`rememberLoginDetails? ${rememberLoginDetails}`);
    console.log(`cnoncePIN? ${cnoncePIN}`);
    // Stack 4. Most Secure, Least Convenient
    // PIN->Login->Main
    if (hasPIN && !hasAutoLogin) {
      console.log('*** AUTH 4 - PIN->Login->Main ***');
      if (hasValidCNonce(cnoncePIN)) return <RenderLogin />;
      return <PINStack/>;
    };
    // Stack 3. More Secure, Less Convenient
    // Login->Main
    if (!hasPIN && !isAutoLogin) {
      console.log('*** AUTH 3 - Login ***');
      return <RenderLogin />;
    };
    // Stack 2. Less Secure, More Convenient
    // PIN->Main
    if (hasPIN && isAutoLogin) {
      console.log('*** AUTH 2 - PIN->Main ***');
      if (hasValidCNonce(cnoncePIN)) return <RenderLogin />;
      return <PINStack/>;
    };
    // Stack 1. Least Secure, Most Convenient
    // Main
    // Login (following Logout, reinstall, delete cache/data)
    if (!hasPIN && isAutoLogin) {
      console.log('*** AUTH 1 - Main ***');
      return <RenderLogin />;
    }
    console.warn('Unknown Auth condition occurred!');
    return <LoginStack/>;
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