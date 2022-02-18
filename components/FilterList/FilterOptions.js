import React from "react";
import { Pressable, Text, View } from "react-native";

import { CaretIcon } from "components/Icon";
import Chip from "components/Chip";
import FilterSheet from "components/Sheets/FilterSheet";

import useBottomSheet from "hooks/useBottomSheet";
import useFilter from "hooks/useFilter";
import useFilters from "hooks/useFilters";
import useStyle from "hooks/useStyles";

import { localStyles } from "./FilterOptions.styles";

const FilterOptions = () => {

  const { styles, globalStyles } = useStyle(localStyles);
  const { expand, snapPoints } = useBottomSheet();
  const { filter, onFilter } = useFilter();
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
    snapPoints,
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
    )
    return(
      <Pressable onPress={() => showFilter(title)}>
        <View
          style={[
            globalStyles.rowContainer,
            styles.optionContainer(selected),
          ]}
        >
          {/*<Count count={12} selected={selected} />*/}
          <Text style={styles.optionText(selected)}>
            { title }
          </Text>
          <Caret selected={selected} />
        </View>
      </Pressable>
    );
  };
  
  /* 
  const ClearFilters = ({ filtering }) => (
    <ClearFiltersIcon
      //onPress={() => filtering ? onFilter(null) : null }
      style={styles.clearFiltersIcon(filtering)}
    />
  );
  */

  if (!filters) return null;
  return (
    <View
      style={[
        globalStyles.rowContainer,
        styles.container,
      ]}
    >
      {/*<ClearFilters />*/}
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