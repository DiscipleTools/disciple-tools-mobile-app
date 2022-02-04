import React, { useState, useReducer, useEffect } from "react";
import { RefreshControl } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Field from "components/Field/Field";

import useStyles from "hooks/useStyles";

const Tile = ({ grouped=false, editing=false, fields, post, save, mutate }) => {

  const { globalStyles } = useStyles();

  const SET_STATE = "SET_STATE";

  const initialState = {};
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_STATE:
        return {
          ...state,
          ...action.fields
        };
      default:
        state;
    };
  };

  const generatePostFromFields = (fields) => {
    // TODO:
    return {
      name: '',
    };
  };

  const [state, dispatch] = useReducer(reducer, post);

  /*
  useEffect(() => {
    if (post) {
      dispatch({ type: SET_STATE, fields: post });
      return;
    };
    const generatedPost = generatePostFromFields(fields);
    dispatch({ type: SET_STATE, fields: generatedPost });
    return;
  }, [post, fields])
  */

  //if (!post) return null;

  const [_value, _setValue] = useState(post);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    if (mutate) {
      setRefreshing(true);
      mutate();
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    };
    return;
  };

  //const onSave = () => save(state);
  const onSave = () => save(_value);
  const onCancel = () => onRefresh();
  //const onChange = (newValue) => dispatch({ type: SET_STATE, fields: newValue });
  const onChange = (data) => {
    _setValue({
      ..._value,
      ...data
    });
  };

  const Fields = () => {
    return fields.map((field, idx) => (
      <Field
        key={field?.name ?? idx}
        grouped={grouped}
        editing={editing}
        field={field}
        //post={state}
        //post={_value}
        post={post}
        onChange={() => onChange}
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
    </KeyboardAwareScrollView>
  );
};
export default Tile;