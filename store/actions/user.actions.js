/*
 * Action Types
 */
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_START = 'USER_LOGIN_START';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';
export const USER_LOGOUT = 'USER_LOGOUT';

/*
 * Action Creators
 */
export function login(domain, username, password) {
  return {
    type: USER_LOGIN,
    domain,
    username,
    password,
  };
}

export function logout() {
  return { type: USER_LOGOUT };
}

/* export function getContacts() {
  return function (dispatch, getState) {
    const state = getState();
    dispatch(requestContacts());

    const url = `${state.user.baseUrl}/wp-json/dt/v1/contacts`;
    return fetch(url)
      .then(
        response => response.json(),
        error => console.log('Error fetching contacts', error),
      )
      .then((json) => {
        dispatch(receiveContacts(json));
      });
  };
} */
