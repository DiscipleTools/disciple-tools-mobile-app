import * as RootNavigation from "navigation/RootNavigation";

import {
  FieldNames,
  TabScreenConstants,
  ScreenConstants,
  TypeConstants,
  SubTypeConstants
} from "constants";

const useType = ({ type, subtype } = {}) => {

  const route = RootNavigation.getRoute();
  if (!type) type = route?.params?.type;
  if (!subtype) subtype = route?.params?.subtype;

  const isList = route?.name === ScreenConstants.LIST;

  const isContact = type === TypeConstants.CONTACT;
  const isGroup = type === TypeConstants.GROUP;

  const isNotification = type === TypeConstants.NOTIFICATION;

  const isCustomPostType = (type || subtype) && !(
    isContact ||
    isGroup ||
    isNotification ||
    isCommentsActivity
  );

  const isPost = (
    isContact ||
    isGroup ||
    isCustomPostType
  );

  const isCommentsActivity = (isPost && subtype === SubTypeConstants.COMMENTS_ACTIVITY);

  const postType = () => {
    if (isContact) return TypeConstants.CONTACT;
    if (isGroup) return TypeConstants.GROUP;
    if (isCustomPostType) return type;
    return null;
  };

  const getPostTypeByFieldName = (fieldName) => {
    if (fieldName === FieldNames.GROUPS) return TypeConstants.GROUP;
    return postType();
  };

  const getTabScreenFromType = (type) => {
    if (type === TypeConstants.CONTACT) return TabScreenConstants.CONTACTS;
    if (type === TypeConstants.GROUP) return TabScreenConstants.GROUPS;
    return TabScreenConstants.MORE;
  };

  return {
    TypeConstants,
    isList,
    isPost,
    isContact,
    isGroup,
    isCustomPostType,
    isNotification,
    isCommentsActivity,
    postType: postType(),
    getPostTypeByFieldName,
    getTabScreenFromType,
  };
};
export default useType;
