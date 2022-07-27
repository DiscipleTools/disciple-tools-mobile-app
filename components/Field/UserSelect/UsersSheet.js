import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { MaterialCommunityIcon, CheckIcon } from "components/Icon";
import FilterList from "components/FilterList";

import useBottomSheet from "hooks/use-bottom-sheet";
import useFilter from "hooks/use-filter";
import useStyles from "hooks/use-styles";
import useUsers from "hooks/use-users";

import { localStyles } from "./UsersSheet.styles";

const UsersSheet = ({ id, values, onChange }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { delayedClose } = useBottomSheet();
  const { search, onSearch } = useFilter();

  // exclude currently selected values from options list
  const exclude = [];
  if (id) exclude.push(id);

  const { data: items } = useUsers({ search, exclude });
  if (!items) return null;

  // MAP TO API
  const mapToAPI = (newItem) => newItem;

  // MAP FROM API
  const mapFromAPI = (items) => {
    return items?.map((item) => {
      // NOTE: for "UserSelect" fields (eg, "assigned_to") use "ID" rather than "contact_id" (like with "Connections")
      return {
        key: item?.ID,
        label: item?.name,
        avatar: item?.avatar,
        contactId: item?.contact_id ? new String(item?.contact_id) : null,
        selected: values?.some(
          (selectedItem) => Number(selectedItem?.value) === item?.contact_id
        ),
      };
    });
  };

  const _onChange = (selectedItem) => {
    const mappedValue = mapToAPI(selectedItem);
    // NOTE: no comparison req bc we already exclude prevoiusly selected value
    onChange(mappedValue, {
      autosave: true,
      force: true,
    });
    delayedClose();
  };

  const _renderItem = ({ item }) => {
    const { key, label, icon, avatar, selected } = item;
    return (
      <Pressable onPress={() => _onChange(item)}>
        <View
          key={key}
          style={[globalStyles.rowContainer, styles.itemContainer]}
        >
          {avatar && <Image style={styles.avatar} source={{ uri: avatar }} />}
          {icon && (
            <View style={globalStyles.rowIcon}>
              <MaterialCommunityIcon
                type={icon?.type}
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
            <Text>
              {label} (#{key})
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

  // SELECT OPTIONS
  const mappedItems = mapFromAPI(items);

  return (
    <FilterList
      items={mappedItems}
      renderItem={_renderItem}
      search={search}
      onSearch={onSearch}
    />
  );
};
export default UsersSheet;
