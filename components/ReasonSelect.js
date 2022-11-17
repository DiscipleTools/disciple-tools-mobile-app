import React from "react";

import Field from "components/Field/Field";

import useI18N from "hooks/use-i18n";
import useSettings from "hooks/use-settings";

import { FieldTypes } from "constants";

const ReasonSelect = ({ post, onChange, mutate }) => {
  const { i18n } = useI18N();
  const { settings } = useSettings();
  let reason = `reason_${post.overall_status}`;
  let reasonItems = settings.fields[reason];
  delete reasonItems.values.none;
  const field = {
    default: reasonItems.values,
    name: reason,
    label: reasonItems.name,
    type: FieldTypes.KEY_SELECT,
  };

  return (
    <Field
      key={field?.name}
      editing
      field={field}
      post={post}
      onChange={onChange}
      mutate={mutate}
    />
  );
};
export default ReasonSelect;
