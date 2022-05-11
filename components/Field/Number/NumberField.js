import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { CancelIcon, SaveIcon } from "components/Icon";
import Slider from "components/Slider";

import useDebounce from "hooks/use-debounce";
import useStyles from "hooks/use-styles";

import { FieldNames } from "constants";

import { localStyles } from "./NumberField.styles";

// TODO: most of this can be reused with TextField
// only the TextInput prop 'keyboardType="numeric" is different
const NumberField = ({ grouped=false, editing, field, value, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const [showSave, setShowSave] = useState(false);
  const [_value, _setValue] = useState(value);
  // TODO: use constant for debounce time
  const debouncedValue = useDebounce(_value, 1500);

  const isSliderField = field?.name === FieldNames.INFLUENCE;

  useEffect(() => {
    if (debouncedValue !== value) {
      if (grouped || isSliderField) {
        onChange(debouncedValue);
        return;
      };
      setShowSave(true);
    };
    return;
  }, [debouncedValue]);

  const _onClear = () => {
    _setValue(value);
    setShowSave(false);
  };

  const _onChange = () => {
    if (_value !== value) {
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
          value={_value ? String(_value) : ''}
          onChangeText={_setValue}
          style={styles.input}
        />
        { showSave && (
          <View style={[globalStyles.rowContainer, styles.controlIcons]}>
            <CancelIcon onPress={() => _onClear()} />
            <SaveIcon onPress={() => _onChange()} />
          </View>
        )}
      </View>
    </View>
  );

  const renderNumberFieldView = () => (
    <View style={styles.container}>
      <View style={globalStyles.rowContainer}>
        <Text style={styles.input}>{_value}</Text>
      </View>
    </View>
  );

  if (editing) {
    if (isSliderField) {
      return(
        <Slider
          value={_value}
          onValueChange={_setValue}
        />
      );
    };
    return renderNumberFieldEdit();
  };
  return renderNumberFieldView();
};
export default NumberField;
