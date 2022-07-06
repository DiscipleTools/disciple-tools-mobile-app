import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleAutoLogin as _toggleAutoLogin,
  toggleRememberLoginDetails as _toggleRememberLoginDetails,
} from "store/actions/auth.actions";

import useNetwork from "hooks/use-network";
import useI18N from "hooks/use-i18n";
import useSecureStore from "hooks/use-secure-store";

import axios from "services/axios";

import jwt_decode from "jwt-decode";

import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
  exchangeCodeAsync,
} from "expo-auth-session";

const TENANT_ID = "1917185a-187d-415b-87e6-295e95df8a01";
const CLIENT_ID = "9a83c1ef-d132-47b2-bf77-d42c465c949a";

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
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

WebBrowser.maybeCompleteAuthSession();

let uri = "tools.disciple.app://login";

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
    }
  };

  const [accessToken, setAccessToken] = useState(null);
  const [baseUrl, setBaseUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [o365domain, setO365domain] = useState(false);

  const dispatch = useDispatch();

  // NOTE: Redux already does a good job indicating whether to rehydrate state, so use that
  const rehydrate = useSelector((state) => state?.authReducer?.rehydrate);
  const isAutoLogin = useSelector((state) => state?.authReducer?.isAutoLogin);
  const rememberLoginDetails = useSelector(
    (state) => state?.authReducer?.rememberLoginDetails
  );

  const { isConnected } = useNetwork();
  const { getSecureItem, setSecureItem, deleteSecureItem } = useSecureStore();

  // rehydrate state from secure storage (depends on Redux to notify via "rehydrate" change)
  useEffect(() => {
    (async () => {
      /*
      if auto-login, but accessToken is missing or invalid,
      then attempt to rehydrate accessToken from secure storage
      else do nothing bc user will be prompted to re-login
      */
      if (
        isAutoLogin &&
        (!accessToken || (accessToken && !validateToken(accessToken)))
      ) {
        // rehydrate access token
        const rehydratedAccessToken = await getSecureItem(
          AuthConstants.ACCESS_TOKEN
        );
        //console.log(`~~~~~~~~~~ rehydratedAccessToken: ${rehydratedAccessToken}`);
        if (validateToken(rehydratedAccessToken))
          setAccessToken(rehydratedAccessToken);
      }
      // rehydrate baseUrl
      const rehydratedBaseUrl =
        baseUrl ?? (await getSecureItem(AuthConstants.BASE_URL));
      //console.log(`~~~~~~~~~~ rehydratedBaseUrl: ${rehydratedBaseUrl}`);
      setBaseUrl(rehydratedBaseUrl);
      // rehydrate user
      try {
        const rehydratedUser =
          user ?? JSON.parse(await getSecureItem(AuthConstants.USER));
        //console.log(`~~~~~~~~~~ rehydratedUser: ${JSON.stringify(rehydratedUser)}`);
        // TODO: if user unable to be rehydrated AND have valid accessToken and baseUrl, then request user info
        setUser(rehydratedUser);
      } catch (error) {
        setUser(null);
      }
    })();
  }, [rehydrate]);

  // when "accessToken" changes, validate it:
  // if valid, configure axios interceptors and setAuthenticated(true)
  // else setAuthenticated(false)
  useEffect(() => {
    (async () => {
      if (accessToken && validateToken(accessToken)) {
        // Add a request interceptor
        axios.interceptors.request.use(
          (config) => {
            if (accessToken && accessToken !== config.headers?.Authorization) {
              config.headers["Authorization"] = `Bearer ${accessToken}`;
            } else {
              delete config.headers["Authorization"];
              setAuthenticated(false);
            }
            return config;
          },
          (error) => error
        );
        // Add a response interceptor
        axios.interceptors.response.use(
          (response) => response,
          async (error) => {
            if (error?.response?.status === 401) {
              setAuthenticated(false);
            }
            return Promise.reject(error);
          }
        );
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    })();
  }, [accessToken]);

  // when baseUrl changes, set axios default baseURL (if applicable)
  useEffect(() => {
    (async () => {
      if (baseUrl) {
        if (baseUrl !== axios.defaults.baseURL)
          axios.defaults.baseURL = baseUrl;
      } else {
        setAuthenticated(false);
      }
      return;
    })();
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
    }
  };

  // FOR o365 LOG IN
  const discovery = useAutoDiscovery(
    `https://login.microsoftonline.com/${TENANT_ID}/v2.0`
  );

  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["openid", "profile", "email", "offline_access"],
      redirectUri: uri,
    },
    discovery
  );

  useEffect(() => {
    if (response !== null && response.type === "success") {
      exchangeCodeAsync(
        {
          clientId: CLIENT_ID,
          scopes: ["openid", "profile", "email", "offline_access"],
          code: response.params.code,
          redirectUri: uri,
          extraParams: { code_verifier: request.codeVerifier },
        },
        discovery
      )
        .then((token) => {
          let decodedToken = jwt_decode(token.idToken);

          //VALIDATE THE ACCESS TOKEN AT THE BACKEND.
          validateAccessToken(token);
        })
        .catch((exchangeError) => {
          throw new Error(exchangeError);
        });
    }
  }, [response]);

  const validateAccessToken = async (token) => {
    try {
      const domain = o365domain;

      const baseUrl = `${PROTOCOL}://${domain}/wp-json`;
      const url = `${baseUrl}/jwt-auth/v1/token/o365validate`;

      const res = await axios({
        url,
        method: "POST",
        data: {
          accessToken: token.accessToken,
        },
      });

      if (res?.status === 200 && res?.data?.token) {
        const accessToken = res.data.token;
        const id = decodeToken(accessToken)?.data?.user?.id;
        const user = {
          id,
          username: res.data?.user_email,
          domain,
          display_name: res.data?.user_display_name,
          email: res.data?.user_email,
          nicename: res.data?.user_nicename,
          o365Login: true,
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
    } catch (err) {
      throw new Error(err);
    }
  };

  const signInO365 = async (domain) => {
    setO365domain(domain);
    try {
      await promptAsync();
    } catch (error) {
      throw new Error(error);
    }
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
    }
  };

  const check2FaEnabled = async (domain, username, password) => {
    try {
      const baseUrl = `${PROTOCOL}://${domain}/wp-json`;
      const url = `${baseUrl}/jwt-auth/v1/login/validate`;
      const res = await axios({
        url,
        method: "POST",
        data: {
          username,
          password,
        },
      });

      if (res?.status === 200 && res?.data) {
        return { ...res.data, baseUrl };
      } else {
        throw new Error(res.data.status);
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const validateOtp = async (domain, username, password, otp) => {
    try {
      const baseUrl = `${PROTOCOL}://${domain}/wp-json`;
      const url = `${baseUrl}/jwt-auth/v1/login/validate-otp`;
      const res = await axios({
        url,
        method: "POST",
        data: {
          username,
          password,
          authcode: otp,
        },
      });

      if (res?.status === 200 && res?.data?.token) {
        return { ...res.data, baseUrl };
      } else {
        throw new Error(res.data.status);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const persistUser = async (domain, username, data) => {
    const accessToken = data.token;
    const id = decodeToken(accessToken)?.data?.user?.id;
    const user = {
      id,
      username,
      domain,
      display_name: data?.user_display_name,
      email: data?.user_email,
      nicename: data?.user_nicename,
      o365Login: false,
    };
    // set persisted storage values
    await setPersistedAuth(accessToken, data.baseUrl, user);
    // sync local locale with server
    if (data?.locale) setLocale(data.locale);
    // set in-memory provider value
    setAccessToken(accessToken);
    setBaseUrl(data.baseUrl);
    setUser(user);
    return;
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
      if (user.o365Login) {
        await WebBrowser.openAuthSessionAsync(
          `https://login.windows.net/${TENANT_ID}/oauth2/logout`,
          uri
        );
      }
      // nullify in-memory auth provider values
      setAccessToken(null);
      setBaseUrl(null);
      setUser(null);
    }
  };

  let memoizedValues = useMemo(
    () => ({
      authenticated,
      user,
      isAutoLogin,
      toggleAutoLogin,
      rememberLoginDetails,
      toggleRememberLoginDetails,
      signIn,
      check2FaEnabled,
      validateOtp,
      persistUser,
      signOut,
    }),
    [
      authenticated,
      user,
      isAutoLogin,
      rememberLoginDetails,
      rememberLoginDetails,
    ]
  );
  return { ...memoizedValues, signInO365 };
};
export { useAuth, AuthProvider };
