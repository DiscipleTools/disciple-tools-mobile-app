import useRequest from "hooks/useRequest";

const useUsers = (search) => {
  let url = "dt/v1/users/get_users?get_all=1";
  if (search) url += `&s=${search}`;
  return useRequest({ url });
};
export default useUsers;