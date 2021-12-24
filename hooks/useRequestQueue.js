import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enqueueRequest } from 'store/actions/request.actions';

import axios from "services/axios";

import useNetworkStatus from "hooks/useNetworkStatus";

const REQUEST_QUEUE_INTERVAL_SECS = 5;

const useRequestQueue = () => {
  const dispatch = useDispatch();
  const isConnected = useNetworkStatus();
  const pendingRequests = useSelector(
    (state) => state.requestReducer.pendingRequests
  ) ?? [];

  // TODO: implement queue interval

  useEffect(() => {
    if (isConnected && pendingRequests?.length > 0) processRequests();
  }, [isConnected, pendingRequests]);

  /*
  // TODO: just pass request, and handle request array in reducer
  const queueRequest = (request) => dispatch(enqueueRequest([...pendingRequests, request]));
  const dequeueRequest = (request) => dispatch(dequeueRequest(pendingRequests.filter((r) => r.id !== request.id)));
  */

  // TODO: use SWR to give immediate user feedback (eg, submit comment)
  const _request = async(request) => {
    if (isConnected) {
      // NOTE: dequeue request regardless of outcome
      // (we do not want to fall into an error loop)
      // TODO: implement retry strategy
      //dispatch(dequeueRequest(request));
      return axios(request);
    }
    toast("OFFLINE, request being queued...");
    //dispatch(enqueueRequest(request));
    return null;
  };

  const processRequests = async() => {
    if (!isConnected) return;
    for (const request of pendingRequests) await _request(request);
    return;
  };

  return {
    hasPendingRequests: (pendingRequests?.length > 0) ? true : false,
    processRequests,
    request: _request,
  };
};
export default useRequestQueue;
