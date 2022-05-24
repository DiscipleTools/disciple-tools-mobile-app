import * as SecureStore from "expo-secure-store";

const useSecureStore = () => {
  const getSecureItem = async (key) => await SecureStore.getItemAsync(key);
  const setSecureItem = async (key, value) =>
    await SecureStore.setItemAsync(key, value);
  const deleteSecureItem = async (key) =>
    await SecureStore.deleteItemAsync(key);
  return {
    getSecureItem,
    setSecureItem,
    deleteSecureItem,
  };
};
export default useSecureStore;
