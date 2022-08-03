import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Random from "expo-random";
import useSecureStore from "hooks/use-secure-store";
import { useAuth } from "hooks/use-auth";
import useCache from "hooks/use-cache";

import {
  setHasPIN,
  setCNoncePIN as _setCNoncePIN,
} from "store/actions/auth.actions";

import { PINConstants } from "constants";
import { reinitializeRedux } from "store/rootActions";

const usePIN = () => {
  const dispatch = useDispatch();
  const hasPIN = useSelector((state) => state?.authReducer?.hasPIN);
  const cnoncePIN = useSelector((state) => state?.authReducer?.cnoncePIN);
  const { getSecureItem, setSecureItem, deleteSecureItem } = useSecureStore();
  const { signOut } = useAuth();
  const { clearCache, clearStorage } = useCache();

  const isTimelyCNonce = useCallback((cnonceDT) => {
    const now = new Date();
    const diff = now.getTime() - new Date(cnonceDT).getTime();
    const diffSecs = Math.floor(diff / 1000);
    return diffSecs < PINConstants.CNONCE_THRESHOLD;
  }, []);

  const validateCNoncePIN = useCallback(async () => {
    const cnonce = await getSecureItem(PINConstants.CNONCE);
    if (cnoncePIN !== cnonce) return false;
    const cnonceDT = await getSecureItem(PINConstants.CNONCE_DATETIME);
    if (isTimelyCNonce(cnonceDT)) return true;
    return false;
  }, [cnoncePIN]);

  const getPIN = useCallback(async () => {
    return getSecureItem(PINConstants.CODE);
  }, []);

  const setPIN = useCallback(async (code) => {
    await setSecureItem(PINConstants.CODE, code);
    dispatch(setHasPIN(true));
  }, []);

  const deletePIN = useCallback(async () => {
    await deleteSecureItem(PINConstants.CODE);
    dispatch(setHasPIN(false));
  }, []);

  const setCNoncePIN = useCallback(async () => {
    const cnonce = Random.getRandomBytes(256).toString();
    const cnonceDT = new Date().toString();
    await setSecureItem(PINConstants.CNONCE_DATETIME, cnonceDT);
    await setSecureItem(PINConstants.CNONCE, cnonce);
    dispatch(_setCNoncePIN(cnonce));
  }, []);

  const activateDistress = useCallback(async () => {
    dispatch(reinitializeRedux());
    clearStorage();
    clearCache();
    signOut();
  }, []);

  return {
    hasPIN,
    getPIN,
    setPIN,
    deletePIN,
    cnoncePIN,
    setCNoncePIN,
    validateCNoncePIN,
    activateDistress,
  };
};
export default usePIN;
