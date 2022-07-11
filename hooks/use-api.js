import * as RootNavigation from "navigation/RootNavigation";

import useCache from "hooks/use-cache";
import useRequestQueue from "hooks/use-request-queue";
import useType from "hooks/use-type";

import { HTTP } from "constants";

import { formatDateAPI } from "utils";

const useAPI = () => {
  const postId = RootNavigation.getId();
  const { cache, mutate } = useCache();
  const { request } = useRequestQueue();
  const { postType } = useType();

  // USER
  // https://developers.disciple.tools/theme-core/api-other/users

  const updateUser = async ({ add_push_token, locale }) => {
    const url = "/dt/v1/user/update";
    let data = {};
    if (add_push_token) data["add_push_token"] = add_push_token;
    if (locale) data["locale"] = locale;
    return request(
      {
        url,
        method: HTTP.METHODS.POST,
        headers: HTTP.HEADERS.DEFAULT,
        data,
      },
      {
        ignoreUI: true,
      }
    );
  };

  // POSTS
  // https://developers.disciple.tools/theme-core/api-posts/create-post

  const createPost = async (fields, mutate = null, silent = false) => {
    let url = postType ? `/dt-posts/v2/${postType}` : null;
    if (silent) url += "?silent=true";
    try {
      const res = await request({
        url,
        method: HTTP.METHODS.POST,
        headers: HTTP.HEADERS.DEFAULT,
        data: { ...fields },
      });
      if (mutate) mutate();
      return res;
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
    fields,
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
        url,
        method: HTTP.METHODS.POST,
        headers: HTTP.HEADERS.DEFAULT,
        data: { ...fields },
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

  const createComment = async (
    comment,
    date = null,
    commentType = "comment"
  ) => {
    const url =
      postType && postId ? `/dt-posts/v2/${postType}/${postId}/comments` : null;
    const data = {
      comment,
      comment_type: commentType,
    };
    if (date) data["date"] = date;
    //
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
    const key = url;
    const localCachedData = cache.get(key);
    if (localCachedData?.comments?.length > 0)
      localData.comments.push(...localCachedData.comments);
    return request(
      {
        url,
        method: HTTP.METHODS.POST,
        headers: HTTP.HEADERS.DEFAULT,
        data,
      },
      { localData }
    );
  };

  const updateComment = async (commentId, comment) => {
    const url =
      postType && postId && commentId
        ? `/dt-posts/v2/${postType}/${postId}/comments/${commentId}`
        : null;
    return request({
      url,
      method: HTTP.METHODS.POST,
      headers: HTTP.HEADERS.DEFAULT,
      data: { comment },
    });
  };

  const deleteComment = async (commentId) => {
    const url =
      postType && postId && commentId
        ? `/dt-posts/v2/${postType}/${postId}/comments/${commentId}`
        : null;
    return request({
      url,
      method: HTTP.METHODS.DELETE,
    });
  };

  // SHARE
  // TODO:
  // https://developers.disciple.tools/theme-core/api-posts/post-sharing

  //const createShare = async(userId) => {};
  //const deleteShare = async(userId) => {};

  // NOTIFICATIONS

  const markAllNotificationsViewed = async () => null;

  const markNotificationViewed = async (id) => {
    const url = id ? `/dt/v1/notifications/mark_viewed/${id}` : null;
    return request({
      url,
      method: HTTP.METHODS.POST,
    });
  };

  const markNotificationUnread = async (id) => {
    const url = id ? `/dt/v1/notifications/mark_unread/${id}` : null;
    return request({
      url,
      method: HTTP.METHODS.POST,
    });
  };

  return {
    updateUser,
    createPost,
    updatePost,
    createComment,
    updateComment,
    deleteComment,
    // TODO
    //createShare,
    //deleteShare,
    markNotificationViewed,
    markNotificationUnread,
  };
};
export default useAPI;
