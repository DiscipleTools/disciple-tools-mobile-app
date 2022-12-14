import { useCallback } from "react";

import useAPI from "hooks/use-api";
import useMyUser from "hooks/use-my-user";
import useRequest from "hooks/use-request";

import { NotificationsRequest } from "constants/urls";
import { searchObjList } from "utils";

const useNotifications = ({ search, filter, exclude, offset, limit } = {}) => {
  const {
    markAllNotificationsViewed,
    markNotificationViewed,
    markNotificationUnread,
  } = useAPI();
  const { data: userData } = useMyUser();
  const userId = userData?.ID;

  const markAllViewed = useCallback(() => {
    if (!userId) return;
    markAllNotificationsViewed({ userId });
    return;
  }, [userId]);

  const {
    data: notifications,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useRequest({ request: NotificationsRequest });
  if (error || isLoading || !notifications)
    return {
      data: null,
      error,
      isLoading,
      isValidating,
      mutate,
    };

  let filtered = notifications.filter((item) => !exclude?.includes(item?.id));
  // TODO: use helpers/index->filterPosts
  // NOTE: filter by key/value per "useFilters" query value
  if (filter?.query?.key && filter?.query?.value)
    filtered = filtered.filter(
      (item) => item?.[filter.query.key] === filter.query.value
    );
  //if (search && isConnected == false) filtered = searchObjList(filtered, search);
  if (search) {
    filtered = searchObjList(filtered, search);
  };
  const filteredRead = filtered?.filter((item) => item?.is_new === "0");
  const filteredNew = filtered?.filter((item) => item?.is_new === "1");
  // place new items at the top of list
  filtered = [...filteredNew, ...filteredRead];

  // NOTE: do not memoize or it will cause not render badge properly
  const hasNotifications = filteredNew?.length > 0;

  return {
    data: filtered,
    error,
    isLoading,
    isValidating,
    mutate,
    hasNotifications,
    //markViewed,
    //markUnread,
    markAllViewed,
    markNotificationViewed,
    markNotificationUnread,
  };
};
export default useNotifications;
