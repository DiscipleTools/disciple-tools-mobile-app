import React, { useRef, useState } from "react";
import { View } from "react-native";

//import { FlashIcon } from "components/Icon";
//import Milestones from "components/Milestones";
import ChurchHealth from "components/ChurchHealth";
import Select from "components/Select";
import PostChip from "components/Post/PostChip";
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import SelectSheet from "components/Sheet/SelectSheet";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useStyles from "hooks/use-styles";

import { FieldNames } from "constants";

import { localStyles } from "./MultiSelectField.styles";

// eg, {"health_metrics":{"values":[{"value":"church_prayer"}]}}
const mapToAPI = ({ fieldKey, newValue }) => {
  return { [fieldKey]: { values: [{ value: newValue?.key }]}};
};

// eg, {"health_metrics":{"values":[{"value":"church_prayer", delete: true}]}}
const mapToAPIRemove = ({ fieldKey, newValue }) => {
  return { [fieldKey]: { values: [{ value: newValue?.key, delete: true }] }};
};

const MultiSelectFieldView = ({
  selectedItems,
  renderItem
}) => {
  const { styles } = useStyles(localStyles);
  return(
    <View style={styles.optionContainer}>
      {selectedItems?.map(renderItem)}
    </View>
  );
};

const MultiSelectFieldEdit = ({
  post,
  cacheKey,
  fieldKey,
  fieldLabel,
  items,
  selectedItems,
  setSelectedItems,
  renderItem,
  sheetComponent
}) => {

  const { cache, mutate } = useCache();
  const { updatePost } = useAPI();

  //const isFaithMilestones = fieldKey === FieldNames.FAITH_MILESTONES;
  const isChurchHealth = fieldKey === FieldNames.CHURCH_HEALTH;
  //const isMilestones = isFaithMilestones || isChurchHealth;

  const _onRemove = async(newValue) => {
    // component state
    setSelectedItems(selectedItems.filter(item => item?.key !== newValue?.key));
    // in-memory cache (and persisted storage) state
    const cachedData = cache.get(cacheKey);
    const cachedDataModified = cachedData?.[fieldKey]?.filter(item => item !== newValue?.key);
    if (!cachedDataModified) return; 
    cachedData[fieldKey] = cachedDataModified;
    mutate(cacheKey, async() => (cachedData), { revalidate: false });
    // remote API state
    const data = mapToAPIRemove({ fieldKey, newValue });
    await updatePost({ data });
  };

  // TODO: support for grouped/create new form
  // TODO: per 'members' list, also need to update list cache and member count
  const _onChange = async(newValue) => {
    const newValueKey = newValue?.key;
    if (!newValueKey) return;
    const exists = selectedItems?.some(item => item?.key === newValueKey);
    if (exists) {
      _onRemove(newValue);
      return;
    };
    // component state
    setSelectedItems([...selectedItems, newValue]);
    // in-memory cache (and persisted storage) state
    const cachedData = cache.get(cacheKey);
    cachedData[fieldKey] = cachedData?.[fieldKey] ? [...cachedData[fieldKey], newValueKey] : [newValueKey];
    mutate(cacheKey, async() => (cachedData), { revalidate: false });
    // remote API state
    const data = mapToAPI({ fieldKey, newValue });
    await updatePost({ data });
  };

  const mapFromAPI = ({ items }) => {
    return items?.map((item) => ({
      key: item?.key,
      label: item?.label,
      selected: selectedItems?.some(
        (selectedItem) => selectedItem?.key === item?.key
      )
    }));
  };

  const sections = [{ data: mapFromAPI({ items }) }]

  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = `${fieldKey}_modal`;
  const defaultIndex =  getDefaultIndex();

  if (isChurchHealth) {
    return (
      <ChurchHealth
        post={post}
        selectedItems={selectedItems}
        onChange={_onChange}
      />
    );
  };
  return (
    <>
      <Select
        onOpen={() => modalRef.current?.present()} 
        items={selectedItems}
        renderItem={renderItem}
      />
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={fieldLabel}
        defaultIndex={defaultIndex}
        onDone={() => modalRef.current?.dismiss()}
      >
        {sheetComponent ? (
          <>
            {sheetComponent}
          </>
        ) : (
          <SelectSheet
            multiple
            sections={sections}
            onChange={_onChange}
            modalName={modalName}
          />
        )}
      </ModalSheet>
    </>
  );
};

const MultiSelectField = ({
  post,
  editing,
  cacheKey,
  fieldKey,
  field,
  value,
  onChange,
  sheetComponent
}) => {

  const items = Object.entries(field?.default).map(
    ([key, val]) => ({ key, ...val })
  );

  const selectedItems = items.map(item => value?.includes(item?.key)
    ? item
    : false
  ).filter(Boolean);

  const [_selectedItems, _setSelectedItems] = useState(selectedItems);

  const renderItemLinkless = (item) => (
    <PostChip id={item?.key} title={item?.label} />
  );

  if (editing) {
    return(
      <MultiSelectFieldEdit
        post={post}
        cacheKey={cacheKey}
        fieldKey={fieldKey}
        fieldLabel={field?.name}
        items={items}
        selectedItems={_selectedItems}
        setSelectedItems={_setSelectedItems}
        renderItem={renderItemLinkless}
        sheetComponent={sheetComponent}
        onChange={onChange}
      />
    );
  };
  return(
    <MultiSelectFieldView
      selectedItems={_selectedItems}
      renderItem={renderItemLinkless}
    />
  );
};
export default MultiSelectField;