import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  View,
} from "react-native";
//import { FlashList } from "@shopify/flash-list";
//import { FlatList } from "react-native";
// ref: https://gorhom.github.io/react-native-bottom-sheet/troubleshooting/#adding-horizontal-flatlist-or-scrollview-is-not-working-properly-on-android
import { FlatList } from "react-native-gesture-handler";

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
  refreshing,
  onRefresh,
  placeholder,
  leftOpenValue,
  rightOpenValue,
  onRowDidOpen,
  onRowDidClose,
  footer,
  style,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);

  const [_refreshing, _setRefreshing] = useState(refreshing ?? false);

  const [_items, setItems] = useState([]);

  useEffect(() => {
    if (items?.length !== _items?.length) {
      setItems(items);
    }
  }, [items]);

  const _onRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
      return;
    }
    _setRefreshing(true);
    setTimeout(() => {
      _setRefreshing(false);
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
    <View style={[styles.container, style]}>
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
      <FlatList
        keyExtractor={keyExtractor}
        data={_items}
        renderItem={renderItem}
        ListEmptyComponent={<Placeholder placeholder={placeholder} />}
        refreshControl={
          <RefreshControl refreshing={_refreshing} onRefresh={_onRefresh} />
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
      {refreshing && (
        <View style={globalStyles.activityIndicator}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
};
export default FilterList;
