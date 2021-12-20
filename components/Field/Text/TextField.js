import React from "react";
import { Text, TextInput } from "react-native";
//import PropTypes from 'prop-types';

import useI18N from "hooks/useI18N";

import { styles } from "./TextField.styles";

//const TextField = ({ value, editing, onChange }) => {
const TextField = (props) => {

  const { i18n, isRTL } = useI18N();

  const { value, editing, onChange } = props;

  const handleChange = (newValue) => {
    if (newValue !== value) onChange(newValue);
  };

  /*
      autoFocus={true}
      defaultValue={value}
      onChangeText={handleChange}
      // TODO: more consistent styling
      style={[styles.textField, isRTL ? { textAlign: "left", flex: 1 } : {}]}
  */
  const TextFieldEdit = () => (
    <TextInput
      {...props}
    />
  );

  const TextFieldView = () => (
    <Text style={isRTL ? { textAlign: "left", flex: 1 } : {}}>{value}</Text>
  );

  return <>{editing ? <TextFieldEdit /> : <TextFieldView />}</>;
};
export default TextField;
