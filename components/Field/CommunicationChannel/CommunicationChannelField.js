import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { RemoveIcon } from "components/Icon";

import CommunicationLink from "./CommunicationLink";

import useDebounce from "hooks/useDebounce";
import useStyles from "hooks/useStyles";

import { localStyles } from "./CommunicationChannelField.styles";

const CommunicationChannelField = ({ grouped=false, editing, field, values, onChange, onAdd }) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const [_editing, _setEditing] = useState(editing);

  if (!values) values = [];

  const _onRemove = (idx) => {
    // ref: https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#communication_channel
    if (idx === 0 && values?.length === 1) return;
    const newValues = JSON.parse(JSON.stringify(values));
    if (newValues[idx]?.key) {
      newValues[idx] = { key: newValues[idx].key, delete: true };
      _onChange(newValues);
      return;
    }
    newValues.splice(idx,1);
    _onChange(newValues);
    return;
  };

  const _onChange = (newValues) => {
    if (JSON.stringify(newValues) !== JSON.stringify(values)) {
      onChange(newValues);
    };
  };

  // TODO: validate input per field type (eg, email, phone, etc)?
  const renderTextInput = (value, idx) => {

    const [_text, _setText] = useState(value?.value);
    // TODO: 1000 too slow and user may click plus sign, but less is too fast for entries like email
    const debouncedText = useDebounce(_text, 1500);

    useEffect(() => {
      if (debouncedText !== values?.[idx]?.value) {
        const newValues = JSON.parse(JSON.stringify(values));
        const newValue = newValues[idx];
        newValue["value"] = debouncedText;
        newValues[idx] = newValue;
        _onChange(newValues);
      };
      return;
    }, [debouncedText]);

    // do not display fields scheduled for deletion
    if (value?.delete) return null;

    const getKeyboardType = () => {
      if (field?.name?.includes("phone")) return "phone-pad";
      if (field?.name?.includes("email")) return "email-address";
      return "default";
    };

    const keyboardType = getKeyboardType();
    return(
      <View style={globalStyles.rowContainer}>
        <View style={styles.container}>
            <TextInput
              key={idx}
              value={_text}
              onChangeText={_setText}
              style={styles.input}
              keyboardType={keyboardType}
            />
        </View>
        <View style={styles.removeIcon}>
          <RemoveIcon key={idx} onPress={() => _onRemove(idx)}
          style={{ color: "red" }} />
        </View>
      </View>
    );
  };

  const allMarkedForDeletion = () => values?.filter(value => value?.delete)?.length === values?.length;

  const CommunicationChannelFieldEdit = () => {
    // if empty (or all marked for deletion), then add to offer at least 1 input
    if (!values || values?.length === 0 || allMarkedForDeletion()) {
      onAdd();
      return null;
    };
    return values?.map((value, idx) => {
      if (value?.delete === true) return null;
      return renderTextInput(value, idx)
    });
  };

  const CommunicationChannelFieldView = () => {
    // if empty, display input placeholder
    if (values?.length === 0) return <View style={styles.container} />;
    return values?.map((value, idx) => (
      <CommunicationLink
        key={value?.key ?? idx}
        value={value?.value}
        fieldName={field?.name}
      />
    ));
  };

  if (_editing) return <CommunicationChannelFieldEdit />;
  return <CommunicationChannelFieldView />;
};
export default CommunicationChannelField;
