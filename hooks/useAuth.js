import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleAutoLogin as _toggleAutoLogin,
  toggleRememberLoginDetails as _toggleRememberLoginDetails,
} from "store/actions/auth.actions";

import useNetwork from "hooks/use-network";
import useI18N from "hooks/useI18N";
import useSecureStore from "hooks/useSecureStore";

import axios from "services/axios";

import jwt_decode from "jwt-decode";

const AuthConstants = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  BASE_URL: "BASE_URL",
  USER: "USER",
};

// TODO: load protocol from .env
const PROTOCOL = "https";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const auth = useCustomAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

const useCustomAuth = () => {

  const { setLocale } = useI18N();

  // TODO: validate "iss" === domain
  const validateToken = (token) => {
    const payload = jwt_decode(token);
    let exp = payload.exp;
    if (exp < 10000000000) exp *= 1000;
    const now = Date.now();
    if (now <= exp) return true;
    return false;
  };

  const decodeToken = (token) => {
    try {
      return jwt_decode(token);
    } catch (error) {
      return null;
    };
  };

  const [accessToken, setAccessToken] = useState(null);
  const [baseUrl, setBaseUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const dispatch = useDispatch();

  // NOTE: Redux already does a good job indicating whether to rehydrate state, so use that
  const rehydrate = useSelector(state => state?.authReducer?.rehydrate);
  const isAutoLogin = useSelector(state => state?.authReducer?.isAutoLogin);
  const rememberLoginDetails = useSelector(state => state?.authReducer?.rememberLoginDetails);

  const { isConnected } = useNetwork();
  const { getSecureItem, setSecureItem, deleteSecureItem } = useSecureStore();

  // rehydrate state from secure storage (depends on Redux to notify via "rehydrate" change)
  useEffect(async() => {
    /*
    if auto-login, but accessToken is missing or invalid, 
    then attempt to rehydrate accessToken from secure storage
    else do nothing bc user will be prompted to re-login
    */
    if (isAutoLogin && (!accessToken || (accessToken && !validateToken(accessToken)))) {
      // rehydrate access token
      const rehydratedAccessToken = await getSecureItem(AuthConstants.ACCESS_TOKEN);
      //console.log(`~~~~~~~~~~ rehydratedAccessToken: ${rehydratedAccessToken}`);
      if (validateToken(rehydratedAccessToken)) setAccessToken(rehydratedAccessToken);
    };
    // rehydrate baseUrl
    const rehydratedBaseUrl = baseUrl ?? (await getSecureItem(AuthConstants.BASE_URL));
    //console.log(`~~~~~~~~~~ rehydratedBaseUrl: ${rehydratedBaseUrl}`);
    setBaseUrl(rehydratedBaseUrl);
    // rehydrate user
    try {
      const rehydratedUser = user ?? JSON.parse((await getSecureItem(AuthConstants.USER)));
      //console.log(`~~~~~~~~~~ rehydratedUser: ${JSON.stringify(rehydratedUser)}`);
      // TODO: if user unable to be rehydrated AND have valid accessToken and baseUrl, then request user info
      setUser(rehydratedUser);
    } catch (error) {
      setUser(null);
    };
  }, [rehydrate]);

  // when "accessToken" changes, validate it:
  // if valid, configure axios interceptors and setAuthenticated(true)
  // else setAuthenticated(false)
  useEffect(async() => {
    if (accessToken && validateToken(accessToken)) {
      // Add a request interceptor
      axios.interceptors.request.use(
        config => {
          if (accessToken && accessToken !== config.headers?.Authorization) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
          } else {
            delete config.headers["Authorization"];
            setAuthenticated(false);
          };
          return config;
        },
        error => error
      );
      // Add a response interceptor
      axios.interceptors.response.use(
        response => response,
        async(error) => {
          if (error?.response?.status === 401) {
            setAuthenticated(false);
          };
          return Promise.reject(error);
        }
      );
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    };
  }, [accessToken]);

  // when baseUrl changes, set axios default baseURL (if applicable)
  useEffect(async() => {
    if (baseUrl) {
      if (baseUrl !== axios.defaults.baseURL) axios.defaults.baseURL = baseUrl;
    } else {
      setAuthenticated(false);
    };
    return;
  }, [baseUrl]);

  const toggleAutoLogin = () => dispatch(_toggleAutoLogin());
  const toggleRememberLoginDetails = () =>
    dispatch(_toggleRememberLoginDetails());

  // set persisted secure storage values (if applicable per user options)
  const setPersistedAuth = async (accessToken, baseUrl, user) => {
    try {
      //if (isAutoLogin) await setSecureItem(AuthConstants.ACCESS_TOKEN, accessToken);
      await setSecureItem(AuthConstants.ACCESS_TOKEN, accessToken);
      await setSecureItem(AuthConstants.BASE_URL, baseUrl);
      //if (rememberLoginDetails) await setSecureItem(AuthConstants.USER, JSON.stringify(user));
      await setSecureItem(AuthConstants.USER, JSON.stringify(user));
    } catch (error) {
      // TODO:
      console.error(error);
    };
  };

  // TODO: implement timeout
  const signIn = async (domain, username, password) => {
    // TODO: handle offline
    try {
      const baseUrl = `${PROTOCOL}://${domain}/wp-json`;
      const url = `${baseUrl}/jwt-auth/v1/token`;
      const res = await axios({
        url,
        method: "POST",
        data: {
          username,
          password,
        },
      });
      console.log(res?.data);
      if (res?.status === 200 && res?.data?.token) {
        const accessToken = res.data.token;
        const id = decodeToken(accessToken)?.data?.user?.id;
        const user = {
          id,
          username,
          domain,
          display_name: res.data?.user_display_name,
          email: res.data?.user_email,
          nicename: res.data?.user_nicename,
        };
        // set persisted storage values
        await setPersistedAuth(accessToken, baseUrl, user);
        // sync local locale with server
        if (res.data?.locale) setLocale(res.data.locale);
        // set in-memory provider value
        setAccessToken(accessToken);
        setBaseUrl(baseUrl);
        setUser(user);
        return;
      }
    } catch (error) {
      throw new Error(error);
    };
  };

  const signOut = async () => {
    try {
      // TODO: delete PIN related values
      //await deleteSecureItem(PINConstants.CNONCE);
      //await deleteSecureItem(PINConstants.CODE);
      await deleteSecureItem(AuthConstants.ACCESS_TOKEN);
      await deleteSecureItem(AuthConstants.BASE_URL);
      await deleteSecureItem(AuthConstants.USER);
    } catch (error) {
      console.warn(error);
    } finally {
      // disable "auto login" and "remember login details" on signOut
      if (isAutoLogin) toggleAutoLogin();
      if (rememberLoginDetails) toggleRememberLoginDetails();
      // nullify in-memory auth provider values
      setAccessToken(null);
      setBaseUrl(null);
      setUser(null);
    }
  };

  return {
    authenticated,
    user,
    isAutoLogin,
    toggleAutoLogin,
    rememberLoginDetails,
    toggleRememberLoginDetails,
    signIn,
    signOut,
  };
};
export { useAuth, AuthProvider };
