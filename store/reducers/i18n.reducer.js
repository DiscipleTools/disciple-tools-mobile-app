import * as actions from "store/actions/i18n.actions";
import { CLEAR_REDUX_DATA } from "store/rootActions";

const initialState = {
  locale: "en_US",
};

export default function i18nReducer(state = initialState, action) {
  switch (action?.type) {
    case CLEAR_REDUX_DATA:
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
      console.log("*** CLEAR_REDUX_DATA ***");
      return initialState;
    case actions.I18N_SET_LOCALE:
      const locale = action?.locale;
      return {
        locale,
      };
    default:
      return state;
  }
}
