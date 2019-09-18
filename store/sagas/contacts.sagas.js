import { AsyncStorage } from 'react-native';

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

function* getLocalLists() {
  let lists = {};
  const users = yield AsyncStorage.getItem('usersList');
  if (users !== null) {
    lists = {
      users: JSON.parse(users).map(user => ({
        key: user.ID,
        label: user.name,
      })),
    };
  }

  const usersContacts = yield AsyncStorage.getItem('usersAndContactsList');
  if (usersContacts !== null) {
    lists = {
      ...lists,
      usersContacts: JSON.parse(usersContacts),
    };
  }

  const peopleGroups = yield AsyncStorage.getItem('peopleGroupsList');
  if (peopleGroups !== null) {
    lists = {
      ...lists,
      peopleGroups: JSON.parse(peopleGroups),
    };
  }

  const geonames = yield AsyncStorage.getItem('locationsList');
  if (geonames !== null) {
    lists = {
      ...lists,
      geonames: JSON.parse(geonames),
    };
  }

  const groups = yield AsyncStorage.getItem('searchGroupsList');
  if (groups !== null) {
    lists = {
      ...lists,
      groups: JSON.parse(groups),
    };
  }

  const contactsSettings = yield AsyncStorage.getItem('contactSettings');
  if (contactsSettings !== null) {
    lists = {
      ...lists,
      contactsSettings: JSON.parse(contactsSettings),
    };
  }

  return lists;
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
      const {
        users, usersContacts, peopleGroups, geonames, groups, contactsSettings,
      } = yield getLocalLists();

      const userData = yield select(state => state.userReducer.userData);

      let assignedTo = (jsonData.assigned_to) ? jsonData.assigned_to.split('-') : null;
      if (assignedTo) {
        assignedTo = assignedTo[assignedTo.length - 1];
      } else {
        const userItem = users.find(user => (user.label === userData.username));
        assignedTo = userItem.key;
      }

      const baptismDate = (jsonData.baptism_date) ? formatDateToBackendResponse(jsonData.baptism_date) : '';
      const overallStatus = (jsonData.overall_status) ? jsonData.overall_status : 'new';
      const seekerPath = (jsonData.seeker_path) ? jsonData.seeker_path : 'none';

      const subassignedContacts = jsonData.subassigned.values.map((subassigned) => {
        let postTitle = usersContacts.find(userContact => (userContact.value === subassigned.value));
        postTitle = (postTitle) ? postTitle.name : '';
        return { ID: subassigned.value, post_title: postTitle };
      });
      const locationGrid = jsonData.location_grid.values.map((location) => {
        let postTitle = geonames.find(geoname => (geoname.value === location.value));
        postTitle = (postTitle) ? postTitle.name : '';
        return { id: location.value, label: postTitle };
      });
      const peopleGroupsMapped = jsonData.people_groups.values.map((peopleGroup) => {
        let postTitle = peopleGroups.find(group => (group.value === peopleGroup.value));
        postTitle = (postTitle) ? postTitle.name : '';
        return { ID: peopleGroup.value, post_title: postTitle };
      });
      const groupsMapped = jsonData.groups.values.map((group) => {
        let postTitle = groups.find(groupItem => (groupItem.value === group.value));
        postTitle = (postTitle) ? postTitle.name : '';
        return { ID: group.value, post_title: postTitle };
      });
      const relationMapped = jsonData.relation.values.map((relation) => {
        let postTitle = usersContacts.find(userContact => (userContact.value === relation.value));
        postTitle = (postTitle) ? postTitle.name : '';
        return { ID: relation.value, post_title: postTitle };
      });
      const baptizedMapped = jsonData.baptized.values.map((baptized) => {
        let postTitle = usersContacts.find(userContact => (userContact.value === baptized.value));
        postTitle = (postTitle) ? postTitle.name : '';
        return { ID: baptized.value, post_title: postTitle };
      });
      const baptizedByMapped = jsonData.baptized_by.values.map((baptizedBy) => {
        let postTitle = usersContacts.find(userContact => (userContact.value === baptizedBy.value));
        postTitle = (postTitle) ? postTitle.name : '';
        return { ID: baptizedBy.value, post_title: postTitle };
      });
      const coachedByMapped = jsonData.coached_by.values.map((coachedBy) => {
        let postTitle = usersContacts.find(userContact => (userContact.value === coachedBy.value));
        postTitle = (postTitle) ? postTitle.name : '';
        return { ID: coachedBy.value, post_title: postTitle };
      });
      const coachingMapped = jsonData.coaching.values.map((coaching) => {
        let postTitle = usersContacts.find(userContact => (userContact.value === coaching.value));
        postTitle = (postTitle) ? postTitle.name : '';
        return { ID: coaching.value, post_title: postTitle };
      });

      jsonData = {
        ID: jsonData.ID,
        age: {
          key: (jsonData.age) ? jsonData.age : 'not-set',
        },
        assigned_to: {
          id: assignedTo, // if its new contact, get value from logged user (user_nicename)
        },
        baptism_date: {
          formatted: baptismDate,
        },
        groups: groupsMapped,
        location_grid: locationGrid,
        people_groups: peopleGroupsMapped,
        subassigned: subassignedContacts,
        relation: relationMapped,
        baptized: baptizedMapped,
        baptized_by: baptizedByMapped,
        coached_by: coachedByMapped,
        coaching: coachingMapped,
        contact_address: jsonData.contact_address.map(contactAddress => ({ key: (contactAddress.key) ? contactAddress.key : '', value: contactAddress.value })),
        contact_email: jsonData.contact_email.map(contactEmail => ({ key: (contactEmail.key) ? contactEmail.key : '', value: contactEmail.value })),
        contact_phone: jsonData.contact_phone.map(contactPhone => ({ key: (contactPhone.key) ? contactPhone.key : '', value: contactPhone.value })),
        gender: (jsonData.gender) ? {
          key: jsonData.gender,
          label: contactsSettings.gender.default[jsonData.gender].label,
        } : null,
        milestones: jsonData.milestones.values.map(milestone => (milestone.value)),
        overall_status: {
          key: overallStatus,
          label: contactsSettings.overall_status.default[overallStatus].label,
        },
        seeker_path: {
          key: seekerPath,
          label: contactsSettings.seeker_path.default[seekerPath].label,
        },
        sources: jsonData.sources.values.map(source => (source.value)),
        quick_button_contact_established: jsonData.quick_button_contact_established,
        quick_button_meeting_complete: jsonData.quick_button_meeting_complete,
        quick_button_meeting_scheduled: jsonData.quick_button_meeting_scheduled,
        quick_button_no_answer: jsonData.quick_button_no_answer,
        quick_button_no_show: jsonData.quick_button_no_show,
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
