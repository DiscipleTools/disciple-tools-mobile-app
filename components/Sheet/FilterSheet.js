import React from "react";
import { Pressable, Text, View } from "react-native";

import { CheckIcon } from "components/Icon";
import SelectSheet from "./SelectSheet";

import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import useList from "hooks/use-list";
import useStyles from "hooks/use-styles";

import { localStyles } from "./FilterSheet.styles";

const FilterSheet = ({
  multiple,
  filters,
  filter,
  selectedFilter,
  onFilter,
  modalName,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { dismiss } = useBottomSheetModal();

  const onChange = (selectedFilter) => {
    if (onFilter) onFilter(selectedFilter);
    if (!multiple) dismiss(modalName);
  };

  const Count = ({ filter }) => {
    const { data: items } = useList({ filter });
    return items?.length ?? null;
  };

  const renderItem = (item, idx) => {
    if (!item) return null;
    const { ID, name, icon, count, subfilter, query } = item;
    const selected = selectedFilter?.ID === ID;
    const _key = `${ID}_${idx}`;
    return (
      <Pressable
        key={_key}
        onPress={() => onChange(item)}
        style={styles.itemContainer}
      >
        {icon && <View style={globalStyles.rowIcon}>{icon}</View>}
        <View style={styles.itemSubFilterContainer(subfilter)}>
          <Text style={styles.itemText}>
            {name} {"("}
            <Count filter={item} />
            {")"}
          </Text>
        </View>
        {selected && (
          <View style={globalStyles.rowIcon}>
            <CheckIcon style={globalStyles.selectedIcon} />
          </View>
        )}
      </Pressable>
    );
  };

  const mapFilters = (filters) => {
    return filters?.map((filter, idx) => ({
      key: filter?.title ?? idx,
      title: filter?.title,
      count: filter?.count,
      data: filter?.content,
    }));
  };

  const sections = mapFilters(filters);

  return (
    <SelectSheet
      required
      multiple={multiple}
      sections={sections}
      renderItem={renderItem}
      onChange={onChange}
    />
  );
};
export default FilterSheet;
