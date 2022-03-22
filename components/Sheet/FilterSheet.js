import React from "react";
import { Pressable, Text, View } from "react-native";

import { CheckIcon } from "components/Icon";
import SelectSheet from "./SelectSheet";
import SheetHeader from "./SheetHeader";

import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";

import { localStyles } from "./FilterSheet.styles";

const FilterSheet = ({ multiple, filters, filter, onFilter }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { delayedClose } = useBottomSheet();

  const onChange = (selectedFilter) => {
    if (onFilter) onFilter(selectedFilter);
    if (!multiple) delayedClose();
  };

  const renderItem = (item) => {
    if (!item) return null;
    const { ID, name, count, subfilter, query } = item;
    const selected = ID === filter?.ID;
    return(
      <Pressable onPress={() => onChange(item)}>
        <View key={ID} style={styles.itemContainer}>
          <View style={styles.itemSubFilterContainer(subfilter)}>
            <Text style={styles.itemText}>
              {name} {count > 0 ? `(${count})` : null}
            </Text>
          </View>
          {selected && (
            <View style={globalStyles.rowIcon}>
              <CheckIcon style={globalStyles.selectedIcon} />
            </View>
          )}
        </View>
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

  // TODO: translate
  const title = "Filter by";

  return(
    <>
      <SheetHeader
        expandable
        dismissable
        title={title}
      />
      <SelectSheet
        required
        multiple={multiple}
        sections={sections}
        renderItem={renderItem}
        onChange={onChange}
      />
    </>
  );
};
export default FilterSheet;