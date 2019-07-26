import * as actions from '../actions/users.actions';

const initialState = {
  type: null,
  error: null,
  users: [],
};

export default function usersReducer(state = initialState, action) {
  const newState = {
    ...state,
    type: action.type,
    error: null,
  };
  switch (action.type) {
    case actions.GET_USERS_START:
      return {
        ...newState,
      };
    case actions.GET_USERS_SUCCESS:
      return {
        ...newState,
        users: action.users,
      };
    case actions.GET_USERS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    default:
      return {
        ...newState,
        error: null,
        type: null,
      };
  }
}
