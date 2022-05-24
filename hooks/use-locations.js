//import { useDispatch, useSelector } from "react-redux";

//import useNetwork from "./use-network";
import useRequest from "hooks/use-request";

// TODO: replace with lodash?
import { searchObjList } from "utils";

/*
 * NOTE: preemptively get all "locations" (via D.T mobile-app-plugin) and search offline
 */
const useLocations = ({ search, filter, exclude } = {}) => {
  // TODO: use standard API to pull 'used' and take complement of 'mobile-app-plugin' and display at top of list
  // TODO: get from AsyncStorage?
  //const { isConnected } = useNetwork();
  //let url = "dt/v1/mapping_module/search_location_grid_by_name?filter=used";
  //if (filter && isConnected) url += `&filter=${filter}`;
  //if (search && isConnected) url += `&s=${search}`;
  let url = "dt-mobile-app/v1/locations";
  let {
    data: locations,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useRequest({ url });
  if (error || isLoading || !locations)
    return {
      data: null,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  // NOTE: when using the dt-mobile-app plugin, we map to values to match the D.T theme endpoint
  const mappedLocations = {};
  mappedLocations["location_grid"] = Object.entries(
    locations?.location_grid
  ).map(([ID, name]) => ({ ID, name }));
  let filtered = mappedLocations?.location_grid?.filter(
    (item) => !exclude?.includes(item?.ID)
  );
  //if (filtered?.length > 0 && search && isConnected == false) filtered = searchObjList(filtered, search);
  if (filtered?.length > 0 && search)
    filtered = searchObjList(filtered, search);
  return {
    data: filtered,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useLocations;
