import useRequest from "hooks/use-request";

import { TypeConstants } from "constants";

const useCustomPostTypes = () => {
  //let url = "wp/v2/types";
  // https://developer.wordpress.org/rest-api/reference/post-types/
  //return useRequest({ url });
  const availablePostTypes = Object.values(TypeConstants);
  const activeCustomPostTypes = [];
  for (let ii=0; ii < availablePostTypes.length; ii++) {
    const type = availablePostTypes[ii];
    if (
      type === TypeConstants.NOTIFICATION ||
      type === TypeConstants.CONTACT ||
      type === TypeConstants.GROUP
    ) continue;
    // NOTE: use-request vs. use-list bc use-type depends on this hook and it would be circular (bc use-list also depends on use-type)
    let url = `/dt-posts/v2/${type}?limit=1`;
    const { data, error, isLoading, isValidating, mutate } = useRequest({ url });
    if (data?.posts?.length > 0) activeCustomPostTypes.push(type);
  };
  return {
    activeCustomPostTypes
  };
};
export default useCustomPostTypes;