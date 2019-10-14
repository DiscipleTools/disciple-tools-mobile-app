import {
  put, take, all, takeLatest, takeEvery, select,
} from 'redux-saga/effects';

import * as actions from '../actions/groups.actions';

export function* getAll({ domain, token }) {
  yield put({ type: actions.GROUPS_GETALL_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GETALL_RESPONSE,
    },
  });
  const isConnected = yield select(state => state.networkConnectivityReducer.isConnected);
  try {
    let response = yield take(actions.GROUPS_GETALL_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      if (isConnected) {
        yield put({
          type: actions.GROUPS_GETALL_SUCCESS,
          groups: jsonData.posts,
        });
      } else {
        yield put({
          type: actions.GROUPS_GETALL_SUCCESS,
          groups: jsonData.posts,
          offline: true,
        });
      }
    } else {
      yield put({
        type: actions.GROUPS_GETALL_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GETALL_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* saveGroup({ domain, token, groupData }) {
  const isConnected = yield select(state => state.networkConnectivityReducer.isConnected);

  yield put({ type: actions.GROUPS_SAVE_START });

  const group = groupData;
  let groupId = '';
  // Add ID to URL only on D.B. IDs
  /* eslint-disable */
  if (group.ID && !isNaN(group.ID)) {
    /* eslint-enable */
    groupId = group.ID;
  }

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(group),
      },
      isConnected,
      action: actions.GROUPS_SAVE_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_SAVE_RESPONSE);
    response = response.payload;
    let jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_SAVE_SUCCESS,
          group: jsonData,
        });
      } else {
        yield put({
          type: actions.GROUPS_SAVE_FAILURE,
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
      if (groupId.length > 0) {
        jsonData = {
          ...jsonData,
          ID: groupId,
        };
      }
      yield put({
        type: actions.GROUPS_SAVE_SUCCESS,
        group: jsonData,
        offline: true,
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SAVE_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getById({ domain, token, groupId }) {
  yield put({ type: actions.GROUPS_GETBYID_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GETBYID_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GETBYID_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GETBYID_SUCCESS,
        group: jsonData,
      });
    } else {
      yield put({
        type: actions.GROUPS_GETBYID_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GETBYID_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getUsersAndContacts({ domain, token }) {
  yield put({ type: actions.GROUPS_GET_USERS_CONTACTS_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/compact`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_USERS_CONTACTS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GET_USERS_CONTACTS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GET_USERS_CONTACTS_SUCCESS,
        usersContacts: jsonData.posts,
      });
    } else {
      yield put({
        type: actions.GROUPS_GET_USERS_CONTACTS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_USERS_CONTACTS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getCommentsByGroup({
  domain, token, groupId, offset, limit,
}) {
  yield put({ type: actions.GROUPS_GET_COMMENTS_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/comments?number=${limit}&offset=${offset}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_COMMENTS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GET_COMMENTS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GET_COMMENTS_SUCCESS,
        comments: jsonData.comments,
        total: jsonData.total,
      });
    } else {
      yield put({
        type: actions.GROUPS_GET_COMMENTS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_COMMENTS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* saveComment({
  domain, token, groupId, commentData,
}) {
  yield put({ type: actions.GROUPS_SAVE_COMMENT_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/comments`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      },
      action: actions.GROUPS_SAVE_COMMENT_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_SAVE_COMMENT_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_SAVE_COMMENT_SUCCESS,
        comment: jsonData,
      });
    } else {
      yield put({
        type: actions.GROUPS_SAVE_COMMENT_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SAVE_COMMENT_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getLocations({ domain, token }) {
  yield put({ type: actions.GROUPS_GET_LOCATIONS_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/mapping_module/search_location_grid_by_name?filter=all`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_LOCATIONS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GET_LOCATIONS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GET_LOCATIONS_SUCCESS,
        geonames: jsonData.location_grid,
      });
    } else {
      yield put({
        type: actions.GROUPS_GET_LOCATIONS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_LOCATIONS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getPeopleGroups({ domain, token }) {
  yield put({ type: actions.GROUPS_GET_PEOPLE_GROUPS_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/people-groups/compact/?s=`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_PEOPLE_GROUPS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GET_PEOPLE_GROUPS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GET_PEOPLE_GROUPS_SUCCESS,
        peopleGroups: jsonData.posts,
      });
    } else {
      yield put({
        type: actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getActivitiesByGroup({
  domain, token, groupId, offset, limit,
}) {
  yield put({ type: actions.GROUPS_GET_ACTIVITIES_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/activity?number=${limit}&offset=${offset}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_ACTIVITIES_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GET_ACTIVITIES_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GET_ACTIVITIES_SUCCESS,
        activities: jsonData.activity,
        total: jsonData.total,
      });
    } else {
      yield put({
        type: actions.GROUPS_GET_ACTIVITIES_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_ACTIVITIES_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* searchGroups({ domain, token }) {
  yield put({ type: actions.GROUPS_SEARCH_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/compact/?s=`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_SEARCH_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_SEARCH_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_SEARCH_SUCCESS,
        search: jsonData.posts,
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SEARCH_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getSettings({ domain, token }) {
  yield put({ type: actions.GROUPS_GET_SETTINGS_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/settings`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_SETTINGS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GET_SETTINGS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GET_SETTINGS_SUCCESS,
        settings: jsonData,
      });
    } else {
      yield put({
        type: actions.GROUPS_GET_SETTINGS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_SETTINGS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export default function* groupsSaga() {
  yield all([
    takeEvery(actions.GROUPS_SAVE, saveGroup),
    takeLatest(actions.GROUPS_GETALL, getAll),
    takeEvery(actions.GROUPS_GETBYID, getById),
    takeEvery(actions.GROUPS_GET_USERS_CONTACTS, getUsersAndContacts),
    takeEvery(actions.GROUPS_GET_COMMENTS, getCommentsByGroup),
    takeEvery(actions.GROUPS_SAVE_COMMENT, saveComment),
    takeEvery(actions.GROUPS_GET_LOCATIONS, getLocations),
    takeEvery(actions.GROUPS_GET_PEOPLE_GROUPS, getPeopleGroups),
    takeEvery(actions.GROUPS_GET_ACTIVITIES, getActivitiesByGroup),
    takeEvery(actions.GROUPS_SEARCH, searchGroups),
    takeEvery(actions.GROUPS_GET_SETTINGS, getSettings),
  ]);
}
