import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Random from "expo-random";
import useSecureStore from "hooks/use-secure-store";

import {
  setHasPIN,
  setCNoncePIN as _setCNoncePIN
} from "store/actions/auth.actions";

const PINConstants = {
  CNONCE: "CNONCE",
  CNONCE_DATETIME: "CNONCE_DATETIME",
  CODE: "CODE",
  DELETE: "DELETE",
  SCREEN: "PIN",
  SET: "SET",
  VALIDATE: "VALIDATE",
};

const usePIN = () => {

  const dispatch = useDispatch();
  const hasPIN = useSelector(state => state?.authReducer?.hasPIN);
  const cnoncePIN = useSelector(state => state?.authReducer?.cnoncePIN);
  const { getSecureItem, setSecureItem, deleteSecureItem } = useSecureStore();

  const CNONCE_THRESHOLD = 10; // seconds 
  const isTimelyCNonce = (cnonceDT) => {
    const now = new Date();
    const diff = now.getTime()-new Date(cnonceDT).getTime();
    const diffSecs = Math.floor((diff/1000));
    return diffSecs < CNONCE_THRESHOLD;
  };

  const validateCNoncePIN = async() => {
    const cnonce = await getSecureItem(PINConstants.CNONCE);
    if (cnoncePIN !== cnonce) return false;
    const cnonceDT = await getSecureItem(PINConstants.CNONCE_DATETIME);
    if (isTimelyCNonce(cnonceDT)) return true;
    return false;
  };

  /*
  Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
at hooks/usePIN.js:48:12 in useEffect$argument_0
  useEffect(async() => {
    const validCNoncePIN = await isValidCNoncePIN();
    // TODO:
    //setValidCNoncePIN(validCNoncePIN);
    setValidCNoncePIN(true);
  }, [])
  */

  const getPIN = async () => {
    return getSecureItem(PINConstants.CODE);
  };

  const setPIN = async (code) => {
    await setSecureItem(PINConstants.CODE, code);
    dispatch(setHasPIN(true));
  };

  const deletePIN = async () => {
    await deleteSecureItem(PINConstants.CODE);
    dispatch(setHasPIN(false));
  };

  const setCNoncePIN = async () => {
    const cnonce = Random.getRandomBytes(256).toString();
    const cnonceDT = new Date().toString();
    await setSecureItem(PINConstants.CNONCE_DATETIME, cnonceDT);
    await setSecureItem(PINConstants.CNONCE, cnonce);
    dispatch(_setCNoncePIN(cnonce));
  };

  return {
    PINConstants,
    hasPIN,
    getPIN,
    setPIN,
    deletePIN,
    cnoncePIN,
    setCNoncePIN,
    validateCNoncePIN,
  };
};
export default usePIN;
