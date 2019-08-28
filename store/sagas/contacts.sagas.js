import {
  put, take, takeEvery, takeLatest, all, call, select,
} from 'redux-saga/effects';
import * as actions from '../actions/contacts.actions';
/* eslint-disable */
import store from '../store';
/* eslint-enable */

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
  const networkConnectivityReducer = yield select(state => state.networkConnectivityReducer);
  const { isConnected } = networkConnectivityReducer;

  yield put({ type: actions.CONTACTS_SAVE_START });
  const contact = contactData;
  let contactInitialComment;
  if (contact.initial_comment) {
    contactInitialComment = contact.initial_comment;
    delete contact.initial_comment;
  }
  let contactId = contact.ID ? contact.ID : '';
  if (isConnected || (!isConnected && !Number.isNaN(contact.ID))) {
    // Online or Offline and id numeric (db contact)
    delete contact.ID;
  } else if (!isConnected && Number.isNaN(contact.ID)) {
    // Offline and UUID
    contactId = '';
  }
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
      isConnected: store.getState().networkConnectivityReducer.isConnected,
      action: actions.CONTACTS_SAVE_RESPONSE,
    },
  });
  try {
    const responseAction = yield take(actions.CONTACTS_SAVE_RESPONSE);
    if (responseAction) {
      const response = responseAction.payload;
      if (isConnected) {
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
      } else {
        let jsonData = response;
        jsonData = {
          ...jsonData,
          sources: [jsonData.sources.values[0].value],
          geonames: [], // How to get tag labels in local ???
          overall_status: {
            key: '', // get and transform value
          },
          seeker_path: {
            key: '', // get and transform value
          },
          subassigned: jsonData.subassigned.values, // transform value
          milestones: jsonData.milestones.values, // transform value
          groups: jsonData.groups.values, // transform value
          relation: jsonData.relation.values, // transform value
          baptized_by: jsonData.baptized_by.values, // transform value
          baptized: jsonData.baptized.values, // transform value
          coached_by: jsonData.coached_by.values, // transform value
          coaching: jsonData.coaching.values, // transform value
          people_groups: jsonData.people_groups.values, // transform value
        };
        yield put({
          type: actions.CONTACTS_SAVE_SUCCESS,
          contact: jsonData,
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
