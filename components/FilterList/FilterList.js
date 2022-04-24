import React, { useState, useCallback, useEffect } from "react";
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

  const [_items, _setItems] = useState(null);

  useEffect(() => {
    _setItems(items);
  }, [items?.length, JSON.stringify(items?.[0])]);

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

  const ScrollList = (props) => {
    const LIMIT = 100;
    const [offset, setOffset] = useState(LIMIT);
    return(
      <SwipeListView
        //initialNumToRender={offset}
        data={_items}
        //data={_items.splice(0, offset)}
        {...props}
        /*
        onEndReached={() => { 
          console.log("*** ON END REACHED")
          if (_items?.length > offset) {
            setOffset(offset + LIMIT);
          };
        }}
        onEndReachedThreshold={0.5}
        */
      />
    );
  };

  if (!items) return null;
  return (
    <SafeAreaView style={[
      styles.gutter,
      style
    ]}>
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
        <ScrollList
          renderItem={renderItem}
          getItemLayout={(data, index) => ({
            length: Constants.LIST_ITEM_HEIGHT,
            offset: Constants.LIST_ITEM_HEIGHT * index, index
          })}
          renderHiddenItem={renderHiddenItem ?? null}
          leftOpenValue={leftOpenValue}
          rightOpenValue={leftOpenValue}
          onRowDidOpen={(item) => {
            onRowDidOpen === undefined ? null : onRowDidOpen(item);
          }}
          onRowDidClose={(item) => {
            onRowDidClose === undefined ? null : onRowDidClose(item);
          }}
          keyExtractor={keyExtractor}
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
        />
      )}
    </SafeAreaView>
  );
};
export default FilterList;