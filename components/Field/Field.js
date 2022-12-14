import { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";

import { AddIcon, CancelIcon, EditIcon } from "components/Icon";
import FieldSkeleton from "./FieldSkeleton";
import FieldIcon from "./FieldIcon";

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

import useStyles from "hooks/use-styles";

import { FieldDefaultValues, FieldTypes, FieldNames } from "constants";

import { localStyles } from "./Field.styles";

const Field = ({
  grouped,
  editing,
  cacheKey,
  fieldKey,
  field,
  post,
  onChange,
  onRemove,
}) => {
  const windowWidth = useWindowDimensions()?.width;
  const { styles, globalStyles } = useStyles(localStyles);

  let value = null;
  try {
    value = post[fieldKey];
  } catch (error) {}

  const [_loading, _setLoading] = useState(false);
  const [_editing, _setEditing] = useState(editing);
  const [_value, _setValue] = useState(value);

  if (field?.hidden === true) return null;
  if (
    fieldKey?.startsWith("reason_") &&
    post?.[FieldNames.OVERALL_STATUS]?.key &&
    fieldKey !== `reason_${post[FieldNames.OVERALL_STATUS].key}`
  ) {
    return null;
  }

  const isRequired = field?.required;
  const fieldName = field?.name;
  const fieldType = field?.type;

  // uncomment line below to enforce post must have data values for a field (ie, uncomment to hide empty fields)
  //if (!post.hasOwnProperty(fieldName)) return null;

  const isGroupField =
    (fieldName === FieldNames.GROUPS ||
      fieldName === FieldNames.PARENT_GROUPS ||
      fieldName === FieldNames.PEER_GROUPS ||
      fieldName === FieldNames.CHILD_GROUPS) &&
    _value?.length > 0;

  const isMultiInputTextField =
    fieldType === FieldTypes.COMMUNICATION_CHANNEL ||
    fieldType === FieldTypes.LOCATION_META;

  const getNewValue = ({ field }) => {
    if (field?.type === FieldTypes.COMMUNICATION_CHANNEL) {
      return FieldDefaultValues.COMMUNICATION_CHANNEL;
    }
    return "";
  };

  const _onAdd = () => {
    _setEditing(true);
    const newValue = getNewValue({ field });
    _setValue(_value?.length > 0 ? [..._value, newValue] : [newValue]);
  };

  const _onCancel = () => {
    _setEditing(false);
    _setValue(value);
  };

  const DefaultControls = () => <EditIcon onPress={_setEditing} />;

  const EditControls = () => {
    return (
      <View style={globalStyles.rowContainer}>
        <CancelIcon onPress={_onCancel} />
      </View>
    );
  };

  const isUncontrolledField = () => {
    if (fieldType === FieldTypes.CONNECTION && isGroupField) return false;
    if (
      fieldType === FieldTypes.MULTI_SELECT &&
      fieldName === FieldNames.CHURCH_HEALTH
    )
      return false;
    return fieldType !== FieldTypes.COMMUNICATION_CHANNEL;
  };

  const Controls = () => {
    if (isUncontrolledField()) return null;
    if (_editing) return <EditControls />;
    return <DefaultControls />;
  };

  const FieldComponent = () => {
    if (field?.name === FieldNames.INFLUENCE) {
      return (
        <TextField
          editing
          cacheKey={cacheKey}
          fieldKey={fieldKey}
          field={field}
          value={value}
          onChange={onChange}
        />
      );
    }

    switch (field?.type) {
      case FieldTypes.BOOLEAN:
        return (
          <BooleanField
            editing={_editing}
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            value={_value}
            onChange={onChange}
          />
        );
      case FieldTypes.COMMUNICATION_CHANNEL:
        return (
          <CommunicationChannelField
            grouped={grouped}
            editing={grouped ? true : _editing}
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            field={field}
            values={_value}
            onChange={onChange}
          />
        );
      case FieldTypes.CONNECTION:
        return (
          <ConnectionField
            editing={isGroupField ? _editing : true}
            post={post}
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            field={field}
            value={_value}
          />
        );
      case FieldTypes.DATE:
        return (
          <DateField
            editing={_editing}
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            value={_value}
            onChange={onChange}
          />
        );
      case FieldTypes.KEY_SELECT:
        return (
          <KeySelectField
            editing
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            field={field}
            value={value}
            onChange={onChange}
          />
        );
      case FieldTypes.LOCATION_META:
        // TODO: support?
        return null;
      case FieldTypes.LOCATION:
        return (
          <LocationField
            editing
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            field={field}
            value={_value}
            onChange={onChange}
            onRemove={onRemove}
          />
        );
      case FieldTypes.MULTI_SELECT:
        return (
          <MultiSelectField
            editing
            post={post}
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            field={field}
            value={_value}
            onChange={onChange}
          />
        );
      case FieldTypes.NUMBER:
        return (
          <NumberField
            editing
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            field={field}
            value={_value}
            onChange={onChange}
          />
        );
      case FieldTypes.TAGS:
        return (
          <TagsField
            editing
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            field={field}
            value={_value}
            onChange={onChange}
          />
        );
      case FieldTypes.TEXT: {
        return (
          <TextField
            editing
            grouped={grouped}
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            field={field}
            value={value}
            onChange={onChange}
          />
        );
      }
      case FieldTypes.USER_SELECT:
        return (
          <UserSelectField
            editing
            cacheKey={cacheKey}
            fieldKey={fieldKey}
            field={field}
            value={_value}
            onChange={onChange}
          />
        );
      default:
        return null;
    }
  };

  /*
   * [ICON | LABEL              | CONTROL(S)]
   */
  const FieldLabelControls = ({ label }) => {
    label = isRequired ? `${label}*` : label;
    return (
      <View style={[globalStyles.rowContainer, styles.fieldLabelContainer]}>
        <View>
          <FieldIcon field={field} />
        </View>
        <View>
          <Text style={styles.fieldLabelText}>{label}</Text>
        </View>
        {isMultiInputTextField && (
          <View>
            <AddIcon onPress={() => _onAdd()} style={{ color: "green" }} />
          </View>
        )}
        <View style={styles.fieldControls}>
          <Controls />
        </View>
      </View>
    );
  };

  /*
   * ____________________________________
   * | FieldLabelControls.............. |
   * | FieldComponent.................. |
   * |__________________________________|
   */
  return (
    <View style={styles.container}>
      <FieldLabelControls label={fieldName} />
      <View style={isMultiInputTextField ? null : styles.component}>
        {_loading ? (
          <FieldSkeleton windowWidth={windowWidth - 10 ?? 400} />
        ) : (
          <FieldComponent />
        )}
      </View>
    </View>
  );
};
export default Field;
