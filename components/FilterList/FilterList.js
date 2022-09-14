import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, RefreshControl, View } from "react-native";
//import { FlashList } from "@shopify/flash-list";
import { FlatList } from "react-native";

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
  style,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);

  const [refreshing, setRefreshing] = useState(false);

  const [_items, setItems] = useState(null);

  useEffect(() => {
    if (JSON.stringify(items) !== JSON.stringify(_items)) {
      setItems(items);
    }
  }, [JSON.stringify(items)]);

  const _onRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
      return;
    }
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  });

  const getItemLayout = useCallback(
    (data, index) => ({
      length: Constants.LIST_ITEM_HEIGHT,
      offset: Constants.LIST_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  // TODO: actual skeleton component for post lists
  if (!_items) return <SafeAreaView style={styles.container} />;
  return (
    <SafeAreaView style={[styles.container, style]}>
      {onSearch && (
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
      {onFilter && (
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
        <FlatList
          keyExtractor={keyExtractor}
          data={_items}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
          style={styles.container}
          contentContainerStyle={globalStyles.screenGutter}
          /*
          contentContainerStyle={{
            ...globalStyles.screenGutter,
            ...styles.container,
          }}
          */
          // Performance settings
          getItemLayout={getItemLayout}
          estimatedItemSize={200}
        />
      )}
    </SafeAreaView>
  );
};
export default FilterList;
