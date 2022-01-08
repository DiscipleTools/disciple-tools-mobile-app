import React, { useState } from "react";
import { View } from "react-native";
import {
  Icon,
  Picker as NBPicker
} from "native-base";

//import useI18N from "hooks/useI18N";
import useAPI from "hooks/useAPI";

// TODO: reuse SingleSelect component
import SingleSelect from "components/SingleSelect";

import { styles } from "./KeySelectField.styles";

const KeySelectField = ({ field, defaultValue, editing, onChange }) => {

  // TODO
  //const { i18n, isRTL } = useI18N();

  const { updatePost } = useAPI();

  // if defaulValue is null/undefined, then set as empty string to ensure field displays
  const [value, setValue] = useState(defaultValue ?? '');

  const handleChange = (newValue) => {
    if (newValue !== value) {
      const data = { [field?.name]: newValue }; 
      if (onChange) onChange(data);
      updatePost(data);
    };
    setValue(newValue);
  };

  // TODO: constants
  const isStatusField = () => {
    if (field?.name === "overall_status" || field?.name === "group_status")
      return true;
    return false;
  };

  // TODO: fix colors
  const backgroundColor = field?.default[value]?.color ?? null;
  return (
    <View
      style={[
        styles.statusFieldContainer,
        isStatusField(field?.name) ? { backgroundColor } : null,
        //Platform.select({
        //android: {
        //transparent?: state.overallStatusBackgroundColor,
        //},
        //ios: {
        //backgroundColor: state.groupStatusBackgroundColor,
        //},
        //}),
      ]}
    >
      <NBPicker
        mode="dropdown"
        enabled={editing}
        selectedValue={value}
        onValueChange={handleChange}
        textStyle={isStatusField() ? { color: "#FFF" } : null}
        placeholder=""
      >
        {Object.keys(field?.default).map((key) => {
          const optionData = field.default[key];
          if (optionData)
            return (
              <NBPicker.Item key={key} label={optionData?.label} value={key} />
            );
          return null;
        })}
      </NBPicker>
      {editing ? (
        <Icon name="caret-down" size={10} style={styles.pickerIcon} />
      ) : null}
    </View>
  );
};
//KeySelectField.whyDidYouRender = true;
export default KeySelectField;