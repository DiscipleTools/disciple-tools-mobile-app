import useRequest from "hooks/useRequest";

const useMyUser = () => {
  const url = "dt/v1/user/my";
  const { data, error, isLoading, isValidating, mutate } = useRequest(url);
  return {
    userData: data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useMyUser;
