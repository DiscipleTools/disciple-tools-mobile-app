import useRequest from "hooks/use-request";

const useCustomPostTypes = () => {
  let url = "wp/v2/types";
  // https://developer.wordpress.org/rest-api/reference/post-types/
  return useRequest({ url });
};
export default useCustomPostTypes;