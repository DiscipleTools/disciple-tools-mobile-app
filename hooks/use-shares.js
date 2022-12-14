import useRequest from "hooks/use-request";

// https://developers.disciple.tools/theme-core/api-posts/post-sharing
const useShares = (url) => {
  // TODO: why is this url coming in as a param?
  const request = {
    url,
    method: "GET",
  };
  return useRequest({ request });
};
export default useShares;
