import useRequest from "hooks/use-request";

import { searchObjList } from "utils";

/*
see: https://developers.disciple.tools/theme-core/api-other/users#list-users
[{
  "name": String,
  "ID": Number,
  "avatar": String,
  "contact_id": Number,
},{..}]
*/
const useUsers = ({ search, filter, exclude } = {}) => {
  let url = "dt/v1/users/get_users?get_all=1";
  // NOTE: see local search implementation below
  //if (search) url += `&s=${search}`;
  const {
    data: users,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useRequest({ url });
  if (error || isLoading || !users)
    return {
      data: null,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  // filter any items marked to be excluded
  let filtered = users.filter((item) => !exclude?.includes(item?.ID));
  // search
  if (search) {
    const searchOptions = {
      caseInsensitive: true,
      include: ["name"],
    };
    filtered = searchObjList(filtered, search, searchOptions);
  }
  return {
    data: filtered,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useUsers;
