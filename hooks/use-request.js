import useSWR from "swr";
import axios from "services/axios";

import useCache from "hooks/use-cache";
import useNetwork from "hooks/use-network";

// 'useRequest' is an abstraction to enable swap SWR for another library
const useRequest = (request, options = {}) => {
  const { cache, mutate } = useCache();
  const { isConnected } = useNetwork();
  const key =
    request && request?.url && JSON.stringify(request) ? request.url : null;
  const fetcher = (request) => axios(request).then((res) => res.data);
  if (!isConnected) {
    const localCachedData = cache.get(key);
    /*
    const ignoreList = [
      "/dt-posts/v2/contacts/settings",
      "dt/v1/user/my",
    ];
    if (!ignoreList.includes(key)) { ... };
    */
    // NOTE: to prevent hook count error
    useSWR(null);
    // NOTE: mimic SWR return format  { data, error, ... }
    return {
      data: localCachedData ?? null,
      error: undefined,
      isValidating: false,
      mutate,
    };
  }
  // TODO: isLoading has been deprecated (remove elsewhere in code)
  return useSWR(key, () => fetcher(request), options);
};
export default useRequest;
