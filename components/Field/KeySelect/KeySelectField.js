import React, { useRef, useState } from "react";
import { Text, View } from "react-native";

import { SquareIcon } from "components/Icon";
import Select from "components/Select";
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import SelectSheet from "components/Sheet/SelectSheet";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
//import useId from "hooks/use-id";
import useStyles from "hooks/use-styles";

import { FieldNames } from "constants";

import { localStyles } from "./KeySelectField.styles";

// eg, {"group_status":"inactive"}
const mapToAPI = ({ fieldKey, newValue }) => ({[fieldKey]: newValue?.key });

const KeySelectFieldEdit = ({
  cacheKey,
  fieldOptions,
  fieldKey,
  fieldLabel,
  selectedLabel,
  value,
  setValue,
  onChange,
}) => {

  const { styles } = useStyles(localStyles);
  //const postId = useId();
  const { setCacheByKey } = useCache();
  const { updatePost } = useAPI();

  // TODO: TS type "newValue"
  const _onChange = async(newValue) => {
    if (newValue?.key !== value?.key) {
      modalRef.current?.dismiss();
      // component state
      setValue(newValue);
      const data = mapToAPI({ fieldKey, newValue });
      // grouped/form state (if applicable)
      if (onChange) {
        onChange({ key: fieldKey, value: { key: data?.[fieldKey] }});
        return;
      };
      // in-memory cache (and persisted storage) state
      // TODO: use cache, mutate directly
      setCacheByKey({ cacheKey, fieldKey, newValue });
      // remote API state
      await updatePost({ data });
    };
    return;
  };

  const isStatusField = (
    fieldKey === FieldNames.OVERALL_STATUS ||
    fieldKey === FieldNames.GROUP_STATUS
  );

  const mapValueToComponent = ({ options, value }) => {
    const keys = Object.keys(options);
    const data = keys.map((key) => {
      const backgroundColor = options?.[key]?.color;
      return {
        key,
        label: options[key]?.label,
        icon: isStatusField ? <SquareIcon style={ backgroundColor ? { color: backgroundColor } : null } /> : null,
        selected: value === key,
      };
    });
    return [{ data }];
  };

  const sections = mapValueToComponent({
    options: fieldOptions,
    value: value?.key,
  });

  const renderItem = (item, idx) => (
    <View key={idx} style={styles.container}>
      <Text>{item}</Text>
    </View>
  );

  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = `${fieldKey}_modal`;
  const defaultIndex =  getDefaultIndex({ items: sections?.[0]?.data });

  const backgroundColor = fieldOptions?.[value?.key]?.color ?? null;

  // TODO: postItem.description (for Reason)
  return (
    <>
      <Select
        onOpen={() => modalRef.current?.present()} 
        items={[selectedLabel]}
        renderItem={renderItem}
        style={{backgroundColor}}
      />
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={fieldLabel}
        defaultIndex={defaultIndex}
      >
        <SelectSheet
          required
          sections={sections}
          onChange={_onChange}
          modalName={modalName}
        />
      </ModalSheet>
    </>
  );
};

const KeySelectFieldView = ({ selectedLabel }) => <Text>{selectedLabel}</Text>;

const KeySelectField = ({
  editing,
  cacheKey,
  fieldKey,
  field,
  value,
  onChange
}) => {

  const [_value, _setValue] = useState(value);
  const fieldOptions = field?.default;
  const selectedLabel = fieldOptions[_value?.key]?.label ?? "";

  if (editing) {
    return(
      <KeySelectFieldEdit
        cacheKey={cacheKey}
        fieldOptions={fieldOptions}
        fieldKey={fieldKey}
        fieldLabel={field?.name}
        selectedLabel={selectedLabel}
        value={_value}
        setValue={_setValue}
        onChange={onChange}
      />
    );
  };
  return <KeySelectFieldView selectedLabel={selectedLabel} />;
};
export default KeySelectField;