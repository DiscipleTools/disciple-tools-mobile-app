import * as actions from "store/actions/cache.actions";
import { REINITIALIZE_REDUX } from "store/rootActions";

import { EMPTY_CACHE } from "constants";

const initialState = {
  cache: EMPTY_CACHE,
};

export default function cacheReducer(state = initialState, action) {
  switch (action?.type) {
    case REINITIALIZE_REDUX:
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("*** REINITIALIZE_REDUX ***");
      return initialState;
    case actions.PERSIST_CACHE:
      return {
        cache: action?.cache ?? EMPTY_CACHE,
      };
    default:
      return state;
  }
}
