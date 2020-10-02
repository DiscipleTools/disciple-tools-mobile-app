import * as actions from '../actions/i18n.actions';

const initialState = {
  canceledLocaleChange: false,
  previousLocale: null,
  previousIsRTL: false,
  locale: null,
  isRTL: false,
};

export default function i18nReducer(state = initialState, action) {
  let newState = {
    ...state,
  };
  switch (action.type) {
    case actions.I18N_SETLANGUAGE: {
      if (action.locale !== state.locale) {
        return {
          ...newState,
          previousLocale: state.locale,
          previousIsRTL: state.isRTL,
          locale: action.locale,
          isRTL: action.isRTL,
        };
      } else {
        return newState;
      }
    }
    case actions.I18N_CANCEL_SET_LANGUAGE: {
      return {
        ...newState,
        canceledLocaleChange: true,
        previousLocale: null,
        previousIsRTL: false,
        locale: state.previousLocale,
        isRTL: state.previousIsRTL,
      };
    }
    case actions.I18N_SET_CANCEL_FALSE: {
      return {
        ...newState,
        canceledLocaleChange: false,
      };
    }
    default:
      return newState;
  }
}
