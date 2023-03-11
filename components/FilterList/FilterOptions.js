import React, { useRef } from "react";
import { View } from "react-native";

import { CaretIcon, ClearFiltersIcon } from "components/Icon";
import Chip from "components/Chip";
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import FilterSheet from "components/Sheet/FilterSheet";

import useI18N from "hooks/use-i18n";
import useStyle from "hooks/use-styles";

import { findFilterOptionById } from "utils";

import { localStyles } from "./FilterOptions.styles";

const ClearFilters = ({ filter, defaultFilter, onFilter }) => {
  const { styles } = useStyle(localStyles);
  const isDefaultFilter = filter?.ID === defaultFilter?.ID;
  return (
    <ClearFiltersIcon
      onPress={() => (isDefaultFilter ? null : onFilter(defaultFilter))}
      style={styles.clearFiltersIcon(!isDefaultFilter)}
    />
  );
};

const FilterOption = ({ idx, filters, filter, selectedFilter, onFilter }) => {
  const { styles } = useStyle(localStyles);
  const { i18n } = useI18N();
  // highlight the selected filter
  const title = filter?.title ?? "";
  if (!title) return null;
  const selectedFilterID = selectedFilter?.ID;
  const filterGroup = findFilterOptionById(selectedFilterID, filters);
  const selected = filterGroup?.title === title;
  // MODAL
  const modalRef = useRef(null);
  const modalName = `${title}_${idx}_modal`;
  const defaultIndex = 3;
  return (
    <>
      <Chip
        onPress={() => modalRef.current?.present()}
        label={title}
        selected={selected}
        endIcon={
          <CaretIcon
            onPress={() => modalRef.current?.present()}
            style={styles.optionCaret(selected)}
          />
        }
      />
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={i18n.t("global.filterBy") ?? ""}
        defaultIndex={defaultIndex}
      >
        <FilterSheet
          filters={filters?.filter((filter) => title === filter?.title)}
          filter={filter}
          selectedFilter={selectedFilter}
          onFilter={onFilter}
          modalName={modalName}
        />
      </ModalSheet>
    </>
  );
};

const FilterOptions = ({ defaultFilter, filters, filter, onFilter }) => {
  const { styles, globalStyles } = useStyle(localStyles);

  /*
  const Count = ({ count, selected }) => (
    <View style={styles.optionCount(selected)}>
      { selected && (
        <Text style={styles.optionCountText(selected)}>{ count }</Text>
      )}
    </View>
  );
  */

  if (!filters) return null;
  return (
    <View style={[globalStyles.rowContainer, styles.container]}>
      <ClearFilters
        filter={filter}
        defaultFilter={defaultFilter}
        onFilter={onFilter}
      />
      {Array.isArray(filters) &&
        filters?.map((_filter, idx) => (
          <FilterOption
            key={_filter?.title ?? idx}
            idx={idx}
            filters={filters}
            filter={_filter}
            selectedFilter={filter}
            onFilter={onFilter}
          />
        ))}
    </View>
  );
};
export default FilterOptions;
