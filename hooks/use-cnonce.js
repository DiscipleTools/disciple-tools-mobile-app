import { useDispatch, useSelector } from "react-redux";

import * as Random from "expo-random";

import {
  setCNonceLogin as _setCNonceLogin,
} from "store/actions/auth.actions";

import useSecureStore from "hooks/use-secure-store";

const useCNonce = ({
  persistedKey,
  cnonceKey,
  cnonceDTKey,
  threshold
}={}) => {

  const dispatch = useDispatch();
  const cnonce = useSelector((state) => state?.authReducer?.[persistedKey]);
  const { getSecureItem, setSecureItem } = useSecureStore();

  const isTimelyCNonce = (cnonceDT) => {
    try {
      const now = new Date();
      const diff = now.getTime() - new Date(cnonceDT).getTime();
      const diffSecs = Math.floor(diff / 1000);
      return diffSecs < threshold;
    } catch(error) {
      return false;
    };
  };

  const validateCNonce = async () => {
    const _cnonce = await getSecureItem(cnonceKey);
    if (cnonce !== _cnonce) return false;
    const cnonceDT = await getSecureItem(cnonceDTKey);
    if (isTimelyCNonce(cnonceDT)) {
      // refresh the cnonce
      await setCNonce();
      return true;
    };
    return false;
  };

  const setCNonce = async () => {
    const cnonce = Random.getRandomBytes(256).toString();
    const cnonceDT = new Date().toString();
    await setSecureItem(cnonceDTKey, cnonceDT);
    await setSecureItem(cnonceKey, cnonce);
    dispatch(_setCNonceLogin(cnonce));
  };

  return {
    cnonce,
    setCNonce,
    validateCNonce
  }
};
export default useCNonce;