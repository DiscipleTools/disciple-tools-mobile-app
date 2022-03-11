import React, { useReducer, useState } from "react";

import useType from "hooks/use-type";

import { SortConstants } from "constants";

const useFilter = () => {
  const { isContact, isGroup } = useType();

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
    // {"ID":"recent","name":"My Recently Viewed","count":0,"subfilter":false,"query":{"dt_recent":true}}
    // last_modified
    /*
    if (isContact) return {
      ID: "recent",
      // TODO: translate?
      name: "My Recently Viewed",
      query: { "sort": "-post_date" }
    };
    */
    //if (isGroup) return {};
    return {
      ID: "recent",
      // TODO: translate?
      name: "My Recently Viewed",
      //count: 0,
      //subfilter: false,
      query: {
        "dt_recent": "true",
        sort: SortConstants.LAST_MOD_DESC
      }
    };
  };
  const defaultFilter = getDefaultFilter();
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