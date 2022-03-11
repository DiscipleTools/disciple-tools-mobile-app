import useSWR from "swr";
import axios from "services/axios";
/*
 * NOTE: useRequest serves as an abstraction in case we want to swap SWR for another library
 */
const useRequest = (request, options={}) => {
  const key = request && request?.url && JSON.stringify(request) ? request.url : null;
  const fetcher = request => axios(request).then(res => res.data);
  return useSWR(key,
    () => fetcher(request),
    options);
};
export default useRequest;