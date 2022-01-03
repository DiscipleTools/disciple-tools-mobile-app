import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState, useMemo } from "react";

// TODO: clean up across screens
const TypeConstants = {
  CONTACT: "contacts",
  CONTACT_CREATE: "CONTACT_CREATE",
  CONTACT_IMPORT: "CONTACT_IMPORT",
  GROUP: "groups",
  GROUP_CREATE: "GROUP_CREATE",
  TRAINING: "TRAINING",
  QUESTIONNAIRE: "QUESTIONNAIRE",
  NOTIFICATION: "notifications",
};

const useType = () => {

  /*
  const [count, setCount] = useState(1);
  useEffect(() => {
    setCount(count => count + 1);
  }, []); 
  console.log(`useType: render # ${count}`);
  */

  const route = useRoute();

  const type = route?.params?.type;
  const subtype = route?.params?.subtype;

  const isContact = (
    type === TypeConstants.CONTACT ||
    type === TypeConstants.CONTACT_CREATE ||
    type === TypeConstants.CONTACT_IMPORT
  );
  const isGroup = type === TypeConstants.GROUP;
  const isTraining = type === TypeConstants.TRAINING;
  const isQuestionnaire = type === TypeConstants.QUESTIONNAIRE;
  const isNotification = type === TypeConstants.NOTIFICATION;

  const postType = () => {
    if (isContact) return "contacts";
    if (isGroup) return "groups";
    if (isTraining) return "trainings";
    if (isQuestionnaire) return "questionnaires";
    return null;
  };

  const isPost = (isContact || isGroup || isTraining || isQuestionnaire) ? true : false;
  const isCommentsActivity = (isPost && subtype === "comments_activity") ? true : false;

  return {
    TypeConstants,
    isPost,
    isContact,
    isGroup,
    isTraining,
    isQuestionnaire,
    isNotification,
    isCommentsActivity,
    postType: postType(),
  };
  /*
  return {
    TypeConstants: null,
    isPost: null,
    isContact: true,
    isGroup: null,
    isTraining: null,
    isQuestionnaire: null,
    isNotification: null,
    isCommentsActivity: null,
    postType: "contacts"//null,
  };
  */
};
export default useType;