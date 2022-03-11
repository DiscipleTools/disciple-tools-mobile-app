import * as RootNavigation from "navigation/RootNavigation";

import useType from "hooks/use-type";
import useRequest from "hooks/use-request";

import { searchObjList } from "utils";

const useActivity = ({ search, filter, exclude }) => {
  const { isPost, postType } = useType();
  const id = RootNavigation.getId();
  const url = isPost ? `/dt-posts/v2/${postType}/${id}/activity` : null;
  const { data, error, isLoading, isValidating, mutate } = useRequest({ url });
  if (error || isLoading || !data?.activity) return {
    data: [],
    error,
    isLoading,
    isValidating,
    mutate
  };
  let filtered = data.activity?.filter(item => !exclude?.includes(item?.ID));
  if (search) filtered = searchObjList(filtered, search);
  return {
    data: filtered,
    error: null,
    isLoading: null,
    isValidating: null,
    mutate
  };
};
export default useActivity;