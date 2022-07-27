import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { CheckIcon, MaterialCommunityIcon } from "components/Icon";
import FilterList from "components/FilterList";

import useBottomSheet from "hooks/use-bottom-sheet";
import useFilter from "hooks/use-filter";
import useList from "hooks/use-list";
import useStyles from "hooks/use-styles";

import { localStyles } from "./ConnectionSheet.styles";

const ConnectionSheet = ({ id, type, renderItem, values, onChange }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { delayedClose } = useBottomSheet();

  const { search, onSearch } = useFilter();

  // exclude currently selected values from options list
  const exclude = values?.map((item) => item?.value);
  // exclude the the current post (ie, contact or group)
  if (id) exclude.push(id);

  const { data: items } = useList({ search, exclude, type });
  if (!items) return [];

  // MAP TO API
  const mapToAPI = (newItem) => {
    let _values = JSON.parse(JSON.stringify(values));
    _values = _values.map((value) => ({
      value: value?.value,
    }));
    _values.push({
      value: newItem?.key,
    });
    return _values;
  };

  // MAP FROM API
  const mapFromAPI = (items) => {
    return items?.map((item) => {
      const key = item?.contact_id || item?.ID || item?.value;
      return {
        key,
        label: item?.name || item?.title,
        avatar: item?.avatar,
        contactId: item?.contact_id ? String(item?.contact_id) : null,
        //selected: values?.some(selectedItem => Number(selectedItem?.value) === item?.contact_id),
      };
    });
  };

  const _onChange = (selectedItem) => {
    const mappedValues = mapToAPI(selectedItem);
    if (JSON.stringify(mappedValues) !== JSON.stringify(items)) {
      onChange({ values: mappedValues }, { autosave: true, force: true });
    }
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
  //const sections = useMemo(() => [{ data: mapFromAPI(items) }], [items, values]);
  const mappedItems = mapFromAPI(items);

  return (
    <FilterList
      items={mappedItems}
      renderItem={renderItem ?? _renderItem}
      search={search}
      onSearch={onSearch}
    />
  );
};
export default ConnectionSheet;
