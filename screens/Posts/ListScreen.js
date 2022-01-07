import React, { useCallback, useReducer, useState } from "react";
import { Container } from "native-base";

import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import FAB from "components/FAB";
// TODO
import { PostItem, PostItemHidden } from "components/Post/PostItem/index";
import PostItemSkeleton from "components/Post/PostItem/PostItemSkeleton";

import useList from "hooks/useList";
import useI18N from "hooks/useI18N";
//import useToast  from "hooks/useToast";
import useType from "hooks/useType";

import Constants from "constants";

const ListScreen = () => {

  const { i18n } = useI18N();
  //const toast = useToast();
  const { isContact, isGroup, postType } = useType();

  const [search, setSearch] = useState(null);

  const filterReducer = (state, action) => {
    switch (action.type) {
      case "SET_FILTER":
        //console.log(`filter: SET_FILTER: ${JSON.stringify(action?.filter)}`);
        return action?.filter;
      default:
        return state;
    }
  };

  const defaultFilter = {
    ID: null,
    name: "All",
    query: { "sort": "name" }
  };
  if (isContact) {
    defaultFilter["name"] = "Last 30 viewed";
    defaultFilter["query"] = null;
  };
  if (isGroup) defaultFilter["query"] = { "sort":"group_type" };

  const [filter, dispatchFilter] = useReducer(filterReducer, defaultFilter);

  const onSearch = (search) => setSearch(search);
  const onFilter = (filter) => dispatchFilter({ type: "SET_FILTER", filter });

  const { data: items, error, isLoading, isValidating, mutate } = useList({ search, filter: filter?.query });

  let isError = false;
  if (error) {
    isError = true;
    // TODO
    //toast(error, true);
    console.error(error);
  };

  const renderItem = ({ item }) => <PostItem item={item} loading={isLoading||isValidating||isError} mutate={mutate} />;
  /*
  const renderItem = ({ item }) => {
    if (isLoading||isValidating||isError) <PostItemSkeleton />;
    return <PostItem item={item} loading={isLoading||isValidating||isError} mutate={mutate} />;
  };
  */
  //const renderHiddenItem = ({ item }) => <PostItemHidden item={item} loading={isLoading||isValidating||isError} />;

  //const NUM_SWIPE_BUTTONS_LEFT = 2;
  //const NUM_SWIPE_BUTTONS_RIGHT = 0;

  // TODO: mock search bar, FAB, etc..
  const ListSkeleton = () => Array(10).fill(null).map((_, ii) => <PostItemSkeleton key={ii} />);

  return (
    <>
      <OfflineBar />
      {!items ? (
        <ListSkeleton />
      ) : (
        <>
          <FilterList
            items={items}
            renderItem={renderItem}
            //renderHiddenItem={renderHiddenItem}
            onRefresh={mutate}
            placeholder={i18n.t("listScreen.placeholder", { postType })}
            //leftOpenValue={Constants.SWIPE_BTN_WIDTH * NUM_SWIPE_BUTTONS_LEFT}
            //rightOpenValue={Constants.SWIPE_BTN_WIDTH * NUM_SWIPE_BUTTONS_RIGHT}
            search={search}
            onSearch={onSearch}
            filter={filter}
            onFilter={onFilter}
          />
          <FAB />
        </>
      )}
    </>
  );
};
export default ListScreen;