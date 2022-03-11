import React from "react";
import { View } from "react-native";

import { CaretIcon, ClearFiltersIcon } from "components/Icon";
import Chip from "components/Chip";
import FilterSheet from "components/Sheet/FilterSheet";

import useBottomSheet from "hooks/use-bottom-sheet";
import useFilters from "hooks/use-filters";
import useStyle from "hooks/use-styles";

import { localStyles } from "./FilterOptions.styles";

const FilterOptions = ({ defaultFilter, filter, onFilter }) => {

  const { styles, globalStyles } = useStyle(localStyles);
  const { expand } = useBottomSheet();

  const { data: filters } = useFilters();

  const filterContent = (title) => (
    <FilterSheet
      filters={filters?.filter(filter => title === filter?.title)}
      filter={filter}
      onFilter={onFilter}
    />
  );

  const showFilter = (title) => expand({
    index: 1,
    renderContent: () => filterContent(title),
  });

  /*
  const Count = ({ count, selected }) => (
    <View style={styles.optionCount(selected)}>
      { selected && (
        <Text style={styles.optionCountText(selected)}>{ count }</Text>
      )}
    </View>
  );
  */

  const FilterOption = ({ title }) => {
    const selectedFilterID = filter?.ID;
    let filterTitle = null; //getFilterTitle();
    // TODO: split into fn
    filters?.forEach(filterOption => {
      filterOption?.content?.forEach(content => {
        if (selectedFilterID === content?.ID) {
          filterTitle = filterOption?.title;
        };
      });
    });
    const selected = filterTitle === title;
    return(
      <Chip
        onPress={() => showFilter(title)}
        label={title}
        selected={selected}
        endIcon={
          <CaretIcon
            onPress={() => showFilter(title)}
            style={styles.optionCaret(selected)}
          />
        }
      />
    );
  };
  
  const ClearFilters = () => {
    const isDefaultFilter = JSON.stringify(filter) === JSON.stringify(defaultFilter);
    return(
      <ClearFiltersIcon
        onPress={() => isDefaultFilter ? null : onFilter(defaultFilter) }
        style={styles.clearFiltersIcon(!isDefaultFilter)}
      />
    );
  };

  if (!filters) return null;
  return (
    <View
      style={[
        globalStyles.rowContainer,
        styles.container,
      ]}
    >
      <ClearFilters />
      { filters?.map((filter, idx) => (
          <FilterOption
            key={filter?.title ?? idx}
            title={filter?.title}
          />
        )
      )}
    </View>
  );
};
export default FilterOptions;