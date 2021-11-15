import * as actions from '../actions/questionnaire.actions';
import produce, { setAutoFreeze } from 'immer';
setAutoFreeze(false);
import set from 'lodash/set';

const initialState = {
  loading: false,
  error: null,
  save: null,
  questionnaires: [],
  questionnaire: null,
};

/*
export default function questionnaireReducer(state = initialState, action) {
  return produce(state, draft => {
    draft.questionnaire.forms[0].questions[0].title = "YYTest";
  });
}
*/

function recursivelyBuildObjectString(objStr, seqArray, idx) {
  if (idx >= seqArray.length - 1) return objStr + '["questions"][' + seqArray[idx++] + ']';
  return recursivelyBuildObjectString(
    objStr + '["questions"][' + seqArray[idx++] + ']["options"][' + seqArray[idx++] + ']',
    seqArray,
    idx,
  );
}

export default function questionnaireReducer(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case actions.GET_QUESTIONNAIRES_ACTIVE:
        return draft;
      case actions.GET_QUESTIONNAIRES_ACTIVE_START:
        return draft;
      case actions.GET_QUESTIONNAIRES_ACTIVE_SUCCESS:
        draft.questionnaires = action.payload.questionnaires;
        return draft;
      case actions.GET_QUESTIONNAIRES_ACTIVE_RESPONSE:
        return draft;
      case actions.GET_QUESTIONNAIRES_ACTIVE_FAILURE:
        return draft;
      case actions.GET_QUESTIONNAIRE_BY_ID:
        draft.loading = true;
        return draft;
      case actions.GET_QUESTIONNAIRE_BY_ID_START:
        return draft;
      case actions.GET_QUESTIONNAIRE_BY_ID_RESPONSE:
        return draft;
      case actions.GET_QUESTIONNAIRE_BY_ID_SUCCESS:
        draft.loading = false;
        draft.save = null;
        draft.error = null;
        draft.questionnaire = action.payload.questionnaire;
        return draft;
      case actions.GET_QUESTIONNAIRE_BY_ID_FAILURE:
        draft.loading = false;
        draft.save = null;
        draft.error = action.error;
        return draft;
      case actions.RESET_STATE:
        if (draft.save != null) {
          draft.questionnaire = null;
          draft.save = null;
        }
        draft.error = null;
        return draft;
      case actions.SET_QUESTION:
        const seqArray = action.question.seq.split('.');
        const seqArrayParsed = seqArray.map((seqItem) => {
          return parseInt(seqItem) - 1;
        });
        if (seqArrayParsed.length > 2) {
          var idx = 0;
          const objStr = recursivelyBuildObjectString(
            'questionnaire.forms[' + seqArrayParsed[idx++] + ']',
            seqArrayParsed,
            idx,
          );
          set(draft, objStr, action.question);
        } else {
          draft.questionnaire.forms[seqArrayParsed[0]].questions[seqArrayParsed[1]] =
            action.question;
        }
        return draft;
      case actions.SUBMIT_QUESTIONNAIRE:
        return draft;
      case actions.SUBMIT_QUESTIONNAIRE_START:
        return draft;
      case actions.SUBMIT_QUESTIONNAIRE_RESPONSE:
        return draft;
      case actions.SUBMIT_QUESTIONNAIRE_SUCCESS:
        draft.loading = false;
        draft.save = true;
        draft.error = null;
        return draft;
      case actions.SUBMIT_QUESTIONNAIRE_FAILURE:
        draft.loading = false;
        draft.save = null;
        draft.error = action.error;
        return draft;
      default:
        return draft;
    }
  });
}
