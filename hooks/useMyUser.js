import useRequest from "hooks/useRequest";

// https://developers.disciple.tools/theme-core/api-other/users
const useMyUser = () => {
  const url = "dt/v1/user/my";
  return useRequest({ url });
};
export default useMyUser;