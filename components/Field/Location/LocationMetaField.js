import React, { useState } from "react";
import { Keyboard, Linking, Pressable, View } from "react-native";

import { AddIcon, ClearIcon, MapIcon } from "components/Icon";
import Chip from "components/Chip";
import CommunicationLink from "components/Field/CommunicationChannel/CommunicationLink";
import CommunicationTextInput from "components/Field/CommunicationChannel/CommunicationTextInput";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useDevice from "hooks/use-device";
import useStyles from "hooks/use-styles";

import { FieldDefaultValues } from "constants";

import { getKeyboardType } from "helpers";

import { localStyles } from "./LocationMetaField.styles";

const mapToComponent = ({ existingValues, idx, newValue }) => {
  let newValues = [...existingValues];
  const prevValue = existingValues[idx];
  if (prevValue?.label === newValue) return existingValues;
  if (!newValue) return existingValues;
  const mergedValue = { ...prevValue, label: newValue };
  newValues[idx] = mergedValue;
  return newValues;
};

const mapToComponentRemove = ({ existingValues, idx }) => {
  if (idx === 0 && existingValues?.length === 1) {
    const newValues = [...existingValues];
    newValues[idx].label = "";
    return newValues;
  }
  return existingValues.filter((_, i) => i !== idx);
};

/* TODO: currently not supported
// eg, { "location_grid_meta": { "values": [ { "lng": -74.4049778, "lat": 40.4316955, "level": "locality", "label": "East Brunswick, NJ, USA", "source": "user" } ] } }
const mapToAPIGrid = ({ fieldKey, newValue }) => {
  return { [fieldKey]: { "values": [{ grid_meta_id: newValue?.value }] }};
};
*/

// eg, {"contact_address":[{"key":"contact_email_123","value":"101"}]}
const mapToAPIText = ({ fieldKey, newValue }) => {
  // NOTE: hardcoded fieldKey
  const data = { contact_address: [{ value: newValue?.label }] };
  // use existing key if available, otherwise API will create a new key
  if (newValue?.key) data["contact_address"][0].key = newValue.key;
  return data;
};

// eg, { "location_grid_meta": { "values": [ { "grid_meta_id": 1759, "delete": true } ] } }
const mapToAPIRemoveGrid = ({ fieldKey, grid_meta_id }) => {
  return { [fieldKey]: { values: [{ grid_meta_id, delete: true }] } };
};

// eg, { "contact_address": [ { "delete": true, "key": "contact_address_0ea" } ] }
const mapToAPIRemoveText = ({ fieldKey, key }) => {
  // NOTE: hardcoded fieldKey
  return { contact_address: [{ key, delete: true }] };
};

const LocationMetaFieldView = ({ field, values }) => {
  const { styles } = useStyles(localStyles);
  const { isIOS } = useDevice();
  const fieldName = field?.name?.toLowerCase();
  return values?.map((value, idx) => {
    const name = value?.label;
    let mapURL = isIOS
      ? `http://maps.apple.com/?q=${name}`
      : `https://www.google.com/maps/search/?api=1&query=${name}`;
    if (value?.lat && value?.lng) {
      const lat = value.lat;
      const lng = value.lng;
      mapURL = isIOS
        ? `http://maps.apple.com/?ll=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Pressable
          onPress={() => Linking.openURL(mapURL)}
          style={styles.mapButton}
        >
          <MapIcon style={styles.mapIcon} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <CommunicationLink
            key={value?.key ?? idx}
            fieldName={fieldName}
            entryKey={value?.key ?? idx}
            value={value?.label}
          />
        </View>
      </View>
    );
  });
};

const LocationMetaFieldEdit = ({
  cacheKey,
  fieldKey,
  field,
  values,
  onChange,
}) => {
  const [_values, _setValues] = useState(values);

  const { cache, mutate } = useCache();
  const { updatePost } = useAPI();

  const _onAdd = () => {
    Keyboard.dismiss();
    const newValues =
      _values?.length > 0
        ? [..._values, FieldDefaultValues.LOCATION_META]
        : [FieldDefaultValues.LOCATION_META];
    _setValues(newValues);
  };

  const _onRemove = ({ idx }) => {
    Keyboard.dismiss();
    // component state
    const componentData = mapToComponentRemove({
      existingValues: _values,
      idx,
    });
    _setValues(componentData);
    // grouped/form state (if applicable)
    if (onChange) {
      onChange({ key: fieldKey, value: componentData });
      return;
    }
    // in-memory cache (and persisted storage) state
    const cachedData = cache.get(cacheKey);
    if (!cachedData?.[fieldKey]) return;
    cachedData[fieldKey] = componentData;
    mutate(cacheKey, cachedData);
    // remote API state (conditional, if it already existed and had a key)
    let data = null;
    if (_values?.[idx]?.key) {
      data = mapToAPIRemoveText({ fieldKey, key: _values[idx].key });
    }
    if (_values[idx]?.grid_meta_id) {
      data = mapToAPIRemoveGrid({
        fieldKey,
        grid_meta_id: Number(_values[idx].grid_meta_id),
      });
    }
    if (!data) return;
    updatePost({ data });
    return;
  };

  const _onChange = ({ idx, value }) => {
    if (!idx && idx !== 0) return;
    const componentData = mapToComponent({
      existingValues: _values,
      idx,
      newValue: value,
    });
    _setValues(componentData);
    // grouped/form state (if applicable)
    if (onChange) {
      onChange({ key: fieldKey, value: componentData });
      return;
    }
    // in-memory cache (and persisted storage) state
    const cachedData = cache.get(cacheKey);
    cachedData[fieldKey] = componentData;
    mutate(cacheKey, cachedData);
    // remote API state
    const newValue = componentData[idx];
    const data = mapToAPIText({ fieldKey, newValue });
    updatePost({ data });
    return;
  };

  const keyboardType = getKeyboardType({ field });
  return (
    <View style={{ position: "relative", top: -10 }}>
      <AddIcon
        onPress={() => _onAdd({ _values, _setValues })}
        style={{ color: "green", position: "relative", top: -17, left: -30 }}
      />
      {_values?.map((value, idx) => {
        const isFreeText = !(value?.grid_meta_id || value?.grid_id);
        return (
          <CommunicationTextInput
            key={idx}
            idx={idx}
            controls={onChange ? false : true}
            defaultValue={value?.label ?? ""}
            onChange={_onChange}
            onRemove={_onRemove}
            keyboardType={keyboardType}
            editable={isFreeText}
          />
        );
      })}
    </View>
  );
};

/*
FROM D.T:
[
  {
    "grid_id": "100246375",
    "grid_meta_id": "1293",
    "label": "Puerto Escondido, Oaxaca, Mexico",
    "lat": "15.8719795",
    "level": "locality",
    "lng": "-97.0767365",
    "post_id": "841",
    "post_type": "contacts",
    "postmeta_id_location_grid": "29116",
    "source": "user",
  },
  {
    "grid_id": "100245968",
    "grid_meta_id": "1759",
    "label": "Puerto Vallarta, Jalisco, Mexico",
    "lat": "20.653407",
    "level": "locality",
    "lng": "-105.2253316",
    "post_id": "841",
    "post_type": "contacts",
    "postmeta_id_location_grid": "35215",
    "source": "user",
  },
]
TO D.T:
{
  "contact_address": [
    {
      "value": "123 Easy St, Nowhereville"
    }
  ]
}
{
  "location_grid_meta": {
    "values": [
      {
        "lng": -105.2253316,
        "lat": 20.653407,
        "level": "locality",
        "label": "Puerto Vallarta, Jalisco, Mexico",
        "source": "user"
      }
    ]
  }
}
*/

const LocationMetaField = ({
  editing,
  cacheKey,
  fieldKey,
  field,
  values,
  onChange,
}) => {
  const _selectedItems =
    values?.length > 0 ? values : [FieldDefaultValues.LOCATION_META];
  if (editing) {
    return (
      <LocationMetaFieldEdit
        cacheKey={cacheKey}
        fieldKey={fieldKey}
        field={field}
        values={_selectedItems}
        onChange={onChange}
      />
    );
  }
  return <LocationMetaFieldView field={field} values={_selectedItems} />;
};
export default LocationMetaField;
