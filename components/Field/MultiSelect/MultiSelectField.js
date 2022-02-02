import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { CaretIcon } from "components/Icon";
import Milestones from "components/Milestones";
import SelectSheet from "components/Sheets/SelectSheet";
import SheetHeader from "components/Sheets/SheetHeader";

import useBottomSheet from "hooks/useBottomSheet";
import useStyles from "hooks/useStyles";
import useType from "hooks/useType";

const MultiSelectField = ({ editing, field, value, onChange }) => {

  const { globalStyles } = useStyles();
  const { expand, snapPoints } = useBottomSheet();
  const { postType } = useType();

  // VALUES
  const values = value?.values || [];

  // ITEMS

  const options = field?.default;

  const getItems = useCallback(() => {
    return Object.keys(options).map((key) => {
      if (options[key].hasOwnProperty("key")) return options[key];
      // 'milestones' do not have a 'key' property, so we set one for consistency sake
      let option = options[key];
      option["key"] = key;
      return option;
    });
  }, [options]);

  const items = getItems();

  const getSelectedItems = useCallback(() => {
    const selectedItems = [];
    values.forEach((selectedItem) => {
      items.find((option) => {
        if (option?.key === selectedItem?.value) {
          selectedItems.push(option);
        }
      });
    });
    return selectedItems;
  }, [items, values]);

  const selectedItems = getSelectedItems();

  const isMilestones = (field?.name === "milestones" || field?.name === "health_metrics");

  const MultiSelectFieldEdit = () => {

    // MAP TO API
    const mapToAPI = (sections) => {
      const values = [];
      sections.forEach((section) => {
        section?.data?.forEach(item => {
          if (item?.selected) {
            values.push({
              value: item?.key,
            });
          };
        });
      });
      return values;
    };

    // MAP FROM API
    const mapFromAPI = (items) => {
      return items?.map(item => {
        return {
          key: item?.key,
          label: item?.label,
          selected: selectedItems?.some(selectedItem => selectedItem?.key === item?.key),
        };
      });
    };

    /*
     * NOTE: Since this is a multi-select, this method gets called when
     * the user clicks the "Done" button, and all 'sections' are passed
     * back (along with 'selected' property values).
     */
    const _onChange = async(newSections) => {
      const mappedValues = mapToAPI(newSections);
      if (JSON.stringify(mappedValues) !== JSON.stringify(values)) {
        const apiValues = {
          values: mappedValues,
          force_values: true,
        };
        onChange(apiValues, {
          autosave: true
        });
      };
    };

    // SELECT OPTIONS
    const sections = useMemo(() => [{ data: mapFromAPI(items) }], [items, selectedItems]);
    const title = field?.label || '';

    const sheetContent = useMemo(() => (
      <>
        <SheetHeader
          expandable
          dismissable
          title={title}
        />
        <SelectSheet
          multiple
          sections={sections}
          onChange={_onChange}
        />
      </>
    ), [title, sections]);

    const showSheet = () => expand({
      index: snapPoints.length-1,
      snapPoints,
      renderContent: () => sheetContent,
    });

    return(
      <Pressable onPress={() => showSheet()}>
        <View style={globalStyles.postDetailsContainer}>
          <MultiSelectFieldView />
          <CaretIcon />
        </View>
      </Pressable>
    );
  };

  const MultiSelectFieldView = () => {
    // TODO: fix formatting
    /*
    if (isMilestones) return (
      <Milestones
        items={items}
        selectedItems={selectedItems}
        postType={postType}
      />
    );
    */
    return (
      <Text>
        { selectedItems.map((selectedItem) => selectedItem?.label).join(", ") }
      </Text>
    );
  };

  if (editing) return <MultiSelectFieldEdit />;
  return <MultiSelectFieldView />;
};
export default MultiSelectField;