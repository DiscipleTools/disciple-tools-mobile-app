import React from "react";
import {
  Icon,
  Picker as NBPicker
} from "native-base";

import useI18N from "hooks/useI18N";

import { styles } from "components/Field/Field.styles";

const SingleSelect = ({ editing, items, selectedItem, onChange }) => {
  const { i18n, isRTL } = useI18N();

  const handleChange = (newValue) => {
    // this is how we enable the user to de-select a value
    if (newValue === -1) {
      onChange({
        key: -1,
        label: "",
      });
      return;
    }
    const newItem = items.find(
      (existingItems) => existingItems.ID === newValue
    );
    if (newItem)
      onChange({
        key: newItem?.ID ?? null,
        label: newItem?.name ?? null,
      });
  };

  return (
    <>
      <NBPicker
        mode="dropdown"
        enabled={editing}
        selectedValue={selectedItem?.key}
        onValueChange={handleChange}
        textStyle={{ fontSize: 14 }}
        //textStyle={isStatusField() ? { color: "#FFF" } : null}
        placeholder=""
      >
        <NBPicker.Item key={-1} label={""} value={-1} />
        {items.map((item, idx) => {
          return (
            <NBPicker.Item
              key={item?.ID ?? idx}
              label={item?.name + " (#" + item?.ID + ")"}
              value={item?.ID}
            />
          );
        })}
      </NBPicker>
      {editing ? (
        <Icon name="caret-down" size={10} style={styles.pickerIcon} />
      ) : null}
    </>
  );
};
export default SingleSelect;
