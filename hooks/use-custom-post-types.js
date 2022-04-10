import useSettings from "hooks/use-settings";

import { TypeConstants } from "constants";

// TODO: merge into use-types?
const useCustomPostTypes = () => {
  const { settings } = useSettings();
  if (!settings?.post_types) return null;
  const ignorePostTypes = [
    TypeConstants.PEOPLEGROUPS
  ];
  const corePostTypes = [
    TypeConstants.CONTACT,
    TypeConstants.GROUP,
  ];
  const filteredCustomPostTypes = settings?.post_types?.filter(postType => (
    !corePostTypes.includes(postType) &&
    !ignorePostTypes.includes(postType)
  ));
  return {
    customPostTypes: filteredCustomPostTypes,
  };
};
export default useCustomPostTypes;