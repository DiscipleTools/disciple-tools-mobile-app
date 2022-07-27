import * as RootNavigation from "navigation/RootNavigation";

import {
  FieldNames,
  ScreenConstants,
  TabScreenConstants,
  TypeConstants,
  SubTypeConstants,
} from "constants";

const useType = ({ type, subtype } = {}) => {
  const route = RootNavigation.getRoute();
  if (!type) type = route?.params?.type;
  if (!subtype) subtype = route?.params?.subtype;

  const isList = route?.name === ScreenConstants.LIST;

  const isContact = type === TypeConstants.CONTACT;
  const isGroup = type === TypeConstants.GROUP;

  const isNotification = type === TypeConstants.NOTIFICATION;

  const isMyUser = type === TypeConstants.MY_USER;

  const isCustomPostType =
    (type || subtype) &&
    !(isContact || isGroup || isNotification || isCommentsActivity || isMyUser);

  const isPost = isContact || isGroup || isCustomPostType;

  const isCommentsActivity =
    isPost && subtype === SubTypeConstants.COMMENTS_ACTIVITY;

  const postType = () => {
    if (isContact) return TypeConstants.CONTACT;
    if (isGroup) return TypeConstants.GROUP;
    if (isCustomPostType) return type;
    return null;
  };

  const getPostTypeByFieldName = (fieldName) => {
    switch (fieldName) {
      // CONTACT
      case FieldNames.COACHES:
      case FieldNames.LEADERS:
      case FieldNames.MEMBERS:
        return TypeConstants.CONTACT;
      // GROUP
      case FieldNames.GROUPS:
      case FieldNames.PARENT_GROUPS:
      case FieldNames.PEER_GROUPS:
      case FieldNames.CHILD_GROUPS:
        return TypeConstants.GROUP;
      case FieldNames.PEOPLE_GROUPS:
        return TypeConstants.PEOPLE_GROUP;
      default:
        return null;
    }
  };

  const getPostTypeByField = (field) => {
    if (field?.post_type) return field.post_type;
    const postType = getPostTypeByFieldName(field?.name);
    if (postType) return postType;
    return null;
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
    getPostTypeByField,
    getTabScreenFromType,
  };
};
export default useType;
