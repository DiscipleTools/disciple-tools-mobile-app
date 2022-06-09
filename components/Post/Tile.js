import React, { useReducer, useState } from "react";
import { RefreshControl, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";

import { UpdateRequiredIcon } from "components/Icon";
import Alert from "components/Alert";
import Button from "components/Button";
import Field from "components/Field/Field";
import MemberList from "components/MemberList";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";
import useType from "hooks/use-type";

import { FieldNames, ScreenConstants } from "constants";

import { localStyles } from "./Tile.styles";

const Tile = ({
  isCreate,
  grouped,
  editing,
  idx,
  post,
  fields,
  save,
  mutate,
}) => {
  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { postType } = useType();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const SET_STATE = "SET_STATE";

  //const initializer = initialState => initialState

  // NOTE: in-memory post
  const reducer = (state, action) => {
    switch (action.type) {
      case SET_STATE:
        return {
          ...state,
          ...action?.field,
        };
      default:
        state;
    }
  };

  /*
   * This is a mock Post object generated from the available Fields,
   * and this is necessary when creating new Posts (ie, Add Contact/Group)
   */
  const generatedPost = () => {
    const post = {};
    fields?.forEach((field) => {
      let defaultValue = null;
      if (field?.default)
        defaultValue = Object.keys(field.default)?.[0] || null;
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

  const onChange = (field) => dispatch({ type: SET_STATE, field });

  const onSave = async () => {
    setLoading(true);
    const requiredFields = fields?.filter(
      (field) => field?.required === true && field?.in_create_form === true
    );
    const filteredPost = Object.fromEntries(
      Object.entries(_post).filter(([_, v]) => v !== null || v?.length > 0)
    );
    for (let ii = 0; ii < requiredFields?.length; ii++) {
      const fieldName = requiredFields[ii]?.name;
      const fieldLabel = requiredFields[ii]?.label;
      if (fieldName && !filteredPost[fieldName]) {
        setLoading(false);
        toast(i18n.t("global.error.isRequired", { item: fieldLabel }), true);
        return;
      }
    }
    const res = await save(filteredPost);
    if (isCreate) {
      if (res?.data?.ID) {
        navigation.navigate(ScreenConstants.DETAILS, {
          id: res.data.ID,
          type: postType,
        });
      } else {
        navigation.navigate(ScreenConstants.LIST, {
          type: postType,
        });
      }
    }
    setLoading(false);
  };

  const SaveButton = () => (
    <Button title={i18n.t("global.save")} loading={loading} onPress={onSave} />
  );

  const Fields = () => {
    return fields.map((field, _idx) => (
      <>
        {idx === 0 && _idx === 0 && post?.requires_update && (
          <Alert
            title={i18n.t("global.updateRequired")}
            subtitle={i18n.t("global.updateRequiredText")}
            icon={<UpdateRequiredIcon style={styles.icon} />}
          />
        )}
        <Field
          key={field?.name ?? idx}
          grouped={grouped}
          editing={editing}
          field={field}
          post={grouped ? _post : post}
          onChange={onChange}
          mutate={mutate}
        />
        {field?.name === FieldNames.MEMBER_COUNT && (
          <MemberList post={post} onChange={onChange} mutate={mutate} />
        )}
      </>
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
      contentContainerStyle={[globalStyles.surface, globalStyles.screenGutter]}
    >
      <Fields />
      {isCreate && (
        <View style={styles.saveButton}>
          <SaveButton />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};
export default Tile;
