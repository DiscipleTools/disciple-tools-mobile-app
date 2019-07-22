import * as actions from '../actions/groups.actions';

const initialState = {
  loading: false,
  error: null,
  groups: [],
  group: null,
  comments: [],
  newComment: null,
  // comment: null,
  activities: [],
  type: null, // delete
  usersContacts: [],
  geonames: [],
  peopleGroups: [],
  search: [],
};

export default function groupsReducer(state = initialState, action) {
  let newState = {
    ...state,
    type: action.type, // delete
    group: null,
    newComment: null,
    error: null,
  };

  switch (action.type) {
    case actions.GROUPS_GET_USERS_CONTACTS_SUCCESS:
      return {
        ...newState,
        usersContacts: action.usersContacts,
      };
    case actions.GROUPS_GET_USERS_CONTACTS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_LOCATIONS_SUCCESS:
      return {
        ...newState,
        geonames: action.geonames,
      };
    case actions.GROUPS_GET_LOCATIONS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_SUCCESS:
      return {
        ...newState,
        peopleGroups: action.peopleGroups,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_SEARCH_SUCCESS:
      return {
        ...newState,
        search: action.search,
      };
    case actions.GROUPS_SEARCH_FAILURE:
      return {
        ...newState,
        error: action.error,
      };


    case actions.GROUPS_GETALL_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GETALL_SUCCESS:
      return {
        ...newState,
        groups: action.groups,
        loading: false,
      };
    case actions.GROUPS_GETALL_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_SAVE_SUCCESS: {
      newState = {
        ...newState,
        group: action.group,
      };
      if (newState.group.start_date) {
        let newStartDate = new Date(newState.group.start_date);
        const year = newStartDate.getFullYear();
        const month = (newStartDate.getMonth() + 1) < 10 ? `0${newStartDate.getMonth() + 1}` : (newStartDate.getMonth() + 1);
        const day = (newStartDate.getDate() + 1) < 10 ? `0${newStartDate.getDate() + 1}` : (newStartDate.getDate() + 1);
        newStartDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          group: {
            ...newState.group,
            start_date: newStartDate,
          },
        };
      } else {
        newState = {
          ...newState,
          group: {
            ...newState.group,
            start_date: '',
          },
        };
      }

      if (newState.group.end_date) {
        let newEndDate = new Date(newState.group.end_date);
        const year = newEndDate.getFullYear();
        const month = (newEndDate.getMonth() + 1) < 10 ? `0${newEndDate.getMonth() + 1}` : (newEndDate.getMonth() + 1);
        const day = (newEndDate.getDate() + 1) < 10 ? `0${newEndDate.getDate() + 1}` : (newEndDate.getDate() + 1);
        newEndDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          group: {
            ...newState.group,
            end_date: newEndDate,
          },
        };
      } else {
        newState = {
          ...newState,
          group: {
            ...newState.group,
            end_date: '',
          },
        };
      }
      return newState;
    }
    case actions.GROUPS_SAVE_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GETBYID_SUCCESS: {
      newState = {
        ...newState,
        group: action.group,
      };
      if (newState.group.start_date) {
        let newStartDate = new Date(newState.group.start_date);
        const year = newStartDate.getFullYear();
        const month = (newStartDate.getMonth() + 1) < 10 ? `0${newStartDate.getMonth() + 1}` : (newStartDate.getMonth() + 1);
        const day = (newStartDate.getDate() + 1) < 10 ? `0${newStartDate.getDate() + 1}` : (newStartDate.getDate() + 1);
        newStartDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          group: {
            ...newState.group,
            start_date: newStartDate,
          },
        };
      } else {
        newState = {
          ...newState,
          group: {
            ...newState.group,
            start_date: '',
          },
        };
      }

      if (newState.group.end_date) {
        let newEndDate = new Date(newState.group.end_date);
        const year = newEndDate.getFullYear();
        const month = (newEndDate.getMonth() + 1) < 10 ? `0${newEndDate.getMonth() + 1}` : (newEndDate.getMonth() + 1);
        const day = (newEndDate.getDate() + 1) < 10 ? `0${newEndDate.getDate() + 1}` : (newEndDate.getDate() + 1);
        newEndDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          group: {
            ...newState.group,
            end_date: newEndDate,
          },
        };
      } else {
        newState = {
          ...newState,
          group: {
            ...newState.group,
            end_date: '',
          },
        };
      }
      return newState;
    }
    case actions.GROUPS_GETBYID_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_COMMENTS_SUCCESS:
      return {
        ...newState,
        comments: action.comments,
      };
    case actions.GROUPS_GET_COMMENTS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_SAVE_COMMENT_SUCCESS:
      return {
        ...newState,
        comment: action.comment,
      };
    case actions.GROUPS_SAVE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_ACTIVITIES_SUCCESS:
      return {
        ...newState,
        activities: action.activities,
      };
    case actions.GROUPS_GET_ACTIVITIES_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    default:
      return newState;
  }
}
