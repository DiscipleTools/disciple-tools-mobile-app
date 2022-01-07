import React from "react";
import { Text, TextInput } from "react-native";
//import PropTypes from 'prop-types';

const TextField = (props) => {

  const { value, editing } = props;

  //const TextFieldEdit = () => (
  const renderTextFieldEdit = () => (
    <TextInput
      {...props}
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