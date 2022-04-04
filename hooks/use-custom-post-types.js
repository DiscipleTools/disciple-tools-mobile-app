import useList from "hooks/use-list";

import { TypeConstants } from "constants";

import { getAvailablePostTypes } from "utils";

const useCustomPostTypes = () => {
  //let url = "wp/v2/types";
  // https://developer.wordpress.org/rest-api/reference/post-types/
  //return useRequest({ url });
  const availablePostTypes = getAvailablePostTypes();
  const activeCustomPostTypes = [];
  for (let ii=0; ii < availablePostTypes.length; ii++) {
    const type = availablePostTypes[ii];
    if (
      type === TypeConstants.NOTIFICATION ||
      type === TypeConstants.CONTACT ||
      type === TypeConstants.GROUP
    ) continue;
    const { data: posts } = useList({ limit: 1, type });
    if (posts?.length > 0) activeCustomPostTypes.push(type);
  };
  return {
    activeCustomPostTypes
  };
};
export default useCustomPostTypes;