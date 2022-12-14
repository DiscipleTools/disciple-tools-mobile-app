import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { RemoveIcon } from "components/Icon";

import CommunicationLink from "./CommunicationLink";
import TextField from "components/Field/Text/TextField";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useDebounce from "hooks/use-debounce";
import useStyles from "hooks/use-styles";

import { FieldDefaultValues } from "constants";

import { localStyles } from "./CommunicationChannelField.styles";

const mapToComponent = ({ existingValues, idx, newValue }) => {
  let newValues = [...existingValues];
  const prevValue = existingValues[idx];
  if (prevValue?.value === newValue) return existingValues;
  if (!newValue?.value) return existingValues;
  const mergedValue = { ...prevValue, value: newValue.value };
  newValues[idx] = mergedValue;
  return newValues;
};

// eg, {"contact_email":[{"key":"contact_email_123","value":"101"}]}
const mapToAPI = ({ fieldKey, newValue }) => {
  const data = { [fieldKey]: [{ value: newValue?.value }] };
  // use existing key if available, otherwise API will create a new key
  if (newValue?.key) data[fieldKey][0].key = newValue.key;
  return data;
};

const mapToComponentRemove = ({ existingValues, idx }) => {
  let newValues = [...existingValues];
  // if only remaining field and is empty, do not remove
  if (idx === 0 && existingValues?.length === 1) {
    const removedValue = newValues[idx];
    // if value is not empty, clear it
    if (removedValue?.value !== "") {
      removedValue.value = "";
    }
    return newValues;
  }
  return newValues.filter((_, _idx) => _idx !== idx);
};

// eg, {"contact_email":[{"key":"contact_email_123","delete":true}]}
const mapToAPIRemove = ({ fieldKey, key }) => {
  return { [fieldKey]: [{ key, delete: true }] };
};

const CommunicationChannelFieldView = ({ values }) => {
  return values?.map((value, idx) => (
    <CommunicationLink
      key={value?.key ?? idx}
      entryKey={value?.key ?? idx}
      value={value?.value}
    />
  ));
};

// ref: https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#communication_channel
const CommunicationTextField = ({
  idx,
  grouped,
  cacheKey,
  fieldKey,
  field,
  value,
  onChange,
  onRemove,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const [_value, _setValue] = useState(value);
  const _text = value?.value ?? "";

  // TODO: 1000 too slow and user may click plus sign, but less is too fast for entries like email
  const debouncedValue = useDebounce(_value, 1500);

  useEffect(() => {
    if (debouncedValue?.value !== value?.value) {
      onChange({ idx, value: debouncedValue });
    }
    return;
  }, [debouncedValue]);

  const getKeyboardType = () => {
    const fieldName = field?.name?.toLowerCase();
    if (!fieldName) return "default";
    if (fieldName.includes("phone")) return "phone-pad";
    if (fieldName.includes("email")) return "email-address";
    return "default";
  };

  const keyboardType = getKeyboardType();
  return (
    <View style={globalStyles.rowContainer}>
      <View style={styles.container}>
        <TextField
          editing
          grouped={grouped}
          cacheKey={cacheKey}
          fieldKey={fieldKey}
          field={field}
          value={_text}
          /*
           * NOTE: this 'onChange' may be unexpected bc the TextField component
           * returns fieldKey with value (not just text value)
           */
          onChange={_setValue}
          style={styles.input}
          keyboardType={keyboardType}
        />
      </View>
      <View style={styles.removeIcon}>
        <RemoveIcon
          onPress={() => onRemove({ idx })}
          style={{ color: "red" }}
        />
      </View>
    </View>
  );
};

const CommunicationChannelFieldEdit = ({
  grouped,
  cacheKey,
  fieldKey,
  field,
  values,
  onChange,
}) => {
  const [_values, _setValues] = useState(values?.length > 0 ? values : []);

  const { cache, mutate } = useCache();
  const { updatePost } = useAPI();

  const _onRemove = ({ idx }) => {
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

  return _values?.map((value, idx) => {
    if (value?.delete === true) return null;
    return (
      <CommunicationTextField
        key={idx}
        idx={idx}
        grouped={grouped}
        cacheKey={cacheKey}
        fieldKey={fieldKey}
        field={field}
        value={value}
        onChange={_onChange}
        onRemove={_onRemove}
      />
    );
  });
};

const CommunicationChannelField = ({
  editing,
  grouped,
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
        grouped={grouped}
        cacheKey={cacheKey}
        fieldKey={fieldKey}
        field={field}
        values={_values}
        onChange={onChange}
      />
    );
  }
  return <CommunicationChannelFieldView values={_values} />;
};
export default CommunicationChannelField;
