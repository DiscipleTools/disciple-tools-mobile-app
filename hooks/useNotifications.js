import { useAuth } from 'hooks/useAuth';
import useRequest from 'hooks/useRequest';
import useToast from 'hooks/useToast';

const useNotifications = () => {

  const { uid } = useAuth();
  const toast = useToast();

  // TODO: D.T API throwing 500 error
  const url = 'dt/v1/notifications/get_notifications';
  // TODO: useSWRInfinity: https://swr.vercel.app/examples/infinite-loading
  const request = {
    url,
    method: "POST",
    data: {
      all: true,
      limit: 20,
      page: 0,
    },
  };
  const { fetch, data, error, isLoading, isValidating, mutate } = useRequest(request);
  console.log(error);

  const mark = async(url) => {
    try {
      await fetch({ url });
    } catch (error) {
      toast(error, true);
    }
  };

  //const markAllViewed = async() => mark(`dt/v1/notifications/mark_all_viewed/${uid}`);
  const markViewed = async(nid) => mark(`dt/v1/notifications/mark_viewed/${nid}`);
  const markUnread = async(nid) => mark(`dt/v1/notifications/mark_unread/${nid}`);

  return {
    notifications: data,
    error,
    isLoading,
    isValidating,
    mutate,
    //markAllViewed,
    markViewed,
    markUnread
  };
};
export default useNotifications;
