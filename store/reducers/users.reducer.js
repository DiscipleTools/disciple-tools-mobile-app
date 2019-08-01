import * as actions from '../actions/users.actions';

const initialState = {
  error: null,
  users: null,
  loading: null,
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
    default:
      return {
        ...newState,
        error: null,
        type: null,
      };
  }
}
