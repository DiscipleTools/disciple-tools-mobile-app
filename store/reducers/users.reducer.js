import * as actions from '../actions/users.actions';

const initialState = {
  error: null,
  users: null,
  loading: null,
  contactFilters: {},
  groupFilters: {},
};

export default function usersReducer(state = initialState, action) {
  const newState = {
    ...state,
    error: null,
    users: null,
  };
  switch (action.type) {
    case actions.GET_USERS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GET_USERS_SUCCESS:
      return {
        ...newState,
        users: action.users,
        loading: false,
      };
    case actions.GET_USERS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GET_CONTACT_FILTERS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GET_CONTACT_FILTERS_SUCCESS: {
      let contactFilters = { ...action.contactFilters };
      contactFilters = {
        ...contactFilters,
        tabs: contactFilters.tabs.filter((filter) => filter.key !== 'custom'),
      };
      return {
        ...newState,
        contactFilters,
        loading: false,
      };
    }
    case actions.GET_CONTACT_FILTERS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GET_GROUP_FILTERS_SUCCESS: {
      let groupFilters = { ...action.groupFilters };
      groupFilters = {
        ...groupFilters,
        tabs: groupFilters.tabs.filter((filter) => filter.key !== 'custom'),
      };
      return {
        ...newState,
        groupFilters,
        loading: false,
      };
    }
    case actions.GET_GROUP_FILTERS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.USER_LOGOUT:
      return {
        ...newState,
        users: null,
      };
    default:
      return newState;
  }
}
