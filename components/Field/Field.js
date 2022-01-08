import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Icon, Label } from "native-base";
import { Grid, Row, Col } from "react-native-easy-grid";

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

import { styles } from "./Field.styles";

const Field = ({ editing=true, post, field }) => {
  //const ref = useRef(null);

  // uncomment line below to enforce post must have data values for a field (ie, uncomment to hide empty fields) 
  //if (!post.hasOwnProperty(field?.name)) return null;

  const value = post && field?.name && post[field.name] ? post[field.name] : null;

  /*
  NOTE: the difference between value and apiValue:

  'value': the value returned from the API that we use to control components,
  and so we need to keep this consistent for handling 'onChange' events and
  future API reads

  'apiValue': this is used only when format to update the API differs from the
  format that the API returns upon reads (eg, 'user_select' fields)
  https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#user_select

  'user_select' read: 
 {"assigned_to":{"key":2,"label":"Jane Doe (multiplier)"}} 

  'user_select' write:
  { "assigned_to": 2 }
  */
 // TODO: useReducer to manage state?
  const [state, setState] = useState({
    editing,
    value,
    apiValue: null,
  });

  /*
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
    const name = field.name;
    if (name === "name") return true;
    return false;
  };

  const isUndecoratedField = () => {
    const name = field?.name;
    //const type = field?.type;
    return (
      name === "parent_groups" ||
      name === "peer_groups" ||
      name === "child_groups"
    );
  };

  const _onChange = (newValue, apiValue = null) => {
    setState({
      ...state,
      value: newValue,
      apiValue,
    });
  };

  // TODO: use constants for switch
  const FieldComponent = () => {
    switch (field?.type) {
      case "boolean":
        return (
          <BooleanField
            editing={state.editing}
            value={state.value}
            onChange={_onChange}
          />
      );
      case "communication_channel":
        // TODO: better implementation (timer not intuitive)
        // TODO: RTL, styles
        return (
          <CommunicationChannelField
            field={field}
            value={value}
            editing={state.editing}
            onChange={_onChange}
          />
        );
      /*
      case "connection":
        // TODO: RTL, style, (*)lists, (*)milestones
        return (
          <ConnectionField
            field={field}
            value={state.value}
            editing={state.editing}
            onChange={_onChange}
          />
        );
      */
      case "date":
        // TODO: RTL, style, better component?
        return (
        <DateField
          value={state.value}
          editing={state.editing}
          onChange={_onChange}
        />
      );
      case "key_select":
        // TODO: RTL, style - ok
        return (
          <KeySelectField
            defaultValue={state.value}
            editing={state.editing}
            field={field}
            //onChange={_onChange}
          />
        );
      //case 'location_grid':
      case "location":
        // TODO: RTL, style
        return (
        <LocationField
          value={state.value}
          editing={state.editing}
          onChange={_onChange}
        />
      );
      case "multi_select":
        // TODO: RTL, style
        return (
          <MultiSelectField
            field={field}
            value={state.value}
            editing={state.editing}
            onChange={_onChange}
          />
        );
      case "number":
        // TODO: RTL, style
        return (
          <>
            <NumberField
              value={state.value}
              editing={state.editing}
              onChange={_onChange}
            />
            { field?.name === "member_count" && (
              <MemberList members={post?.members?.values} />
            )}
          </>
        );
      case "post_user_meta":
        return null;
      //return <PostUserMetaField value={state.value} editing={state.editing} onChange={_onChange} />;
      case "tags":
        // TODO: RTL, style
        return (
          <TagsField
            value={state.value}
            options={post?.tags?.values}
            editing={state.editing}
            onChange={_onChange}
          />
        );
      case "text":
        // TODO: RTL, style - ok
        return (
          <TextField
            defaultValue={state.value}
            editing={state.editing}
            field={field}
          />
        );
      case "user_select":
        // TODO: RTL, style
        return (
          <UserSelectField
            value={state.value}
            editing={state.editing}
            onChange={_onChange}
          />
        );
      default:
        return null;
    }
  };

  if (isUndecoratedField() && !state.editing)
    return (
      <Grid>
        <Row style={styles.formRow}>
          <Col size={11}>
            <FieldComponent />
          </Col>
        </Row>
      </Grid>
    );
  return (
    <Grid>
      <Row
        style={[
          styles.formRow,
          styles.formDivider,
        ]}
      >
        <Col size={1} style={[{ marginBottom: "auto" }, styles.formIconLabel]}>
          <FieldIcon field={field} />
        </Col>
        <Col size={2} style={styles.formParentLabel}>
          <Label style={styles.formLabel}>{field.label}</Label>
        </Col>
        <Col size={8}>
          <View style={styles.formComponent}>
            <FieldComponent />
          </View>
        </Col>
      </Row>
    </Grid>
  );
};
export default Field;
