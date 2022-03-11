import React from "react";
import { ScrollView, Text, View } from "react-native";

import FilterOptions from "./FilterOptions";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { localStyles } from "./FilterBar.styles";

const FilterBar = ({ display, items, defaultFilter, filter, onFilter }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();

  const Count = () => (
    <Text style={[globalStyles.text, styles.count]}>
      {items?.length}
    </Text>
  );

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
