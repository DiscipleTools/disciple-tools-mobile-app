import React, { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";

import Milestones from "components/Milestones";
import Select from "components/Select";
import PostLink from "components/Post/PostLink";
import SelectSheet from "components/Sheet/SelectSheet";
import SheetHeader from "components/Sheet/SheetHeader";

import useBottomSheet from "hooks/useBottomSheet";
import useStyles from "hooks/useStyles";
import useType from "hooks/useType";

import { localStyles } from "./MultiSelectField.styles";

const MultiSelectField = ({ editing, field, value, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { expand, snapPoints, setMultiSelectValues } = useBottomSheet();
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
        console.log("*** CHANGE OCCURRED ***");
        setMultiSelectValues({ values: mappedValues });
      };
    };

    const onDone = (selectedValues) => {
      onChange(selectedValues,
        {
          autosave: true,
          force: true
        }
      );
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

    const renderItemLinkless = (item) => <PostLink id={item?.key} title={item?.label} />;

    return(
      <Select
        onOpen={() => {
          expand({
            index: snapPoints.length-1,
            snapPoints,
            multiple: true,
            onDone: (selectedValues) => onDone(selectedValues),
            renderContent: () => sheetContent
          });
        }}
        items={selectedItems}
        renderItem={renderItemLinkless}
      />
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
      <Select
        items={selectedItems}
        renderItem={renderItemLinkless}
      />
    );
    return (
      <View style={styles.container}>
        {selectedItems.map(selectedItem => (
          <PostLink id={selectedItem?.key} title={selectedItem?.label} />
        ))}
      </View>
    );
    return (
      <View style={styles.container}>
        {selectedItems.map(selectedItem => (
          <Text style={styles.item}>
            {selectedItem?.label}
          </Text>
        ))}
      </View>
    );
  };

  if (editing) return <MultiSelectFieldEdit />;
  return <MultiSelectFieldView />;
};
export default MultiSelectField;