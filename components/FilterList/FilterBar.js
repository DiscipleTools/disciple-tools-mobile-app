import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import FilterOptions from "./FilterOptions";

import useFilters from "hooks/use-filters";
import useI18N from "hooks/use-i18n";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import { findFilterById } from "utils";

import { SortConstants } from "constants";

import { localStyles } from "./FilterBar.styles";

const FilterBar = ({ display, items, defaultFilter, filter, onFilter }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { isNotification, isCommentsActivity } = useType();
  const { data: filters } = useFilters();
  const { settings } = useSettings();

  // TODO: default to English in this way?
  const lastModifiedDateLabel = settings?.fields?.last_modified?.name ?? "Last Modified Date";
  const createdDateLabel = settings?.fields?.post_date?.name ?? "Created Date";

  const Count = () => (
    <Text style={[globalStyles.text, styles.count]}>{items?.length}</Text>
  );

  /*
   * NOTE: the defaultFilter in 'use-filter' has only an ID (not a query), ex:
   * { ID: "recent" }, so we find the corresponding filter by ID in the results
   * of 'use-filters' and set it and re-render.
   *
   * This works for *any* Post Type bc D.T supports the 'recent' filter for any.
   */
  useEffect(() => {
    if (
      !filter ||
      filter?.query ||
      defaultFilter?.query ||
      isNotification ||
      isCommentsActivity
    ) return;
    if (filter?.ID || defaultFilter?.ID) {
      if (!filters) return;
      const foundFilter = findFilterById(
        filter?.ID || defaultFilter?.ID,
        filters
      );
      if (foundFilter) onFilter(foundFilter);
    }
    return;
  }, [filter]);

  const mapSortKey = (sortKey) => {
    if (SortConstants.LAST_MOD_DESC === sortKey) {
      return `${ lastModifiedDateLabel } (${ i18n.t("global.newest") })`;
    };
    if (SortConstants.LAST_MOD_ASC === sortKey) {
      return `${ lastModifiedDateLabel } (${ i18n.t("global.oldest") })`;
    };
    if (SortConstants.CREATED_DESC === sortKey) {
      return `${ createdDateLabel } (${ i18n.t("global.newest") })`;
    };
    if (SortConstants.CREATED_ASC === sortKey) {
      return `${ createdDateLabel } (${ i18n.t("global.oldest") })`;
    };
    return sortKey;
  };

  if (!filter) return null;
  return (
    <View style={styles.filtersScrollContainer}>
      <ScrollView
        horizontal
        contentContainerStyle={[
          globalStyles.rowContainer,
          styles.filtersContentContainer,
        ]}
      >
        <FilterOptions
          defaultFilter={defaultFilter}
          filter={filter}
          filters={filters}
          onFilter={onFilter}
        />
      </ScrollView>
      {display && (
        <View style={[globalStyles.rowContainer, styles.displayContainer]}>
          <Count />
          <View>
            {filter?.name && (
              <Text style={styles.filterSelections}>
                {i18n.t("global.filter")}: {filter.name}
              </Text>
            )}
            {filter?.query?.sort && (
              <Text style={styles.filterSelections}>
                {" "}
                {i18n.t("global.sort")}: {mapSortKey(filter.query.sort)}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
export default FilterBar;
