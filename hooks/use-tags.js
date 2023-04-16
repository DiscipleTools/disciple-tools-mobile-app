import useSettings from "hooks/use-settings";
import { SettingsURL } from "constants/urls";

const useTags = ({ exclude, search, postType }) => {
  const { settings, error, isLoading, isValidating } = useSettings();
  const mutate = () => null;
  const data = settings?.post_types?.[postType]?.fields?.tags?.default;
  if (!data || isValidating || error) {
    return {
      cacheKey: SettingsURL,
      data: isValidating ? null : [],
      error,
      isLoading: !data && !error,
      isValidating,
      mutate,
    };
  }
  let tags = [];
  // filter any items marked to be excluded
  if (exclude) {
    tags = data.filter((tag) => !exclude?.includes(tag));
  }
  // search posts
  if (search) {
    tags = tags.filter((tag) =>
      tag?.toLowerCase().includes(search?.toLowerCase())
    );
  }
  // sort?
  return {
    cacheKey: SettingsURL,
    data: tags,
    error,
    isLoading: !data && !error,
    isValidating,
    mutate,
  };
};
export default useTags;
