import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { ClearIcon, SaveIcon } from "components/Icon";

import useDebounce from "hooks/useDebounce";
import useStyles from "hooks/useStyles";

import { localStyles } from "./NumberField.styles";

// TODO: refactor futher
// most of this can be reused with TextField
// only the TextInput prop 'keyboardType="numeric" is different
const NumberField = ({ editing, value, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const [showSave, setShowSave] = useState(false);

  const mappedValue = value ? new String(value) : '';
  const [_value, _setValue] = useState(mappedValue);

  const debouncedValue = useDebounce(_value, 1000);

  useEffect(() => {
    if (debouncedValue !== mappedValue) {
      setShowSave(true);
    };
    return;
  }, [debouncedValue]);

  const _onClear = () => {
    _setValue(mappedValue);
    setShowSave(false);
  };

  const _onChange = () => {
    if (_value !== mappedValue) {
      onChange(_value, {
        autosave: true,
        automutate: true
      });
    };
  };

  const renderNumberFieldEdit = () => (
    <View style={styles.container}>
      <View style={globalStyles.rowContainer}>
        <TextInput
          keyboardType="numeric"
          value={_value}
          onChangeText={_setValue}
          style={styles.input}
        />
        { showSave && (
          <>
            <ClearIcon onPress={() => _onClear()} />
            <SaveIcon onPress={() => _onChange()} />
          </>
        )}
      </View>
    </View>
  );

  const renderNumberFieldView = () => <Text>{_value}</Text>;

  if (editing) return renderNumberFieldEdit();
  return renderNumberFieldView();
};
export default NumberField;
