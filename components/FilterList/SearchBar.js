import React, { useEffect, useState } from "react";
import { Keyboard, View, TextInput } from "react-native";

import { ClearIcon, SearchIcon } from "components/Icon";
import Sort from "components/FilterList/Sort";

import useDebounce from "hooks/use-debounce";
import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { localStyles } from "./SearchBar.styles";

const SearchBar = ({
  sortable,
  items,
  setItems,
  search,
  onSearch,
  filter,
  onFilter,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();

  const [_search, _setSearch] = useState(search ?? "");
  const debouncedSearch = useDebounce(_search, 1000);

  useEffect(() => {
    if (onSearch) onSearch(debouncedSearch.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    Keyboard.dismiss();
    return;
  }, [debouncedSearch]);

  const onClear = () => {
    onSearch("");
    _setSearch("");
  };

  return (
    <View style={styles.container}>
      <View style={[globalStyles.rowContainer, styles.inputContainer]}>
        <View>
          <SearchIcon style={globalStyles.icon} />
        </View>
        <TextInput
          placeholder={i18n.t("global.search")}
          placeholderTextColor={globalStyles.placeholder.color}
          value={_search}
          onChangeText={_setSearch}
          autoCorrect={false}
          style={styles.input}
        />
        {_search?.length > 0 && (
          <View>
            <ClearIcon onPress={() => onClear()} style={globalStyles.icon} />
          </View>
        )}
        {sortable && (
          <View>
            <Sort
              items={items}
              setItems={setItems}
              filter={filter}
              onFilter={onFilter}
            />
          </View>
        )}
      </View>
    </View>
  );
};
export default SearchBar;
