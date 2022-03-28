import React, { useEffect, useReducer, useState } from "react";
import * as RootNavigation from "navigation/RootNavigation";

import useI18N from "hooks/use-i18n";
import useType from "hooks/use-type";

//import { SortConstants } from "constants";

const useFilter = () => {

  const { i18n } = useI18N();
  const { isNotification, isCommentsActivity } = useType();
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
    if (isNotification || isCommentsActivity) return {
      ID: "all",
      name: i18n.t("global.all"),
      query: null,
      subfilter: false 
    };
    return { ID: "recent" };
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