import { useAuth } from "hooks/useAuth";
import useAPI from "hooks/useAPI";
import useRequest from "hooks/useRequest";
import useToast from "hooks/useToast";

const useNotifications = () => {
  //const { uid } = useAuth();
  const toast = useToast();

  /*
  const {
    markAllNotificationsViewed,
    markNotificationUnread,
    markNotificationViewed
  } = useAPI();
  */

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
      limit: 10,
      mentions: true,
    },
  };
  const { data, error, isLoading, isValidating, mutate } = useRequest(request);
  console.log("*** NOTIFICATIONS ***");
  console.log(JSON.stringify(data));
  return {
    data,
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
