import React from 'react';

import Field from 'components/Field/Field';

import useI18N from 'hooks/use-i18n';

import { FieldNames, FieldTypes } from "constants";

const MemberList = ({ post, onChange, mutate }) => {
  const { i18n } = useI18N();
  const field = {
    name: FieldNames.MEMBERS,
    label: i18n.t('global.membersActivity'),
    type: FieldTypes.CONNECTION,
  };
  return(
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
export default MemberList;