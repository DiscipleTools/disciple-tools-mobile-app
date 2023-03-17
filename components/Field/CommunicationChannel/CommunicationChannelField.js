import React, { useState } from "react";
import { Keyboard, View } from "react-native";

import CommunicationLink from "./CommunicationLink";
import CommunicationTextInput from "./CommunicationTextInput";

import { AddIcon } from "components/Icon";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";

import { FieldDefaultValues } from "constants";

import { getKeyboardType } from "helpers";

const mapToComponent = ({ existingValues, idx, newValue }) => {
  let newValues = [...existingValues];
  const prevValue = existingValues[idx];
  if (prevValue?.value === newValue) return existingValues;
  if (!newValue) return existingValues;
  const mergedValue = { ...prevValue, value: newValue };
  newValues[idx] = mergedValue;
  return newValues;
};

const mapToComponentRemove = ({ existingValues, idx }) => {
  if (idx === 0 && existingValues?.length === 1) {
    const newValues = [...existingValues];
    newValues[idx].value = "";
    return newValues;
  }
  return existingValues.filter((_, i) => i !== idx);
};

// eg, {"contact_email":[{"key":"contact_email_123","value":"101"}]}
const mapToAPI = ({ fieldKey, newValue }) => {
  const data = { [fieldKey]: [{ value: newValue?.value }] };
  // use existing key if available, otherwise API will create a new key
  if (newValue?.key) data[fieldKey][0].key = newValue.key;
  return data;
};

// eg, {"contact_email":[{"key":"contact_email_123","delete":true}]}
const mapToAPIRemove = ({ fieldKey, key }) => {
  return { [fieldKey]: [{ key, delete: true }] };
};

const CommunicationChannelFieldView = ({ field, values }) => {
  const fieldName = field?.name?.toLowerCase();
  return values?.map((value, idx) => (
    <CommunicationLink
      key={value?.key ?? idx}
      fieldName={fieldName}
      entryKey={value?.key ?? idx}
      value={value?.value}
    />
  ));
};

const CommunicationChannelFieldEdit = ({
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
        ? [..._values, FieldDefaultValues.COMMUNICATION_CHANNEL]
        : [FieldDefaultValues.COMMUNICATION_CHANNEL];
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
    if (_values?.[idx]?.key) {
      const data = mapToAPIRemove({ fieldKey, key: _values[idx].key });
      updatePost({ data });
    }
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
    const data = mapToAPI({ fieldKey, newValue });
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
        return (
          <CommunicationTextInput
            key={idx}
            idx={idx}
            controls={onChange ? false : true}
            defaultValue={value?.value ?? ""}
            onChange={_onChange}
            onRemove={_onRemove}
            keyboardType={keyboardType}
          />
        );
      })}
    </View>
  );
};

const CommunicationChannelField = ({
  editing,
  cacheKey,
  fieldKey,
  field,
  values,
  onChange,
}) => {
  const _values =
    values?.length > 0 ? values : [FieldDefaultValues.COMMUNICATION_CHANNEL];
  if (editing) {
    return (
      <CommunicationChannelFieldEdit
        cacheKey={cacheKey}
        fieldKey={fieldKey}
        field={field}
        values={_values}
        onChange={onChange}
      />
    );
  }
  return <CommunicationChannelFieldView field={field} values={_values} />;
};
export default CommunicationChannelField;
