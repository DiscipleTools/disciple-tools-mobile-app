import * as actions from '../actions/i18n.actions';

const initialState = {
  locale: 'en',
  isRTL: false,
};

export default function networkConnectivityReducer(state = initialState, action) {
  switch (action.type) {
    case actions.I18N_SETLANGUAGE:
      return {
        locale: action.locale,
        isRTL: !!action.isRTL,
      };
    default:
      return state;
  }
}
