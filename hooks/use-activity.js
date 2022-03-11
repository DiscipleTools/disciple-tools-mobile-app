import useType from "hooks/useType";
import useId from "hooks/useId";
import useRequest from "hooks/useRequest";

const useActivity = ({ count, offset, exclude }) => {
  const { isPost, postType } = useType();
  const id = useId();

  const url = (isPost && !exclude) ? `/dt-posts/v2/${postType}/${id}/activity` : null;
  const { data, error, isLoading, isValidating, mutate } = useRequest({ url });
  return {
    data: data?.activity,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useActivity;