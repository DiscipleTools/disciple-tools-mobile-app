import useSettings from "hooks/use-settings";

import { TypeConstants } from "constants";

// TODO: merge into use-types?
const useCustomPostTypes = () => {
  const { settings } = useSettings();
  if (!settings?.post_types) return null;
  const availablePostTypes = Object.keys(settings?.post_types);
  const ignorePostTypes = [
    TypeConstants.PEOPLE_GROUP
  ];
  const corePostTypes = [
    TypeConstants.CONTACT,
    TypeConstants.GROUP,
  ];
  const filteredCustomPostTypes = availablePostTypes?.filter(postType => (
    !corePostTypes.includes(postType) &&
    !ignorePostTypes.includes(postType)
  ));
  return {
    customPostTypes: filteredCustomPostTypes,
  };
};
export default useCustomPostTypes;