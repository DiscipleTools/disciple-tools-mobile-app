import useRequest from "hooks/use-request";
import { getTagsURL } from "helpers/urls";

const useTags = ({ exclude, search, postType }) => {
  const url = getTagsURL({ postType });
  const { data, error, isValidating, mutate } = useRequest({
    request: { url, method: "GET" },
  });
  if (!data?.length > 0 || isValidating || error) {
    return {
      cacheKey: url,
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
    cacheKey: url,
    data: tags,
    error,
    isLoading: !data && !error,
    isValidating,
    mutate,
  };
};
export default useTags;
