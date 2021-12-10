import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleAutoLogin as _toggleAutoLogin,
  toggleRememberLoginDetails as _toggleRememberLoginDetails,
} from 'store/actions/auth.actions';

import useRequest from 'hooks/useRequest';
import usePIN from 'hooks/usePIN';

import axios from 'services/axios';

import jwt_decode from 'jwt-decode';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {

  const AuthConstants = {
    ACCESS_TOKEN: "ACCESS_TOKEN",
  };

  const {
    accessToken,
    setAccessToken,
  } = useContext(AuthContext);

  const dispatch = useDispatch();

  const [authenticated, setAuthenticated] = useState(false);
  const [uid, setUid] = useState(null);

  useEffect(async() => {
    //console.log("*** ACCESS TOKEN CHANGED ***")
    setAuthenticated(await authenticate(accessToken));
    setUid(decodeToken(accessToken)?.data?.user?.id);
  }, [accessToken]);

  const { fetch } = useRequest();
  const { PINConstants } = usePIN();

  const isAutoLogin = useSelector(state => state?.authReducer?.isAutoLogin);
  const rememberLoginDetails = useSelector(state => state?.authReducer?.rememberLoginDetails);

  const toggleAutoLogin = () => dispatch(_toggleAutoLogin());
  const toggleRememberLoginDetails = () => dispatch(_toggleRememberLoginDetails());

  const decodeToken = (token) => jwt_decode(token);

  // TODO: validate "iss" === domain
  const validateToken = (token) => {
    const payload = decodeToken(token);
    //console.log(`payload: ${JSON.stringify(payload)}`);
    let exp = payload.exp;
    if (exp < 10000000000) exp *= 1000;
    const now = Date.now();
    if (now < exp) return true;
    return false;
  };

  const authenticate = async(accessToken) => {
    try {
      // first check and validate in-memory token
      // if valid, then set axios authorization header and return true
      //console.log(`in-memory token: ${accessToken}`);
      //console.log(`validated: ${ validateToken(accessToken) }`);
      if (accessToken && validateToken(accessToken)) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${ accessToken }`;
        return true;
      }
      // if in-memory token is invalid AND "isAutoLogin", then pull from storage
      if (isAutoLogin) {
        console.log("*** try to authenticate with stored token ***")
        // next check and validate stored token
        // if valid, then set axios authorization header and return true
        /*
        const storedToken = await getItem(Constants.ACCESS_TOKEN); 
        console.log(`stored token: ${storedToken}`);
        console.log(`validated: ${ validateToken(storedToken) }`);
        if (storedToken && validateToken(storedToken)) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${ storedToken }`;
          return true;
        };
        */
      };
      // else delete any existing axios authorization header and return false
      delete axios.defaults.headers.common['Authorization'];
      return false;
    } catch (err) {
      return false;
    }
  };

  const signIn = async(domain, username, password) => {
    // TODO: check if offline
    /*
    if (!isConnected) {
      // TODO: translate
      toast("No internet connection", true);
      return null;
    };
    */
    // TODO: store domain, username in-memory with provider
    axios.defaults.baseURL = `https://${domain}/wp-json/`;
    console.log("** SIGN IN **")
    const url = `jwt-auth/v1/token`;
    const res = await fetch({
      url,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        username,
        password
      },
    });
    if (res?.status === 200 && res?.data?.token) {
      console.log("*** ACCESS TOKEN RECEIVED ***")
      console.log(res.data.token)
      setAccessToken(res.data.token);
      // TODO
      /*
      if (isAutoLogin) {
        await setItem(Constants.ACCESS_TOKEN, res.data.access_token);
      };
      if (rememberLoginDetails) {
        await setItem(Constants.DOMAIN, domain);
        await setItem(Constants.USERNAME, email);
      };
      */
    };
  };

  const signOut = async() => {
    console.log("** SIGN OUT **")
    try {
      console.log(`delete: ${ AuthConstants?.ACCESS_TOKEN }`);
      console.log(`delete: ${ PINConstants?.CNONCE }`);
      /*
      await deleteItem(AuthConstants.ACCESS_TOKEN);
      await deleteItem(AuthConstants.DOMAIN);
      await deleteItem(AuthConstants.USERNAME);
      await deleteItem(PINConstants.CNONCE);
      */
    } catch (error) {
      console.warn(error);
    } finally {
      // disable "auto login" and "remember login details" on signOut
      if (isAutoLogin) toggleAutoLogin();
      if (rememberLoginDetails) toggleRememberLoginDetails();
      // nullify in-memory access token
      setAccessToken(null);
    }
  };

  return {
    uid,
    authenticated,
    isAutoLogin,
    toggleAutoLogin,
    rememberLoginDetails,
    toggleRememberLoginDetails,
    signIn,
    signOut,
  };
};
export { useAuth, AuthProvider };