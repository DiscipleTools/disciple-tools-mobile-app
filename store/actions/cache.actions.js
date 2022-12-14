export const CACHE_SET = "CACHE_SET";

export const setCache = (cache) => {
  return {
    type: CACHE_SET,
    cache,
  };
};
