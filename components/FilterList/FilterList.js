import React, { useState, useCallback, useEffect } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
// (recommended by native base (https://docs.nativebase.io/Components.html#swipeable-multi-def-headref))
import { SwipeListView } from "react-native-swipe-list-view";

import SearchBar from "./SearchBar";
import FilterOptions from "./FilterOptions";

import useI18N from "hooks/useI18N";
import useStyles from "hooks/useStyles";

import { localStyles } from "./FilterList.styles";

import PropTypes from "prop-types";

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
}) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();

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

  const Count = () => (
    <Text style={[globalStyles.text, styles.count]}>({items?.length})</Text>
  );

  const Filters = () => {
    return(
      <ScrollView
        horizontal
        style={styles.filtersScrollContainer}
        contentContainerStyle={styles.filtersContentContainer}
      >
        <Count />
        <FilterOptions />
      </ScrollView>
    );
  };

  const Placeholder = () => {
    const defaultPlaceholder = i18n.t("global.placeholder");
    return(
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>{placeholder ?? defaultPlaceholder}</Text>
      </View>
    );
  };

  return (
    <>
      <SearchBar
        sortable
        items={_items}
        setItems={_setItems}
      />
      <Filters />
      {items?.length === 0 ? (
        <Placeholder />
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
FilterList.propTypes = {
  //items: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderItem: PropTypes.func.isRequired,
};
export default FilterList;
