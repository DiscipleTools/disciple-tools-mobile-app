import React, { useState, useCallback, useEffect } from "react";
import { RefreshControl, Text, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import Placeholder from "components/Placeholder";

import useStyles from "hooks/use-styles";

import { localStyles } from "./FilterList.styles";

const FilterList = ({
  display,
  sortable,
  items,
  renderItem,
  renderHiddenItem,
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
}) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const [refreshing, setRefreshing] = useState(false);

  const [_items, _setItems] = useState(null);

  useEffect(() => {
    _setItems(items);
  }, [items]);

  const _onRefresh = useCallback(() => {
    setRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  });

  return (
    <>
      { onSearch && (
        <SearchBar
          sortable={sortable}
          items={_items}
          setItems={_setItems}
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
      {_items && _items?.length === 0 ? (
        <View style={styles.container}>
          <Placeholder placeholder={placeholder} />
        </View>
      ) : (
        <SwipeListView
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
          keyExtractor={(item) => item?.ID?.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_onRefresh}
              //colors={globalStyles.refreshControl.color}
              //tintColor={globalStyles.refreshControl.color}
            />
          }
          style={styles.container}
        />
      )}
    </>
  );
};
export default FilterList;
