import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { MaterialCommunityIcon, CheckIcon } from "components/Icon";
import FilterList from "components/FilterList";

import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import useFilter from "hooks/use-filter";
import useStyles from "hooks/use-styles";
import useUsers from "hooks/use-users";

import { localStyles } from "./UsersSheet.styles";

const UsersSheet = ({
  id,
  values,
  onChange,
  sharedIDs,
  modalName
}) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const { dismiss } = useBottomSheetModal();

  const { search, onSearch } = useFilter();

  // exclude currently selected values from options list
  let exclude = [];
  if (id) exclude.push(id);
  if (sharedIDs && sharedIDs.length !== 0) {
    exclude = [...exclude, ...sharedIDs];
  };

  const { data: items } = useUsers({ search, exclude });
  if (!items) return null;

  const _onChange = (newValue) => {
    onChange(newValue);
    dismiss(modalName);
  };

  const renderItem = ({ item }) => {
    const { ID, name, icon, avatar, contact_id, selected } = item;
    return (
      <Pressable onPress={() => _onChange(item)}>
        <View
          key={ID}
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
              {name} (#{ID})
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

  return (
    <FilterList
      items={items}
      renderItem={renderItem}
      search={search}
      onSearch={onSearch}
    />
  );
};
export default UsersSheet;