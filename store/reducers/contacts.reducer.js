import * as actions from '../actions/contacts.actions';

const initialState = {
  loading: false,
  error: null,
  contacts: [],
  contact: null,
  comments: [],
  newComment: null,
  activities: [],
  totalComments: null,
  totalActivities: null,
  loadingComments: false,
  loadingActivities: false,
};

export default function contactsReducer(state = initialState, action) {
  let newState = {
    ...state,
    contact: null,
    newComment: null,
    error: null,
    comments: null,
    totalComments: null,
    activities: null,
    totalActivities: null,
  };

  switch (action.type) {
    case actions.CONTACTS_GETALL_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.CONTACTS_GETALL_SUCCESS:
      return {
        ...newState,
        contacts: action.contacts,
        loading: false,
      };
    case actions.CONTACTS_GETALL_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.CONTACTS_SAVE_SUCCESS:
      return {
        ...newState,
        contact: action.contact,
      };
    case actions.CONTACTS_SAVE_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.CONTACTS_GETBYID_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.CONTACTS_GETBYID_SUCCESS: {
      newState = {
        ...newState,
        contact: action.contact,
        loading: false,
      };
      if (newState.contact.baptism_date) {
        let newBaptismDate = new Date(newState.contact.baptism_date);
        const year = newBaptismDate.getFullYear();
        const month = (newBaptismDate.getMonth() + 1) < 10 ? `0${newBaptismDate.getMonth() + 1}` : (newBaptismDate.getMonth() + 1);
        const day = (newBaptismDate.getDate() + 1) < 10 ? `0${newBaptismDate.getDate() + 1}` : (newBaptismDate.getDate() + 1);
        newBaptismDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          contact: {
            ...newState.contact,
            baptism_date: newBaptismDate,
          },
        };
      } else {
        newState = {
          ...newState,
          contact: {
            ...newState.contact,
            baptism_date: '',
          },
        };
      }

      return newState;
    }
    case actions.CONTACTS_GETBYID_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.CONTACTS_GET_COMMENTS_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.CONTACTS_GET_COMMENTS_SUCCESS:
      return {
        ...newState,
        comments: action.comments,
        totalComments: action.total,
        loadingComments: false,
      };
    case actions.CONTACTS_GET_COMMENTS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.CONTACTS_SAVE_COMMENT_SUCCESS:
      return {
        ...newState,
        newComment: action.comment,
      };
    case actions.CONTACTS_SAVE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.CONTACTS_GET_ACTIVITIES_START:
      return {
        ...newState,
        loadingActivities: true,
      };
    case actions.CONTACTS_GET_ACTIVITIES_SUCCESS:
      return {
        ...newState,
        activities: action.activities,
        totalActivities: action.total,
        loadingActivities: false,
      };
    case actions.CONTACTS_GET_ACTIVITIES_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingActivities: false,
      };
    default:
      return newState;
  }
}
