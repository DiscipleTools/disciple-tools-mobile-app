import React, { useEffect, useReducer, useState } from "react";
import * as RootNavigation from "navigation/RootNavigation";
import { useSelector, useDispatch } from "react-redux";

import useI18N from "hooks/use-i18n";
import useType from "hooks/use-type";

import { setFilter } from "store/actions/user.actions";

//import { SortConstants } from "constants";

const useFilter = () => {

  const dispatch = useDispatch();
  const persistedFilters = useSelector(state => state.userReducer.filters);
  const { i18n } = useI18N();
  const { isContact, isNotification, isCommentsActivity, postType } = useType();
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
    if (isContact) return { ID: "all_my_contacts" };
    return { ID: "all" };
    //return { ID: "recent" };
  };

  const getActiveFilter = () => {
    if (persistedFilters && persistedFilters[postType]) return persistedFilters[postType];
    return getDefaultFilter();
  };

  useEffect(() => {
    let filter = route?.params?.filter;
    if (filter) {
      _setFilter({ type: SET_FILTER, filter });
      return;
    };
    filter = getActiveFilter();
    _setFilter({ type: SET_FILTER, filter });
  }, [route]);

  const activeFilter = getActiveFilter();
  const defaultFilter = getDefaultFilter();

  const [filter, _setFilter] = useReducer(filterReducer, activeFilter);
  const [search, setSearch] = useState(null);
  const onSearch = (search) => setSearch(search);
  const onFilter = (filter) => {
    dispatch(setFilter({ postType, filter }));
    _setFilter({ type: SET_FILTER, filter });
  };

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