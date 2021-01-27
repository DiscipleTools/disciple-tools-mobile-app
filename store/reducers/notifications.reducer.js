import * as actions from '../actions/notifications.actions';
import * as userActions from '../actions/user.actions';
import { REHYDRATE } from 'redux-persist/lib/constants';

const initialState = {
  loading: false,
  error: null,
  notifications: [],
  notificationsCount: null,
};

export default function notificationsReducer(state = initialState, action) {
  const newState = {
    ...state,
    error: null,
    notifications: null,
  };
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...newState,
        loading: false,
      };
    }
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
    case actions.NOTIFICATIONS_COUNT_BY_USER_SUCCESS:
      return {
        ...newState,
        notificationsCount: action.notificationsCount,
      };
    case actions.NOTIFICATIONS__COUNTBY_USER_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case userActions.USER_LOGOUT:
      return {
        notificationsCount: null,
      };
    default:
      return newState;
  }
}
