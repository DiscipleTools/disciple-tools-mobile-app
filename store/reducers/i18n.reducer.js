import * as actions from 'store/actions/i18n.actions';

const initialState = {
  locale: null
};

export default function i18nReducer(state = initialState, action) {
  switch (action?.type) {
    case actions.I18N_SET_LOCALE:
      const locale = action?.locale;
      return {
        ...state,
        locale
      };
    default:
      return state;
  }
}
