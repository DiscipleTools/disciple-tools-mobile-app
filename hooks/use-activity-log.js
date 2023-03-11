import useRequest from "./use-request";

import { ActivityLogURL } from "constants/urls";

const useActivityLog = () => {
  const request = {
    url: ActivityLogURL,
    method: "GET",
  };
  const { data, error, isValidating, mutate } = useRequest({ request });
  return {
    data,
    error,
    isLoading: !error && !data,
    isValidating,
    mutate,
  };
};
export default useActivityLog;
