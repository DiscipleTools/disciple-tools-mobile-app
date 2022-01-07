import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Field from "components/Field/Field";

//import { styles } from "./Tile.styles";

const Tile = ({ grouped=false, editing=false, post, fields, save, mutate }) => {

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    mutate();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const currentlyUnsupportedFieldFilter = (field) => {
    // TODO
    //return field.name !== '??';
    return field;
  };

  const Fields = () => {
    return fields
      .filter((field) => currentlyUnsupportedFieldFilter(field))
      .map((field, idx) => (
        <Field
          //grouped
          //editing
          key={field?.name ?? idx}
          post={post}
          field={field}
          //save={grouped ? tileSave : save}
          save={save}
        />
      ));
  };

  return (
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      extraScrollHeight={75}
      keyboardShouldPersistTaps="handled"
    >
      <Fields />
    </KeyboardAwareScrollView>
  );
};
export default Tile;