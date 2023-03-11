import useRequest from "hooks/use-request";

// TODO: replace with lodash?
import { searchObjList } from "utils";

import { LocationsURL } from "constants/urls";

/*
 * NOTE: preemptively get all "locations" (via D.T mobile-app-plugin) and search offline
 */
const useLocations = ({ search, filter, exclude } = {}) => {
  // TODO: use standard API to pull 'used' and take complement of 'mobile-app-plugin' and display at top of list
  // FILTERS: all | focus | used
  //let url = `dt/v1/mapping_module/search_location_grid_by_name?filter=all&s=${search}`;
  //if (filter && isConnected) url += `&filter=${filter}`;
  //if (search && isConnected) url += `&s=${search}`;
  const request = {
    url: LocationsURL,
    method: "GET",
  };
  let {
    data: locations,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useRequest({ request });
  if (error || isLoading || !locations) {
    return {
      data: null,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  }
  // TODO: remove mappings and work directly from API format
  // NOTE: when using the dt-mobile-app plugin, we map to values to match the D.T theme endpoint
  const mappedLocations = {};
  mappedLocations["location_grid"] = Object.entries(
    locations?.location_grid
  ).map(([ID, name]) => ({ ID, name }));
  let filtered = mappedLocations?.location_grid?.filter(
    (item) => !exclude?.includes(item?.ID)
  );
  // filter any items marked to be excluded
  if (exclude) {
    filtered =
      filtered?.filter((location) => !exclude?.includes(location)) ?? [];
  }
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
