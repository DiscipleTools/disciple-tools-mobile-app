import React, { useState, useCallback } from "react";
import { RefreshControl, Text, View } from "react-native";
import PropTypes from "prop-types";

// (recommended by native base (https://docs.nativebase.io/Components.html#swipeable-multi-def-headref))
import { SwipeListView } from "react-native-swipe-list-view";

import SearchBar from "./SearchBar";

import useI18N from "hooks/useI18N";

import { styles } from "./FilterList.styles";

const FilterList = ({
  items,
  renderItem,
  renderHiddenItem,
  onRefresh,
  placeholder,
  leftOpenValue,
  rightOpenValue,
  onRowDidOpen,
  onRowDidClose,
  search,
  onSearch,
  filter,
  onFilter
}) => {

  const { i18n } = useI18N();

  const [refreshing, setRefreshing] = useState(false);

  const _onRefresh = useCallback(() => {
    setRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  });

  const listItemSeparator = () => <View style={styles.listItemSeparator} />;

  const Tags = () => (
    <View style={styles.tags}>
      { search && (
        <Text style={styles.chip}>{search}</Text>
      )}
      { filter?.name && (
        <Text style={styles.chip}>{filter?.name}</Text>
      )}
    </View>
  );

  const Placeholder = () => {
    const defaultPlaceholder = i18n.t("global.placeholder");
    return(
      <View style={styles.background}>
        <Text style={styles.placeholder}>{placeholder ?? defaultPlaceholder}</Text>
      </View>
    );
  };

  return (
    <>
      <SearchBar onSearch={onSearch} filter={filter} onFilter={onFilter} />
      <Tags />
      {(items && items?.length === 0) ? (
        <Placeholder />
      ) : (
        <SwipeListView
          data={items}
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
          ItemSeparatorComponent={listItemSeparator}
          keyExtractor={(item) => item?.ID?.toString()}
          //extraData={}
          //ListFooterComponent={}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
          style={styles.background}
        />
      )}
    </>
  );
};
FilterList.propTypes = {
  //items: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderItem: PropTypes.func.isRequired,
};
export default FilterList;
