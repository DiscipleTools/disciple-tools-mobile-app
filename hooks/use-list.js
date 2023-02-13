import useSWR from "swr";

import useNetwork from "./use-network";
import useType from "hooks/use-type.js";

import {
  filterPosts,
  sortPosts,
  getPostsFetcher,
  defaultFetcher,
  mapFilterOnQueryParams,
} from "helpers";
import { getListURL } from "helpers/urls";
import { searchObjList, searchCommFields, dedupeObjList } from "utils";

import { FieldNames } from "constants";

const useList = ({
  search,
  filter,
  exclude,
  type,
  subtype,
  revalidate,
  filterByAPI,
} = {}) => {
  const { isConnected, isInitializing } = useNetwork();
  const { postType } = useType({ type, subtype });

  let url = getListURL({ postType });

  /*
   * revalidate only if specified AND online (network is at least initializing)
   * otherwise use in-memory cached data
   */
  let fetcher = null;
  if ((isConnected || isInitializing) && revalidate) {
    if (filterByAPI) {
      const queryParams = mapFilterOnQueryParams(filter?.query, userData);
      const mappedUrl = url + "?" + queryParams.slice(1); // workaround to remove leading '&'
      fetcher = defaultFetcher({ url: mappedUrl, method: "GET" });
    } else {
      ({ fetcher } = getPostsFetcher({ postType }));
    }
  }

  // TODO: merge with 'use-request' ?
  const { data, error, isValidating, mutate } = useSWR(url, fetcher);
  if (!data?.posts || isValidating || error) {
    return {
      cacheKey: url,
      data: isValidating ? null : [],
      error,
      isLoading: !data && !error,
      isValidating,
      mutate,
    };
  }
  // process the posts
  let posts = [];
  if (data?.posts) {
    posts = data.posts;
  }
  // filter any items marked to be excluded
  if (exclude) {
    posts = posts.filter((item) => !exclude?.includes(item?.ID));
  }
  // filter posts (by query)
  if (filter?.query) {
    posts = filterPosts({ posts, query: filter.query });
  }
  // search posts
  if (search) {
    const searchOptions = {
      caseInsensitive: true,
      include: [
        FieldNames.POST_TITLE,
        FieldNames.NAME,
        FieldNames.NICKNAME,
        //FieldNames.NOTE, NOTE property is "oikos" ??
      ],
    };
    const objSearchResList = searchObjList(posts, search, searchOptions);
    const commSearchResList = searchCommFields(posts, search, {
      caseInsensitive: true,
    });
    posts = dedupeObjList([...commSearchResList, ...objSearchResList]);
  }
  // sort posts
  posts = sortPosts({ posts, sortKey: filter?.query?.sort });
  return {
    cacheKey: url,
    data: posts,
    error,
    isLoading: !data && !error,
    isValidating,
    mutate,
  };
};
export default useList;
