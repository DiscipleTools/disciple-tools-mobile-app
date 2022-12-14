import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";

import { CancelIcon, SaveIcon } from "components/Icon";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useDebounce from "hooks/use-debounce";
import useType from "hooks/use-type";
import useStyles from "hooks/use-styles";

import { FieldNames } from "constants";

import { localStyles } from "./TextField.styles";
import { getListURL } from "helpers/urls";
import { getCurrentDate } from "helpers";

const mapFromAPI = ({ value }) => {
  if (!value) return '';
  return typeof value === "string" ? value : value?.toString();
};

// eg, {"name":"Jane Doe"}
const mapToAPI = ({ fieldKey, newValue }) => ({ [fieldKey]: newValue });

const TextFieldView = ({ value }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return(
    <View style={styles.container}>
      <View style={globalStyles.rowContainer}>
        <Text style={styles.input}>{value}</Text>
      </View>
    </View>
  );
};

const TextFieldEdit = ({
  editing,
  grouped,
  cacheKey,
  fieldKey,
  field,
  value,
  onChange,
  keyboardType
}) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const { postType } = useType();

  const { cache, mutate } = useCache();
  const { updatePost } = useAPI();

  const mappedValue = mapFromAPI({ value })
  const [_value, _setValue] = useState(mappedValue);

  useEffect(() => {
    if (_value !== mappedValue) {
      _setValue(mappedValue);
    };
  }, [mappedValue]);

  // TODO: use env var for debounce time?
  const debouncedValue = useDebounce(_value, 3000); // 3 secs //1500

  const [showSave, setShowSave] = useState(false);

  const isSliderField = field?.name === FieldNames.INFLUENCE;

  const _onClear = useCallback(() => {
    _setValue(mappedValue);
    setShowSave(false);
    Keyboard.dismiss();
  }, [mappedValue]);

  const _onChange = useCallback(async() => {
    // component state
    _setValue(debouncedValue);
    // grouped/form state (if applicable)
    if (onChange) {
      onChange({ key: fieldKey, value: debouncedValue });
      setShowSave(false);
      Keyboard.dismiss();
      return;
    };
    // in-memory cache (and persisted storage) state
    const cachedData = cache.get(cacheKey);
    cachedData[fieldKey] = debouncedValue;
    if (fieldKey === FieldNames.NAME) {
      // in order to update the header value, also set the "title" field
      cachedData[FieldNames.TITLE] = debouncedValue;
      // this is for updating the cached list view
      cachedData[FieldNames.POST_TITLE] = debouncedValue;
      // update list cache
      const listURL = getListURL({ postType });
      const cachedList = cache.get(listURL);
      if (cachedList?.posts?.length > 0) {
        const idx = cachedList?.posts?.findIndex((item) => item.ID === cachedData.ID.toString());
        if (idx || idx === 0) {
          const currentDate = getCurrentDate();
          cachedData[FieldNames.LAST_MODIFIED] = currentDate;
          cachedList.posts[idx] = cachedData;
          mutate(listURL, () => (cachedList), { revalidate: true });
        };
      };
    };
    // revalidate=true here so that the title bar will update immediately
    mutate(cacheKey, () => (cachedData), { revalidate: true });
    // remote API state
    const data = mapToAPI({ fieldKey, newValue: debouncedValue });
    await updatePost({ data });
    setShowSave(false);
    Keyboard.dismiss();
  }, [debouncedValue]);

  useEffect(() => {
    if (debouncedValue !== mappedValue && debouncedValue !== null) {
      if (!grouped && !isSliderField) {
        setShowSave(true);
        return;
      };
      _onChange(debouncedValue);
      return;
    };
    return;
  }, [debouncedValue]);

  if (isSliderField) {
    return <Slider value={_value} onValueChange={_setValue} />;
  };
  return(
    <View style={styles.container}>
      <View style={globalStyles.rowContainer}>
        <TextInput
          keyboardType={keyboardType ?? "default"}
          value={_value}
          onChangeText={_setValue}
          style={styles.input}
        />
        {showSave && (
          <View style={[globalStyles.rowContainer, styles.controlIcons]}>
            <CancelIcon onPress={() => _onClear()} />
            <SaveIcon onPress={() => _onChange()} />
          </View>
        )}
      </View>
    </View>
  );
};

const TextField = ({
  editing,
  grouped,
  cacheKey,
  fieldKey,
  field,
  value,
  onChange,
  keyboardType
}) => {
  if (editing) {
    return(
      <TextFieldEdit
        editing={editing}
        grouped={grouped}
        cacheKey={cacheKey}
        fieldKey={fieldKey}
        field={field}
        value={value}
        onChange={onChange}
        keyboardType={keyboardType}
      />
    );
  };
  return <TextFieldView value={value} />;
};
export default TextField;