import useRequest from "hooks/use-request";

import { SettingsURL } from "constants/urls";

const useSettings = () => {
  const request = {
    url: SettingsURL,
    method: "GET",
  };
  const { data, error, isValidating } = useRequest({ request });
  return {
    settings: data, // TODO: leave as 'data' for consistency?
    error,
    isLoading: !error && !data,
    isValidating,
  };
};
export default useSettings;
