import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import { queueRequest as _queueRequest } from 'store/actions/requests.actions';

import axios from 'services/axios';

import useNetworkStatus from 'hooks/useNetworkStatus';

const REQUEST_QUEUE_INTERVAL_SECS = 5;

const useRequestQueue = () => {

  const dispatch = useDispatch();
  const isConnected = useNetworkStatus();
  const pendingRequests = useSelector((state) => state.requestReducer.pendingRequests);

  //const queueRequest = (request) => dispatch(queueRequest([...pendingRequests, request]));

  const processRequests = async() => {
    if (!isConnected) return;
    //pendingRequests.forEach(request => {
    for (const request of pendingRequests) {
      try {
        const res = await axios(request);
        // TODO: Toast
        //dispatch(dequeueRequest(request));
      } catch (err) {
        console.error(err);
      }
    };
  };

  return {
    hasPendingRequests: pendingRequests?.length > 0,
    queueRequest: () => console.log("*** QUEUE REQUEST ***"),
    processRequests
  };
};
export default useRequestQueue;
