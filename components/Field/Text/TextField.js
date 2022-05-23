import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { CancelIcon, SaveIcon } from "components/Icon";
import Slider from "components/Slider";

import useDebounce from "hooks/use-debounce";
import useStyles from "hooks/use-styles";

import { FieldNames } from "constants";

import { localStyles } from "./TextField.styles";

const TextField = ({ grouped = false, editing, field, value, onChange }) => {
  const { styles, globalStyles } = useStyles(localStyles);

  const [showSave, setShowSave] = useState(false);
  const [_value, _setValue] = useState(value);
  // TODO: use constant for debounce time
  //const debouncedValue = useDebounce(_value, grouped ? 3000 : 1500);
  const debouncedValue = useDebounce(_value, 1500);

  const isSliderField = field?.name === FieldNames.INFLUENCE;

  // console.log("------ isSliderField ------", isSliderField);

  useEffect(() => {
    if (debouncedValue !== value) {
      // TODO: explain
      if (grouped || isSliderField) {
        onChange(debouncedValue);
        return;
      }
      setShowSave(true);
    }
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
        automutate: true,
      });
    }
  };

  useEffect(() => {
    if (isSliderField) {
      // console.log("------ _value ------", _value, typeof _value);

      _onChange();
    }
    return;
  }, [_value]);

  const renderTextFieldEdit = () => (
    <View style={styles.container}>
      <View style={globalStyles.rowContainer}>
        <TextInput
          value={_value}
          onChangeText={_setValue}
          style={styles.input}
        />
        {showSave && (
          <View style={[globalStyles.rowContainer, styles.controlIcons]}>
            <CancelIcon onPress={() => _onClear()} />
            <SaveIcon onPress={() => _onChange()} />
          </View>
        )}
      </View>
    </View>
  );

  const renderTextFieldView = () => (
    <View style={styles.container}>
      <View style={globalStyles.rowContainer}>
        <Text style={styles.input}>{_value}</Text>
      </View>
    </View>
  );

  /*
   * NOTE: returning a component will cause loss of focus and Keyboard dismissal
   * (instead 'trick' React by invoking lowercase render method)
   */
  //return <>{editing ? <TextFieldEdit /> : <TextFieldView />}</>;
  if (editing) {
    if (isSliderField) {
      return <Slider value={_value} onValueChange={_setValue} />;
    }
    return renderTextFieldEdit();
  }
  // if (editing) return renderTextFieldEdit();
  return renderTextFieldView();
};
export default TextField;
