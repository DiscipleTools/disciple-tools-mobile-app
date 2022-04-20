import React from "react";
import { Text, View } from "react-native";

import { SquareIcon } from "components/Icon";
import Select from "components/Select";
import SelectSheet from "components/Sheet/SelectSheet";
import SheetHeader from "components/Sheet/SheetHeader";

import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";

import { FieldNames } from "constants";

import { localStyles } from "./KeySelectField.styles";

const KeySelectField = ({ editing, field, value, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { expand, getDefaultIndex } = useBottomSheet();

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
      if (isStatusField()) return <SquareIcon style={style} />;
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

    const KeySelectSheet = () => (
      <SelectSheet
        required
        sections={sections}
        onChange={_onChange}
      />
    );

    const getBackgroundColor = () => {
      if (items[value]?.color) return items[value].color;
      return globalStyles.background?.backgroundColor;
     
    };

    const renderItem = (item) => <Text>{item}</Text>;

    // TODO: items[value]?.description (for when "Not Ready")
    return(
      <Select
        onOpen={() => {
          expand({
            defaultIndex: getDefaultIndex({ items: sections?.[0]?.data }),
            renderHeader: () => (
              <SheetHeader
                expandable
                dismissable
                title={title}
              />
            ),
            renderContent: () => <KeySelectSheet />
          });
        }}
        items={[selectedLabel]}
        renderItem={renderItem}
        style={{ backgroundColor: getBackgroundColor() }}
      />
    );
  };

  // VIEW MODE
  const KeySelectFieldView = () => <Text>{selectedLabel}</Text>;

  if (editing) return <KeySelectFieldEdit />;
  return <KeySelectFieldView />;
};
export default KeySelectField;
