import { useSelector, useDispatch } from "react-redux";
import { enqueueRequest, dequeueRequest } from "store/actions/request.actions";
import { useSWRConfig } from "swr";

import axios from "services/axios";

import useI18N from "hooks/use-i18n";
import useNetwork from "hooks/use-network";

//const REQUEST_QUEUE_INTERVAL_SECS = 5;

const useRequestQueue = () => {
  const { cache, mutate } = useSWRConfig();
  const { isConnected } = useNetwork();
  const { i18n } = useI18N();
  const dispatch = useDispatch();
  const pendingRequests = useSelector(
    (state) => state.requestReducer.pendingRequests
  );

  const hasPendingRequests = () => pendingRequests?.length > 0;

  /*
  // TODO: implement queue interval
  useEffect(() => {
    if (isConnected && hasPendingRequests) processRequests();
  }, [isConnected, pendingRequests]);
  */

  /*
   * NOTE:
   * update the local data and do not revalidate (user gets immediate feedback).
   * assume that the server will handle the update and return the same data,
   * otherwise the local data will be replaced with server state
   */
  const _mutate = async (request) => {
    const key = request?.url;
    if (!key) return null;
    const localCachedData = cache.get(key);
    const newData = request?.data;
    mutate(key, { ...localCachedData, ...newData }, false);
    return axios(request);
  };

  const request = async (request) => {
    if (!isConnected) {
      dispatch(enqueueRequest(request));
      toast(i18n.t("error.requestQueued"));
      return null;
    }
    if (hasPendingRequests()) {
      //console.log("request queue: has pending requests");
      for (const ii = 0; ii < pendingRequests?.length; ii++) {
        const pendingRequest = pendingRequests[ii];
        //console.log(`pending request: ${ JSON.stringify(pendingRequest) }`);
        await _mutate(pendingRequest);
        dispatch(dequeueRequest(pendingRequest));
      }
    }
    return _mutate(request);
  };

  return {
    hasPendingRequests,
    request,
  };
};
export default useRequestQueue;
