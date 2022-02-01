import React from "react";
import { Text } from "react-native";

const TagsField = ({ editing, field, value, onChange }) => {

  // VALUES
  const values = value?.values || [];

  const TagsFieldEdit = () => null;

  // TODO: link to FilterList
  const TagsFieldView = () => (
    <Text>
      { values.map(tag => tag?.value).join(", ") }
    </Text>
  );

  if (editing) return <TagsFieldEdit />;
  return <TagsFieldView />;
};
export default TagsField;