import React, { useCallback, useReducer, useState } from "react";
import { Container } from "native-base";

import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import FAB from "components/FAB";
import { PostItem, PostItemHidden } from "components/Post/PostItem/index";

import useList from "hooks/useList";
import useI18N from "hooks/useI18N";
//import useToast  from "hooks/useToast";
import useType from "hooks/useType";

import Constants from "constants";

const ListScreen = () => {

  const { i18n } = useI18N();
  //const toast = useToast();
  const { postType } = useType();

  const [search, setSearch] = useState(null);

  const filterReducer = (state, action) => {
    switch (action.type) {
      case "SET_FILTER":
        console.log(`filter: SET_FILTER: ${JSON.stringify(action?.filter)}`);
        return action?.filter;
      default:
        return state;
    }
  };

  const [filter, dispatchFilter] = useReducer(filterReducer, {
    ID: null,
    name: null,
    query: null
  });

  const onSearch = (search) => setSearch(search);
  const onFilter = (filter) => dispatchFilter({ type: "SET_FILTER", filter });

  console.log(`filter.query: ${JSON.stringify(filter?.query)}`);

  const { data: items, error, isLoading, isValidating, mutate } = useList({ search, filter: filter?.query });

  let isError = false;
  if (error) {
    isError = true;
    // TODO
    //toast(error, true);
    console.error(error);
  };

  const renderItem = ({ item }) => <PostItem item={item} loading={isLoading||isValidating||isError} mutate={mutate} />;
  const renderHiddenItem = ({ item }) => <PostItemHidden item={item} loading={isLoading||isValidating||isError} />;

  const NUM_SWIPE_BUTTONS_LEFT = 2;
  const NUM_SWIPE_BUTTONS_RIGHT = 0;

  return (
    <>
      <OfflineBar />
      <FilterList
        items={items}
        renderItem={renderItem}
        //renderHiddenItem={renderHiddenItem}
        onRefresh={mutate}
        placeholder={i18n.t("listScreen.placeholder", { postType })}
        leftOpenValue={Constants.SWIPE_BTN_WIDTH * NUM_SWIPE_BUTTONS_LEFT}
        rightOpenValue={Constants.SWIPE_BTN_WIDTH * NUM_SWIPE_BUTTONS_RIGHT}
        search={search}
        onSearch={onSearch}
        filter={filter}
        onFilter={onFilter}
      />
      <FAB />
    </>
  );
};
export default ListScreen;