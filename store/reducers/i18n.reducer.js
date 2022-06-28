import * as actions from "store/actions/i18n.actions";
import { REINITIALIZE_REDUX } from "store/rootActions";

const initialState = {
  locale: "en_US",
};

export default function i18nReducer(state = initialState, action) {
  switch (action?.type) {
    case REINITIALIZE_REDUX:
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("*** REINITIALIZE_REDUX ***");
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
