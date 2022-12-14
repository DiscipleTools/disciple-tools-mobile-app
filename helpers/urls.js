export const getFiltersURL = ({ postType }) => `dt/v1/users/get_filters?post_type=${postType}`;
export const getListURL = ({ postType }) => `dt-posts/v2/${postType}/`;
export const getPostURL = ({ postType, postId }) => `dt-posts/v2/${postType}/${postId}/`;
export const getFavoritesURL = ({ postType }) => `dt-posts/v2/${postType}/?favorite[]=1`;
export const getRecentURL = ({ postType }) => `dt-posts/v2/${postType}/?dt_recent`;
export const getCommentsURL = ({ postType, postId }) => `dt-posts/v2/${postType}/${postId}/comments`;
export const getCommentURL = ({ postType, postId, commentId }) => `dt-posts/v2/${postType}/${postId}/comments/${commentId}`;
export const getActivitiesURL = ({ postType, postId }) => `dt-posts/v2/${postType}/${postId}/activity`;
export const getActivityURL = ({ postType, postId, activityId }) => `dt-posts/v2/${postType}/${postId}/activity/${activityId}`;
export const getSharesURL = ({ postType, postId }) => `dt-posts/v2/${postType}/${postId}/shares`;
export const getFollowingURL = ({ postType, postId }) => `dt-posts/v2/${postType}/${postId}/following`;
export const getTagsURL = ({ postType }) => `dt-posts/v2/${postType}/multi-select-values?field=tags`;
//399Kb (1000) dt-posts/v2/contacts/?fields_to_return[]=last_modified&fields_to_return[]=seeker_path&fields_to_return[]=overall_status&limit=1000
//57Kb (153) dt-posts/v2/groups/?fields_to_return[]=last_modified&fields_to_return[]=group_status&fields_to_return[]=group_type&fields_to_return[]=member_count&limit=1000

//9Kb dt-posts/v2/contacts/?dt_recent&fields_to_return[]=last_modified
//9Kb dt-posts/v2/groups/?dt_recent&fields_to_return[]=last_modified

//2.0Kb (4) dt-posts/v2/contacts/?favorite[]=1&fields_to_return[]=last_modified
//1.3Kb (2) dt-posts/v2/groups/?favorite[]=1&fields_to_return[]=last_modified