import React, { useCallback, useEffect, useState } from "react";

// redux 
import { useSelector } from 'react-redux';

// expo
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from "expo-splash-screen";

// navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

// component library

// custom components
import PINScreen from "screens/PINScreen";
import LoginScreen from 'screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';

// 3rd party libraries
import jwt_decode from 'jwt-decode';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$$$$          APP NAVIGATOR                  $$$$$");
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

  const isAutoLogin = useSelector((state) => state.userReducer.isAutoLogin);
  const cnoncePIN = useSelector((state) => state.userReducer.cnoncePIN);
  const cnonceLogin = useSelector((state) => state.userReducer.cnonceLogin);

  // NOTE: this 'hasPIN' differs from 'state.userReducer.hasPIN' which is used only to toggle the Switch on the Settings Screen. This is set if an existing PIN is found in SecureStore (to compare user confirm/entry against)
  const [state, setState] = useState({
    hasPIN: null,
    hasAutoLogin: isAutoLogin,
    hasValidAuthToken: null,
    hasDomain: null, 
    hasValidPINCNonces: null,
    hasValidLoginCNonces: null,
    appIsReady: false 
  });

  const isTimelyCNonce = (cnonce, threshold) => {
    if (cnonce === null) return false;
    const delta = new Date()-Date.parse(cnonce);
    console.log(`*** DELTA: ${ delta } ***`);
    return delta < threshold;
  };

  const hasValidCNonces = async (cnonce, secureCNonceKey, secureCNonceDTKey, threshold) => {
    // TODO: useSecureStore hook
    // const { getCNonceDT, getCNonce } = useSecureStore();
    const secureCNonceDT = await SecureStore.getItemAsync(secureCNonceDTKey);
    //console.log(`secureCNonceDT: ${secureCNonceDT}`);
    const isTimelyCNonce = isTimelyCNonce(secureCNonceDT, threshold); 
    //console.log(`isTimelyCNonce: ${isTimelyCNonce}`);
    const secureCNonce = await SecureStore.getItemAsync(secureCNonceKey);
    //console.log(`secureCNonce: ${secureCNonce}`);
    const isMatchingCNonce = cnonce === secureCNonce;
    //console.log(`isMatchingCNonce: ${isMatchingCNonce}`);
    return (isTimelyCNonce && isMatchingCNonce);
  };

  const checkIsAuthTokenExpired = (token) => {
    const decoded = jwt_decode(token); //, {complete: true});
    let exp = decoded.exp; //decoded.payload.exp;
    if (exp < 10000000000) exp *= 1000;
    const now = Date.now();
    if (now <= exp) {
      return false;
    }
    return true;
  };

  const validateCNonces = async (type, cnonce) => {
    let secureCNonceKey = null;
    let secureCNonceDTKey = null;
    let threshold = null;
    if (type === "PIN") {
      secureCNonceKey = "cnoncePIN";
      secureCNonceDTKey = "cnoncePINDT";
      // TODO: different PIN threshold depending on auth stage?
      threshold = 30000; // 30 secs
    }
    if (type === "Login") {
      secureCNonceKey = "cnonceLogin";
      secureCNonceDTKey = "cnonceLoginDT";
      threshold = 30000; // 3 secs 
    }
    return await hasValidCNonces(cnonce, secureCNonceKey, secureCNonceDTKey, threshold); 
  };

  // TODO: useSecureStore hook
  const hasSecureStoreItem = async(key) => {
    item = await SecureStore.getItemAsync(key);
    if (item !== null && item.length > 0) return true;
    return false;
  };

  const init = async(cnonce=null) => {
    let hasPIN = null;
    let hasValidAuthToken = null;
    let hasDomain = null;
    let hasValidPINCNonces = null;
    let hasValidLoginCNonces = null;
    try {
      // Lookup Auth-related values in SecureStore
      hasPIN = await hasSecureStoreItem("pinCode");
      const hasAuthToken = await hasSecureStoreItem("authToken");
      if (hasAuthToken === true) {
        const authToken = await SecureStore.getItemAsync("authToken");
        const isAuthTokenExpired = checkIsAuthTokenExpired(authToken); 
        hasValidAuthToken = (hasAuthToken === true && isAuthTokenExpired === false);
      } else {
        hasValidAuthToken = false;
      }
      hasDomain = await hasSecureStoreItem("domain");
      hasValidPINCNonces = await validateCNonces("PIN", cnoncePIN);
      hasValidLoginCNonces = await validateCNonces("Login", cnonceLogin);
    } catch (e) {
      console.warn(e);
    } finally {
      console.log("**** setState - INIT ****");
      setState({
        ...state,
        hasPIN,
        hasValidAuthToken,
        hasDomain,
        hasValidPINCNonces,
        hasValidLoginCNonces,
        appIsReady: true
      });
    };
  };

  useEffect(() => {
    console.log("*** INIT ");
    console.log(`USE EFFECT: cnonceLogin: ${cnonceLogin}`);
    console.log(`USE EFFECT: cnoncePIN: ${cnoncePIN}`);
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

  const RenderStack = () => {
    console.log(`state.hasPIN? ${state.hasPIN}`);
    console.log(`state.hasAutoLogin? ${state.hasAutoLogin}`);
    console.log(`state.hasValidPINCNonces? ${state.hasValidPINCNonces}`);
    console.log(`state.hasValidLoginCNonces? ${state.hasValidLoginCNonces}`);
    console.log(`state.hasValidAuthToken? ${state.hasValidAuthToken}`);
    console.log(`state.hasDomain? ${state.hasDomain}`);
    // Stack 4. Most Secure, Least Convenient
    // PIN->Login->Main
    if (state.hasPIN && !state.hasAutoLogin) {
      console.log('*** AUTH 4 - PIN->Login->Main ***');
      // valid PINCNonces
      if (state.hasValidPINCNonces) {
        // valid LoginCNonces && valid Token/Domain
        //if (state.hasValidLoginCNonces && state.hasValidAuthToken && state.hasDomain) {
        if (state.hasValidAuthToken && state.hasDomain) {
          return <MainTabNavigator/>;
        } else {
          return <LoginStack/>;
        }
      }
      return <PINStack/>;
    }
    // Stack 3. More Secure, Less Convenient
    // Login->Main
    else if (!state.hasPIN && !state.hasAutoLogin) {
      console.log('*** AUTH 3 - Login ***');
      // valid LoginCNonces && valid Token/Domain
      // TODO: why is this broke and re-rendering?
      //if (state.hasValidLoginCNonces && state.hasValidAuthToken && state.hasDomain) {
      if (state.hasValidAuthToken && state.hasDomain) {
        return <MainTabNavigator/>;
      } else {
        return <LoginStack/>;
      }
    }
    // Stack 2. Less Secure, More Convenient
    // PIN->Main
    else if (state.hasPIN && state.hasAutoLogin) {
      console.log('*** AUTH 2 - PIN->Main ***');
      // valid PINCNonces
      if (state.hasValidPINCNonces) {
        // TODO: ONLINE? && !valid Token/Domain
        //if (ONLINE? && !state.hasValidAuthToken && !state.hasDomain)
        // return <LoginStack/>;
        return <MainTabNavigator/>;
      } else {
        return <PINStack/>;
      }
    }
    // Stack 1. Least Secure, Most Convenient
    // Main
    // Login (following Logout, reinstall, delete cache/data)
    else if (!state.hasPIN && state.hasAutoLogin) {
      console.log('*** AUTH 1 - Main ***');
      // valid Token/Domain
      if (state.hasValidAuthToken && state.hasDomain) {
        return <MainTabNavigator/>;
      } else {
        return <LoginStack/>;
      }
    }
    else {
      console.warn('Unknown Auth condition occurred!');
      return <LoginStack/>;
    }
  };

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
          initialParams={{ type: "validate" }}
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

        //<RenderStack />
        //<LoginStack />
  return (
    <SafeAreaProvider>
      <NavigationContainer onReady={onReady}>
        <MainTabNavigator/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default AppNavigator;
