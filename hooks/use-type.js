import React from "react";
import * as RootNavigation from "navigation/RootNavigation";

import { FieldNames, ScreenConstants, TypeConstants, SubTypeConstants  } from "constants";

const useType = ({ type, subtype } = {}) => {

  const route = RootNavigation.getRoute();
  if (!type) type = route?.params?.type;
  if (!subtype) subtype = route?.params?.subtype;

  const isList = route?.name === ScreenConstants.LIST;

  const isContact = type === TypeConstants.CONTACT;
  const isGroup = type === TypeConstants.GROUP;
  const isTraining = type === TypeConstants.TRAINING;
  const isQuestionnaire = type === TypeConstants.QUESTIONNAIRE;
  const isNotification = type === TypeConstants.NOTIFICATION;

  const isPost = (isContact || isGroup || isTraining || isQuestionnaire);
  const isCommentsActivity = (isPost && subtype === SubTypeConstants.COMMENTS_ACTIVITY);

  const postType = () => {
    if (isContact) return TypeConstants.CONTACT;
    if (isGroup) return TypeConstants.GROUP;
    if (isTraining) return TypeConstants.TRAINING;
    if (isQuestionnaire) return TypeConstants.QUESTIONNAIRE;
    return null;
  };

  const getPostTypeByFieldName = (fieldName) => {
    if (fieldName === FieldNames.GROUPS) return TypeConstants.GROUP;
    return postType();
  };

  return {
    TypeConstants,
    isList,
    isPost,
    isContact,
    isGroup,
    isTraining,
    isQuestionnaire,
    isNotification,
    isCommentsActivity,
    postType: postType(),
    getPostTypeByFieldName,
  };
};
export default useType;
