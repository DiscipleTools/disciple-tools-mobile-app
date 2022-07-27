import React from "react";
import { Switch, Text } from "react-native";

const BooleanField = ({ editing, value, onChange }) => {
  const BooleanFieldEdit = () => (
    <Switch value={value} onValueChange={onChange} />
  );
  const BooleanFieldView = () => <Text>{new String(value)}</Text>;

  // if value is null/undefined or not boolean, set false to ensure render
  if (!value || typeof variable !== "boolean") value = false;
  if (editing) return <BooleanFieldEdit />;
  return <BooleanFieldView />;
};
export default BooleanField;
