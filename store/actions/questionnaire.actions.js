/**
 * Action Types
 */
export const GET_QUESTIONNAIRES_ACTIVE = 'GET_QUESTIONNAIRES_ACTIVE';
export const GET_QUESTIONNAIRES_ACTIVE_START = 'GET_QUESTIONNAIRES_ACTIVE_START';
export const GET_QUESTIONNAIRES_ACTIVE_SUCCESS = 'GET_QUESTIONNAIRES_ACTIVE_SUCCESS';
export const GET_QUESTIONNAIRES_ACTIVE_RESPONSE = 'GET_QUESTIONNAIRES_ACTIVE_RESPONSE';
export const GET_QUESTIONNAIRES_ACTIVE_FAILURE = 'GET_QUESTIONNAIRES_ACTIVE_FAILURE';

export const GET_QUESTIONNAIRE_BY_ID = 'GET_QUESTIONNAIRE_BY_ID';
export const GET_QUESTIONNAIRE_BY_ID_START = 'GET_QUESTIONNAIRE_BY_ID_START';
export const GET_QUESTIONNAIRE_BY_ID_SUCCESS = 'GET_QUESTIONNAIRE_BY_ID_SUCCESS';
export const GET_QUESTIONNAIRE_BY_ID_RESPONSE = 'GET_QUESTIONNAIRE_BY_ID_RESPONSE';
export const GET_QUESTIONNAIRE_BY_ID_FAILURE = 'GET_QUESTIONNAIRE_BY_ID_FAILURE';

export const SUBMIT_QUESTIONNAIRE = 'SUBMIT_QUESTIONNAIRE';
export const SUBMIT_QUESTIONNAIRE_START = 'SUBMIT_QUESTIONNAIRE_START';
export const SUBMIT_QUESTIONNAIRE_SUCCESS = 'SUBMIT_QUESTIONNAIRE_SUCCESS';
export const SUBMIT_QUESTIONNAIRE_RESPONSE = 'SUBMIT_QUESTIONNAIRE_RESPONSE';
export const SUBMIT_QUESTIONNAIRE_FAILURE = 'SUBMIT_QUESTIONNAIRE_FAILURE';

export const RESET_STATE = 'RESET_STATE';
export const SET_QUESTION = 'SET_QUESTION';

/**
 * Action Creators
 */
export function getActiveQuestionnaires(domain, token) {
  return {
    type: GET_QUESTIONNAIRES_ACTIVE,
    domain,
    token,
  };
}

export function getQuestionnaireById(domain, token, id) {
  return {
    type: GET_QUESTIONNAIRE_BY_ID,
    domain,
    token,
    id,
  };
}

export function resetState() {
  return {
    type: RESET_STATE,
  };
}

export function setQuestion(question) {
  return {
    type: SET_QUESTION,
    question,
  };
}

export function submitQuestionnaire(domain, token, questionnaire) {
  return {
    type: SUBMIT_QUESTIONNAIRE,
    domain,
    token,
    questionnaire,
  };
}
