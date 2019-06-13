import {
  put, take, takeEvery, takeLatest, all,
} from 'redux-saga/effects';
import * as actions from '../actions/contacts.actions';

export function* getAll({ domain, token }) {
  yield put({ type: actions.CONTACTS_GETALL_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.CONTACTS_GETALL_RESPONSE,
    },
  });

  try {
    const res = yield take(actions.CONTACTS_GETALL_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        if (jsonData.posts) {
          yield put({
            type: actions.CONTACTS_GETALL_SUCCESS,
            contacts: jsonData.posts,
          });
        } else {
          yield put({
            type: actions.CONTACTS_GETALL_SUCCESS,
            contacts: [],
          });
        }
      } else {
        yield put({
          type: actions.CONTACTS_GETALL_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GETALL_FAILURE,
      error: {
        code: '400',
        message: '(400) Unable to process the request. Please try again later.',
      },
    });
  }
}

/* function* delayPostInitialComment(user, comment, contactId) {
  // post the delayed initial comment
  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${user.domain}/wp-json/dt/v1/contact/${contactId}/comment`,
      data: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          comment: `${comment}`
        })
      }
    }
  });
} */

export function* save({ domain, token, contactData }) {
  yield put({ type: actions.CONTACTS_SAVE });
  let contact = contactData;
  const urlPart = contact.ID ? contact.ID : '';
  delete contact.ID;
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${urlPart}`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contact),
      },
      action: actions.CONTACTS_SAVE_RESPONSE,
    },
  });

  try {
    const responseAction = yield take(actions.CONTACTS_SAVE_RESPONSE);
    if (responseAction) {
      const response = responseAction.payload;
      const jsonData = yield response.json();
      // response.status === 200
      if (jsonData.ID) {
        contact = jsonData;
        yield put({
          type: actions.CONTACTS_SAVE_SUCCESS,
          contact: {},
        });
        /* if (contact.initial_comment) {
          // submit the comment now, AFTER receiving the D.T key/ID
          delayPostInitialComment(user, contact.initial_comment, key);
        } */
      } else {
        yield put({
          type: actions.CONTACTS_SAVE_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    }
  } catch (error) {
    console.log('saveContact() -> error');
    console.log(error);
    yield put({
      type: actions.CONTACTS_SAVE_FAILURE,
      error: {
        code: '400',
        message: '(400) Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getById({ domain, token, contactId }) {
  yield put({ type: actions.CONTACTS_GETBYID_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.CONTACTS_GETBYID_RESPONSE,
    },
  });

  try {
    const res = yield take(actions.CONTACTS_GETBYID_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        const contact = jsonData;
        yield put({
          type: actions.CONTACTS_GETBYID_SUCCESS,
          contact: {},
        });
      } else {
        yield put({
          type: actions.CONTACTS_GETBYID_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
            data: jsonData.data,
          },
        });
      }
    }
  } catch (error) {
    console.log('getById() ->error');
    console.log(error);
    yield put({
      type: actions.CONTACTS_GETBYID_FAILURE,
      error: {
        code: '400',
        message: '(400) Unable to process the request. Please try again later.',
      },
    });
  }
}

export default function* contactsSaga() {
  yield all([
    takeLatest(actions.CONTACTS_GETALL, getAll),
    takeEvery(actions.CONTACTS_SAVE, save),
    takeEvery(actions.CONTACTS_GETBYID, getById),
  ]);
}
