import React from "react";
import { Pressable, Text, View } from "react-native";

import { CaretIcon } from "components/Icon";
import SelectSheet from "components/Sheets/SelectSheet";
import SheetHeader from "components/Sheets/SheetHeader";

import useBottomSheet from "hooks/useBottomSheet";
import useStyles from "hooks/useStyles";

import { FieldNames } from "constants";

import { localStyles } from "./KeySelectField.styles";

const KeySelectField = ({ editing, field, value, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { expand, snapPoints } = useBottomSheet();

  // ITEMS
  const items = field?.default;

  // SELECTED 
  const selectedLabel = items[value]?.label ?? ''; 

  // EDIT MODE
  const KeySelectFieldEdit = () => {

    // MAP TO API
    const mapToAPI = (item) => {
      return item?.key;
    };

    // ON CHANGE
    const _onChange = (newValue) => {
      const mappedValue = mapToAPI(newValue);
      if (mappedValue !== value) {
        onChange(mappedValue, {
          autosave: true,
        });
      };
    };

    const isStatusField = () => {
      if (
        field?.name === FieldNames.OVERALL_STATUS ||
        field?.name === FieldNames.GROUP_STATUS
      ) return true;
      return false;
    };

    const mapIcon = (key) => {
      const style = items[key]?.color ? { color: items[key].color } : null;
      if (isStatusField()) return {
        type: 'MaterialCommunityIcons',
        name: 'square',
        style,
      };
      return null;
    };

    // MAP ITEMS
    const mapItems = (items) => {
      const keys = Object.keys(items);
      return keys.map(key => {
        return {
          key,
          label: items[key]?.label,
          icon: mapIcon(key),
          selected: value === key, 
        };
      });
    };

    // SECTIONS 
    const sections = [{ data: mapItems(items) }];

    const title = field?.label;

    const keySelectContent = () => (
      <>
        <SheetHeader
          expandable
          dismissable
          title={title}
        />
        <SelectSheet
          required
          sections={sections}
          onChange={_onChange}
        />
      </>
    );

    const showSheet = () => expand({
      index: 0,
      snapPoints,
      renderContent: () => keySelectContent,
    });

    const backgroundColor = items[value]?.color ?? globalStyles.surface?.backgroundColor;
    // TODO: items[value]?.description (for when "Not Ready")
    return(
      <Pressable onPress={() => showSheet()}>
        <View style={[
          globalStyles.rowContainer,
          styles.container(isStatusField(), backgroundColor),
        ]}>
          <Text>{selectedLabel}</Text>
          <CaretIcon />
        </View>
      </Pressable>
    );
  };

  // VIEW MODE
  const KeySelectFieldView = () => <Text>{selectedLabel}</Text>;

  if (editing) return <KeySelectFieldEdit />;
  return <KeySelectFieldView />;
};
export default KeySelectField;