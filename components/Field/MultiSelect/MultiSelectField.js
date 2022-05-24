import React, { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";

import { FlashIcon } from "components/Icon";
//import Milestones from "components/Milestones";
import ChurchHealth from "components/ChurchHealth";
import Select from "components/Select";
import PostChip from "components/Post/PostChip";
import SelectSheet from "components/Sheet/SelectSheet";
import SheetHeader from "components/Sheet/SheetHeader";

import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import { FieldNames } from "constants";

import { localStyles } from "./MultiSelectField.styles";

const MultiSelectField = ({ editing, field, value, onChange }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { expand, setMultiSelectValues } = useBottomSheet();
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

  const isFaithMilestones = () => field?.name === FieldNames.FAITH_MILESTONES;

  const isChurchHealth = () => field?.name === FieldNames.CHURCH_HEALTH;

  const isMilestones = isFaithMilestones() || isChurchHealth();

  const MultiSelectFieldEdit = () => {
    // MAP TO API
    const mapToAPI = (sections) => {
      const values = [];
      sections.forEach((section) => {
        section?.data?.forEach((item) => {
          if (item?.selected) {
            values.push({
              value: item?.key,
            });
          }
        });
      });
      return values;
    };

    // MAP FROM API
    const mapFromAPI = (items) => {
      return items?.map((item) => {
        return {
          key: item?.key,
          label: item?.label,
          selected: selectedItems?.some(
            (selectedItem) => selectedItem?.key === item?.key
          ),
        };
      });
    };

    /*
     * NOTE: Since this is a multi-select, this method gets called when
     * the user clicks the "Done" button, and all 'sections' are passed
     * back (along with 'selected' property values).
     */
    const _onChange = async (newSections) => {
      const mappedValues = mapToAPI(newSections);
      if (JSON.stringify(mappedValues) !== JSON.stringify(values)) {
        setMultiSelectValues({ values: mappedValues });
      }
    };

    const onDone = (selectedValues) => {
      onChange(selectedValues, {
        autosave: true,
        force: true,
      });
    };

    // SELECT OPTIONS
    const sections = useMemo(
      () => [{ data: mapFromAPI(items) }],
      [items, selectedItems]
    );
    const title = field?.label || "";

    const sheetContent = useMemo(
      () => (
        <>
          <SelectSheet multiple sections={sections} onChange={_onChange} />
        </>
      ),
      [title, sections]
    );

    const renderItemLinkless = (item) => (
      <PostChip id={item?.key} title={item?.label} />
    );

    return (
      <Select
        onOpen={() => {
          expand({
            defaultIndex: 3,
            renderHeader: () => (
              <SheetHeader expandable dismissable title={title} />
            ),
            renderContent: () => sheetContent,
            onDone: (selectedValues) => onDone(selectedValues),
          });
        }}
        items={selectedItems}
        renderItem={renderItemLinkless}
      />
    );
  };

  const MultiSelectFieldView = () => {
    if (isChurchHealth())
      return <ChurchHealth items={items} selectedItems={selectedItems} />;
    return <MultiSelectFieldEdit />;
  };

  if (editing) return <MultiSelectFieldEdit />;
  return <MultiSelectFieldView />;
};
export default MultiSelectField;
