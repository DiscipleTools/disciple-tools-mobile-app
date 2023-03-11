import useId from "hooks/use-id";
import useType from "hooks/use-type";
import useRequest from "hooks/use-request";

import { getCommentsURL } from "helpers/urls";
import { searchObjList } from "utils";

const useComments = ({ search, filter, exclude }) => {
  const { isPost, postType } = useType();
  const postId = useId();
  const url = isPost ? getCommentsURL({ postType, postId }) : null;
  const request = {
    url,
    method: "GET",
  };
  const { cacheKey, data, error, isValidating, mutate } = useRequest({
    request,
  });
  if (error || !data?.comments)
    return {
      data: [],
      error,
      isLoading: !error && !data,
      isValidating,
      mutate,
    };
  let filtered = data.comments?.filter((item) => !exclude?.includes(item?.ID));
  if (search) filtered = searchObjList(filtered, search);
  return {
    cacheKey,
    data: filtered,
    error: null,
    isLoading: null,
    isValidating: null,
    mutate,
  };
};
export default useComments;
