import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useAuth } from "hooks/use-auth";
import useCache from "hooks/use-cache";
import useCNonce from "hooks/use-cnonce";
import useSecureStore from "hooks/use-secure-store";

import { setHasPIN } from "store/actions/auth.actions";

import { PINConstants } from "constants";
import { reinitializeRedux } from "store/rootActions";

const usePIN = () => {
  const dispatch = useDispatch();
  const hasPIN = useSelector((state) => state?.authReducer?.hasPIN);
  const { getSecureItem, setSecureItem, deleteSecureItem } = useSecureStore();
  const { signOut } = useAuth();
  const { clearCache, clearStorage } = useCache();
  const {
    cnonce: cnoncePIN,
    setCNonce,
    validateCNonce,
  } = useCNonce({
    persistedKey: PINConstants.CNONCE_PERSISTED,
    cnonceKey: PINConstants.CNONCE,
    cnonceDTKey: PINConstants.CNONCE_DATETIME,
    threshold: PINConstants.CNONCE_THRESHOLD,
  });

  const validateCNoncePIN = useCallback(async () => {
    return validateCNonce();
  }, [cnoncePIN]);

  const getPIN = useCallback(async () => {
    return getSecureItem(PINConstants.CODE);
  }, []);

  const setPIN = useCallback(async (code) => {
    await setSecureItem(PINConstants.CODE, code);
    dispatch(setHasPIN(true));
    return;
  }, []);

  const deletePIN = useCallback(async () => {
    await deleteSecureItem(PINConstants.CODE);
    dispatch(setHasPIN(false));
    return;
  }, []);

  const setCNoncePIN = useCallback(async () => {
    let isPinCNonce = true;
    await setCNonce(isPinCNonce);
  }, []);

  const activateDistress = useCallback(async () => {
    dispatch(reinitializeRedux());
    clearStorage();
    clearCache();
    signOut();
    return;
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
