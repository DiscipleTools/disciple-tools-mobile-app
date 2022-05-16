import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enqueueRequest, dequeueRequest } from "store/actions/request.actions";

import axios from "services/axios";

import useCache from "hooks/use-cache";
import useNetwork from "hooks/use-network";

const useRequestQueue = () => {
  const { cache, mutate } = useCache();
  const { isConnected } = useNetwork();
  const dispatch = useDispatch();
  const pendingRequests = useSelector(state => state.requestReducer);

  const processRequests = () => pendingRequests?.forEach(_request => request(_request, { reprocess: true }));

  useEffect(() => {
    if (isConnected && pendingRequests?.length > 0) processRequests();
  }, [isConnected, pendingRequests?.length]);

  /*
   * NOTE:
   * update the local data and do not revalidate (user gets immediate feedback).
   * assume that the server will handle the update and return the same data,
   * otherwise the local data will be replaced with server state
   */
  const request = async (request, { reprocess, localData }={}) => {
    const key = request?.url;
    if (!key) return null;
    const localCachedData = cache.get(key);
    const newData = localData ?? request?.data;
    const optimisticData = newData ? { ...localCachedData, ...newData } : null;
    const options = {
      optimisticData,
      revalidate: false,
      populateCache: false,
      rollbackOnError: true
    };
    // we do *not* return here, but rather continue to attempt the 'mutate'
    // because we are performing an optimisticUI update when offline, and the
    // conditional of whether to make an API request or not is part of that
    // see `await mutate(key, isConnected ? ...)` below
    if (!isConnected) dispatch(enqueueRequest(request));
    try {
      const res = await mutate(key, isConnected ? axios(request) : null, options);
      // dequeue request, if conditions met
      if (isConnected && reprocess && res?.data) dispatch(dequeueRequest(request));
    } catch(error) {
      // dequeue request, if error occurred (so as to not retry errors)
      // TODO: is this appropriate?
      if (isConnected && reprocess) dispatch(dequeueRequest(request));
    } finally {
      return;
    };
  };
  return { request };
};
export default useRequestQueue;