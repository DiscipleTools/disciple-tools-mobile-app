import React, { useState, useCallback, useEffect } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import SearchBar from "./SearchBar";
import FilterOptions from "./FilterOptions";

import useI18N from "hooks/useI18N";
import useStyles from "hooks/useStyles";
import useType from "hooks/useType";

import { localStyles } from "./FilterList.styles";

const FilterList = ({
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
    <Text style={[globalStyles.text, styles.count]}>
      {items?.length}
    </Text>
  );

  // TODO: component, translate, and styles
  const FilterBar = () => {
    return(
      <View
        style={styles.filtersScrollContainer}
      >
        <ScrollView
          horizontal
          contentContainerStyle={styles.filtersContentContainer}
        >
          <FilterOptions
            defaultFilter={defaultFilter}
            filter={filter}
            onFilter={onFilter}
          />
        </ScrollView>
        <View style={[
          globalStyles.rowContainer,
          { paddingVertical: 5 }
        ]}>
          <Count />
          <View>
            <Text style={styles.filterSelections}>Filtering: My Recently Viewed</Text>
            <Text style={styles.filterSelections}> Sorting: Last Modified Date - Most Recent</Text>
          </View>
        </View>
      </View>
    );
  };

  const Placeholder = () => {
    const { isContact, isGroup } = useType();
    const getDefaultPlaceholder = () => {
      if (isContact) return i18n.t("contactsScreen.noContactPlacheHolder");
      if (isGroup) return i18n.t("groupsScreen.noGroupPlacheHolder");
      return i18n.t("global.placeholder");
    };
    const defaultPlaceholder = getDefaultPlaceholder();
    return(
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>{placeholder ?? defaultPlaceholder}</Text>
      </View>
    );
  };

  return (
    <>
      { onSearch && (
        <SearchBar
          sortable={sortable}
          search={search}
          onSearch={onSearch}
        />
      )}
      { onFilter && (
        <FilterBar />
      )}
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
export default FilterList;
