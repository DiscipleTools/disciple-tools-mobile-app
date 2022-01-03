import useId from "hooks/useId";
import useType from "hooks/useType";
import useRequestQueue from "hooks/useRequestQueue";

import { HTTP } from "constants";

const useAPI = () => {
  const { request } = useRequestQueue();
  const { postType } = useType();
  const postId = useId();

  // USER
  // https://developers.disciple.tools/theme-core/api-other/users

  const updateUser = async(locale) => {
    const url = "/dt/v1/user/update";
    return request({
      url,
      method: HTTP.METHODS.POST,
      headers: HTTP.HEADERS.DEFAULT,
      data: { locale }
    });
  };

  // POSTS
  // https://developers.disciple.tools/theme-core/api-posts/create-post

  const createPost = async(fields, silent=false) => {
    let url = postType ? `/dt-posts/v2/${postType}` : null;
    if (silent) url += "?silent=true";
    return request({
      url,
      method: HTTP.METHODS.POST,
      headers: HTTP.HEADERS.DEFAULT,
      data: { ...fields }
    });
  };


  // https://developers.disciple.tools/theme-core/api-posts/update-post
  const updatePost = async(fields, silent=false) => {
    let url = postType && postId ? `/dt-posts/v2/${postType}/${postId}` : null;
    if (silent) url += "?silent=true";
    return request({
      url,
      method: HTTP.METHODS.POST,
      headers: HTTP.HEADERS.DEFAULT,
      data: { ...fields }
    });
  };

  /* NOTE: DELETE Post is not supported by the API
  //const deletePost = async() => null;
  */

  // COMMENTS
  // https://developers.disciple.tools/theme-core/api-posts/post-comments

  const createComment = async(comment, date=null, commentType="comment") => {
    const url = postType && postId ? `/dt-posts/v2/${postType}/${postId}/comments` : null;
    const data = {
      comment,
      comment_type: commentType
    };
    if (date) data["date"] = date;
    return request({
      url,
      method: HTTP.METHODS.POST,
      headers: HTTP.HEADERS.DEFAULT,
      data
    });
  };

  const updateComment = async(commentId, comment) => {
    const url = postType && postId && commentId ? `/dt-posts/v2/${postType}/${postId}/comments/${commentId}` : null;
    return request({
      url,
      method: HTTP.METHODS.POST,
      headers: HTTP.HEADERS.DEFAULT,
      data: { comment }
    });
  };

  const deleteComment = async(commentId) => {
    const url = postType && postId && commentId ? `/dt-posts/v2/${postType}/${postId}/comments/${commentId}` : null;
    return request({
      url,
      method: HTTP.METHODS.DELETE
    });
  };

  // SHARE
  // TODO:
  // https://developers.disciple.tools/theme-core/api-posts/post-sharing

  //const createShare = async(userId) => {};
  //const deleteShare = async(userId) => {};

  // NOTIFICATIONS

  const markAllNotificationsViewed = async() => null;

  const markNotificationViewed = async(id) => {
    const url = id ? `/dt/v1/notifications/mark_viewed/${id}` : null;
    return request({
      url,
      method: HTTP.METHODS.POST
    });
  };

  const markNotificationUnread = async(id) => {
    const url = id ? `/dt/v1/notifications/mark_unread/${id}` : null;
    return request({
      url,
      method: HTTP.METHODS.POST
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