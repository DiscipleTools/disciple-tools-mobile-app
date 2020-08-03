import * as actions from '../actions/questionnaire.actions';
import produce, { setAutoFreeze } from 'immer';
setAutoFreeze(false);
import set from 'lodash/set';

/*
const initialState = {
  loading: false,
  error: null,
  questionnaire: {
    forms: [
    ]
  }
}
*/

const initialState = {
  loading: false,
  error: null,
  questionnaire: {
    forms: [
      {
        seq: '2',
        title: 'What THEY Did',
        questions: [
          {
            seq: '2.1',
            title: "Did they do last meeting's commitment?",
            required: true,
            type: 'radio',
            options: [
              {
                seq: '2.1.1',
                title: 'Yes',
                selected: false,
              },
              {
                seq: '2.1.2',
                title: 'No',
                selected: false,
              },
              {
                seq: '2.1.3',
                title: 'N/A',
                selected: false,
              },
            ],
          },
          {
            seq: '2.2',
            title: 'Other Activities',
            required: false,
            type: 'checkbox',
            options: [
              {
                seq: '2.2.1',
                title: 'Shared with someone recently',
                selected: false,
              },
              {
                seq: '2.2.2',
                title: 'In the Word since last meeting',
                selected: false,
              },
            ],
          },
        ],
      },
      {
        seq: '3',
        title: 'What I Did',
        questions: [
          {
            seq: '3.1',
            title: 'Held to the Study Plan?',
            required: true,
            type: 'radio',
            options: [
              {
                seq: '3.1.1',
                title: 'Yes',
                selected: false,
              },
              {
                seq: '3.1.2',
                title: 'No (Study was for where they were at)',
                selected: false,
              },
            ],
          },
          {
            seq: '3.2',
            title: 'Other Activities',
            required: false,
            type: 'checkbox',
            options: [
              {
                seq: '3.2.1',
                title: 'Prayed before the meeting',
                selected: false,
              },
              {
                seq: '3.2.2',
                title: 'Encouraged them',
                selected: false,
              },
              {
                seq: '3.2.3',
                title: 'Cast vision to share with their groups',
                selected: false,
              },
              {
                seq: '3.2.4',
                title: '30+ min caring/loving them',
                selected: false,
              },
              {
                seq: '3.2.5',
                title: '90% or more in local language',
                selected: false,
              },
              {
                seq: '3.2.6',
                title: 'Listened more than I talked',
                selected: false,
              },
            ],
          },
        ],
      },
      {
        seq: '1',
        title: 'What WE Did',
        questions: [
          {
            seq: '1.1',
            title: 'Type of Meeting',
            required: true,
            type: 'radio',
            options: [
              {
                seq: '1.1.1',
                title: 'Relational hangout',
                selected: false,
              },
              {
                seq: '1.1.2',
                title: 'Spiritual discussion',
                selected: false,
              },
              {
                seq: '1.1.3',
                title: 'Bible Study',
                selected: false,
                questions: [
                  {
                    seq: '1.1.3.1',
                    title: 'What Scripture?',
                    required: true,
                    type: 'input',
                    value: '',
                  },
                  {
                    seq: '1.1.3.2',
                    title: 'Type of Study',
                    required: false,
                    type: 'radio',
                    options: [
                      {
                        seq: '1.1.3.2.1',
                        title: 'Discovery Bible Study',
                        selected: false,
                      },
                      {
                        seq: '1.1.3.2.2',
                        title: '4 Fields',
                        selected: false,
                        questions: [
                          {
                            seq: '1.1.3.2.2.1',
                            title: 'Yet another nested question',
                            required: false,
                            type: 'checkbox',
                            options: [
                              {
                                seq: '1.1.3.2.2.1.1',
                                title: 'Y1',
                                selected: false,
                              },
                              {
                                seq: '1.1.3.2.2.1.2',
                                title: 'Y2',
                                selected: false,
                              },
                              {
                                seq: '1.1.3.2.2.1.3',
                                title: 'Y3',
                                selected: false,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        seq: '1.1.3.2.3',
                        title: 'Inductive Bible Study',
                        selected: false,
                      },
                      {
                        seq: '1.1.3.2.4',
                        title: '9 Studies for Seekers',
                        selected: false,
                      },
                      {
                        seq: '1.1.3.2.5',
                        title: 'Teaching',
                        selected: false,
                      },
                      {
                        seq: '1.1.3.2.6',
                        title: 'Other',
                        selected: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            seq: '1.2',
            title: 'Other Activities',
            required: false,
            type: 'checkbox',
            options: [
              {
                seq: '1.2.1',
                title: 'Worshiped',
                selected: false,
              },
              {
                seq: '1.2.2',
                title: 'Prayed',
                selected: false,
              },
              {
                seq: '1.2.3',
                title: 'Confessed our sins',
                selected: false,
              },
            ],
          },
        ],
      },
    ],
  },
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
      case actions.RESET_STATE:
        draft = initialState;
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
        console.log(
          JSON.stringify({
            questionnaire: action.questionnaire,
          }),
        );
        draft = initialState;
        return draft;
      default:
        return draft;
    }
  });
}
