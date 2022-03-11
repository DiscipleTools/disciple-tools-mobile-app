import useNetwork from "./use-network";
import useRequest from "hooks/use-request";

import { searchObjList } from "utils";

const useUsers = ({ search, filter, exclude } = {}) => {
  //const { isConnected } = useNetwork();
  let url = "dt/v1/users/get_users?get_all=1";
  //if (search && isConnected) url += `&s=${search}`;
  const { data: users, error, isLoading, isValidating, mutate } = useRequest({ url });
  if (error || isLoading || !users) return {
    data: null,
    error,
    isLoading,
    isValidating,
    mutate
  };
  let filtered = users.filter(item => !exclude?.includes(item?.ID));
  //if (filtered?.length > 0 && search && isConnected == false) filtered = searchObjList(filtered, search);
  if (filtered?.length > 0 && search) filtered = searchObjList(filtered, search);
  return {
    data: filtered,
    error,
    isLoading,
    isValidating,
    mutate
  };
};
export default useUsers;
