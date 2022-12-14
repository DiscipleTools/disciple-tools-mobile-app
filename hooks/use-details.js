import useId from "hooks/use-id";
import useRequest from "hooks/use-request";
import useType from "hooks/use-type";

import { getPostURL } from "helpers/urls";

const useDetails = () => {
  const { postType } = useType();
  const postId = useId();
  const url = getPostURL({ postType, postId });
  const request = {
    url,
    method: "GET",
  };
  const { data, error, isValidating, mutate } = useRequest({ request });
  return {
    cacheKey: url,
    data,
    error,
    isLoading: !data && !error,
    isValidating,
    mutate,
  };
};
export default useDetails;