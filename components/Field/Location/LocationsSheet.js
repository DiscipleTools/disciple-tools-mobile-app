import React from "react";
import { Pressable, Text, View } from "react-native";

import { CheckIcon } from "components/Icon";
import FilterList from "components/FilterList";
import SheetHeader from "components/Sheet/SheetHeader";

import useBottomSheet from "hooks/use-bottom-sheet";
import useFilter from "hooks/use-filter";
import useStyles from "hooks/use-styles";
import useLocations from "hooks/use-locations";

import { localStyles } from "components/Field/Connection/ConnectionField.styles";

const LocationsSheet = ({ id, title, values, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { delayedClose } = useBottomSheet();
  const { search, onSearch } = useFilter();

  // exclude currently selected values from options list
  const exclude = values?.values?.map(item => item?.grid_id);

  const { data: items, error, isLoading, isValidating, mutate } = useLocations({ search, exclude });
  if (!items) return [];

  // MAP TO API
  const mapToAPI = (newItem) => {
    const mappedValues = values?.values?.map(value => ({ value: value?.grid_id }));
    mappedValues.push({
      value: newItem?.key,
    });
   return mappedValues;
  };

  // MAP FROM API
  const mapFromAPI = (items) => {
    return items?.map(item => {
      return {
        key: item?.ID,
        label: item?.name,
      };
    });
  };

  const _onChange = (selectedItem) => {
    const mappedValues = mapToAPI(selectedItem);
    if (JSON.stringify(mappedValues) !== JSON.stringify(items)) {
      onChange(
        { values: mappedValues },
        { autosave: true }
      );
    };
    delayedClose();
  };

  const _renderItem = ({ item }) => {
    const { key, label, icon, selected } = item;
    return(
      <Pressable onPress={() => _onChange(item)}>
        <View key={key} style={styles.itemContainer}>
            {icon && (
              <View style={globalStyles.rowIcon}>
                <Icon
                  type={icon?.type}
                  name={icon?.name}
                  style={[globalStyles.icon, icon?.style ? icon?.style : {}]} 
                />
              </View>
            )}
          <View style={{
            marginEnd: "auto",
          }}>
            <Text>{label}</Text>
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

  // SELECT OPTIONS
  //const sections = useMemo(() => [{ data: mapFromAPI(items) }], [items, values]);
  const mappedItems = mapFromAPI(items);

  return(
    <>
      <SheetHeader
        expandable
        dismissable
        title={title}
      />
      <FilterList
        items={mappedItems}
        renderItem={_renderItem}
        search={search}
        onSearch={onSearch}
      />
    </>
  );
};
export default LocationsSheet;
