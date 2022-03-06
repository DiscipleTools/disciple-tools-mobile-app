import React, { useReducer, useState } from "react";

import useType from "hooks/useType";

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
      query: { "dt_recent": "true" }
    };
  };

  const defaultFilter = getDefaultFilter();
  const [filter, dispatch] = useReducer(filterReducer, defaultFilter);

  const [search, setSearch] = useState(null);

  const onSearch = (search) => setSearch(search);
  const onFilter = (filter) => {
    dispatch({ type: SET_FILTER, filter });
  };

  return {
    defaultFilter,
    filter,
    onFilter,
    search,
    onSearch,
  };
};
export default useFilter;