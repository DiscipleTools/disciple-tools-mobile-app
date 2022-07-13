import { useCallback, useEffect } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { enqueueRequest, dequeueRequest } from "store/actions/request.actions";

import axios from "services/axios";

import useCache from "hooks/use-cache";
import useNetwork from "hooks/use-network";

const useRequestQueue = () => {
  const { cache, mutate } = useCache();
  const { isConnected, isConnectedNow } = useNetwork();
  const dispatch = useDispatch();
  const pendingRequests = useSelector(
    (state) => state.requestReducer,
    shallowEqual
  );

  const processRequests = () =>
    pendingRequests?.forEach((_request) =>
      request(_request, { reprocess: true })
    );

  useEffect(() => {
    if (isConnected && pendingRequests?.length > 0) processRequests();
    return;
  }, [isConnected, pendingRequests?.length]);

  /*
   * NOTE:
   * Update the local data and do not revalidate (user gets immediate feedback).
   * assume that the server will handle the update and return the same data,
   * otherwise the local data will be replaced with server state
   */
  const request = useCallback(
    async (request, { reprocess, localData, ignoreUI } = {}) => {
      /*
       * NOTE:
       * Because of reinitialization of NetInfo, we cannot rely on `use-network`
       * props directly, and rather need to fetch network status when request is
       * invoked (via `isConnectedNow`)
       */
      const _isConnected = await isConnectedNow();
      const key = request?.url;
      if (!key) return null;
      let options = null;
      if (ignoreUI !== true) {
        const localCachedData = cache.get(key);
        const newData = localData ?? request?.data;
        const optimisticData = newData
          ? { ...localCachedData, ...newData }
          : null;
        options = {
          optimisticData,
          revalidate: false,
          populateCache: false,
          rollbackOnError: true,
        };
      }
      /*
       * NOTE:
       * We do *not* return here, but rather continue to attempt the 'mutate'
       * because we are performing an optimisticUI update when offline, and the
       * conditional of whether to make an API request or not is part of that
       * see `await mutate(key, isConnected ? ...)` below
       */
      if (!_isConnected) dispatch(enqueueRequest(request));
      try {
        const res = await mutate(
          key,
          _isConnected ? axios(request) : null,
          options
        );
        // dequeue request, if conditions met
        if (_isConnected && reprocess && res?.data)
          dispatch(dequeueRequest(request));
        return res;
      } catch (error) {
        console.error(error);
        // dequeue request, if error occurred (so as to not retry errors)
        // TODO: is this appropriate?
        if (_isConnected && reprocess) dispatch(dequeueRequest(request));
      }
    },
    []
  );
  return { request };
};
export default useRequestQueue;
