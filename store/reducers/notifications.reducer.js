import * as actions from '../actions/notifications.actions';

const initialState = {
  loading: false,
  error: null,
  notifications: [],
};

export default function notificationsReducer(state = initialState, action) {
  const newState = {
    ...state,
    error: null,
  };
  switch (action.type) {
    case actions.NOTIFICATIONS_BY_USER_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.NOTIFICATIONS_BY_USER_SUCCESS:
      return {
        ...newState,
        notifications: action.notifications,
        loading: false,
      };
    case actions.NOTIFICATIONS_BY_USER_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    default:
      return newState;
  }
}
