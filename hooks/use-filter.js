import React, { useEffect, useReducer, useState } from "react";
import * as RootNavigation from "navigation/RootNavigation";

//import useType from "hooks/use-type";

import { SortConstants } from "constants";

const useFilter = () => {

  //const { isContact, isGroup } = useType();
  const route = RootNavigation.getRoute();

  const SET_FILTER = "SET_FILTER";

  const filterReducer = (state, action) => {
    switch (action.type) {
      case SET_FILTER:
        return action?.filter;
      default:
        return state;
    }
  };

  const getDefaultFilter = () => {
    return {
      ID: "recent",
      /*
      name: "My Recently Viewed",
      query: {
        "dt_recent": "true",
        sort: SortConstants.LAST_MOD_DESC
      }
      */
    };
  };
  const defaultFilter = getDefaultFilter();

  useEffect(() => {
    let filter = route?.params?.filter;
    if (filter) {
      dispatch({ type: SET_FILTER, filter });
      return;
    };
    filter = getDefaultFilter();
    dispatch({ type: SET_FILTER, filter });
  }, [route]);

  const [filter, dispatch] = useReducer(filterReducer, defaultFilter);
  const [search, setSearch] = useState(null);
  const onSearch = (search) => setSearch(search);
  const onFilter = (filter) => dispatch({ type: SET_FILTER, filter });

  const filterByKey = (items, key) => {
    if (!key || !value) return items;
    return items.filter(item => item.hasOwnProperty(key));
  };

  const filterByKeyValue = (items, key, value) => {
    if (!key || !value) return items;
    return items.filter(item => item?.[key] === value);
  };

  const sortByKey = (items, key) => {
    items.sort((a,b) =>  b[key]-a[key]);
  };

  return {
    defaultFilter,
    filter,
    onFilter,
    search,
    onSearch,
    filterByKey,
    filterByKeyValue,
    sortByKey
  };
};
export default useFilter;