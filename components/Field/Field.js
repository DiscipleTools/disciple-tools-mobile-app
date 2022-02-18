import React, { useState } from "react";
import { Text, View } from "react-native";
import {
  AddIcon,
  ClearIcon,
  EditIcon,
  SaveIcon
} from "components/Icon";
import FieldIcon from "components/Field/FieldIcon";
import BooleanField from "components/Field/Boolean/BooleanField";
import CommunicationChannelField from "components/Field/CommunicationChannel/CommunicationChannelField";
import ConnectionField from "components/Field/Connection/ConnectionField";
import DateField from "components/Field/Date/DateField";
import KeySelectField from "components/Field/KeySelect/KeySelectField";
import LocationField from "components/Field/Location/LocationField";
import MultiSelectField from "components/Field/MultiSelect/MultiSelectField";
import NumberField from "components/Field/Number/NumberField";
import TagsField from "components/Field/Tags/TagsField";
import TextField from "components/Field/Text/TextField";
import UserSelectField from "components/Field/UserSelect/UserSelectField";

import MemberList from "components/MemberList";

import useAPI from "hooks/useAPI";
import useStyles from "hooks/useStyles";

import { FieldConstants, FieldTypes, FieldNames } from "constants";

import { localStyles } from "./Field.styles";

const Field = ({ grouped=false, editing=false, field, post, onChange, mutate }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { updatePost } = useAPI();

  // uncomment line below to enforce post must have data values for a field (ie, uncomment to hide empty fields) 
  //if (!post.hasOwnProperty(field?.name)) return null;

  let value = null;
  try { value = post[field?.name]; } catch (error) {};

  const [_editing, _setEditing] = useState(editing);
  const [_value, _setValue] = useState(value);

  const isRequiredField = (field) => {
    const name = field?.name;
    if (name === FieldNames.NAME) return true;
    return false;
  };

  const isUndecoratedField = () => {
    const name = field?.name;
    return (
      name === FieldNames.PARENT_GROUPS ||
      name === FieldNames.PEER_GROUPS ||
      name === FieldNames.CHILD_GROUPS
    );
  };

  const isUncontrolledField = () => {
    const fieldType = field?.type;
    return(
      grouped || fieldType !== FieldTypes.COMMUNICATION_CHANNEL
    );
  };

  const isMultiInputTextField = () => {
    const fieldType = field?.type;
    return(
      fieldType === FieldTypes.COMMUNICATION_CHANNEL ||
      fieldType === FieldTypes.LOCATION_META
    );
  };

  /*
   * Map Field to API format
   *
   * This method differs from individual Field 'mapToAPI' methods because
   * those implementations are mapping values, and this is mapping those
   * mapped values to the corresponding Field Name
   */
  const mapToAPI = (newValue, { force } = {}) => {
    if (field?.type === FieldTypes.COMMUNICATION_CHANNEL) {
      newValue = newValue.map(value => {
        if (!value?.key) {
          const random3Chars = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0,3);
          value["key"] = `${field?.name}_${random3Chars}`;
        };
        return value;
      });
    };
    let data = { [field?.name]: newValue };
    if (force && newValue?.values && field?.type !== FieldTypes.COMMUNICATION_CHANNEL) data[field?.name]["force_values"] = true;
    //if (newValue?.values && field?.type !== FieldTypes.COMMUNICATION_CHANNEL) data[field?.name]["force_values"] = force ?? false;
    return data;
  };

  const _onSave = async(newValue) => {
    // TODO: handle this differently (we shouldn't need one-off for this field.type)
    if (field?.type === FieldTypes.COMMUNICATION_CHANNEL) newValue = mapToAPI(newValue);
    await updatePost(newValue);
    mutate();
  };

  const _onCancel = () => {
    _setEditing(false);
    _setValue(value);
  };

  /*
   * NOTE:
   * - if grouped, lift state up to Tile
   * - if autosave, update API directly and immediately (via useAPI hook)
   * - else, await user interaction with manual save/clear icons
   */
  const _onChange = (newValue, { autosave, force } = {}) => {
    const mappedField = mapToAPI(newValue, { force });
    if (grouped) {
      onChange(mappedField);
      return;
    };
    if (autosave) {
      onChange(mappedField);
      _onSave(mappedField);
      return;
    };
    _setValue(newValue);
    return;
  };

  const DefaultControls = () => (
    <EditIcon onPress={_setEditing} />
  );

  const EditControls = () => {
    // TODO: ignore empty communication channel fields
    const hasChanged = _value !== value; // && !(value === null && (_value === null || _value === ''));
    return(
      <View style={globalStyles.rowContainer}>
        <ClearIcon onPress={_onCancel} />
        { hasChanged && (
          <SaveIcon onPress={() => _onSave(_value)} />
        )}
      </View>
    );
  };

  const Controls = () => {
    if (isUncontrolledField()) return null;
    if (_editing) return <EditControls />;
    return <DefaultControls />;
  };

  const FieldComponent = () => {
    switch (field?.type) {
      case FieldTypes.BOOLEAN:
        return (
          <BooleanField
            editing={_editing}
            value={_value}
            onChange={_onChange}
          />
        );
      case FieldTypes.COMMUNICATION_CHANNEL:
        return (
          <CommunicationChannelField
            grouped={grouped}
            editing={grouped ? true : _editing}
            field={field}
            values={_value}
            onChange={_onChange}
            onAdd={_onAdd}
          />
        );
      case FieldTypes.CONNECTION:
        return (
          <ConnectionField
            //editing={_editing}
            editing
            field={field}
            value={_value}
            onChange={_onChange}
          />
        );
      case FieldTypes.DATE:
        return (
          <DateField
            editing={_editing}
            field={field}
            value={_value}
            onChange={_onChange}
          />
        );
      case FieldTypes.KEY_SELECT:
        return (
          <KeySelectField
            editing
            field={field}
            value={_value}
            onChange={_onChange}
          />
        );
      case FieldTypes.LOCATION_META:
        return (
          <LocationField
            editing={_editing}
            value={_value}
            onChange={_onChange}
          />
        );
      case FieldTypes.MULTI_SELECT:
        return (
          <MultiSelectField
            editing
            field={field}
            value={_value}
            onChange={_onChange}
          />
        );
      case FieldTypes.NUMBER:
        // TODO:
        //{ field?.name === FieldNames.MEMBER_COUNT
        //<MemberList members={post?.members?.values} />
        return (
          <NumberField
            grouped={grouped}
            editing
            value={_value}
            onChange={_onChange}
          />
        );
      case FieldTypes.TAGS:
        return (
          <TagsField
            //editing={_editing}
            //editing
            field={field}
            value={_value}
            onChange={_onChange}
          />
        );
      case FieldTypes.TEXT:
        return (
          <TextField
            grouped={grouped}
            editing
            value={_value}
            onChange={_onChange}
          />
        );
      case FieldTypes.USER_SELECT:
        return (
          <UserSelectField
            editing
            field={field}
            value={_value}
            onChange={_onChange}
          />
        );
      default:
        return null;
    }
  };

  if (isUndecoratedField()) {
    return (
      <View style={globalStyles.postDetailsContainer}>
        <View style={{ marginEnd: "auto" }}>
          <FieldComponent />
        </View>
        <Controls />
      </View>
    );
  };

  const _onAdd = () => {
    const newValue = _value ? [..._value, { value: '' }] : [{ value: '' }];
    const mappedValue = mapToAPI(newValue);
    _onChange(newValue);
    if (!grouped) _setEditing(true);
  };

  /*
   * [ICON | LABEL              | CONTROL(S)]
   */
  const FieldLabelControls = ({ label }) => (
    <View style={[globalStyles.rowContainer, styles.fieldLabelContainer]}>
      <FieldIcon field={field} />
      <View style={styles.fieldLabel}>
        <Text style={styles.fieldLabelText}>
          {label}
        </Text>
      </View>
      { isMultiInputTextField() && (
        <View>
          <AddIcon onPress={() => _onAdd()} />
        </View>
      )}
      <View style={styles.fieldControls}>
        <Controls />
      </View>
    </View>
  );

  /*
   * ____________________________________
   * | FieldLabelControls.............. |
   * | FieldComponent.................. |
   * |__________________________________|
   */
  return (
    <View style={styles.container}>
      <FieldLabelControls label={ field?.label } />
      <View style={
        (isUndecoratedField() || isMultiInputTextField()) ? null : styles.component
      }>
        <FieldComponent />
      </View>
    </View>
  );
};
export default Field;
