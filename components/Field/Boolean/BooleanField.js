import React from "react";

import useI18N from "hooks/useI18N";

const BooleanField = ({ value, editing, onChange }) => {
  const { isRTL } = useI18N();

  // if value is null, then set a default to ensure field displays
  if (value === null) value = false;

  // TODO: implement as Switch?

  const BooleanFieldEdit = () => {
    return null;
  };

  const BooleanFieldView = () => {
    return null;
  };

  return <>{editing ? <BooleanFieldEdit /> : <BooleanFieldView />}</>;
};
export default BooleanField;
