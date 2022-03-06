//import { useDispatch, useSelector } from "react-redux";

//import useNetwork from "./use-network";
import useRequest from "hooks/useRequest";

import { searchObjList } from "utils";

/*
 * NOTE: preemptively get all "people groups" and search offline
 */
const usePeopleGroups = ({ search, exclude }) => {
  let url = "dt/v1/people-groups/compact";
  //const { isConnected } = useNetwork();
  //if (search && isConnected) url += `?s=${search}`;
  const { data: peopleGroups, error, isLoading, isValidating } = useRequest({ url });
  if (error || isLoading || !peopleGroups?.posts) return [];

  let filtered = peopleGroups.posts.filter(item => !exclude?.includes(String(item?.ID)));
  //if (filtered?.length > 0 && search && isConnected == false) filtered = searchObjList(filtered, search);
  if (filtered?.length > 0 && search) filtered = searchObjList(filtered, search);
  return filtered;
};
export default usePeopleGroups;