import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  View,
} from "react-native";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import Placeholder from "components/Placeholder";

import useStyles from "hooks/use-styles";

import Constants from "constants";

import { localStyles } from "./FilterList.styles";

const FilterList = ({
  isFlashList,
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
  if (!items) return <SafeAreaView style={styles.container} />;
  return (
    <View style={[styles.container, style]}>
      {onSearch && (
        <SearchBar
          sortable={sortable}
          search={search}
          onSearch={onSearch}
          filter={filter}
          onFilter={onFilter}
        />
      )}
      {onFilter && (
        <FilterBar
          display={display}
          items={items}
          defaultFilter={defaultFilter}
          filter={filter}
          onFilter={onFilter}
        />
      )}
      {isFlashList ? (
        <FlashList
          keyExtractor={keyExtractor}
          data={items}
          renderItem={renderItem}
          ListEmptyComponent={<Placeholder placeholder={placeholder} />}
          refreshControl={
            <RefreshControl refreshing={_refreshing} onRefresh={_onRefresh} />
          }
          contentContainerStyle={globalStyles.screenGutter}
          // Performance settings
          getItemLayout={getItemLayout}
          estimatedItemSize={200}
        />
      ) : (
        <FlatList
          keyExtractor={keyExtractor}
          data={items}
          renderItem={renderItem}
          ListEmptyComponent={<Placeholder placeholder={placeholder} />}
          refreshControl={
            <RefreshControl refreshing={_refreshing} onRefresh={_onRefresh} />
          }
          contentContainerStyle={globalStyles.screenGutter}
          // Performance settings
          getItemLayout={getItemLayout}
          estimatedItemSize={200}
        />
      )}
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
