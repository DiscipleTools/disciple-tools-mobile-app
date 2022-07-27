import useRequest from "./use-request";

const useActivityLog = () => {
  let url = "dt-users/v1/activity-log";
  const { data, error, isLoading, isValidating, mutate } = useRequest({ url });
  if (error || isLoading || !data)
    return {
      data: null,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useActivityLog;
