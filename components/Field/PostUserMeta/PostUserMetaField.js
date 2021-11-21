import React from 'react';

import useI18N from 'hooks/useI18N';

// ref: https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#post_user_meta
const PostUserMetaField = ({ value, editing, onChange }) => {
  const { i18n, isRTL } = useI18N();

  // if value is null, then set a default to ensure field displays
  if (value === null) value = { values: [{ value: ''}]};

  // TODO: implement
  const PostUserMetaFieldEdit = () => {
    return null;
  };

  // TODO: implement
  const PostUserMetaFieldView = () => {
    return null;
  };

  return <>{editing ? <PostUserMetaFieldEdit /> : <PostUserMetaFieldView />}</>;
};
export default PostUserMetaField;
