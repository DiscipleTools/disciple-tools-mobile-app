import useRequest from "hooks/use-request";

// https://developers.disciple.tools/theme-core/api-other/users
const useMyUser = () => {
  const url = "dt/v1/user/my";
  return useRequest({ url });
};
export default useMyUser;
