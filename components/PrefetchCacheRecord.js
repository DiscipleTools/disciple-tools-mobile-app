import React from "react";

import useDetails from "hooks/use-details";

/*
 * NOTE: this is a hack to prefetch posts so that the records are available
 * in SWR cache to be persisted if the user goes OFFLINE.
 *
 * This is a component so we can leverage the 'useDetails' hook.
 * (No need to render anything).
 */
const PrefetchCacheRecord = ({ id, type }) => {
  useDetails({ id, type });
  return null;
};
export default PrefetchCacheRecord;
