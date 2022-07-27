import { useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const useSecureStore = () => {
  const getSecureItem = useCallback(
    async (key) => await SecureStore.getItemAsync(key),
    []
  );
  const setSecureItem = useCallback(
    async (key, value) => await SecureStore.setItemAsync(key, value),
    []
  );
  const deleteSecureItem = useCallback(
    async (key) => await SecureStore.deleteItemAsync(key),
    []
  );
  return {
    getSecureItem,
    setSecureItem,
    deleteSecureItem,
  };
};
export default useSecureStore;
