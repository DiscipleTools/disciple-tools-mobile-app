import useRequest from "hooks/use-request";

import { UsersURL } from "constants/urls";

import { searchObjList } from "utils";

// ref: https://developers.disciple.tools/theme-core/api-other/users#list-users
const useUsers = ({ search, filter, exclude } = {}) => {
  const request = {
    url: UsersURL,
    method: "GET",
  };
  const {
    data: users,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useRequest({ request });
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
