import React from "react";
import { useNavigationState } from "@react-navigation/native";

import { FieldNames, TypeConstants } from "constants";

const useType = ({ type, subtype } = {}) => {

  const navState = useNavigationState(state => state);
  const route = navState?.routes[navState?.index];
  if (!type && route) type = route?.params?.type;
  if (!subtype && !type && route) subtype = route?.params?.subtype;

  const isContact = (
    type === TypeConstants.CONTACT ||
    type === TypeConstants.CONTACT_CREATE ||
    type === TypeConstants.CONTACT_IMPORT
  );
  const isGroup = (
    type === TypeConstants.GROUP ||
    type === TypeConstants.GROUP_CREATE
  );
  const isTraining = type === TypeConstants.TRAINING;
  const isQuestionnaire = type === TypeConstants.QUESTIONNAIRE;
  const isNotification = type === TypeConstants.NOTIFICATION;

  // TODO: constants
  const postType = () => {
    if (isContact) return "contacts";
    if (isGroup) return "groups";
    if (isTraining) return "trainings";
    if (isQuestionnaire) return "questionnaires";
    return null;
  };

  const isPost = (isContact || isGroup || isTraining || isQuestionnaire) ? true : false;
  const isCommentsActivity = (isPost && subtype === "comments_activity") ? true : false;

  const isList = isPost && !route?.params?.id && !route?.params?.name;

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
