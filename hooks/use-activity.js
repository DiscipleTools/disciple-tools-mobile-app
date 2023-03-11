import useId from "hooks/use-id";
import useType from "hooks/use-type";
import useRequest from "hooks/use-request";

import { getActivitiesURL } from "helpers/urls";
import { searchObjList } from "utils";

const useActivity = ({ search, filter, exclude }) => {
  const { isPost, postType } = useType();
  const postId = useId();
  const url = isPost ? getActivitiesURL({ postType, postId }) : null;
  const request = {
    url,
    method: "GET",
  };
  const { data, error, isValidating, mutate } = useRequest({ request });
  if (error || !data?.activity)
    return {
      data: [],
      error,
      isLoading: !error && !data,
      isValidating,
      mutate,
    };
  let filtered = data.activity?.filter((item) => !exclude?.includes(item?.ID));
  if (search) filtered = searchObjList(filtered, search);
  return {
    data: filtered,
    error: null,
    isLoading: null,
    isValidating: null,
    mutate,
  };
};
export default useActivity;
