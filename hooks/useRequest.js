import useSWR from 'swr';
import axios from 'services/axios';

import useNetworkStatus from 'hooks/useNetworkStatus';
import useRequestQueue from 'hooks/useRequestQueue';

const useRequest = (request, { initialData, ...config } = {}) => {

  const { isConnected } = useNetworkStatus();
  const { hasPendingRequests, queueRequest, processRequests } = useRequestQueue();

  // if offline, then do not make the request (by passing null arg)
  let { data, error, isLoading, isValidating, mutate } = useSWR(
    isConnected ? request && JSON.stringify(request) : null,
    () => axios(request || {}).then((response) => response.data),
    {
      ...config,
      initialData: initialData && {
        status: 200,
        statusText: 'InitialData',
        headers: {},
        data: initialData,
      },
    },
  );

  // this method serves for any non-read request (create, update, delete)
  //
  // if offline, then queue the request
  // if online, first check if there are any pending requests
  // else make the request
  const fetch = async (request) => {
    //console.log(`====> FETCH! ${ JSON.stringify(request) }`);
    if (!isConnected) {
      queueRequest(request);
      return null;
    }
    if (hasPendingRequests) await processRequests();
    return axios(request);
  };

  return {
    fetch,
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useRequest;