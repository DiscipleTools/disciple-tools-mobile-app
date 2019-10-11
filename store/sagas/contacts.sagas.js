import {
  put, take, takeEvery, takeLatest, all, select,
} from 'redux-saga/effects';

import * as Sentry from 'sentry-expo';
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
  const isConnected = yield select(state => state.networkConnectivityReducer.isConnected);
  try {
    let response = yield take(actions.CONTACTS_GETALL_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      if (jsonData.posts) {
        if (isConnected) {
          yield put({
            type: actions.CONTACTS_GETALL_SUCCESS,
            contacts: jsonData.posts,
          });
        } else {
          yield put({
            type: actions.CONTACTS_GETALL_SUCCESS,
            contacts: jsonData.posts,
            offline: true,
          });
        }
      } else {
        yield put({
          type: actions.CONTACTS_GETALL_SUCCESS,
          contacts: [],
        });
      }
    } else if (isConnected) {
      yield put({
        type: actions.CONTACTS_GETALL_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    if (isConnected) {
      Sentry.captureException(error);
    }
    yield put({
      type: actions.CONTACTS_GETALL_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* save({ domain, token, contactData }) {
  const isConnected = yield select(state => state.networkConnectivityReducer.isConnected);

  yield put({ type: actions.CONTACTS_SAVE_START });

  const contact = contactData;
  let contactInitialComment;
  if (contact.initial_comment) {
    contactInitialComment = contact.initial_comment;
    delete contact.initial_comment;
  }
  let contactId = '';
  // Add ID to URL only on D.B. IDs
  /* eslint-disable */
  if (contact.ID && !isNaN(contact.ID)) {
    /* eslint-enable */
    contactId = contact.ID;
  }
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contact),
      },
      isConnected,
      action: actions.CONTACTS_SAVE_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.CONTACTS_SAVE_RESPONSE);
    response = response.payload;
    let jsonData = response.data;
    if (isConnected) {
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
          response = yield take(actions.CONTACTS_SAVE_COMMENT_RESPONSE);
          response = response.payload;
          const jsonDataComment = response.data;
          if (response.status !== 200) {
            if (isConnected) {
              Sentry.captureException({
                type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
                error: {
                  code: jsonDataComment.code,
                  message: jsonDataComment.message,
                },
              });
            }
            yield put({
              type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
              error: {
                code: jsonDataComment.code,
                message: jsonDataComment.message,
              },
            });
          }
        }
        yield put({
          type: actions.CONTACTS_SAVE_SUCCESS,
          contact: jsonData,
        });
      } else {
        if (isConnected) {
          Sentry.captureException({
            type: actions.CONTACTS_SAVE_FAILURE,
            error: {
              code: jsonData.code,
              message: jsonData.message,
            },
          });
        }
        yield put({
          type: actions.CONTACTS_SAVE_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    } else {
      jsonData = {
        ...response,
      };
      if (contactId.length > 0) {
        jsonData = {
          ...jsonData,
          ID: contactId,
        };
      }
      yield put({
        type: actions.CONTACTS_SAVE_SUCCESS,
        contact: jsonData,
        offline: true,
      });
    }
  } catch (error) {
    if (isConnected) {
      Sentry.captureException(error);
    }
    yield put({
      type: actions.CONTACTS_SAVE_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
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
  const isConnected = yield select(state => state.networkConnectivityReducer.isConnected);
  try {
    let response = yield take(actions.CONTACTS_GETBYID_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.CONTACTS_GETBYID_SUCCESS,
        contact: jsonData,
      });
    } else {
      if (isConnected) {
        Sentry.captureException({
          type: actions.CONTACTS_GETBYID_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
      yield put({
        type: actions.CONTACTS_GETBYID_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    if (isConnected) {
      Sentry.captureException(error);
    }
    yield put({
      type: actions.CONTACTS_GETBYID_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      },
      action: actions.CONTACTS_SAVE_COMMENT_RESPONSE,
    },
  });
  const isConnected = yield select(state => state.networkConnectivityReducer.isConnected);
  try {
    let response = yield take(actions.CONTACTS_SAVE_COMMENT_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.CONTACTS_SAVE_COMMENT_SUCCESS,
        comment: jsonData,
      });
    } else {
      if (isConnected) {
        Sentry.captureException({
          type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
      yield put({
        type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    if (isConnected) {
      Sentry.captureException(error);
    }
    yield put({
      type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getCommentsByContact({
  domain, token, contactId, offset, limit,
}) {
  yield put({ type: actions.CONTACTS_GET_COMMENTS_START });
  /* eslint-disable */
  if (isNaN(contactId)) {
    /* eslint-enable */
    yield put({
      type: actions.CONTACTS_GET_COMMENTS_SUCCESS,
      comments: [],
      total: 0,
    });
  } else {
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
    const isConnected = yield select(state => state.networkConnectivityReducer.isConnected);
    try {
      let response = yield take(actions.CONTACTS_GET_COMMENTS_RESPONSE);
      response = response.payload;
      const jsonData = response.data;
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_GET_COMMENTS_SUCCESS,
          comments: jsonData.comments,
          total: jsonData.total,
        });
      } else {
        if (isConnected) {
          Sentry.captureException({
            type: actions.CONTACTS_GET_COMMENTS_FAILURE,
            error: {
              code: jsonData.code,
              message: jsonData.message,
            },
          });
        }
        yield put({
          type: actions.CONTACTS_GET_COMMENTS_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    } catch (error) {
      if (isConnected) {
        Sentry.captureException(error);
      }
      yield put({
        type: actions.CONTACTS_GET_COMMENTS_FAILURE,
        error: {
          code: '400',
          message: 'Unable to process the request. Please try again later.',
        },
      });
    }
  }
}

export function* getActivitiesByContact({
  domain, token, contactId, offset, limit,
}) {
  yield put({ type: actions.CONTACTS_GET_ACTIVITIES_START });
  /* eslint-disable */
  if (isNaN(contactId)) {
    /* eslint-enable */
    yield put({
      type: actions.CONTACTS_GET_ACTIVITIES_SUCCESS,
      activities: [],
      total: 0,
    });
  } else {
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
    const isConnected = yield select(state => state.networkConnectivityReducer.isConnected);
    try {
      let response = yield take(actions.CONTACTS_GET_ACTIVITIES_RESPONSE);
      response = response.payload;
      const jsonData = response.data;
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_GET_ACTIVITIES_SUCCESS,
          activities: jsonData.activity,
          total: jsonData.total,
        });
      } else {
        if (isConnected) {
          Sentry.captureException({
            type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
            error: {
              code: jsonData.code,
              message: jsonData.message,
            },
          });
        }
        yield put({
          type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    } catch (error) {
      if (isConnected) {
        Sentry.captureException(error);
      }
      yield put({
        type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
        error: {
          code: '400',
          message: 'Unable to process the request. Please try again later.',
        },
      });
    }
  }
}

export function* getSettings({ domain, token }) {
  yield put({ type: actions.CONTACTS_GET_SETTINGS_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/settings`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.CONTACTS_GET_SETTINGS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.CONTACTS_GET_SETTINGS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.CONTACTS_GET_SETTINGS_SUCCESS,
        settings: jsonData,
      });
    } else {
      yield put({
        type: actions.CONTACTS_GET_SETTINGS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GET_SETTINGS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
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
    takeEvery(actions.CONTACTS_GET_SETTINGS, getSettings),
  ]);
}
