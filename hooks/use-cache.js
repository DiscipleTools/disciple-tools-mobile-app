import { useDispatch } from "react-redux";
import { SWRConfig, useSWRConfig } from "swr";

import { store } from "store/store";
import { persistCache } from "store/actions/cache.actions";

import useAppState from "hooks/use-app-state";

import { EMPTY_CACHE } from "constants";

/**
 * A hook that abstracts the in-memory (SWR) and device storage (Redux) cache
 * implementations.
 * 
 * TODO: implement 'CacheProvider'
 * For use in App.js (rather than referencing 'SWRConfig' provider directly).
 */
const useCache = () => {

  const { cache, mutate } = useSWRConfig();
  const dispatch = useDispatch();

  /**
   * When user "backgrounds" the app, persist the in-memory cache (SWR)
   * to device storage (via Redux).
   */
  const onAppBackgroundCallback = () => {
    const inMemoryCacheMap = SWRConfig.default.cache;
    dispatch(persistCache(inMemoryCacheMap));
  };

  /**
   * When user "foregrounds" the app, rehydrate the in-memory cache. 
   */
  const onAppForegroundCallback = () => {
    // Use Redux 'store' object reference directly because 'useSelector'
    // does not have latest state available within 'AppState' event listener.
    const persistentCacheMap = store?.getState()?.cacheReducer?.cache ?? EMPTY_CACHE; 
    if (persistentCacheMap && (persistentCacheMap?.size > 0 || Object.keys(persistentCacheMap)?.length > 0)) {
      for (var [key, value] of persistentCacheMap.entries()) {
        cache.set(key, value);
      };
    };
  };

  //* Use the "useAppState" hook to listen for app state changes.
  useAppState({ onAppForegroundCallback, onAppBackgroundCallback });

  return {
    cache,
    mutate
  };
};
export default useCache;