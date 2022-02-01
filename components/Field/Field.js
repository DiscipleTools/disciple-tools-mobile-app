import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "native-base";
import { Row, Col } from "react-native-easy-grid";

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
  //console.log(`...FIELD value: ${JSON.stringify(value)}`);
  //console.log(`...post: ${JSON.stringify(post)}`);

  const [_editing, _setEditing] = useState(editing);
  const [_value, _setValue] = useState(value);

  /*
  //const ref = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        alert("You clicked outside of me!");
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  */

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
    if (
      fieldType === FieldTypes.COMMUNICATION_CHANNEL
    ) return false;
    return true;
    return(
      fieldType === FieldTypes.KEY_SELECT ||
      fieldType === FieldTypes.USER_SELECT
    );
  };

  const _onSave = async(newValue) => {
    console.log(`..._onSave: ${JSON.stringify(newValue)}`);
    const fieldType = field?.type;
    let data = { [field?.name]: newValue };
    if (fieldType === FieldTypes.COMMUNICATION_CHANNEL) {
      // NOTE: see CommunicationChannelField.js '_onAdd' 
      const filteredNewValue = newValue.map(value => value?.key?.startsWith(FieldConstants.TMP_KEY_PREFIX) ? { value: value?.value } : value);
      data = { [field?.name]: filteredNewValue };
    };
    console.log(`data: ${JSON.stringify(data)}`);
    await updatePost(data);
    mutate();
  };

  const _onCancel = () => {
    _setEditing(false);
    _setValue(value);
  };

  /*
   * NOTE:
   * - if grouped, then lift state up to Tile
   * - if auto-save (instead of manual save via icon), update API directly
   * - else, set local state (and await manual save via icon)
   */
  const _onChange = (newValue, { autosave } = {}) => {
    console.log(`newValue: ${JSON.stringify(newValue)}`);
    if (grouped) {
      console.log("*** ON CHANGE 1 ***")
      onChange(newValue);
      return;
    };
    if (autosave) {
      console.log("*** ON CHANGE 2 ***")
      _onSave(newValue);
    };
    console.log("*** ON CHANGE N ***")
    _setValue(newValue);
    return;
  };

  const DefaultControls = () => (
    <Col size={1} style={styles.formControls}>
      { !grouped && (
        <Pressable onPress={_setEditing}>
          <Icon
            type={"MaterialIcons"}
            name={"edit"}
            style={globalStyles.icon}
          />
        </Pressable>
      )}
    </Col>
  );

  const EditControls = () => {
    console.log("**** EDIT CONTROLS ****");
    const hasChanged = _value !== value; // && !(value === null && (_value === null || _value === ''));
    console.log(`hasChanged: ${hasChanged}`);
    return(
      <Col size={1} style={styles.formControls}>
        { !grouped && (
          <Row>
            { _editing && hasChanged && (
              <Pressable onPress={() => _onSave(_value)}>
                <Icon
                  type={"MaterialIcons"}
                  name={"save"}
                  style={globalStyles.icon}
                />
              </Pressable>
            )}
            { _editing && !hasChanged && (
              <Pressable onPress={_onCancel}>
                <Icon
                  type={"MaterialIcons"}
                  name={"clear"}
                  style={globalStyles.icon}
                />
              </Pressable>
            )}
          </Row>
        )}
      </Col>
    );
  };

  const Controls = () => {
    if (isUncontrolledField()) return null;
    // preserve control spacing for uncontrolled fields
    //if (isUncontrolledField()) return <Col size={1} style={styles.formControls} />;
    if (_editing) return <EditControls />;
    return <DefaultControls />;
  };

  const FieldComponent = () => {
    //console.log("***************************");
    //console.log(`name: ${JSON.stringify(field?.name)}`);
    //console.log(`type: ${JSON.stringify(field?.type)}`);
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
            editing={_editing}
            field={field}
            values={_value}
            onChange={_onChange}
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
        //return null;
        return (
          <MultiSelectField
            //editing={_editing}
            editing
            field={field}
            value={_value}
            onChange={_onChange}
          />
        );
      case FieldTypes.NUMBER:
        return (
          <NumberField
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
  return (
    <>
      <Row style={[styles.formRow, styles.formDivider]}>
        <Col size={1} style={styles.formIconLabel}>
          <FieldIcon field={field} />
        </Col>
        <Col size={2} style={styles.formParentLabel}>
          <Text style={styles.formLabel}>{field.label}</Text>
        </Col>
        <Col size={8}>
          <View style={[
            styles.formComponent,
            field?.type === FieldTypes.COMMUNICATION_CHANNEL && _editing ? null : styles.field,
            isUncontrolledField() ? null : { paddingLeft: 10, paddingRight: 10 }
          ]}>
            <FieldComponent />
          </View>
        </Col>
        <Controls />
      </Row>
      { field?.name === FieldNames.MEMBER_COUNT && (
        <Row style={[ styles.formRow, styles.formDivider ]}>
          <Col size={1} style={[{ marginBottom: "auto" }, styles.formIconLabel]}>
            <FieldIcon field={field} />
          </Col>
          <Col size={2} style={styles.formParentLabel}>
            <Text style={styles.formLabel}>{field.label}</Text>
          </Col>
          <Col size={8}>
            <MemberList members={post?.members?.values} />
          </Col>
        </Row>
      )}
    </>
  );
};
export default Field;