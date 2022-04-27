import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, RefreshControl, Text, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import Placeholder from "components/Placeholder";

import useStyles from "hooks/use-styles";

import Constants from "constants";

import { localStyles } from "./FilterList.styles";

const FilterList = ({
  display,
  sortable,
  items,
  renderItem,
  renderHiddenItem,
  keyExtractor,
  search,
  onSearch,
  defaultFilter,
  filter,
  onFilter,
  onRefresh,
  placeholder,
  leftOpenValue,
  rightOpenValue,
  onRowDidOpen,
  onRowDidClose,
  style
}) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const [refreshing, setRefreshing] = useState(false);

  const [_items, setItems] = useState(items);

  const _onRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
      return;
    };
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  });

  const getItemLayout = useCallback((data, index) => ({
    length: Constants.LIST_ITEM_HEIGHT,
    offset: Constants.LIST_ITEM_HEIGHT * index, index
  }), []);

  if (!_items) return null;
  return (
    <SafeAreaView style={[
      styles.gutter,
      style
    ]}>
      { onSearch && (
        <SearchBar
          sortable={sortable}
          items={_items}
          setItems={setItems}
          search={search}
          onSearch={onSearch}
          filter={filter}
          onFilter={onFilter}
        />
      )}
      { onFilter && (
        <FilterBar
          display={display}
          items={_items}
          defaultFilter={defaultFilter}
          filter={filter}
          onFilter={onFilter}
        />
      )}
      {items && items?.length === 0 ? (
        <View style={styles.container}>
          <Placeholder placeholder={placeholder} />
        </View>
      ) : (
        <SwipeListView
          keyExtractor={keyExtractor}
          data={_items}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem ?? null}
          leftOpenValue={leftOpenValue}
          rightOpenValue={leftOpenValue}
          onRowDidOpen={(item) => {
            onRowDidOpen === undefined ? null : onRowDidOpen(item);
          }}
          onRowDidClose={(item) => {
            onRowDidClose === undefined ? null : onRowDidClose(item);
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_onRefresh}
              //colors={globalStyles.refreshControl.color}
              //tintColor={globalStyles.refreshControl.color}
            />
          }
          disableScrollViewPanResponder={true}
          style={styles.container}
          contentContainerStyle={globalStyles.screenGutter}
          // Performance settings
          getItemLayout={getItemLayout}
          //removeClippedSubviews={true} // Unmount components when outside of window
          //maxToRenderPerBatch={10} // Reduce number in each render batch
          //updateCellsBatchingPeriod={50} // Increase time between renders
          //initialNumToRender={10} // Reduce initial render amount
          windowSize={3} // Reduce the window size
        />
      )}
    </SafeAreaView>
  );
};
export default FilterList;