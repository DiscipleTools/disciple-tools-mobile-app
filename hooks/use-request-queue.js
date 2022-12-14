import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { enqueueRequest, dequeueRequest } from "store/actions/request.actions";
import { store } from "store/store";

import useCache from "hooks/use-cache";
import useNetwork from "hooks/use-network";

import axios from "services/axios";

import { getListURL, getPostURL } from "helpers/urls";

const useRequestQueue = () => {

  const { isConnected } = useNetwork();
  const { cache, mutate } = useCache();

  const dispatch = useDispatch();

  /**
   * Process API request, if online. Otherwise, enqueue the request (for later)
   * 
   * @param {Object} request
   * @param {Boolean} reprocess
   * @returns {Promise}
   */
  const processRequest = async({ request, reprocess }) => {
    if (!request) return null;
    // OFFLINE 
    if (!isConnected && !reprocess) {
      // enqueue request for later
      dispatch(enqueueRequest(request));
      return;
    };
    // ignore reprocessed requests if offline (will be reprocessed later)
    if (!isConnected) return;
    // ONLINE
    try {
      return axios(request);
    } catch (error) {
      console.error(error);
      return { error };
    } finally {
      // dequeue request, regardless of success/failure (to prevent loop)
      if (reprocess) {
        dispatch(dequeueRequest(request));
      };
    };
  };

  // TODO: prevent infinite loops!!
  useEffect(() => {
    (async() => {
      if (isConnected) {
        /*
         * NOTE: accessing store directly (rather than via 'useSelector') in
         * order to prevent a re-render of the post details when a request is
         * enqueued and the selector is triggered
         */
        const state = store.getState();
        const pendingRequests = state?.requestReducer;
        if (pendingRequests?.length > 0) {
          for (let ii = 0; ii < pendingRequests?.length; ii++) {
            const request = pendingRequests[ii];
            const requestID = request?.data?.ID;
            const isPendingCreateNewPost = request?.data?.offline === true;
            // reprocess any pending *create new post* requests
            if (isPendingCreateNewPost) {
              delete request.data.ID;  
              delete request.data.offline;  
              const res = await processRequest({ request, reprocess: true });
              if (res?.data?.ID) {
                const postId = res.data.ID;
                const postType = res.data.post_type;
                const existingPostURL = getPostURL({ postType, postId: requestID });
                const newPostURL = getPostURL({ postType, postId });
                const listURL = getListURL({ postType });
                for (let jj = 0; jj < pendingRequests?.length; jj++) {
                  if (jj === ii) continue; // skip current request
                  // if any queued updates for the offline post, update with new URL (ID)
                  // (remove any leading/trailing slashes from URLs to compare)
                  if (pendingRequests[jj]?.url?.replace(/^\/|\/$/g, '') === existingPostURL?.replace(/^\/|\/$/g, '')) {
                    pendingRequests[jj].url = newPostURL;
                  };
                };
                // cache the new post
                cache.set(newPostURL, res.data);
                // overwrite the existing post with the new post in the list cache
                const cachedList = cache.get(listURL);
                if (cachedList) {
                  const idx = cachedList?.posts?.findIndex(item => item.ID === requestID);
                  if (idx > -1) {
                    cachedList.posts[idx] = res.data;
                    mutate(listURL, () => (cachedList));
                  };
                };
                // delete the existing, tmp post from cache
                cache.delete(existingPostURL);
              };
            };
            // reprocess any pending update requests
            await processRequest({ request, reprocess: true });
          };
        };
      };
    })();
    return;
  }, [isConnected]);

  return {
    request: processRequest,
  };
};
export default useRequestQueue;