import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { MaterialCommunityIcon, CheckIcon } from "components/Icon";
import FilterList from "components/FilterList";
import SheetHeader from "components/Sheet/SheetHeader";

import useFilter from "hooks/use-filter";
import useStyles from "hooks/use-styles";
import useUsers from "hooks/use-users";

import { localStyles } from "./UsersSheet.styles";

const UsersSheet = ({ id, values, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { search, onSearch } = useFilter();

  // exclude currently selected values from options list
  const exclude = [];
  if (id) exclude.push(id);

  const { data: items, error, isLoading, isValidating, mutate } = useUsers({ search, exclude });
  if (!items) return null;

  // MAP TO API
  const mapToAPI = (newItem) => ({
    value: newItem?.key
  });

  // MAP FROM API
  const mapFromAPI = (items) => {
    return items?.map(item => {
      // NOTE: for "UserSelect" fields (eg, "assigned_to") use "ID" rather than "contact_id" (like with "Connections")
      return {
        key: item?.ID,
        label: item?.name,
        avatar: item?.avatar,
        contactId: item?.contact_id ? new String(item?.contact_id) : null,
        selected: values?.some(selectedItem => Number(selectedItem?.value) === item?.contact_id),
      };
    });
  };

  const _renderItem = ({ item }) => {
    const { key, label, icon, avatar, selected } = item;
    return(
      <Pressable onPress={() => onChange(item)}>
        <View key={key} style={styles.itemContainer}>
            {avatar && (
              <Image style={styles.avatar} source={{ uri: avatar }} />
            )}
            {icon && (
              <View style={globalStyles.rowIcon}>
                <MaterialCommunityIcon
                  name={icon?.name}
                  style={[globalStyles.icon, icon?.style ? icon?.style : {}]} 
                />
              </View>
            )}
          <View style={{
            marginEnd: "auto",
          }}>
            <Text>{label} (#{key})</Text>
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
    <FilterList
      items={mappedItems}
      renderItem={_renderItem}
      search={search}
      onSearch={onSearch}
    />
  );
};
export default UsersSheet;
