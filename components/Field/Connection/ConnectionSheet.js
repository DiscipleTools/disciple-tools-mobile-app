import { Image, Pressable, Text, View } from "react-native";

import { CheckIcon } from "components/Icon";
import FilterList from "components/FilterList";
import StatusBorder from "components/StatusBorder";

import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import useFilter from "hooks/use-filter";
import useList from "hooks/use-list";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";

import { TypeConstants } from "constants";

import { localStyles } from "./ConnectionSheet.styles";

const ConnectionSheet = ({
  id,
  type,
  renderItem,
  values,
  onChange,
  modalName,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { dismiss } = useBottomSheetModal();
  const { search, onSearch } = useFilter();
  const { settings } = useSettings();

  const fields = settings?.post_types?.[type]?.fields;

  // exclude currently selected values from options list
  const exclude = values?.map((item) => item?.ID);
  // exclude the the current post (ie, contact or group)
  if (exclude && id) exclude.push(id);

  const revalidate = type === TypeConstants.PEOPLE_GROUP ? true : false;

  const { data: items } = useList({ search, exclude, type, revalidate });
  if (!items) return null;

  // TODO: this should not be necessary with use-list defaulting to sort by last_modified (fix that first)
  items?.sort(
    (a, b) => b?.last_modified?.timestamp - a?.last_modified?.timestamp
  );

  const _onChange = (selectedItem) => {
    onChange(selectedItem);
    dismiss(modalName);
  };

  const _renderItem = ({ item }) => {
    const { ID, avatar, name, post_title, selected } = item;
    return (
      <Pressable onPress={() => _onChange(item)}>
        <View
          key={ID}
          style={[globalStyles.rowContainer, styles.itemContainer]}
        >
          <StatusBorder fields={fields} item={item} />
          {avatar && <Image style={styles.avatar} source={{ uri: avatar }} />}
          <View style={styles.textContainer}>
            <Text>
              {name || post_title} (#{ID})
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
      renderItem={renderItem ?? _renderItem}
      search={search}
      onSearch={onSearch}
    />
  );
};
export default ConnectionSheet;
