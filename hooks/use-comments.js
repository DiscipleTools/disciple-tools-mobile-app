import * as RootNavigation from "navigation/RootNavigation";

import useType from "hooks/use-type";
import useRequest from "hooks/use-request";

import { searchObjList } from "utils";

const useComments = ({ search, filter, exclude }) => {
  const { isPost, postType } = useType();
  const id = RootNavigation.getId();
  const url = isPost ? `/dt-posts/v2/${postType}/${id}/comments` : null;
  const { data, error, isLoading, isValidating, mutate } = useRequest({ url });
  if (error || isLoading || !data?.comments) return {
    data: [],
    error,
    isLoading,
    isValidating,
    mutate
  };
  let filtered = data.comments?.filter(item => !exclude?.includes(item?.ID));
  if (search) filtered = searchObjList(filtered, search);
  return {
    data: filtered,
    error: null,
    isLoading: null,
    isValidating: null,
    mutate
  };
};
export default useComments;