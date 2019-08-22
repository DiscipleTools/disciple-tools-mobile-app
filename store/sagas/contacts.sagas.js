import {
  put, take, takeEvery, takeLatest, all, call,
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
      const jsonData = yield response.clone().json();
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
        message: error.toString(),
      },
    });
  }
}

export function* save({ domain, token, contactData }) {
  yield put({ type: actions.CONTACTS_SAVE_START });
  const contact = contactData;
  let contactInitialComment;
  if (contact.initial_comment) {
    contactInitialComment = contact.initial_comment;
    delete contact.initial_comment;
  }
  const contactId = contact.ID ? contact.ID : '';
  delete contact.ID;
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}`,
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
      const jsonData = yield response.clone().json();
      if (response.status === 200) {
        if (contactInitialComment) {
          yield put({ type: actions.CONTACTS_SAVE_COMMENT_START });
          yield put({
            type: 'REQUEST',
            payload: {
              url: `https://${domain}/wp-json/dt-posts/v2/contacts/${jsonData.ID}/comments`,
              data: {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  comment: `${contactInitialComment}`,
                }),
              },
              action: actions.CONTACTS_SAVE_COMMENT_RESPONSE,
            },
          });
          const res = yield take(actions.CONTACTS_SAVE_COMMENT_RESPONSE);
          if (res) {
            const responseComment = res.payload;
            const saveCommentJsonData = yield call(() => new Promise((resolve) => {
              resolve(response.clone());
            }));
            if (responseComment.status !== 200) {
              yield put({
                type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
                error: {
                  code: saveCommentJsonData.code,
                  message: saveCommentJsonData.message,
                  data: saveCommentJsonData.data,
                },
              });
            }
          }
        }
        yield put({
          type: actions.CONTACTS_SAVE_SUCCESS,
          contact: jsonData,
        });
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
    yield put({
      type: actions.CONTACTS_SAVE_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
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
      const jsonData = yield response.clone().json();
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_GETBYID_SUCCESS,
          contact: jsonData,
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
    yield put({
      type: actions.CONTACTS_GETBYID_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
      },
    });
  }
}

export function* saveComment({
  domain, token, contactId, commentData,
}) {
  yield put({ type: actions.CONTACTS_SAVE_COMMENT_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/comments`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      },
      action: actions.CONTACTS_SAVE_COMMENT_RESPONSE,
    },
  });

  try {
    const res = yield take(actions.CONTACTS_SAVE_COMMENT_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.clone().json();
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_SAVE_COMMENT_SUCCESS,
          comment: jsonData,
        });
      } else {
        yield put({
          type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
            data: jsonData.data,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
      },
    });
  }
}

export function* getCommentsByContact({
  domain, token, contactId, offset, limit,
}) {
  yield put({ type: actions.CONTACTS_GET_COMMENTS_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/comments?number=${limit}&offset=${offset}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.CONTACTS_GET_COMMENTS_RESPONSE,
    },
  });

  try {
    const res = yield take(actions.CONTACTS_GET_COMMENTS_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.clone().json();
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_GET_COMMENTS_SUCCESS,
          comments: jsonData.comments,
          total: jsonData.total,
        });
      } else {
        yield put({
          type: actions.CONTACTS_GET_COMMENTS_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
            data: jsonData.data,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GET_COMMENTS_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
      },
    });
  }
}

export function* getActivitiesByContact({
  domain, token, contactId, offset, limit,
}) {
  yield put({ type: actions.CONTACTS_GET_ACTIVITIES_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/activity?number=${limit}&offset=${offset}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.CONTACTS_GET_ACTIVITIES_RESPONSE,
    },
  });

  try {
    const res = yield take(actions.CONTACTS_GET_ACTIVITIES_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.clone().json();
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_GET_ACTIVITIES_SUCCESS,
          activities: jsonData.activity,
          total: jsonData.total,
        });
      } else {
        yield put({
          type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
            data: jsonData.data,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
      },
    });
  }
}

export default function* contactsSaga() {
  yield all([
    takeLatest(actions.CONTACTS_GETALL, getAll),
    takeEvery(actions.CONTACTS_SAVE, save),
    takeEvery(actions.CONTACTS_GETBYID, getById),
    takeEvery(actions.CONTACTS_GET_COMMENTS, getCommentsByContact),
    takeEvery(actions.CONTACTS_SAVE_COMMENT, saveComment),
    takeEvery(actions.CONTACTS_GET_ACTIVITIES, getActivitiesByContact),
  ]);
}
