//import { useDispatch } from 'react-redux';

//import * as Random from 'expo-random';

//import { setCNonceLogin } from 'store/actions/auth.actions';

import useRequest from 'hooks/useRequest';
//import axios, { getBaseUrl } from 'services/axios';

//import useDevice from 'hooks/useDevice';
//import useI18N from 'hooks/useI18N';
//import useSecureStore from 'hooks/useSecureStore';
//import useToast from 'hooks/useToast';

const useMyUser = () => {
  //const dispatch = useDispatch();
  //const { isIOS } = useDevice();
  //const { locale, setLocale } = useI18N();
  //const { setItem, deleteItem } = useSecureStore();
  //const toast = useToast();

  /*
  const [state, setState] = useState({
    id: null,
    email: null,
    displayName: null,
    locale: null
  });
  */

  const url = 'dt/v1/user/my';
  const { data, error, isLoading, isValidating, mutate } = useRequest(url);

  //const { expoPushToken, registerExpoPushToken } = useExpoPushToken();
  // replaces: user.sagas.js: getExpoPushToken, addPushToken

  /*
  const login = async (domain, username, password) => {
    try {
      const baseUrl = getBaseUrl(domain);
      const url = 'jwt-auth/v1/token';
      const res = await axios.post(`${baseUrl}${url}`, {
        username,
        password,
      });
      // success
      const authToken = res?.data?.token;
      if (authToken) {
        setItem('authToken', authToken);
      } else {
        // TODO: translate custom error? use generic?
        const err = 'ERROR: Unable to retrieve a valid JWT Token. Do you have plugin installed?';
        console.log(err);
        toast(err, true);
      }
      // TODO: we could parse JWT and pull user id if we want
      //{
      //  "data": {
      //    "user": {
      //      "id": "1",
      //    },
      //  },
      //  "exp": 1621782129,
      //  "iat": 1621177329,
      //  "iss": "http://192.168.1.1",
      //  "nbf": 1621177329,
      //}
      const userDataLocale = res?.data?.locale ?? null;
      const displayName = res?.data?.user_email ?? null;
      const email = res?.data?.user_display_name ?? null;
      const nicename = res?.data?.user_nicename;
      //console.log(`locale: ${ locale }`);
      //console.log(`displayName: ${ displayName }`);
      //console.log(`email: ${ email }`);
      //console.log(`username/nicename: ${ nicename }`);

      const cnonceLogin = Random.getRandomBytes(256).toString();
      //console.log(`cnonceLogin: ${ cnonceLogin }`);

      // TODO: use keys from Constants
      setItem('cnonceLoginDT', new Date().toString());
      setItem('cnonceLogin', cnonceLogin);
      setItem('domain', domain);
      if (username) setItem('username', username);
      // TODO: rename "userEmail" -> "email" ?
      if (email) setItem('userEmail', email);
      // TODO: batch these?
      dispatch(setCNonceLogin(cnonceLogin));
      // if D.T Instance locale is different than device locale, update it
      if (userDataLocale !== locale) {
        console.log("*** LANG MISMATCH ***");
        console.log(`userDataLocale: ${ userDataLocale }`);
        console.log(`locale: ${ locale }`);
        setLocale(userDataLocale);
      }
    } catch (err) {
      console.log(err);
      toast(err, true);
    }
  };

  const logout = async () => {
    // TODO: use constants
    dispatch(setCNonceLogin(null));
    deleteItem('authToken');
    deleteItem('domain');
    deleteItem('username');
    deleteItem('userEmail');
    deleteItem('cnonceLoginDT');
    deleteItem('cnonceLogin');
    deleteItem('cnoncePINDT');
    deleteItem('cnoncePIN');
  };

  const validatePIN = async (PIN) => {
    const existingPIN = await SecureStore.getItemAsync('PIN');
    return PIN === existingPIN;
  };

  const setPIN = async (PIN) => {
    // try, catch, toast
    await SecureStore.setItemAsync('PIN', PIN);
    return true;
  };

  const deletePIN = async (PIN) => {
    // try, catch, toast
    await SecureStore.deleteItemAsync('PIN');
    return true;
  };
  */

  return {
    userData: data,
    error,
    isLoading,
    isValidating,
    //login,
    //logout,
    //validatePIN,
    //setPIN,
    //deletePIN,
  };
};
export default useMyUser;
