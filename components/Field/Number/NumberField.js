import React from "react";

import TextField from "components/Field/Text/TextField";

// this is a TextField with a keyboard type of "numeric"
const NumberField = ({
  editing,
  cacheKey,
  fieldKey,
  field,
  value,
  onChange
}) => {
  return(
    <TextField
      editing={editing}
      cacheKey={cacheKey}
      fieldKey={fieldKey}
      field={field}
      value={value}
      onChange={onChange}
      keyboardType="numeric"
    />
  );
};
export default NumberField;
