import React, { createContext, useContext, useMemo, useReducer, useState } from "react";
import { useSWRConfig } from "swr";

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const filterContext = useFilterContext();
  return(
    <FilterContext.Provider value={filterContext}>
      {children}
    </FilterContext.Provider>
  );
};

const useFilter = () => useContext(FilterContext);

const useFilterContext = () => {

  const { cache } = useSWRConfig();

  const SET_FILTER = "SET_FILTER";

  const filterReducer = (state, action) => {
    switch (action.type) {
      case SET_FILTER:
        return action?.filter;
      default:
        return state;
    }
  };

  const [filter, dispatch] = useReducer(filterReducer, null);

  // NOTE: this is the SWR key for retrieving cached items to filter/sort
  const [key, setKey] = useState(null);

  const [search, setSearch] = useState(null);

  const onSearch = (search) => setSearch(search);
  const onFilter = (filter) => {
    dispatch({ type: SET_FILTER, filter });
  };

  const items = () => cache.get(key);

  // TODO: implement
  const setItems = (items) => null; //{
  //  if (!isOnline) mutate(key, items, false);
  //};

  return {
    key,
    setKey,
    items,
    setItems,
    filter,
    onFilter,
    search,
    onSearch,
  };
};
export default useFilter;
