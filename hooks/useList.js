import usePostType from 'hooks/usePostType.js';
import useRequest from 'hooks/useRequest';

const useList = (filter, type) => {
  const { isContact, isGroup, postType, mapContacts, mapGroups } = usePostType(type);

  const mapPosts = (posts) => {
    if (isContact) return mapContacts(posts);
    if (isGroup) return mapGroups(posts);
    return null;
  };

  const mapFilterOnQueryParams = (filter, userData) => {
    let queryParams = '?';
    Object.keys(filter).forEach((key) => {
      let filterValue = filter[key];
      let filterValueType = Object.prototype.toString.call(filterValue);
      if (filterValueType === '[object Array]') {
        filterValue.forEach((value) => {
          queryParams = `${queryParams}${queryParams === '?' ? '' : '&'}${key}%5B%5D=${
            value === userData.displayName ? 'me' : value
          }`;
        });
      } else if (filterValueType === '[object Object]') {
        // TODO: implement?
        //mapFilterOnQueryParams(filterValue, null, userData);
      } else {
        if (filterValue?.length > 0) {
          queryParams = `${queryParams}${queryParams === '?' ? '' : '&'}${key}=${
            filterValue === userData.displayName ? 'me' : filterValue
          }`;
        }
      }
    });
    //console.log(`queryParams: ${queryParams}`);
    return queryParams;
  };

  // TODO: useMyUser() hook
  //const userData = { displayName: 'zzadmin' };
  const userData = { displayName: 'zdmc23' };
  let url = `/dt-posts/v2/${postType}`;
  if (filter) url += mapFilterOnQueryParams(filter, userData);

  // TODO: useSelector for initialData if OFFLINE
  //const initialData = null;

  let { data, error, isLoading, isValidating, mutate } = useRequest(url);

  return {
    posts: data?.posts ? mapPosts(data.posts) : null,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useList;
