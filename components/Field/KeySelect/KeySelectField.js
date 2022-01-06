import React from "react";
import { View } from "react-native";
import {
  Icon,
  Picker as NBPicker
} from "native-base";

import useI18N from "hooks/useI18N";

// TODO: reuse SingleSelect component
import SingleSelect from "components/SingleSelect";

import { styles } from "./KeySelectField.styles";

const KeySelectField = ({ field, value, editing, onChange }) => {
  const { i18n, isRTL } = useI18N();

  // if value is null, then set a default to ensure field displays
  if (value === null) value = "";

  const handleChange = (newValue) => {
    if (newValue !== value) onChange(newValue);
  };

  const isStatusField = () => {
    if (field?.name === "overall_status" || field?.name === "group_status")
      return true;
    return false;
  };

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
export default KeySelectField;
