import React, { useCallback, useEffect, useState } from "react";

import * as SplashScreen from "expo-splash-screen";

import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { navigationRef } from "./RootNavigation";

import LaunchScreen from "screens/LaunchScreen";
import PINScreen from "screens/PINScreen";
import LoginScreen from "screens/LoginScreen";
//import TabNavigator from "./TabNavigator";

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

  const RenderLogin = () => {
    const { authenticated } = useAuth();
    if (authenticated) return <LaunchScreen />;
    //if (authenticated) return <TabNavigator />;
    return <LoginStack />;
  };

  const RenderStack = () => {
    const { hasPIN, cnoncePIN, validateCNoncePIN } = usePIN();
    const [isValidCNoncePIN, setIsValidCNoncePIN] = useState(false);

    useEffect(() => {
      (async () => {
        const isValidCNoncePIN = await validateCNoncePIN();
        setIsValidCNoncePIN(isValidCNoncePIN);
      })();
      return;
    }, [cnoncePIN]);

    /*
     * IF PIN option is enabled AND PIN CNonce is invalid/stale, then navigate
     * user to PIN entry screen. Otherwise (CNonce is valid OR PIN option is
     * disabled), check if the user is authenticated (via RenderLogin)
     */
    if (hasPIN && !isValidCNoncePIN) {
      return <PINStack />;
    }
    return <RenderLogin />;
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
