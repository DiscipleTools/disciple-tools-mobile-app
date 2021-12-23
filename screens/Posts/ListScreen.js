import React, { useCallback, useReducer, useState } from "react";
import { Container } from "native-base";

import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import FAB from "components/FAB";
import { PostItem, PostItemHidden } from "components/PostItem";

//import useFilters from "hooks/useFilters";
import useList from "hooks/useList";
import useI18N from "hooks/useI18N";
import useNetworkStatus from "hooks/useNetworkStatus";
import useToast  from "hooks/useToast";
import useType from "hooks/useType";

import Constants from "constants";

const ListScreen = () => {

  const { i18n } = useI18N();
  const isConnected = useNetworkStatus();
  const toast = useToast();
  const { postType } = useType();

  const [search, setSearch] = useState(null);

  const filterReducer = (state, action) => {
    switch (action.type) {
      case "SET_FILTER":
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

  const { data: items, error, isLoading, isValidating, mutate } = useList({ search, filter: filter?.query });

  let isError = false;
  if (error) {
    isError = true;
    // TODO
    //toast(error, true);
    console.error(error);
  };

  const renderItem = ({ item }) => <PostItem item={item} loading={isLoading||isValidating||isError} />;
  const renderHiddenItem = ({ item }) => <PostItemHidden item={item} loading={isLoading||isValidating||isError} />;

  const NUM_SWIPE_BUTTONS_LEFT = 2;
  const NUM_SWIPE_BUTTONS_RIGHT = 0;

  return (
    <Container>
      {!isConnected && <OfflineBar />}
      <FilterList
        items={items}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        onRefresh={mutate}
        placeholder={i18n.t("listScreen.placeholder", { postType })}
        //placeholder={i18n.t("global.placeholder")}
        leftOpenValue={Constants.SWIPE_BTN_WIDTH * NUM_SWIPE_BUTTONS_LEFT}
        rightOpenValue={Constants.SWIPE_BTN_WIDTH * NUM_SWIPE_BUTTONS_RIGHT}
        search={search}
        onSearch={onSearch}
        filter={filter}
        onFilter={onFilter}
      />
      <FAB />
    </Container>
  );
};
export default ListScreen;