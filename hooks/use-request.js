import useSWR from "swr";

import useNetwork from "hooks/use-network";

import { defaultFetcher } from "helpers";

//import { getCacheKeyByRequest } from "utils";

const useRequest = ({ request }) => {
  const { isConnected, isInitializing } = useNetwork();

  //const cacheKey = getCacheKeyByRequest(request);
  const cacheKey = request?.url;

  // revalidate only if online (or network is at least initializing)
  const fetcher =
    isConnected || isInitializing ? defaultFetcher(request) : null;

  const { data, error, isValidating, mutate } = useSWR(cacheKey, fetcher);
  return {
    cacheKey,
    data,
    error,
    isLoading: !error && !data,
    isValidating,
    mutate,
  };
};
export default useRequest;
