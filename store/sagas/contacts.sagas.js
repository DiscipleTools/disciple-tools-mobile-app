import {
  put, take, takeEvery, takeLatest, all, select,
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
    let response = yield take(actions.CONTACTS_GETALL_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
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
  } catch (error) {
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
  const networkConnectivityReducer = yield select(state => state.networkConnectivityReducer);
  const { isConnected } = networkConnectivityReducer;

  yield put({ type: actions.CONTACTS_SAVE_START });
  const contact = contactData;
  let contactInitialComment;
  if (contact.initial_comment) {
    contactInitialComment = contact.initial_comment;
    delete contact.initial_comment;
  }
  let contactId = '';
  if (contact.ID) {
    if (!isConnected && Number.isNaN(contact.ID)) {
      // Offline and UUID
      contactId = '';
    } else if (!Number.isNaN(contact.ID)) {
      // Online or Offline and numeric ID (db contact)
      contactId = contact.ID;
      delete contact.ID;
    }
  }
  //console.log('0.1 isConnected', isConnected);
  //console.log('0.2 contactId', contactId);
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
    //console.log("3.1 CONTACTS_SAVE_RESPONSE", response);
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
          let jsonDataComment = response.data;
          if (response.status !== 200) {
            yield put({
              type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
              error: {
                code: jsonDataComment.code,
                message: jsonDataComment.message,
              },
            });
          }
        }
        //console.log("3.2 CONTACTS_SAVE_SUCCESS online", jsonData);
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
      jsonData = response;
      //console.log('3.2 jsonData', jsonData);
      jsonData = {
        ...jsonData,
        sources: [jsonData.sources.values[0].value],
        location_grid: [], // How to get tag labels in local ???
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
      //console.log("3.3 CONTACTS_SAVE_SUCCESS offline", jsonData);
      yield put({
        type: actions.CONTACTS_SAVE_SUCCESS,
        contact: jsonData,
      });
    }
  } catch (error) {
    //console.log("3.4 error", error);
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
      yield put({
        type: actions.CONTACTS_GETBYID_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
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
      yield put({
        type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
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
      yield put({
        type: actions.CONTACTS_GET_COMMENTS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GET_COMMENTS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
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
      yield put({
        type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
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
  ]);
}
