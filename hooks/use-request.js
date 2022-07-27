import useSWR from "swr";
import axios from "services/axios";

import useCache from "hooks/use-cache";
import useNetwork from "hooks/use-network";

// 'useRequest' is an abstraction to enable swap SWR for another library
const useRequest = (request, options = {}) => {
  const { cache, mutate } = useCache();
  const { isConnected, isInitializing } = useNetwork();
  const key =
    request && request?.url && JSON.stringify(request) ? request.url : null;
  const fetcher = (request) => axios(request).then((res) => res.data);
  if (!isConnected && !isInitializing) {
    const localCachedData = cache.get(key);
    // NOTE: to prevent hook count error
    useSWR(null);
    return {
      data: localCachedData ?? null,
      error: undefined,
      isValidating: false,
      mutate,
    };
  }
  return useSWR(key, () => fetcher(request), options);
};
export default useRequest;
