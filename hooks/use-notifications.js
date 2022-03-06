import { useAuth } from "hooks/useAuth";
import useAPI from "hooks/useAPI";
import useRequest from "hooks/useRequest";

import { searchObjList } from "utils";

const useNotifications = ({ search, filter, exclude }) => {
  //const { uid } = useAuth();
  /*
  const {
    markAllNotificationsViewed,
    markNotificationUnread,
    markNotificationViewed
  } = useAPI();
  */

  const LIMIT = 1000;

  const url = "dt/v1/notifications/get_notifications";
  const request = {
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      all: true,
      page: 0,
      limit: LIMIT,
      mentions: false,
    },
  };
  const { data: notifications, error, isLoading, isValidating, mutate } = useRequest(request);
  if (error || isLoading || !notifications) return {
    data: null,
    error,
    isLoading,
    isValidating,
    mutate
  };
  let filtered = notifications.filter(item => !exclude?.includes(item?.id));
  if (filter?.query?.key && filter?.query?.value) filtered = filtered.filter(item => item?.[filter.query.key] === filter.query.value);
  //if (search && isConnected == false) filtered = searchObjList(filtered, search);
  if (search) filtered = searchObjList(filtered, search);
  return {
    data: filtered,
    error,
    isLoading,
    isValidating,
    mutate,
    //markAllNotificationsViewed,
    //markNotificationUnread,
    //markNotificationViewed,
  };
};
export default useNotifications;