import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { mutate, useSWRConfig } from "swr";

import axios from "services/axios";

import TabNavigator from "navigation/TabNavigator";

import { LogoHeader } from "components/Header/Header";
import OfflineBar from "components/OfflineBar";

import useCache from "hooks/use-cache";
import useNetwork from "hooks/use-network";
import useStyles from "hooks/use-styles";

import { defaultFetcher, fetchPostData } from "helpers";
import { getListURL, getFavoritesURL, getRecentURL } from "helpers/urls";
import { dedupeObjList } from "utils";
import { TypeConstants } from "constants";
import { ActivityLogURL } from "constants/urls";

import { localStyles } from "./LaunchScreen.styles";

const PREFETCH_TIMEOUT = 15000; // 15 seconds

const getPostsByURL = async ({ url, posts }) => {
  const res = await axios({ url, method: "GET" });
  if (res?.data?.posts) {
    posts.push(...res.data.posts);
  }
  return posts;
};

const filterActivityLog = ({ activityLog, postType }) => {
  const filteredActivityLog = activityLog.filter(
    (item) => item?.post_type === postType
  );
  const activityLogIds = filteredActivityLog.map((item) => item?.object_id);
  return [...new Set(activityLogIds)];
};

const filterActivityLogByMissingPosts = ({ uniqueActivityLogIds, posts }) => {
  let missingActivityLogIds = new Set();
  const postIds = posts.map((post) => post.ID);
  for (let ii = 0; ii < uniqueActivityLogIds.length; ii++) {
    const id = uniqueActivityLogIds[ii];
    if (!postIds.includes(id)) {
      missingActivityLogIds.add(id);
    }
  }
  return Array.from(missingActivityLogIds);
};

const getPostsByIds = async ({ baseUrl, posts, ids }) => {
  for (let ii = 0; ii < ids.length; ii++) {
    const id = ids[ii];
    const url = `${baseUrl}${id}/`;
    posts = getPostsByURL({ url, posts });
  }
  return posts;
};

/**
 * Prefetch list of "fresh" posts (ie, Favorites, Recent, and Activity Log),
 * a subset of the full list (to be available for immediate offline use)
 *
 * @param {Array} activityLog
 * @param {String} postType
 * @returns {Promise<Array>} Merged, deduplicated list of posts
 */
const prefetchListFresh = async ({ postType }) => {
  const options = { revalidate: true, rollbackOnError: true };
  let posts = [];
  // favorites
  const favoritesURL = getFavoritesURL({ postType });
  posts = await getPostsByURL({ url: favoritesURL, posts });
  // recent
  const recentURL = getRecentURL({ postType });
  posts = await getPostsByURL({ url: recentURL, posts });
  // activity log by post type
  const activityLog = await mutate(
    ActivityLogURL,
    defaultFetcher({ url: ActivityLogURL, method: "GET" }),
    options
  );
  const uniqueActivityLogIds = filterActivityLog({ activityLog, postType });
  // filter any activity log posts that are present in favorites or recent
  const missingActivityLogIds = filterActivityLogByMissingPosts({
    uniqueActivityLogIds,
    posts,
  });
  // get missing activity log posts
  const baseUrl = getListURL({ postType });
  posts = await getPostsByIds({ baseUrl, posts, ids: missingActivityLogIds });
  // deduplicate posts
  posts = dedupeObjList(posts);
  return { posts };
};

const prefetchPosts = async ({ postType }) => {};

/**
 * Component to prefetch data for offline use
 *
 * @callback setFetching
 * @returns null
 */
const PrefetchData = ({ setFetching }) => {
  const { cache } = useSWRConfig();
  (async () => {
    // prefetch contacts (favorites, recent, activity log, but use common cacheKey)
    const contactsListUrl = getListURL({ postType: TypeConstants.CONTACT });
    const contacts = cache.get(contactsListUrl);
    const prefetchContacts = await prefetchListFresh({
      postType: TypeConstants.CONTACT,
    });
    // do not overwrite any existing contacts
    if (!contacts) {
      cache.set(contactsListUrl, prefetchContacts);
    } else {
      // else contacts exist, update existing contacts list w/ prefetch data
      for (let ii = 0; ii < prefetchContacts?.posts?.length; ii++) {
        const idx = contacts.posts.findIndex(
          (post) => post.ID === prefetchContacts.posts[ii].ID
        );
        contacts.posts[idx] = prefetchContacts.posts[ii];
      }
      cache.set(contactsListUrl, contacts);
    }
    // prefetch groups (favorites, recent, activity log, but use common cacheKey)
    const groupsListUrl = getListURL({ postType: TypeConstants.GROUP });
    const groups = cache.get(groupsListUrl);
    const prefetchGroups = await prefetchListFresh({
      postType: TypeConstants.GROUP,
    });
    // do not overwrite any existing groups
    if (!groups) {
      cache.set(groupsListUrl, prefetchGroups);
    } else {
      // else groups exist, update existing groups list w/ prefetch data
      for (let ii = 0; ii < prefetchGroups?.posts?.length; ii++) {
        const idx = groups.posts.findIndex(
          (post) => post.ID === prefetchGroups.posts[ii].ID
        );
        groups.posts[idx] = prefetchGroups.posts[ii];
      }
      cache.set(groupsListUrl, groups);
    }
    /*
     * Attempt to pre/fetch fresh data (ie, comments, activity, shares)
     *
     * NOTE:
     * this will run asynchronously in the background - user will proceed with
     * the normal app launch flow (ie, Home Screen) while this is happening
     */
    fetchPostData({
      postType: TypeConstants.CONTACT,
      posts: prefetchContacts?.posts,
    });
    fetchPostData({
      postType: TypeConstants.GROUP,
      posts: prefetchGroups?.posts,
    });
    // proceed to Home Screen once the appropriate data is fetched
    if (contacts && groups) {
      setFetching(false);
    }
  })();
  return null;
};

/**
 * Component to load cache from device storage into SWR in-memory cache
 *
 * @callback setHydrating
 * @returns null
 */
const HydrateCache = ({ setHydrating }) => {
  const { loadCache } = useCache();
  (async () => {
    await loadCache();
    setHydrating(false);
    return;
  })();
  return null;
};

const LaunchScreen = () => {
  const { isConnected, isInitializing } = useNetwork();
  const { styles, globalStyles } = useStyles(localStyles);

  const [fetching, setFetching] = useState(isConnected || isInitializing);
  const [hydrating, setHydrating] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // ensure user may proceed to Home Screen even if something goes wrong
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, PREFETCH_TIMEOUT);
    return () => clearTimeout(timeout);
  }, []);

  // confirm offline, and disable fetching (triggering redirect)
  useEffect(() => {
    if (!isConnected && !isInitializing) {
      setFetching(false);
    }
    return;
  }, [isConnected, isInitializing]);

  if ((!hydrating && !fetching) || timeoutReached) return <TabNavigator />;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LogoHeader />
      </View>
      <OfflineBar />
      <View style={globalStyles.screenContainer}>
        {hydrating && <HydrateCache setHydrating={setHydrating} />}
        {isConnected && fetching && !hydrating && (
          <PrefetchData setFetching={setFetching} />
        )}
        <View style={globalStyles.activityIndicator}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default LaunchScreen;
