/*
 * Action Types
 */
export const I18N_SETLANGUAGE = 'I18N_SETLANGUAGE';
export const I18N_CANCEL_SET_LANGUAGE = 'I18N_CANCEL_SET_LANGUAGE';
export const I18N_SET_CANCEL_FALSE = 'I18N_SET_CANCEL_FALSE';

/*
 * Action Creators
 */
export function setLanguage(locale, isRTL) {
  return {
    type: I18N_SETLANGUAGE,
    locale,
    isRTL,
  };
}

export function cancelSetLanguage() {
  return {
    type: I18N_CANCEL_SET_LANGUAGE,
  };
}

export function setCancelFalse() {
  return {
    type: I18N_SET_CANCEL_FALSE,
  };
}
