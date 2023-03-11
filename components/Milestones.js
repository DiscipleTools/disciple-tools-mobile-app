import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { SvgUri } from "react-native-svg";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { localStyles } from "./Milestones.styles";

const Milestones = ({
  items,
  selectedItems,
  onChange,
  customAdd,
  customRemove,
  postType,
  editing,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  // TODO:
  const { i18n, isRTL } = useI18N();
  const add = (newValue) => {
    if (customAdd) customAdd(newValue);
    // TODO: debug why this is not working properly like 'MultiSelectField.addSelection' (does it have to do with 'selectedItems'?)
    const exists = selectedItems.find(
      (selectedItem) => selectedItem?.key === newValue?.key
    );
    if (!exists) {
      const apiValue = [...selectedItems, newValue].map((newValue) => {
        return { value: newValue?.key };
      });
      onChange({
        values: apiValue,
      });
    }
  };
  const remove = (deletedValue) => {
    if (customRemove) customRemove(deletedValue);
    // TODO: debug why this is not working properly like 'MultiSelectField.removeSelection' (does it have to do with 'selectedItems'?)
    const idx = selectedItems.findIndex(
      (value) => value?.key === deletedValue?.key
    );
    if (idx > -1) {
      const newValue = [...selectedItems];
      const removed = newValue.splice(idx, 1);
      const apiValue = newValue.map((newValue) => {
        return { value: newValue?.key };
      });
      onChange({
        values: apiValue,
        force_values: true,
      });
    }
  };
  const handleChange = (item, selected) => {
    if (selected) {
      remove(item);
    } else {
      add(item);
    }
  };
  return (
    <>
      {items.map((item, idx) => {
        const selected = selectedItems.find(
          (selectedItem) => selectedItem.label === item.label
        )
          ? true
          : false;
        return (
          <Pressable
            disabled={!editing}
            onPress={() => handleChange(item, selected)}
          >
            <View
              style={[
                styles.button,
                selected ? { backgroundColor: "#F0F" } : null,
              ]}
            >
              <View style={globalStyles.rowContainer}>
                <SvgUri width="25" height="25" uri={item?.icon} />
                <Text
                  style={[
                    styles.buttonLabel,
                    selected ? { color: "#fff" } : null,
                  ]}
                >
                  {item?.label}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </>
  );
};
export default Milestones;
