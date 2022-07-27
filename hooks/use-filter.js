import { useEffect, useMemo, useReducer, useState } from "react";
import * as RootNavigation from "navigation/RootNavigation";
import { useSelector, useDispatch } from "react-redux";

import useFilters from "./use-filters";
import useType from "hooks/use-type";

import { setFilter } from "store/actions/user.actions";

import { TypeConstants, SubTypeConstants } from "constants";

import { findFilterById } from "utils";

const useFilter = () => {
  const dispatch = useDispatch();
  const persistedFilters = useSelector((state) => state.userReducer.filters);
  const { isContact, isNotification, isCommentsActivity, postType } = useType();
  const route = RootNavigation.getRoute();

  const { data: filters } = useFilters({ type: postType });

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
    for (let ii = 0; ii < filters?.length; ii++) {
      const filterType = filters[ii];
      for (let jj = 0; jj < filterType?.content?.length; jj++) {
        const filter = filterType.content[jj];
        // TODO: constants?
        if (
          (isContact && filter?.ID === "all_my_contacts") ||
          filter?.ID === "all"
        ) {
          return filter;
        }
      }
    }
    //return null;
    //return { ID: "recent" };
    return { ID: "all" };
  };

  const getActiveFilter = () => {
    if (route?.params?.filter) return route.params.filter;
    let key = postType;
    if (isNotification) key = TypeConstants.NOTIFICATION;
    if (isCommentsActivity) key = SubTypeConstants.COMMENTS_ACTIVITY;
    if (persistedFilters && persistedFilters[key]) {
      const filterID = persistedFilters[key];
      const _filter = findFilterById(filterID, filters);
      if (_filter) return _filter;
    }
    return getDefaultFilter();
  };

  useEffect(() => {
    const filter = getActiveFilter();
    _setFilter({ type: SET_FILTER, filter });
  }, [route?.params?.filter]);

  const activeFilter = getActiveFilter();
  const defaultFilter = getDefaultFilter();

  const [filter, _setFilter] = useReducer(filterReducer, activeFilter);
  const [search, setSearch] = useState(null);
  const onSearch = (search) => setSearch(search);
  const onFilter = (filter) => {
    let key = postType;
    if (isNotification) key = TypeConstants.NOTIFICATION;
    if (isCommentsActivity) key = SubTypeConstants.COMMENTS_ACTIVITY;
    dispatch(setFilter({ key, filter: filter?.ID }));
    _setFilter({ type: SET_FILTER, filter });
  };

  const filterByKey = (items, key) => {
    if (!key || !value) return items;
    return items.filter((item) => item.hasOwnProperty(key));
  };

  const filterByKeyValue = (items, key, value) => {
    if (!key || !value) return items;
    return items.filter((item) => item?.[key] === value);
  };

  const sortByKey = (items, key) => {
    items.sort((a, b) => b[key] - a[key]);
  };

  return useMemo(
    () => ({
      defaultFilter,
      filter,
      onFilter,
      search,
      onSearch,
      filterByKey,
      filterByKeyValue,
      sortByKey,
    }),
    [defaultFilter?.ID, filter?.ID, search, postType]
  );
};
export default useFilter;
