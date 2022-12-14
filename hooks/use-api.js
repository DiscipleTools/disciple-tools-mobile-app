import * as RootNavigation from "navigation/RootNavigation";

import useCache from "hooks/use-cache";
import useRequestQueue from "hooks/use-request-queue";
import useType from "hooks/use-type";

import { getCommentURL, getCommentsURL, getListURL } from "helpers/urls";

import { formatDateAPI } from "utils";

import { HTTP } from "constants";

const useAPI = ({ cacheKey } = {}) => {
  const postId = RootNavigation.getId();
  const { cache } = useCache();
  const { request } = useRequestQueue();
  const { postType } = useType();

  // USER
  // https://developers.disciple.tools/theme-core/api-other/users

  const updateUser = async ({ add_push_token, locale }) => {
    const url = "/dt/v1/user/update";
    let data = {};
    //if (add_push_token) data["add_push_token"] = add_push_token;
    // TODO
    if (add_push_token) return;
    if (locale) data["locale"] = locale;
    return request({
      request: {
        url,
        method: HTTP.METHODS.POST,
        headers: HTTP.HEADERS.DEFAULT,
        data,
      },
      // TODO: getCacheKeyByRequest?
      cacheKey: url,
    });
  };

  // POSTS
  // https://developers.disciple.tools/theme-core/api-posts/create-post
  const createPost = async ({ data, mutate, silent }) => {
    let url = postType ? getListURL({ postType }) : null;
    if (silent) url += "?silent=true";
    try {
      const res = await request({
        request: {
          url,
          method: HTTP.METHODS.POST,
          headers: HTTP.HEADERS.DEFAULT,
          data,
        },
      });
      if (mutate) mutate();
      return res?.data;
    } catch (error) {
      // TODO
      console.error(error);
    }
    return;
  };

  // https://developers.disciple.tools/theme-core/api-posts/update-post
  const updatePost = async ({
    urlPath,
    urlPathPostfix,
    data,
    id,
    type,
    mutate,
    silent,
  }) => {
    if (!id) id = postId;
    if (!type) type = postType;
    let url = type && id ? `/dt-posts/v2/${type}/${id}` : null;
    if (urlPathPostfix) url += urlPathPostfix;
    if (urlPath) url = urlPath;
    // TODO: check for exiting params to use '&' instead of '?'
    //if (silent) url += "?silent=true";
    try {
      const res = await request({
        request: {
          url,
          method: HTTP.METHODS.POST,
          headers: HTTP.HEADERS.DEFAULT,
          data,
        },
      });
      if (mutate) mutate();
      return res;
    } catch (error) {
      // TODO
      console.error(error);
    }
    return;
  };

  /* NOTE: DELETE Post is not supported by the API
  //const deletePost = async() => null;
  */

  // COMMENTS
  // https://developers.disciple.tools/theme-core/api-posts/post-comments

  const createComment = async ({ comment }) => {
    let url = null;
    if (postType && postId) {
      url = getCommentsURL({ postType, postId });
    }
    const data = {
      comment,
      comment_type: "comment", // hardcoded
    };
    // TODO: remove
    /*
    const localData = {
      comments: [
        {
          comment_ID: "-1",
          comment_content: comment,
          comment_date: formatDateAPI(new Date()),
          comment_type: "comment",
        },
      ],
    };
    //const key = url;
    const localCachedData = cache.get(cacheKey);
    if (localCachedData?.comments?.length > 0)
      localData.comments.push(...localCachedData.comments);
    */
    return request({
      request: {
        url,
        method: HTTP.METHODS.POST,
        headers: HTTP.HEADERS.DEFAULT,
        data,
      },
    });
  };

  const updateComment = async (commentId, comment) => {
    const url =
      postType && postId && commentId
        ? `/dt-posts/v2/${postType}/${postId}/comments/${commentId}`
        : null;
    return request({
      request: {
        url,
        method: HTTP.METHODS.POST,
        headers: HTTP.HEADERS.DEFAULT,
        data: { comment },
      },
      cacheKey,
    });
  };

  const deleteComment = async ({ commentId }) => {
    let url = null;
    if (postType && postId && commentId) {
      url = getCommentURL({ postType, postId, commentId });
    }
    return request({
      request: {
        url,
        method: HTTP.METHODS.DELETE,
      },
    });
  };

  // SHARE
  // https://developers.disciple.tools/theme-core/api-posts/post-sharing
  const createShare = async (userId) => {
    const url =
      postType && postId && userId
        ? `/dt-posts/v2/${postType}/${postId}/shares`
        : null;
    return request({
      request: {
        url,
        method: HTTP.METHODS.POST,
        headers: HTTP.HEADERS.DEFAULT,
        data: { user_id: userId },
      },
      cacheKey,
    });
  };
  //const deleteShare = async(userId) => {};

  // NOTIFICATIONS

  const markNotifications = async ({ action, id }) => {
    const url = id ? `dt/v1/notifications/${action}/${id}` : null;
    return request({
      request: {
        url,
        method: HTTP.METHODS.POST,
      },
    });
  };
  const markAllNotificationsViewed = async ({ userId }) =>
    markNotifications({ action: "mark_all_viewed", id: userId });
  const markNotificationViewed = async ({ notificationId }) =>
    markNotifications({ action: "mark_viewed", id: notificationId });
  const markNotificationUnread = async ({ notificationId }) =>
    markNotifications({ action: "mark_unread", id: notificationId });

  return {
    updateUser,
    createPost,
    updatePost,
    createComment,
    updateComment,
    deleteComment,
    createShare,
    // TODO
    //deleteShare,
    markAllNotificationsViewed,
    markNotificationViewed,
    markNotificationUnread,
  };
};
export default useAPI;
