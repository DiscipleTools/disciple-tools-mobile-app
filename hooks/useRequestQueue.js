//import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enqueueRequest, dequeueRequest } from 'store/actions/request.actions';
import { useSWRConfig } from 'swr'

import axios from "services/axios";

import useNetworkStatus from "hooks/useNetworkStatus";

//const REQUEST_QUEUE_INTERVAL_SECS = 5;

const useRequestQueue = () => {

  const { cache, mutate } = useSWRConfig();
  const isConnected = useNetworkStatus();
  const dispatch = useDispatch();
  const pendingRequests = useSelector(state => state.requestReducer.pendingRequests);

  const hasPendingRequests = () => pendingRequests?.length > 0;


  /*
  // TODO: implement queue interval
  useEffect(() => {
    if (isConnected && hasPendingRequests) processRequests();
  }, [isConnected, pendingRequests]);
  */

  const _mutate = async(request) => {
    const key = request?.url;
    if (!key) return null;
    return mutate(request?.url, axios(request)); //, false);
  };

  /*
   * NOTE:
   * update the local data immediately and revalidate (refetch).
   * we will assume that the server will handle the update and return the same data,
   * otherwise the local data will be replaced with server state
   * (this is so the user can see the new comment immediately)
   */
  const request = async(request) => {
    if (!isConnected) {
      dispatch(enqueueRequest(request));
      // throw new Error?
      toast("OFFLINE, request being queued...");
      return null;
    };
    if (hasPendingRequests()) {
      console.log("request queue: has pending requests");
      for (const ii=0; ii < pendingRequests?.length; ii++) {
        const pendingRequest = pendingRequests[ii];
        console.log(`pending request: ${ JSON.stringify(pendingRequest) }`);
        /*
        await _mutate(pendingRequest);
        dispatch(dequeueRequest(pendingRequest));
        */
      };
    };
    //const tmpUrl = "/dt-posts/v2/contacts/1681/comments";
    //const cachedData = cache.get(tmpUrl);
    //console.log("*** CACHED DATA ***");
    //console.log(JSON.stringify(...cachedData.comments));
    //const newComment = {"comment_ID":"9204","comment_author":"zdmc23","comment_author_email":"zdmc23@gmail.com","comment_date":"2020-09-15 03:02:03","comment_date_gmt":"2020-09-15 03:02:03","gravatar":"https://secure.gravatar.com/avatar/ccdaaa46cf24ecdfbece4680179a827e?s=16&d=mm&r=g","comment_content":"A TEMP TEST COMMENT","user_id":"13","comment_type":"comment","comment_post_ID":"1681","comment_reactions":[]};
    //console.log(JSON.stringify(cachedData.comments.push(newComment)));
    //mutate(tmpUrl, { comments: [ newComment, newComment ] }, false);
    //mutate(tmpUrl, { comments: [ ...cachedData.comments, newComment ]}, false);
    return _mutate(request);
    //mutate(tmpUrl);
    //return;
    //return axios(request);
  };

  return {
    hasPendingRequests,
    request,
  };
};
export default useRequestQueue;
