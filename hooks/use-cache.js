import { useCallback } from "react";
import { useSWRConfig } from "swr";
import * as FileSystem from 'expo-file-system';

import { CacheConstants } from "constants";

/**
 * Abstracts the in-memory cache (SWR) and device storage (Expo FileSystem)
 */
const useCache = () => {

  const { cache, mutate } = useSWRConfig();

  const loadCache = async () => { 
    const cacheFilename = FileSystem.documentDirectory + CacheConstants.FILENAME;
    let cacheObj;
    try {
      const cacheStr = await FileSystem.readAsStringAsync(cacheFilename, { encoding: FileSystem.EncodingType.UTF8 });
      cacheObj = JSON.parse(cacheStr);
      if (cacheObj) {
        const persistentCacheMap = new Map(Object.entries(cacheObj));
        if (persistentCacheMap && (persistentCacheMap?.size > 0 || Object.keys(persistentCacheMap)?.length > 0)) {
          for (var [key, value] of persistentCacheMap.entries()) {
            //console.log("*** REHYDRATING KEY: ", key, JSON.stringify(value)?.substring(0, 100));
            cache.set(key, value);
          };
        };
      };
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  };

  // TODO: remove
  const mergeValueIntoCacheByType = useCallback(({ cachedValue, newValue, fieldType }) => {
    //if ((!cachedValue && cachedValue !== 0) || !newValue) return null;
    if (!newValue) return null;
    switch (typeof cachedValue) {
      case "undefined":
        if (fieldType === "array") {
          return [ newValue ];
        };
        if (fieldType === "object") {
          return { ...newValue };
        };
        return newValue;
      case "object": {
        // "cachedValue" is an Array 
        if (Array.isArray(cachedValue)) {
          /*
           * Arrays may merge other arrays, objects, or primitives, so we need to
           * check the type of "newValue" to determine how to merge
           */
          if (typeof newValue === "object") {
            if (Array.isArray(newValue)) {
              return [...cachedValue, ...newValue];
            };
            return [...cachedValue, { ...newValue }];
          };
          return [...new Set([...cachedValue, newValue])]; // prevent dupes
        };
        // "cachedValue" is object
        /*
         * no need for conditional bc it must be a non-array object, otherwise
         * it cannot be merged into an existing object
         */
        return {...cachedValue, ...newValue};
      };
      default:
        // "cachedValue" is string, number, etc...
        return newValue;
    };
  }, []);

  // TODO: remove
  const mergeValueIntoCacheByKey = ({ cacheKey, fieldKey, fieldType, newValue }) => {
    const cachedData = cache.get(cacheKey);
    const cachedValue = cachedData?.[fieldKey];
    //for (const [key, value] of cache.entries()) {
    const mergedData = mergeValueIntoCacheByType({ cachedValue, newValue, fieldType });
    cachedData[fieldKey] = mergedData;
    cache.set(cacheKey, cachedData);
    //mutate(cacheKey);
    return;
  };

  // TODO: rename?
  const setCacheByKey = ({ cacheKey, fieldKey, newValue }) => {
    const cachedData = cache.get(cacheKey);
    cachedData[fieldKey] = newValue;
    cache.set(cacheKey, cachedData);
    return;
  };

  const setCachePostFieldValue = ({ cacheKey, fieldKey, newValue, postId }) => {
    const cachedData = cache.get(cacheKey);
    const idx = cachedData?.posts?.findIndex((post) => post.ID === postId);
    //if (!cachedData?.posts?.[idx]?.[fieldKey]) return;
    const newPost = { ...cachedData.posts[idx] };
    newPost[fieldKey] = newValue;
    cachedData.posts[idx] = newPost;
    cache.set(cacheKey, cachedData);
    return;
  };

  const setCacheFilterPostFieldValues = ({ cacheKey, fieldKey, filterValue, postId }) => {
    const cachedData = cache.get(cacheKey);
    const idx = cachedData?.posts?.findIndex((post) => post.ID === postId);
    if (!cachedData?.posts?.[idx]?.[fieldKey]) return;
    const cachedDataModified = cachedData.posts[idx][fieldKey]?.filter(item => item.ID !== filterValue);
    if (!cachedDataModified) return; 
    cachedData.posts[idx][fieldKey] = cachedDataModified;
    cache.set(cacheKey, cachedData);
  };

  const clearStorage = useCallback(async() => {
    try {
      const cacheFilename = FileSystem.documentDirectory + CacheConstants.FILENAME;
      //await FileSystem.deleteAsync(cacheFilename);
      await FileSystem.writeAsStringAsync(cacheFilename, JSON.stringify({}), { encoding: FileSystem.EncodingType.UTF8 });
    } catch (error) {
      console.error(error);
    };
  }, []);

  const clearCache = async() => cache.clear();

  //for (const [key, value] of cache.entries()) {
  return {
    cache,
    mergeValueIntoCacheByKey,
    setCacheByKey,
    setCachePostFieldValue,
    setCacheFilterPostFieldValues,
    mutate,
    loadCache,
    clearStorage,
    clearCache,
  };
};
export default useCache;