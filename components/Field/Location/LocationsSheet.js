import React from "react";
import { Pressable, Text, View } from "react-native";

import { MaterialCommunityIcon, CheckIcon } from "components/Icon";
import FilterList from "components/FilterList";

import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import useFilter from "hooks/use-filter";
import useStyles from "hooks/use-styles";
import useLocations from "hooks/use-locations";

import { localStyles } from "./LocationsSheet.styles";

const LocationsSheet = ({ selectedItems, onChange, modalName }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { dismiss } = useBottomSheetModal();
  const { search, onSearch } = useFilter();

  // exclude currently selected items from options list
  const exclude = selectedItems?.map((item) => item?.id);

  const { data: locations } = useLocations({ search, exclude });
  if (!locations) return [];

  const _onChange = (selectedItem) => {
    dismiss(modalName);
    onChange(selectedItem);
  };

  const _renderItem = ({ item }) => {
    const { ID, name, icon, selected } = item;
    return (
      <Pressable onPress={() => _onChange(item)}>
        <View key={ID} style={styles.itemContainer}>
          {icon && (
            <View style={globalStyles.rowIcon}>
              <MaterialCommunityIcon
                name={icon?.name}
                style={[globalStyles.icon, icon?.style ? icon?.style : {}]}
              />
            </View>
          )}
          <View
            style={{
              marginEnd: "auto",
            }}
          >
            <Text>{name}</Text>
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

  return (
    <FilterList
      items={locations}
      renderItem={_renderItem}
      search={search}
      onSearch={onSearch}
    />
  );
};
export default LocationsSheet;
