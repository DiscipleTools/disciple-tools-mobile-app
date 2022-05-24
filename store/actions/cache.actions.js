export const PERSIST_CACHE = "PERSIST_CACHE";

export function persistCache(cache) {
  return {
    type: PERSIST_CACHE,
    cache,
  };
}
