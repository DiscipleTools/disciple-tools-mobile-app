import * as SecureStore from 'expo-secure-store';

const useSecureStore = () => {

  const getItem = async (key) => {
    return await SecureStore.getItemAsync(key);
  };

  const setItem = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  };

  const deleteItem = async (key) => {
    await SecureStore.deleteItemAsync(key);
  };

  const Constants = {
    PIN_CODE: 'PIN_CODE',
  }

  return {
    Constants,
    getItem,
    setItem,
    deleteItem
  };
};
export default useSecureStore;