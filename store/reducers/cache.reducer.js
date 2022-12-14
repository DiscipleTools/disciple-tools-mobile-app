import * as actions from "../actions/cache.actions";

const initialState = {};

export default function cacheReducer(state = initialState, action) {
  switch (action.type) {
    case actions.CACHE_SET:
      return action?.cache ?? {};
    default:
      return state;
  }
}
