import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCNonceLogin as _setCNonceLogin,
  toggleAutoLogin as _toggleAutoLogin,
  toggleRememberLoginDetails as _toggleRememberLoginDetails,
} from "store/actions/auth.actions";

import useCache from "hooks/use-cache";
import useCNonce from "hooks/use-cnonce";
import useI18N from "hooks/use-i18n";
import useSecureStore from "hooks/use-secure-store";

import axios from "services/axios";

import jwt_decode from "jwt-decode";

import { AppConstants, AuthConstants } from "constants";

const AuthContext = createContext(null);

const AuthProvider = React.memo(({ children }) => {
  const auth = useCustomAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
});

const useAuth = () => useContext(AuthContext);

const useCustomAuth = () => {
  const { setLocale } = useI18N();

  const [authenticated, setAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [baseUrl, setBaseUrl] = useState(null);
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  const isAutoLogin = useSelector((state) => state?.authReducer?.isAutoLogin);
  const rememberLoginDetails = useSelector((state) => state?.authReducer?.rememberLoginDetails);

  const { getSecureItem, setSecureItem, deleteSecureItem } = useSecureStore();

  const { clearCache, clearStorage } = useCache();

  const { setCNonce, validateCNonce } = useCNonce({
    persistedKey: AuthConstants.CNONCE_PERSISTED,
    cnonceKey: AuthConstants.CNONCE,
    cnonceDTKey: AuthConstants.CNONCE_DATETIME,
    threshold: AuthConstants.CNONCE_THRESHOLD
  });

  const validateToken = useCallback((token, baseUrl) => {
    const payload = jwt_decode(token);
    //if (domain !== payload.iss) return false;
    if (!baseUrl?.includes(payload.iss)) {
      return false;
    };
    let exp = payload.exp;
    if (exp < 10000000000) exp *= 1000;
    const now = Date.now();
    if (now <= exp) return true;
    return false;
  }, []);

  const decodeToken = useCallback((token) => {
    try {
      return jwt_decode(token);
    } catch (error) {
      return null;
    }
  }, []);

  // rehydrate state from secure storage
  useEffect(() => {
    if (!accessToken && !baseUrl && !user) {
      (async () => {
        // rehydrate user
        try {
          const rehydratedUser = JSON.parse(await getSecureItem(AuthConstants.USER));
          setUser(rehydratedUser);
        } catch (error) {
          console.error(error);
        }
        // rehydrate baseUrl
        const rehydratedBaseUrl = await getSecureItem(AuthConstants.BASE_URL);
        setBaseUrl(rehydratedBaseUrl);
        // rehydrate access token
        const rehydratedAccessToken = await getSecureItem(AuthConstants.ACCESS_TOKEN);
        setAccessToken(rehydratedAccessToken);
      })();
    };
    return;
  }, []);

  // auto-logout on any 401 - Unauthorized
  useEffect(() => {
    // add a response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error(error);
        if (error?.response?.status === 401) {
          setAuthenticated(false);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      if (responseInterceptor) {
        axios.interceptors.request.eject(responseInterceptor);
      };
    };
  }, []);

  // when baseUrl changes, set axios default baseURL (if applicable)
  useEffect(() => {
    if (baseUrl && baseUrl !== axios.defaults.baseURL) {
      axios.defaults.baseURL = baseUrl;
      // when switching D.T instances, clear any previous data
      clearStorage();
      clearCache();
    };
    return;
  }, [baseUrl]);

  /*
   * When "accessToken" changes, validate it.
   * If valid, configure axios request interceptor and validate login cnonce
   */
  useEffect(() => {
    let requestInterceptor = null;
    (async() => {
      if (accessToken && validateToken(accessToken, baseUrl)) {
        // eject any previous request interceptors
        for (let ii=0; ii<axios.interceptors.request.handlers?.length; ii++) {
          axios.interceptors.request.eject(ii);
        };
        // add a request interceptor
        requestInterceptor = axios.interceptors.request.use(
          (config) => {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
            return config;
          },
          (error) => error
        );
        // if auto-login enabled, then proceeed, otherwise validate login cnonce
        if (isAutoLogin) {
          setAuthenticated(true);
        } else {
          const validatedLogin = await validateCNonce();
          setAuthenticated(validatedLogin);
        };
      };
    })();
    return () => {
      if (requestInterceptor) {
        axios.interceptors.request.eject(requestInterceptor);
      };
    };
  }, [accessToken]);

  const toggleAutoLogin = useCallback(async() => {
    dispatch(_toggleAutoLogin());
    return;
  }, []);

  const toggleRememberLoginDetails = useCallback(() => {
    dispatch(_toggleRememberLoginDetails());
    return;
  }, []);

  // set persisted secure storage values (if applicable per user options)
  const setPersistedAuth = useCallback(
    async (accessToken, baseUrl, user) => {
      try {
        await setSecureItem(AuthConstants.ACCESS_TOKEN, accessToken);
        await setSecureItem(AuthConstants.BASE_URL, baseUrl);
        //if (rememberLoginDetails) await setSecureItem(AuthConstants.USER, JSON.stringify(user));
        await setSecureItem(AuthConstants.USER, JSON.stringify(user));
      } catch (error) {
        // TODO:
        console.error(error);
      }
    },
    [accessToken, baseUrl, user?.id]
  );

  // TODO: implement timeout
  const signIn = useCallback(async (domain, username, password) => {
    // TODO: handle offline
    try {
      const baseUrl = `${AppConstants.PROTOCOL}://${domain}/wp-json`;
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
        // set login cnonce
        await setCNonce(_setCNonceLogin)
        // set persisted storage values
        await setPersistedAuth(accessToken, baseUrl, user);
        // sync local locale with server
        if (res.data?.locale) {
          setLocale(res.data.locale);
        };
        // set in-memory provider value
        // NOTE: order matters here (per hook ordering)!
        setUser(user);
        setBaseUrl(baseUrl);
        setAccessToken(accessToken);
        setAuthenticated(true);
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }, []);

  // TODO: remove when switch to web-based OAuth2 login
  // used by ValidateOtpScreen
  const persistUser = useCallback(
    async (domain, username, data) => {
      const accessToken = data.token;
      const id = decodeToken(accessToken)?.data?.user?.id;
      const user = {
        id,
        username,
        domain,
        display_name: data?.user_display_name,
        email: data?.user_email,
        nicename: data?.user_nicename,
      };
      // set persisted storage values
      await setPersistedAuth(accessToken, data.baseUrl, user);
      // sync local locale with server
      if (data?.locale) setLocale(data.locale);
      // set in-memory provider value
      // NOTE: order matters here (per hook ordering)!
      setUser(user);
      setBaseUrl(data.baseUrl);
      setAccessToken(accessToken);
      return;
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      await deleteSecureItem(AuthConstants.ACCESS_TOKEN);
      await deleteSecureItem(AuthConstants.BASE_URL);
      await deleteSecureItem(AuthConstants.USER);
    } catch (error) {
      console.warn(error);
    } finally {
      // disable "auto login" and "remember login details" on signOut
      //if (isAutoLogin) toggleAutoLogin();
      if (rememberLoginDetails) toggleRememberLoginDetails();
      // nullify in-memory auth provider values
      setUser(null);
      setBaseUrl(null);
      setAccessToken(null);
      setAuthenticated(false);
    }
  }, []);

  return useMemo(
    () => ({
      authenticated,
      accessToken,
      user,
      persistUser,
      isAutoLogin,
      toggleAutoLogin,
      rememberLoginDetails,
      toggleRememberLoginDetails,
      signIn,
      signOut,
    }),
    [authenticated, user?.id, isAutoLogin, rememberLoginDetails]
  );
};
export { useAuth, AuthProvider };
