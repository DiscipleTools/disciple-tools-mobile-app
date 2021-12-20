import React, { useState, useCallback } from "react";
import { RefreshControl, Text, View, useWindowDimensions } from "react-native";
import PropTypes from "prop-types";

// Component Library (Native Base)
// (recommended by native base (https://docs.nativebase.io/Components.html#swipeable-multi-def-headref))
import { SwipeListView } from "react-native-swipe-list-view";

// Expo

// Custom Hooks
import useI18N from "hooks/useI18N";
import useType from "hooks/useType.js";

// Custom Components
import SearchBar from "./SearchBar";

// Third-party Components
// (native base does not have a Skeleton component)
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";

// Assets
// Styles
import { styles } from "./FilterList.styles";

const FilterList = ({
  posts,
  settings,
  filter,
  setFilter,
  resetFilter,
  renderRow,
  loading,
  onRefresh,
  renderSkeletonRow,
  renderHiddenRow,
  leftOpenValue,
  rightOpenValue,
  onRowDidOpen,
  onRowDidClose,
  footer,
}) => {
  const { i18n, isRTL } = useI18N();
  const windowWidth = useWindowDimensions().width;

  const [showSearchBar, setShowSearchBar] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const { isContact, isGroup, postType } = useType();

  const setSearchFilter = (searchString) => {
    setFilter({
      ...filter,
      text: searchString,
    });
  };

  const setOptionsFilter = (newFilter) => {
    setFilter({
      ...filter,
      ...newFilter,
    });
  };

  const _onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: some other mechanism to reset?
    resetFilter();
    onRefresh();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  });

  const skeletons = Array(10)
    .fill("")
    .map((_, i) => ({ key: `${i}`, text: `item #${i}` }));

  const renderDefaultSkeletonRow = (item) => {
    return (
      <ContentLoader
        rtl={isRTL}
        speed={3}
        width={windowWidth}
        height={77}
        viewBox={"0 " + "0 " + windowWidth + " 80"}
        backgroundColor="#e7e7e7"
        foregroundColor="#b7b7b7"
      >
        <Circle cx="385" cy="25" r="8" />
        <Rect x="10" y="20" rx="2" ry="2" width="150" height="8" />
        <Rect x="10" y="45" rx="2" ry="2" width="100" height="5" />
        <Circle cx="120" cy="47" r="2" />
        <Rect x="130" y="45" rx="2" ry="2" width="150" height="5" />
        <Rect x="0" y="75" rx="2" ry="2" width="400" height="1" />
      </ContentLoader>
    );
  };

  const listItemSeparator = () => <View style={styles.listItemSeparator} />;

  let placeholder = i18n.t("global.placeholder");
  if (isContact) placeholder = i18n.t("contactsScreen.noContactPlacheHolder");
  if (isGroup) placeholder = i18n.t("groupsScreen.noGroupPlacheHolder");

  /*
  return (
    <Text>
      { JSON.stringify(posts) }
    </Text>
  );
  */
  // TODO: make the placeholder prettier (reuse from comments?)
  return (
    <>
      {showSearchBar && (
        <SearchBar
          setFilter={setSearchFilter}
          setOptionsFilter={setOptionsFilter}
        />
      )}
      {posts?.length < 1 ? (
        <View style={styles.background}>
          <Text style={styles.placeholder}>{placeholder}</Text>
        </View>
      ) : (
        <SwipeListView
          data={posts ?? skeletons}
          renderItem={(item) => {
            const isSkeletons = item?.item?.text?.includes("item #");
            // render normal
            if (!loading && !isSkeletons && renderRow)
              return renderRow(item.item);
            // render component provided skeletons
            if (item && renderSkeletonRow) return renderSkeletonRow(item.item);
            // render default skeletons
            return renderDefaultSkeletonRow(item.item);
          }}
          renderHiddenItem={(item, rowMap) => {
            const isSkeletons = item?.item?.text?.includes("item #");
            // confirm is not skeletons and render fn exists, else return null
            return !isSkeletons && renderHiddenRow
              ? renderHiddenRow(item, rowMap)
              : null;
          }}
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
          extraData={settings}
          ListFooterComponent={footer}
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
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderRow: PropTypes.func.isRequired,
};
export default FilterList;
