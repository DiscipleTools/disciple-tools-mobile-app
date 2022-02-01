import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { ClearIcon, SaveIcon } from "components/Icon";

import useDebounce from "hooks/useDebounce.js";
import useStyles from "hooks/useStyles";

import { localStyles } from "./TextField.styles";

const TextField = ({ editing, value, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const [showSave, setShowSave] = useState(false);
  const [_value, _setValue] = useState(value);
  const debouncedValue = useDebounce(_value, 1000);

  useEffect(() => {
    if (debouncedValue !== value) {
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

  const renderTextFieldEdit = () => (
    <View style={styles.container}>
      <View style={globalStyles.rowContainer}>
        <TextInput
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

  const renderTextFieldView = () => <Text>{_value}</Text>;

  /*
   * NOTE: returning a component will cause loss of focus and Keyboard dismissal
   * (instead 'trick' React by invoking lowercase render method)
   */
  //return <>{editing ? <TextFieldEdit /> : <TextFieldView />}</>;
  if (editing) return renderTextFieldEdit();
  return renderTextFieldView();
};
export default TextField;