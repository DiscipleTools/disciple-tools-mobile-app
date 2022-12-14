export const AUTH_TOGGLE_AUTO_LOGIN = "AUTH_TOGGLE_AUTO_LOGIN";
export const AUTH_TOGGLE_REMEMBER_LOGIN_DETAILS =
  "AUTH_TOGGLE_REMEMBER_LOGIN_DETAILS";
export const AUTH_SET_CNONCE_LOGIN = "AUTH_SET_CNONCE_LOGIN";
export const AUTH_SET_HAS_PIN = "AUTH_SET_HAS_PIN";
export const AUTH_SET_CNONCE_PIN = "AUTH_SET_CNONCE_PIN";
export const AUTH_SET_FORM_FIELD = "AUTH_SET_FORM_FIELD";
export const AUTH_CLEAR_FORM_FIELDS = "AUTH_CLEAR_FORM_FIELDS";

export function toggleAutoLogin() {
  return { type: AUTH_TOGGLE_AUTO_LOGIN };
}

export function toggleRememberLoginDetails() {
  return { type: AUTH_TOGGLE_REMEMBER_LOGIN_DETAILS };
}

export function setCNonceLogin(cnonceLogin) {
  return { type: AUTH_SET_CNONCE_LOGIN, cnonceLogin };
}

export function setHasPIN(hasPIN) {
  return { type: AUTH_SET_HAS_PIN, hasPIN };
}

export function setCNoncePIN(cnoncePIN) {
  return { type: AUTH_SET_CNONCE_PIN, cnoncePIN };
}

export function setFormField({ key, value }) {
  return { type: AUTH_SET_FORM_FIELD, key, value };
}

export function clearFormFields() {
  return { type: AUTH_CLEAR_FORM_FIELDS };
}
