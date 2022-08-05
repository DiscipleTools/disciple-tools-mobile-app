import useRequest from "hooks/use-request";

// https://developers.disciple.tools/theme-core/api-posts/post-sharing
const useShares = (url) => {
  return useRequest({ url });
};
export default useShares;
