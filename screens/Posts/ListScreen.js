import React, { useEffect, useReducer, useState } from "react";

import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import FAB from "components/FAB";
import { PostItem, PostItemSkeleton, PostItemHidden } from "components/Post/PostItem/index";

import useFilter from "hooks/useFilter";
import useList from "hooks/useList";
import useI18N from "hooks/useI18N";
import useType from "hooks/useType";

const ListScreen = () => {

  const { i18n } = useI18N();
  const { isContact, isGroup } = useType();

  const { filter, onFilter } = useFilter();

  // last_modified
  const defaultFilter = isContact ? {
    ID: "recent",
    // TODO: translate?
    name: "My Recently Viewed",
    query: { "sort": "-post_date" }
  } : {
    ID: "recent",
    // TODO: translate?
    name: "My Recently Viewed",
    query: { "dt_recent": "true" }
  };
  // {"ID":"recent","name":"My Recently Viewed","count":0,"subfilter":false,"query":{"dt_recent":true}}

  // initialize default filter
  useEffect(() => {
    if (!filter) onFilter(defaultFilter);
  }, [filter]);

  const { data: items, error, isLoading, isValidating, mutate } = useList();

  const renderItem = ({ item }) => <PostItem item={item} loading={isLoading||isValidating} mutate={mutate} />;
  //const renderHiddenItem = ({ item }) => <PostItemHidden item={item} loading={isLoading||isValidating} />;

  // TODO: mock search bar, filter tags, FAB, etc..
  const ListSkeleton = () => Array(10).fill(null).map((_, ii) => <PostItemSkeleton key={ii} />);

  // TODO: generic post placeholder with string template for postType
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
            //leftOpenValue={Constants.SWIPE_BTN_WIDTH * Constants.NUM_SWIPE_BUTTONS_LEFT}
            //rightOpenValue={Constants.SWIPE_BTN_WIDTH * Constants.NUM_SWIPE_BUTTONS_RIGHT}
          />
          <FAB />
        </>
      )}
    </>
  );
};
export default ListScreen;