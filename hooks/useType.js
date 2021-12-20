import { useRoute } from "@react-navigation/native";

// TODO: use caps once updates are made to nav params in screens
const TypeConstants = {
  //CONTACT: "CONTACT",
  CONTACT: "contacts",
  //GROUP: "GROUP",
  GROUP: "groups",
  TRAINING: "TRAINING",
  QUESTIONNAIRE: "QUESTIONNAIRE",
  //NOTIFICATION: "NOTIFICATION",
  NOTIFICATION: "notifications",
};

const useType = () => {
  const route = useRoute();
  const type = route?.params?.type;

  console.log("*** useType ***");
  console.log(`type: ${ type }`);
  console.log(`route.name: ${ route?.name }`);

  const isContact = type === TypeConstants.CONTACT;
  const isGroup = type === TypeConstants.GROUP;
  const isTraining = type === TypeConstants.TRAINING;
  const isQuestionnaire = type === TypeConstants.QUESTIONNAIRE;
  const isNotification = type === TypeConstants.NOTIFICATION;

  // TODO
  const isCommentsActivity = () => {
    //if (isContact || isGroup) { ... }
    return true;
  };

  const postType = () => {
    if (isContact) return "contacts";
    if (isGroup) return "groups";
    if (isTraining) return "trainings";
    if (isQuestionnaire) return "questionnaires";
    return null;
  };

  const isPost = (isContact || isGroup || isTraining || isQuestionnaire) ? true : false;

  return {
    TypeConstants,
    isPost,
    isContact,
    isGroup,
    isTraining,
    isQuestionnaire,
    isNotification,
    isCommentsActivity: isCommentsActivity(),
    postType: postType(),
  };
};
export default useType;