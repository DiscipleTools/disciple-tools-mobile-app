import React, { useEffect, useMemo, useState } from "react";
import { Keyboard, View, TextInput } from "react-native";
//import PropTypes from "prop-types";
import { Icon } from "native-base";

import SortSheet from "components/Sheets/SortSheet";

import useBottomSheet from "hooks/useBottomSheet";
import useDebounce from "hooks/useDebounce.js";
import useFilter from "hooks/useFilter";
import useI18N from "hooks/useI18N";
import useStyles from "hooks/useStyles";

import { localStyles } from "./SearchBar.styles";

const SearchBar = ({ sortable }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { expand, collapse, snapPoints } = useBottomSheet();
  const { items, setItems, search, onSearch, filter, onFilter } = useFilter();
  const { i18n } = useI18N();

  const [_search, _setSearch] = useState(search ?? '');
  const debouncedSearch = useDebounce(_search, 1000);

  useEffect(() => {
    onSearch(debouncedSearch);
    Keyboard.dismiss();
    return;
  }, [debouncedSearch]);

  const onClear = () => {
    onSearch('');
    _setSearch('');
  };

  const sortSheetContent = useMemo(() => (
    <SortSheet
      items={items}
      setItems={setItems}
      filter={filter}
      onFilter={onFilter}
    />
  ), [items, filter]);

  const showSort = (show) => show ? expand({
    index: 1,
    snapPoints,
    renderContent: () => sortSheetContent
  }) : collapse();

  return (
    <View style={styles.container}>
      <View style={[globalStyles.rowContainer, styles.inputContainer]}>
        <Icon
          type="MaterialIcons"
          name="search"
          style={styles.icon}
        />
        <TextInput
          placeholder={i18n.t("global.search")}
          placeholderTextColor={globalStyles.placeholder.color}
          value={_search}
          onChangeText={_setSearch}
          autoCorrect={false}
          style={styles.input}
        />
        { (_search?.length > 0) && (
          <Icon
            type="MaterialIcons"
            name="clear"
            style={styles.icon}
            onPress={() => onClear()}
          />
        )}
        { sortable && (
          <Icon
            type="MaterialCommunityIcons"
            name="sort"
            style={styles.icon}
            onPress={() => showSort(true)}
          />
        )}
      </View>
    </View>
  );
};
/*
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired
};
*/
export default SearchBar;