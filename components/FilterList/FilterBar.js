import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import FilterOptions from "./FilterOptions";

import useFilters from "hooks/use-filters";
import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { findFilterById } from "utils";

import { localStyles } from "./FilterBar.styles";

const FilterBar = ({ display, items, defaultFilter, filter, onFilter }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { data: filters } = useFilters();

  const Count = () => (
    <Text style={[globalStyles.text, styles.count]}>
      {items?.length}
    </Text>
  );

  /*
   * NOTE: the defaultFilter in 'use-filter' has only an ID (not a query), ex:
   * { ID: "recent" }, so we find the corresponding filter by ID in the results
   * of 'use-filters' and set it and re-render.
   * 
   * This works for *any* Post Type bc D.T supports the 'recent' filter for any. 
   */
  useEffect(() => {
    if (!filter || filter?.query || defaultFilter?.query) return;
    if (filter?.ID || defaultFilter?.ID) {
      if (!filters) return;
      const foundFilter = findFilterById(filter?.ID || defaultFilter?.ID, filters);
      if (foundFilter) onFilter(foundFilter);
    };
    return;
  }, [filter]);

  if (!filter) return null;
  return(
    <View
      style={styles.filtersScrollContainer}
    >
      <ScrollView
        horizontal
        contentContainerStyle={[
          globalStyles.rowContainer,
          styles.filtersContentContainer
        ]}
      >
        <FilterOptions
          defaultFilter={defaultFilter}
          filter={filter}
          filters={filters}
          onFilter={onFilter}
        />
      </ScrollView>
      { display && (
        <View style={[
          globalStyles.rowContainer,
          styles.displayContainer 
        ]}>
          <Count />
          <View>
            { filter?.name && (
              <Text style={styles.filterSelections}>{i18n.t('global.filter')}: {filter.name}</Text>
            )}
            { filter?.query?.sort && (
              <Text style={styles.filterSelections}> {i18n.t('global.sort')}: {filter.query.sort}</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
export default FilterBar;