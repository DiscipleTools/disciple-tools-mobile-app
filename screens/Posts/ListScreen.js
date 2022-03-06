import React from "react";

import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import FAB from "components/FAB";
import { PostItem, PostItemSkeleton, PostItemHidden } from "components/Post/PostItem/index";

import useFilter from "hooks/useFilter";
import useList from "hooks/useList";

const ListScreen = () => {

  const { defaultFilter, filter, onFilter, search, onSearch } = useFilter();

  const { data: items, error, isLoading, isValidating, mutate } = useList({ search, filter });
  // TODO: handler error case

  const renderItem = ({ item }) => <PostItem item={item} loading={isLoading||isValidating} mutate={mutate} />;
  //const renderHiddenItem = ({ item }) => <PostItemHidden item={item} loading={isLoading||isValidating} />;

  // TODO: mock search bar, filter tags, FAB, etc..
  const ListSkeleton = () => Array(10).fill(null).map((_, ii) => <PostItemSkeleton key={ii} />);

  return (
    <>
      <OfflineBar />
      {!items ? (
        <ListSkeleton />
      ) : (
        <>
          <FilterList
            display
            sortable
            items={items}
            renderItem={renderItem}
            //renderHiddenItem={renderHiddenItem}
            search={search}
            onSearch={onSearch}
            defaultFilter={defaultFilter}
            filter={filter}
            onFilter={onFilter}
            onRefresh={mutate}
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