/*
 * Action Types
 */
export const I18N_SETLANGUAGE = 'I18N_SETLANGUAGE';

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
