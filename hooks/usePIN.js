import { useDispatch, useSelector } from 'react-redux';
import * as Random from 'expo-random';
import useSecureStore from 'hooks/useSecureStore';

import { setHasPIN } from 'store/actions/auth.actions';

const usePIN = () => {
  const dispatch = useDispatch();
  const hasPIN = useSelector(state => state?.authReducer?.hasPIN);

  const { Constants: SecureStore, getItem, setItem, deleteItem } = useSecureStore();

  const getPIN = async () => {
    return getItem(SecureStore.PIN_CODE);
  };

  const setPIN = async (code) => {
    await setItem(SecureStore.PIN_CODE, code);
    await setCNoncePIN();
  };

  const deletePIN = async () => {
    // TODO: PINConstants.CODE
    await deleteItem(SecureStore.PIN_CODE);
    dispatch(setHasPIN(false));
  };

  const setCNoncePIN = async () => {
    const cnonce = Random.getRandomBytes(256).toString();
    // TODO: set in a Context
    dispatch(setHasPIN(true));
    /*
    await SecureStore.setItemAsync('cnoncePINDT', new Date().toString());
    await SecureStore.setItemAsync('cnoncePIN', cnonce);
    dispatch(setCNoncePIN(cnonce));
    */
  };

  const PINConstants = {
    SCREEN: "PIN",
    VALIDATE: "VALIDATE",
    SET: "SET",
    DELETE: "DELETE"
  };

  const cnoncePIN = null;

  return {
    PINConstants,
    hasPIN,
    getPIN,
    setPIN,
    deletePIN,
    cnoncePIN,
  };
};
export default usePIN;
