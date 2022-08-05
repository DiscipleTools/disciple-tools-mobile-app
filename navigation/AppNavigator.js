import React, { useCallback, useEffect, useState } from "react";

import * as SplashScreen from "expo-splash-screen";

import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { navigationRef } from "./RootNavigation";

import PINScreen from "screens/PINScreen";
import LoginScreen from "screens/LoginScreen";
import TabNavigator from "./TabNavigator";

import usePIN from "hooks/use-pin";
import { useAuth } from "hooks/use-auth";
import { BottomSheetProvider } from "hooks/use-bottom-sheet";

const Stack = createNativeStackNavigator();

import { PINConstants } from "constants";

const AppNavigator = () => {
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

  const RenderLogin = ({ authenticated }) => {
    if (authenticated) return <TabNavigator />;
    return <LoginStack />;
  };

  const RenderStack = () => {
    const { hasPIN, cnoncePIN, validateCNoncePIN } = usePIN();
    const { authenticated, isAutoLogin } = useAuth();

    const [isValidCNoncePIN, setIsValidCNoncePIN] = useState(false);

    useEffect(() => {
      const run = async () => {
        const isValidCNoncePIN = await validateCNoncePIN();
        setIsValidCNoncePIN(isValidCNoncePIN);
      };
      run();
      return;
    }, [cnoncePIN]);

    // Auth Flow 4. Most Secure, Least Convenient
    // PIN->Login->Main
    if (hasPIN && !isAutoLogin) {
      //console.log("*** AUTH 4 - PIN->Login->Main ***");
      if (isValidCNoncePIN)
        return <RenderLogin authenticated={authenticated} />;
      return <PINStack />;
    }
    // Auth Flow 3. More Secure, Less Convenient
    // Login->Main
    if (!hasPIN && !isAutoLogin) {
      //console.log("*** AUTH 3 - Login ***");
      return <RenderLogin authenticated={authenticated} />;
    }
    // Auth Flow 2. Less Secure, More Convenient
    // PIN->Main
    if (hasPIN && isAutoLogin) {
      //console.log("*** AUTH 2 - PIN->Main ***");
      if (isValidCNoncePIN)
        return <RenderLogin authenticated={authenticated} />;
      return <PINStack />;
    }
    // Auth Flow 1. Least Secure, Most Convenient
    // Main
    // Login (following Logout, reinstall, delete cache/data)
    if (!hasPIN && isAutoLogin) {
      //console.log("*** AUTH 1 - Main ***");
      return <RenderLogin authenticated={authenticated} />;
    }
    console.warn("Unknown Auth condition occurred!");
    return <LoginStack />;
  };

  return (
    <NavigationContainer
      onReady={onReady}
      ref={navigationRef}
      //theme={DarkTheme}
      //onStateChange={(state) => {}}
    >
      <BottomSheetProvider>
        <SafeAreaProvider>
          <RenderStack />
        </SafeAreaProvider>
      </BottomSheetProvider>
    </NavigationContainer>
  );
};
export default AppNavigator;