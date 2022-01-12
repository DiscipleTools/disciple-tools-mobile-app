import React, { useReducer, useState } from "react";

import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import FAB from "components/FAB";
import { PostItem, PostItemSkeleton, PostItemHidden } from "components/Post/PostItem/index";

import useList from "hooks/useList";
import useI18N from "hooks/useI18N";
import useToast  from "hooks/useToast";
import useType from "hooks/useType";

const ListScreen = () => {

  const toast = useToast();
  const { i18n } = useI18N();
  const { isContact, isGroup } = useType();

  const [search, setSearch] = useState(null);

  const SET_FILTER = "SET_FILTER";

  const filterReducer = (state, action) => {
    switch (action.type) {
      case SET_FILTER:
        return action?.filter;
      default:
        return state;
    }
  };

  const defaultFilter = {
    ID: -1,
    name: "All",
    query: { "sort": "name" }
  };

  if (isContact) {
    defaultFilter["name"] = "Last 20 viewed";
    defaultFilter["query"] = null;
  };

  if (isGroup) {
    defaultFilter["query"] = { "sort":"group_type" };
  };

  const [filter, dispatchFilter] = useReducer(filterReducer, defaultFilter);

  const onSearch = (search) => setSearch(search);
  const onFilter = (filter) => dispatchFilter({ type: SET_FILTER, filter: filter ?? defaultFilter });

  const { data: items, error, isLoading, isValidating, mutate } = useList({ search, filter: filter?.query });

  if (error) {
    // if legit error, reset to defaults
    if (filter?.ID !== -1) {
      onFilter(defaultFilter);
      if (search !== null) onSearch(null);
      // TODO: translate
      toast("Unable to retrieve based on Search/Filter criteria. Resetting to default", true);
    };
  };

  const renderItem = ({ item }) => <PostItem item={item} loading={isLoading||isValidating} mutate={mutate} />;
  //const renderHiddenItem = ({ item }) => <PostItemHidden item={item} loading={isLoading||isValidating} />;
  //const NUM_SWIPE_BUTTONS_LEFT = 2;
  //const NUM_SWIPE_BUTTONS_RIGHT = 0;

  // TODO: mock search bar, filter tags, FAB, etc..
  const ListSkeleton = () => Array(10).fill(null).map((_, ii) => <PostItemSkeleton key={ii} />);

  const placeholder = isContact ? i18n.t("contactsScreen.noContactPlacheHolder") : i18n.t("groupsScreen.noGroupPlacheHolder");
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
            placeholder={placeholder}
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