import { SWRConfig, mutate } from "swr";
import axios from "services/axios";

import * as FileSystem from "expo-file-system";

import {
  getListURL,
  getPostURL,
  getCommentsURL,
  getFiltersURL,
  getActivitiesURL,
} from "helpers/urls";
import {
  ActivityLogURL,
  LocationsURL,
  MyUserDataURL,
  NotificationsRequest,
  NotificationsURL,
  PeopleGroupsURL,
  SettingsURL,
  UsersURL,
} from "constants/urls";

import { CacheConstants, FieldConstants, TypeConstants } from "constants";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isEmpty = (obj) =>
  obj &&
  Object.keys(obj).length === 0 &&
  Object.getPrototypeOf(obj) === Object.prototype;

export const persistCache = async () => {
  const cacheFilename = FileSystem.documentDirectory + CacheConstants.FILENAME;
  const inMemoryCacheMap = SWRConfig.default.cache;
  const cacheObj = Object.fromEntries(inMemoryCacheMap);
  if (!isEmpty(cacheObj)) {
    Object.entries(cacheObj).forEach(([key, val]) => {
      if (key.startsWith("$swr$")) {
        delete cacheObj[key];
      }
    });
    await FileSystem.writeAsStringAsync(
      cacheFilename,
      JSON.stringify(cacheObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }
};

// ref: https://gist.github.com/zensh/4975495
export const memorySizeOf = (obj) => {
  let bytes = 0;
  const sizeOf = (obj) => {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case "number":
          bytes += 8;
          break;
        case "string":
          bytes += obj.length * 2;
          break;
        case "boolean":
          bytes += 4;
          break;
        case "object":
          const objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === "Object" || objClass === "Array") {
            for (var key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else {
            bytes += obj.toString().length * 2;
          }
          break;
      }
    }
    return bytes;
  };

  const formatByteSize = (bytes) => {
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
    else return (bytes / 1073741824).toFixed(3) + " GB";
  };

  return formatByteSize(sizeOf(obj));
};

export const filterPosts = ({ posts, query }) => {
  if (!query) return posts;
  // TODO: constant, and fill out remainer!!
  const meMultipleFields = ["subassigned", "coached_by"];
  if (query?.fields) query = query.fields;
  return posts?.filter((item) => {
    let queryKeys = Object.keys(query);
    queryKeys = queryKeys.filter(
      (key) => key !== "sort" && key !== "combine" && key !== "subassigned"
    );
    if (!queryKeys?.length > 0) return true;
    const queryMatches = queryKeys?.map((key) => {
      if (!item?.[key]) return false;
      if (item[key] === "*") return true; // matches: ...query { "comment_ID": '*' ...}
      if (query[key]?.includes(item?.[key])) return true;
      if (query[key]?.includes(item?.[key]?.key)) return true;
      // special handler for "favorite" field
      if (query[key][0] === "1" && item?.[key] === true) return true;
      /*
       * NOTE: userData is accessed from cache (bc problematic to access it via
       * 'use-my-user' hook from within 'use-list' for some unknown reason)
       */
      const userData = SWRConfig.default.cache.get(MyUserDataURL);
      // special handler for "assigned_to" field
      if (
        key === "assigned_to" &&
        query[key][0] === "me" &&
        item?.[key]?.id === userData?.ID?.toString()
      )
        return true;
      // special handler for "subassigned" (and other "me") fields
      if (
        meMultipleFields.includes(key) &&
        query[key][0] === "me" &&
        item?.[key]?.find((_item) => _item?.ID === userData?.ID?.toString())
      )
        return true;
      return false;
    });
    if (!queryMatches?.includes(false)) return true;
    return false;
  });
};

export const sortPosts = ({ posts, sortKey }) => {
  if (!posts) return posts;
  // TODO: constants
  return posts.sort((a, b) => {
    if (!sortKey) sortKey = "-last_modified";
    let sortDesc = sortKey?.startsWith("-");
    if (sortDesc) sortKey = sortKey?.substring(1);
    // necessary bc date fields have subfields (eg, "formatted" and "timestamp")
    let secondarySortKey = null;
    if (sortKey === "last_modified" || sortKey === "post_date") {
      secondarySortKey = "timestamp"; //"formatted";
    }
    if (a?.[sortKey]?.key) {
      secondarySortKey = "key";
    }
    if (secondarySortKey !== null) {
      if (a?.[sortKey]?.[secondarySortKey] < b?.[sortKey]?.[secondarySortKey])
        return sortDesc ? 1 : -1;
      if (a?.[sortKey]?.[secondarySortKey] > b?.[sortKey]?.[secondarySortKey])
        return sortDesc ? -1 : 1;
      return 0;
    }
    if (a?.[sortKey] < b?.[sortKey]) return sortDesc ? 1 : -1;
    if (a?.[sortKey] > b?.[sortKey]) return sortDesc ? -1 : 1;
    return 0;
  });
};

export const getPosts = async ({ url, offset, limit, posts }) => {
  //const _url = `${url}&offset=${offset}&limit=${limit}`;
  const _url = `${url}?offset=${offset}&limit=${limit}`;
  const res = await axios({
    url: _url,
    method: "GET",
  });
  if (res?.data) {
    posts = [...posts, ...(res?.data?.posts ?? [])];
    const total = res?.data?.total ?? 0;
    if (total > offset + limit) {
      offset = offset + limit;
      return getPosts({ url, offset, limit, posts });
    }
    return { posts };
  }
  // TODO: constant error message
  throw new Error("No data");
};

export const postFetcher = (request) => async (key) => getPosts(request);

export const getPostsFetcher = ({ postType }) => {
  const url = getListURL({ postType });
  /*
   * NOTE: if below is implemented, then the refresh is far more ~3x efficient,
   * but then the filters do not work (bc the relevant fields are not present)
   */
  /*
  if (postType === TypeConstants.CONTACT) {
    url = `${url}?fields_to_return[]=last_modified&fields_to_return[]=seeker_path&fields_to_return[]=overall_status`;
  }; 
  if (postType === TypeConstants.GROUP) {
    url = `${url}?fields_to_return[]=last_modified&fields_to_return[]=group_status&fields_to_return[]=group_type&fields_to_return[]=member_count`;
  };
  url = `${url}?fields_to_return[]=last_modified`;
  */
  return {
    url,
    fetcher: postFetcher({ url, offset: 0, limit: 1000, posts: [] }),
  };
};

export const getDefaultFavoritesFilter = ({ i18n, type } = {}) => {
  let defaultFavoritesFilter = {
    ID: "favorite",
    name: "",
    count: 0,
    subfilter: false,
    query: {
      fields: {
        favorite: ["1"],
      },
      sort: "-last_modified",
    },
  };
  if (!i18n || !type) return defaultFavoritesFilter;
  defaultFavoritesFilter["name"] =
    type === TypeConstants.CONTACT
      ? i18n.t("global.favoriteContacts")
      : type === TypeConstants.GROUP
      ? i18n.t("global.favoriteGroups")
      : "";
  return defaultFavoritesFilter;
};

export const defaultFetcher = (request) => async (key) =>
  axios(request).then((res) => res.data);

// TODO:
// support: filter?.query: {"fields":[{"overall_status":["from_facebook"]}],"sort":"name","fields_to_return":["name","favorite","overall_status","seeker_path","milestones","assigned_to","groups","last_modified"]}
// /dt-posts/v2/contacts?&fields%5B%5D=[object Object]&sort=name&fields_to_return%5B%5D=name&fields_to_return%5B%5D=favorite&fields_to_return%5B%5D=overall_status&fields_to_return%5B%5D=seeker_path&fields_to_return%5B%5D=milestones&fields_to_return%5B%5D=assigned_to&fields_to_return%5B%5D=groups&fields_to_return%5B%5D=last_modified
export const mapFilterOnQueryParams = (filter, userData) => {
  let queryParams = "";
  Object.keys(filter).forEach((key) => {
    let filterValue = filter[key];
    if (key === "fields") {
      filterValue = { ...filter[key] };
    }
    let filterValueType = Object.prototype.toString.call(filterValue);
    if (filterValueType === "[object Array]") {
      filterValue.forEach((value) => {
        queryParams = `${queryParams}&${key}[]=${
          value === userData?.display_name ? "me" : value
        }`;
      });
    } else if (filterValueType === "[object Object]") {
      queryParams = mapFilterOnQueryParams(filterValue, null, userData);
    } else {
      if (key === "dt_recent") {
        queryParams = `&${key}`;
      } else if (typeof filterValue === "boolean" || filterValue?.length > 0) {
        queryParams = `${queryParams}&${key}=${
          filterValue === userData?.display_name ? "me" : filterValue
        }`;
      } else;
    }
  });
  return queryParams;
};

/**
 * Prefetch Comments and Activity (Shares and Following not yet implemented)
 * for each post in the list of prefetched posts (to be available offline)
 *
 * @param {String} baseUrl
 * @param {Array} posts
 * @returns {Promise<undefined>}
 */
export const fetchPostData = async ({ postType, posts }) => {
  let url = null;
  const options = { revalidate: true, rollbackOnError: true };
  const ids = posts?.map((contact) => contact.ID);
  (async () => {
    for (let ii = 0; ii < ids.length; ii++) {
      const postId = ids[ii];
      // details
      url = getPostURL({ postType, postId });
      await mutate(url, defaultFetcher({ url, method: "GET" }), options);
      // comments
      url = getCommentsURL({ postType, postId });
      await mutate(url, defaultFetcher({ url, method: "GET" }), options);
      // activity
      url = getActivitiesURL({ postType, postId });
      await mutate(url, defaultFetcher({ url, method: "GET" }), options);
      // shares // TODO: implement in app (currently write only)
      // url = getSharesURL({ postType, postId });
      //await mutate(url, defaultFetcher({ url, method: "GET" }), options);
      // following // TODO: implement in app
      //url = getFollowingURL({ postType, postId });
      //const following = await mutate(url, defaultFetcher({ url, method: "GET" }), options);
    }
  })();
  return;
};

// TODO: support non-contacts/groups post types (read settings to see what is available)
export const downloadAllData = async () => {
  const options = { revalidate: true, rollbackOnError: true };
  // refresh activity log
  await mutate(
    ActivityLogURL,
    defaultFetcher({ url: ActivityLogURL, method: "GET" }),
    options
  );
  // refresh settings
  await mutate(
    SettingsURL,
    defaultFetcher({ url: SettingsURL, method: "GET" }),
    options
  );
  // refresh my user data
  await mutate(
    MyUserDataURL,
    defaultFetcher({ url: MyUserDataURL, method: "GET" }),
    options
  );
  // refresh notifications
  await mutate(NotificationsURL, defaultFetcher(NotificationsRequest), options);
  // refresh users
  await mutate(
    UsersURL,
    defaultFetcher({ url: UsersURL, method: "GET" }),
    options
  );
  // refresh group filters
  const groupFiltersURL = getFiltersURL({ postType: TypeConstants.GROUP });
  await mutate(
    groupFiltersURL,
    defaultFetcher({ url: groupFiltersURL, method: "GET" }),
    options
  );
  // refresh contact filters
  const contactFiltersURL = getFiltersURL({ postType: TypeConstants.CONTACT });
  await mutate(
    contactFiltersURL,
    defaultFetcher({ url: contactFiltersURL, method: "GET" }),
    options
  );
  // refresh locations
  await mutate(
    LocationsURL,
    defaultFetcher({ url: LocationsURL, method: "GET" }),
    options
  );
  // refresh people groups
  await mutate(
    PeopleGroupsURL,
    defaultFetcher({ url: PeopleGroupsURL, method: "GET" }),
    options
  );
  // refresh groups
  const groupsListURL = getListURL({ postType: TypeConstants.GROUP });
  const groups = await mutate(
    groupsListURL,
    postFetcher({ url: groupsListURL, offset: 0, limit: 1000, posts: [] }),
    options
  );
  // refresh contacts
  const contactsListURL = getListURL({ postType: TypeConstants.CONTACT });
  const contacts = await mutate(
    contactsListURL,
    postFetcher({ url: contactsListURL, offset: 0, limit: 1000, posts: [] }),
    options
  );
  // refresh group data (details, comments, activity, shares, following)
  await fetchPostData({ postType: TypeConstants.GROUP, posts: groups?.posts });
  // refresh contact data (details, comments, activity, shares, following)
  await fetchPostData({
    postType: TypeConstants.CONTACT,
    posts: contacts?.posts,
  });
  return;
};

export const getCurrentDate = () => {
  const date = new Date();
  const timestamp = Math.floor(date.getTime() / 1000);
  const formatted = date.toISOString().split("T")[0];
  return {
    timestamp,
    formatted,
  };
};

export const generateTmpId = () => {
  const randomValue = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `${FieldConstants.TMP_ID_PREFIX}${randomValue}`;
};

export const getStatusKey = ({ postType }) => {
  if (postType === TypeConstants.CONTACT) return "overall_status";
  if (postType === TypeConstants.GROUP) return "group_status";
  return "status";
};
