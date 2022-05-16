import * as actions from "store/actions/cache.actions";
import { CLEAR_REDUX_DATA } from "store/rootActions";

import { EMPTY_CACHE } from "constants";

const initialState = {
  cache: EMPTY_CACHE
};

export default function cacheReducer(state = initialState, action) {
  switch (action?.type) {
    case CLEAR_REDUX_DATA:
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
      console.log("*** CLEAR_REDUX_DATA ***");
      return initialState;
    case actions.PERSIST_CACHE:
      return {
        cache: action?.cache ?? EMPTY_CACHE
      }; 
    default:
      return state;
  };
}
