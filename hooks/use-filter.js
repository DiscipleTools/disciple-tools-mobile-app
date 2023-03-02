import { useEffect, useMemo, useReducer, useState } from "react";
import * as RootNavigation from "navigation/RootNavigation";
import { useSelector, useDispatch } from "react-redux";

import useFilters from "./use-filters";
import useI18N from "./use-i18n";
import useType from "hooks/use-type";

import { setFilter } from "store/actions/user.actions";

import { TypeConstants, SubTypeConstants } from "constants";

import { getDefaultFavoritesFilter } from "helpers";

import { findFilterById } from "utils";

const useFilter = () => {
  const { i18n } = useI18N();
  const dispatch = useDispatch();
  const persistedFilters = useSelector((state) => state.userReducer.filters);
  const { isContact, isGroup, isNotification, isCommentsActivity, postType } =
    useType();

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
    if ((isContact || isGroup) && !isNotification && !isCommentsActivity) {
      return getDefaultFavoritesFilter({ i18n, type: postType });
    }
    return {
      ID: "all",
      name: i18n.t("global.all"),
      query: {
        sort: "-last_modified",
      },
    };
  };

  const getActiveFilter = () => {
    if (route?.params?.filter) return route.params.filter;
    let key = postType;
    if (isNotification) key = TypeConstants.NOTIFICATION;
    if (isCommentsActivity) key = SubTypeConstants.COMMENTS_ACTIVITY;
    if (persistedFilters && persistedFilters?.[key]) {
      const filterID = persistedFilters[key];
      // TODO: explain... necessary to ensure consistency beteween LaunchScreen, HomeScreen, and ListScreen
      if (filterID === "favorite") {
        return getDefaultFilter();
      }
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

  return {
    defaultFilter,
    filter,
    onFilter,
    search,
    onSearch,
    filterByKey,
    filterByKeyValue,
    sortByKey,
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
