import React, { useState } from "react";
import { Text, TextInput } from "react-native";
//import PropTypes from 'prop-types';

import useAPI from "hooks/useAPI";

const TextField = (props) => {

  const { defaultValue, editing, field, onChange } = props;

  const { updatePost } = useAPI();

  const [value, setValue] = useState(defaultValue ?? "");

  const handleChange = () => {
    if (field?.name) {
      const data = { [field?.name]: value }; 
      if (onChange) onChange(data);
      updatePost(data);
    };
  };

  //const TextFieldEdit = () => (
  const renderTextFieldEdit = () => (
    <TextInput
      {...props}
      value={value}
      onChangeText={setValue}
      onBlur={() => handleChange()}
    />
  );

  //const TextFieldView = () => (
  const renderTextFieldView = () => (
    <Text>{value}</Text>
  );

  /*
   * NOTE: returning a component  will cause loss of focus and Keyboard dismissal
   * (instead 'trick' React by invoking lowercase render method)
   */
  //return <>{editing ? <TextFieldEdit /> : <TextFieldView />}</>;
  return <>{editing ? renderTextFieldEdit() : renderTextFieldView() }</>;
};
export default TextField;