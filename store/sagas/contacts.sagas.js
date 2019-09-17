import {
  put, take, takeEvery, takeLatest, all, select,
} from 'redux-saga/effects';

import * as Sentry from 'sentry-expo';
import * as actions from '../actions/contacts.actions';

function formatDateToBackendResponse(dateString) {
  const monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December',
  ];
  let date = new Date(dateString);
  date = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  date = new Date(date);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${monthNames[monthIndex]} ${day}, ${year}`;
}

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
  if (contact.ID) {
    /* eslint-disable */
    if (!isNaN(contact.ID)) {
      /* eslint-enable */
      // Numeric ID
      contactId = contact.ID;
    }
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
      jsonData = response;

      let assignedTo = (jsonData.assigned_to) ? jsonData.assigned_to.split('-') : null;
      assignedTo = (assignedTo) ? assignedTo[assignedTo.length - 1] : null;

      const baptismDate = (jsonData.baptism_date) ? formatDateToBackendResponse(jsonData.baptism_date) : '';

      jsonData = {
        ID: jsonData.ID,
        age: {
          key: (jsonData.age) ? jsonData.age : 'not-set', // get first value from local list
        },
        assigned_to: {
          id: assignedTo, // if its new contact, get value from logged user (user_nicename)
        },
        baptism_date: {
          formatted: baptismDate,
        },
        baptized: jsonData.baptized.values.map(baptizedPerson => ({ ID: baptizedPerson.value, post_title: '' })), // get post_title from local list
        baptized_by: jsonData.baptized_by.values.map(baptizedByPerson => ({ ID: baptizedByPerson.value, post_title: '' })), // get post_title from local list
        coached_by: jsonData.coached_by.values.map(coachedByPerson => ({ ID: coachedByPerson.value, post_title: '' })), // get post_title from local list
        coaching: jsonData.coaching.values.map(coachingPerson => ({ ID: coachingPerson.value, post_title: '' })), // get post_title from local list
        contact_address: jsonData.contact_address.map(contactAddress => ({ key: (contactAddress.key) ? contactAddress.key : '', value: contactAddress.value })),
        contact_email: jsonData.contact_email.map(contactEmail => ({ key: (contactEmail.key) ? contactEmail.key : '', value: contactEmail.value })),
        contact_phone: jsonData.contact_phone.map(contactPhone => ({ key: (contactPhone.key) ? contactPhone.key : '', value: contactPhone.value })),
        gender: (jsonData.gender) ? {
          key: jsonData.gender,
          label: '', // get label from local list
        } : null,
        groups: jsonData.groups.values.map(group => ({ ID: group.value, post_title: '' })), // get post_title from local list
        location_grid: jsonData.location_grid.values.map(location => ({ id: location.value, label: '' })), // get label from local list
        milestones: jsonData.milestones.values.map(milestone => (milestone.value)),
        overall_status: {
          key: (jsonData.overall_status) ? jsonData.overall_status : 'new', // get label from local list
          label: '', // get label from local list
        },
        people_groups: jsonData.people_groups.values.map(peopleGroup => ({ ID: peopleGroup.value, post_title: '' })), // get post_title from local list
        quick_button_contact_established: jsonData.quick_button_contact_established,
        quick_button_meeting_complete: jsonData.quick_button_meeting_complete,
        quick_button_meeting_scheduled: jsonData.quick_button_meeting_scheduled,
        quick_button_no_answer: jsonData.quick_button_no_answer,
        quick_button_no_show: jsonData.quick_button_no_show,
        relation: jsonData.relation.values.map(relation => ({ ID: relation.value, post_title: '' })), // get post_title from local list
        seeker_path: {
          key: (jsonData.seeker_path) ? jsonData.seeker_path : 'none', // get first value from local list
          label: '', // get label from local list
        },
        sources: jsonData.sources.values.map(source => (source.value)),
        subassigned: jsonData.subassigned.values.map(subassigned => ({ ID: subassigned.value, post_title: '' })), // get post_title from local list
        title: jsonData.title,
      };
      yield put({
        type: actions.CONTACTS_SAVE_SUCCESS,
        contact: jsonData,
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
