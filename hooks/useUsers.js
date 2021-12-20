import useRequest from "hooks/useRequest";

const useUsers = (searchString) => {
  let url = "dt/v1/users/get_users?get_all=1";
  if (searchString) url += `&s=${searchString}`;

  const { data, error, isLoading, isValidating } = useRequest(url);

  /*
  let users = null;
  if (data) {
    users = data?.map(user => ({
      ID: String(user?.ID),
      avatar: user?.avatar,
      contact_id: String(user?.contact_id),
      name: user?.name
    }));
  }
  */

  return {
    users: data,
    error,
    isLoading,
    isValidating,
  };
};
export default useUsers;
