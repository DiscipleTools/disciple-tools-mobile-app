import React, { useEffect, useState } from "react";
import { Keyboard, View, TextInput } from "react-native";
import PropTypes from "prop-types";

import { Icon } from "native-base";

import useDebounce from "hooks/useDebounce.js";
import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";

import FilterOptionsPanel from "./FilterOptionsPanel";

import { styles } from "./SearchBar.styles";

const SearchBar = ({ onSearch, filter, onFilter }) => {

  const isConnected = useNetworkStatus();
  const { i18n } = useI18N();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [showFilterOptionsPanel, setShowFilterOptionsPanel] = useState(false);

  useEffect(() => {
    //if (debouncedSearch) onSearch(debouncedSearch);
    console.log(debouncedSearch);
    return;
  }, [debouncedSearch]);

  const _onSearch = (search) => {
    if (search?.length < 1) {
      onSearch(null);
      setSearch("");
      Keyboard.dismiss();
      return;
    };
    onSearch(search);
    setSearch(search);
    return;
  };

  const onClear = () => {
    _onSearch('');
    onFilter(null);
  };

  return (
    <>
      <View style={styles.searchSection}>
        <Icon
          type="MaterialIcons"
          name="search"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={i18n.t("global.search")}
          value={search}
          onChangeText={(search) => _onSearch(search)}
          autoCorrect={false}
          style={styles.input}
        />
        { (search?.length > 0 || filter) && (
          <Icon
            type="MaterialIcons"
            name="clear"
            style={styles.searchIcon}
            onPress={() => onClear()}
          />
        )}
        <Icon
          type="MaterialIcons"
          name="filter-list"
          style={styles.searchIcon}
          onPress={() => setShowFilterOptionsPanel(!showFilterOptionsPanel)}
        />
      </View>
      {showFilterOptionsPanel && (
        <FilterOptionsPanel onFilter={onFilter} />
      )}
    </>
  );
};
/*
SearchBar.propTypes = {
  setFilter: PropTypes.func.isRequired,
  setOptionsFilter: PropTypes.func,
};
*/
export default SearchBar;
