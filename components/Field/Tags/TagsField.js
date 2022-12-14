import { useRef, useState } from "react";
import { View } from "react-native";

import { ClearIcon, TagIcon } from "components/Icon";
import Select from "components/Select";
import Chip from "components/Chip";
import PostChip from "components/Post/PostChip";
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import TagsSheet from "./TagsSheet";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useStyles from "hooks/use-styles";

import { localStyles } from "./TagsField.styles";

// eg, {"tags":{"values":[{"value":"person of peace"}]}}
const mapToAPI = ({ fieldKey, newValue }) => {
  return { [fieldKey]: { values: [{ value: newValue }] } };
};

// eg, {"tags":{"values":[{"value":"person of peace", delete: true}]}}
const mapToAPIRemove = ({ fieldKey, existingValue }) => {
  return { [fieldKey]: { values: [{ value: existingValue, delete: true }] } };
};

const renderItemView = (item) => (
  <PostChip id={null} title={item} type={null} />
);

const TagsFieldView = ({ items }) => (
  <Select items={items} renderItem={renderItemView} />
);

const TagsFieldEdit = ({
  cacheKey,
  fieldKey,
  fieldLabel,
  values,
  setValues,
  renderItem,
  onChange,
}) => {
  const { styles } = useStyles(localStyles);

  const { cache, mutate } = useCache();
  const { updatePost } = useAPI();

  const _onRemove = async (existingValue) => {
    // component state
    setValues(values.filter((item) => item !== existingValue));
    // in-memory cache (and persisted storage) state
    const cachedData = cache.get(cacheKey);
    const cachedDataModified = cachedData?.[fieldKey]?.filter(
      (item) => item !== existingValue
    );
    if (!cachedDataModified) return;
    cachedData[fieldKey] = cachedDataModified;
    mutate(cacheKey, async () => cachedData, { revalidate: false });
    // remote API state
    const data = mapToAPIRemove({ fieldKey, existingValue });
    await updatePost({ data });
  };

  const _onChange = async (newValue) => {
    const exists = values?.some((item) => item === newValue);
    if (exists) {
      _onRemove(newValue);
      return;
    }
    // component state
    setValues([...values, newValue]);
    // in-memory cache (and persisted storage) state
    const cachedData = cache.get(cacheKey);
    cachedData[fieldKey] = cachedData?.[fieldKey]
      ? [...cachedData[fieldKey], newValue]
      : [newValue];
    mutate(cacheKey, async () => cachedData, { revalidate: false });
    // remote API state
    const data = mapToAPI({ fieldKey, newValue });
    await updatePost({ data });
  };

  const _renderItem = (item) => (
    <Chip
      label={item}
      startIcon={<TagIcon style={styles.startIcon} />}
      endIcon={
        _onRemove ? (
          <View style={styles.clearIconContainer(false)}>
            <ClearIcon
              onPress={() => _onRemove(item)}
              style={styles.clearIcon}
            />
          </View>
        ) : null
      }
    />
  );

  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = `${fieldKey}_modal`;
  const defaultIndex = getDefaultIndex();

  return (
    <>
      <Select
        onOpen={() => modalRef.current?.present()}
        items={values ?? null}
        renderItem={renderItem ?? _renderItem}
      />
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={fieldLabel}
        defaultIndex={defaultIndex}
      >
        <TagsSheet values={values} onChange={_onChange} modalName={modalName} />
      </ModalSheet>
    </>
  );
};

const TagsField = ({ editing, cacheKey, fieldKey, field, value, onChange }) => {
  const [_values, _setValues] = useState(value);

  if (editing) {
    return (
      <TagsFieldEdit
        cacheKey={cacheKey}
        fieldKey={fieldKey}
        fieldLabel={field?.name}
        values={_values}
        setValues={_setValues}
        onChange={onChange}
      />
    );
  }
  return <TagsFieldView items={value} />;
};
export default TagsField;
