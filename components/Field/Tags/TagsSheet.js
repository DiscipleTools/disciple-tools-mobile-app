import { Pressable, Text, View } from "react-native";

import { TagIcon } from "components/Icon";
import FilterList from "components/FilterList";

import { useBottomSheetModal } from "@gorhom/bottom-sheet";

import useFilter from "hooks/use-filter";
import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";
import useTags from "hooks/use-tags";
import useType from "hooks/use-type";

import { localStyles } from "./TagsSheet.styles";

const TagsSheet = ({ values, onChange, modalName }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();

  const { dismiss } = useBottomSheetModal();

  const { search, onSearch } = useFilter();

  // exclude currently selected values from options list
  let exclude = values ? [...values] : [];

  const { postType } = useType();

  const { data: items } = useTags({ exclude, search, postType });
  if (!items) return null;

  const _onChange = (newValue) => {
    onChange(newValue);
    dismiss(modalName);
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable onPress={() => _onChange(item)}>
        <View
          key={item}
          style={[globalStyles.rowContainer, styles.itemContainer]}
        >
          <View style={globalStyles.rowIcon}>
            <TagIcon />
          </View>
          <View
            style={{
              marginEnd: "auto",
            }}
          >
            <Text>{item}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const placeholderItems = i18n.t("global.items");
  return (
    <FilterList
      items={items}
      renderItem={renderItem}
      placeholder={i18n.t("global.placeholder", { items: placeholderItems })}
      search={search}
      onSearch={onSearch}
    />
  );
};
export default TagsSheet;
