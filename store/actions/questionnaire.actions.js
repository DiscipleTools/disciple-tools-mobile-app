/**
 * Action Types
 */
export const RESET_STATE = 'RESET_STATE';
export const SET_QUESTION = 'SET_QUESTION';
export const SUBMIT_QUESTIONNAIRE = 'SUBMIT_QUESTIONNAIRE';

/**
 * Action Creators
 */
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

export function submitQuestionnaire(questionnaire) {
  return {
    type: SUBMIT_QUESTIONNAIRE,
    questionnaire,
  };
}
