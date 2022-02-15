import React, { useState, useReducer, useEffect } from "react";
import { Button, RefreshControl, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";

import Field from "components/Field/Field";

import useI18N from "hooks/useI18N";
import useStyles from "hooks/useStyles";
import useType from "hooks/useType";

import { localStyles } from "./Tile.styles";

const Tile = ({ grouped=false, editing=false, fields, post, save, mutate }) => {

  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { isContact, isGroup, postType } = useType();
  const { i18n } = useI18N();

  const SET_STATE = "SET_STATE";

  //const initializer = initialState => initialState

  // NOTE: in-memory post
  const reducer = (state, action) => {
    switch (action.type) {
      case SET_STATE:
        return {
          ...state,
          ...action?.field
        };
      default:
        state;
    };
  };

  /*
   * This is a mock Post object generated from the available Fields,
   * and this is necessary when creating new Posts (ie, Add Contact/Group)
   */
  const generatedPost = () => {
    const post = {};
    fields?.forEach(field => {
      let defaultValue = null;
      if (field?.default) defaultValue = Object.keys(field.default)?.[0] || null;
      /*
      if (
        //field?.type === FieldTypes.COMMUNICATION_CHANNEL ||
        field?.type === FieldTypes.CONNECTION ||
        field?.type === FieldTypes.LOCATION_META ||
        field?.type === FieldTypes.MULTI_SELECT ||
        field?.type === FieldTypes.TAGS
      ) defaultValue = { values: [{ value: null}], force_values: true };
      // connection_meta?
      // post_user_meta
      */
      post[field?.name] = defaultValue;
    });
    return post;
  };

  const initialPost = post || generatedPost();
  const [_post, dispatch] = useReducer(reducer, initialPost); //, initializer);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    if (mutate) mutate();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    return;
  };

  // TODO: check required fields
  // TODO: clean up any added then removed fields (currently works, but messy)
  const onSave = async() => {
    let filteredPost = Object.fromEntries(Object.entries(_post).filter(([_, v]) => v != null));
    await save(filteredPost);
    mutate();
    // TODO: use postType, and constants
    if (isGroup) navigation.push("Groups");
    if (isContact) navigation.push("Contacts");
  };

  const onChange = (field) => dispatch({ type: SET_STATE, field });

  const onCancel = () => onRefresh();

  const Fields = () => {
    return fields.map((field, idx) => (
      <Field
        key={field?.name ?? idx}
        grouped={grouped}
        editing={editing}
        field={field}
        //post={_post}
        post={grouped ? _post : post}
        onChange={onChange}
        mutate={mutate}
      />
    ));
  };

  return (
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          // TODO
          //color={null}      // Android
          //tintColor={null}  //iOS
        />
      }
      extraScrollHeight={75}
      keyboardShouldPersistTaps="handled"
      style={globalStyles.surface}
    >
      <Fields />
      { grouped && (
        <View style={[
          globalStyles.buttonShadow,
          globalStyles.buttonText,
          styles.button,
        ]}>
          <Button
            onPress={onSave}
            title={i18n.t("global.save")}
            color={globalStyles.buttonText.color}
            accessibilityLabel="Save, and Continue Editing"
          />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};
export default Tile;