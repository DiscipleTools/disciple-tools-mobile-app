import React, { useRef, useState } from "react";
import { Linking, View } from "react-native";

import { ClearIcon, MapIcon } from "components/Icon";
import Chip from "components/Chip";
import Select from "components/Select";
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import LocationsSheet from "./LocationsSheet";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useDevice from "hooks/use-device";
import useStyles from "hooks/use-styles";

import { localStyles } from "./LocationField.styles";

// eg, {"values":[{"value":"1000001"}, {"value":"1000002"}]}
const mapToFormValues = (selectedItems) => ({ values: selectedItems?.map(item => ({ value: item?.id })) ?? [] });

// eg, {"location_grid":{"values":[{"value":"1000001", delete: true}]}}
const mapToAPI = ({ fieldKey, newValue, isDelete }) => {
  const mappedValue = { [fieldKey]: { values: [{ value: newValue?.id ?? '' }]}};
  if (isDelete) {
    mappedValue[fieldKey].values[0]["delete"] = true;
  };
  return mappedValue;
};

const LocationFieldView = ({
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

const LocationFieldEdit = ({
  cacheKey,
  fieldKey,
  field,
  selectedItems,
  setSelectedItems,
  renderItem,
  onChange,
  setCacheByKey,
  updatePost
}) => {

  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = `expandable_card_${title ?? ''}_modal`;
  const defaultIndex =  getDefaultIndex();
  const title = field?.name || "";

  const _onChange = async(newValue) => {
    // NOTE: this is temporary until we get Locations endpoint usage resolved 
    const mappedNewValue = {
      id: newValue?.ID,
      label: newValue?.name,
    };
    const exists = selectedItems?.find(existingItem => existingItem?.id === mappedNewValue?.id);
    if (!exists) {
      // COMPONENT STATE 
      const componentData = selectedItems ? [...selectedItems, mappedNewValue] : [mappedNewValue];
      setSelectedItems(componentData);
      // FORM STATE
      if (onChange) {
        const mappedFormValues = mapToFormValues(componentData);
        onChange({ key: fieldKey, value: { ...mappedFormValues }});
        return;
      };
      // CACHE STATE, API STATE
      if (!onChange) {
        setCacheByKey({ cacheKey, fieldKey, newValue: mappedNewValue});
        const data = mapToAPI({ fieldKey, newValue: mappedNewValue });
        await updatePost({ data });
      };
    };
    return;
  };

  return(
    <>
      <Select
        onOpen={() => modalRef.current?.present()} 
        items={selectedItems}
        renderItem={renderItem}
      />
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={title}
        defaultIndex={defaultIndex}
      >
        <LocationsSheet
          selectedItems={selectedItems}
          onChange={_onChange}
          modalName={modalName}
        />
      </ModalSheet>
    </>
  );
};

const LocationField = ({
  editing,
  cacheKey,
  fieldKey,
  field,
  value,
  onChange,
}) => {

  const { styles } = useStyles(localStyles);
  const { isIOS } = useDevice();
  const { setCacheByKey } = useCache();
  const { updatePost } = useAPI();

  const [_selectedItems, _setSelectedItems] = useState(value);

  const _onRemove = async({ id }) => {
    const remainingSelectedItems = _selectedItems?.filter(item => item?.id !== id);
    // COMPONENT STATE 
    _setSelectedItems(remainingSelectedItems ?? []);
    // GROUPED/FORM STATE (ie, Create New)
    if (onChange) {
      const mappedFormValues = mapToFormValues(remainingSelectedItems);
      onChange({ key: fieldKey, value: { ...mappedFormValues }});
      return;
    };
    // CACHE STATE, API STATE
    if (!onChange) {
      // CACHE STATE
      setCacheByKey({ cacheKey, fieldKey, newValue: remainingSelectedItems });
      // API STATE
      const existingItem = _selectedItems?.find(item => item?.id === id);
      if (existingItem) {
        const data = mapToAPI({ fieldKey, newValue: existingItem, isDelete: true });
        await updatePost({ data });
      };
    };
  };

  const renderItemMapLink = (item) => {
    const name = item?.name || item?.label;
    let mapURL = isIOS
      ? `http://maps.apple.com/?q=${name}`
      : `https://www.google.com/maps/search/?api=1&query=${name}`;
    if (item?.lat && item?.lng) {
      mapURL = isIOS
        ? `http://maps.apple.com/?ll=${item?.lat},${item?.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${item?.lat},${item?.lng}`;
    }
    return (
      <Chip
        label={name}
        // TODO
        //onPress={() => Linking.openURL(mapURL)}
        startIcon={<MapIcon style={styles.startIcon} />}
        endIcon={_onRemove ? (
          <View style={styles.clearIconContainer(false)}>
            <ClearIcon
              onPress={() => _onRemove({ id: item?.id })}
              style={styles.clearIcon}
            />
          </View>
        ) : null }
      />
    );
  };

  if (editing) {
    return(
      <LocationFieldEdit
        cacheKey={cacheKey}
        fieldKey={fieldKey}
        field={field}
        selectedItems={_selectedItems}
        setSelectedItems={_setSelectedItems}
        renderItem={renderItemMapLink}
        onChange={onChange}
        setCacheByKey={setCacheByKey}
        updatePost={updatePost}
      />
    );
  };
  return(
    <LocationFieldView
      selectedItems={_selectedItems}
      renderItem={renderItemMapLink}
    />
  );
};
export default LocationField;