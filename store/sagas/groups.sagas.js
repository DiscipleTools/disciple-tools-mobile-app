import {
  put, take, all, takeLatest, takeEvery,
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

  try {
    const res = yield take(actions.GROUPS_GETALL_RESPONSE);
    if (res) {
      const response = res.payload;
      /* eslint-disable */
      const jsonData = JSON.parse(response._bodyInit);
      /* eslint-enable */
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_GETALL_SUCCESS,
          groups: jsonData.posts,
        });
      } else {
        yield put({
          type: actions.GROUPS_GETALL_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GETALL_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
      },
    });
  }
}

export function* saveGroup({ domain, token, groupData }) {
  yield put({ type: actions.GROUPS_SAVE_START });
  let group = groupData;
  const urlPart = group.ID ? group.ID : '';
  delete group.ID;
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${urlPart}`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(group),
      },
      action: actions.GROUPS_SAVE_RESPONSE,
    },
  });

  try {
    const responseAction = yield take(actions.GROUPS_SAVE_RESPONSE);
    if (responseAction) {
      const response = responseAction.payload;
      /* eslint-disable */
      const jsonData = JSON.parse(response._bodyInit);
      /* eslint-enable */
      if (response.status === 200) {
        group = jsonData;
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
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SAVE_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
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
    const res = yield take(actions.GROUPS_GETBYID_RESPONSE);
    if (res) {
      const response = res.payload;
      /* eslint-disable */
      const jsonData = JSON.parse(response._bodyInit);
      /* eslint-enable */
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
            data: jsonData.data,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GETBYID_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
      },
    });
  }
}

export function* getUsersAndContacts({ domain, token }) {
  yield put({ type: actions.GROUPS_GET_USERS_CONTACTS_START });
  // get all groups
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
    const res = yield take(actions.GROUPS_GET_USERS_CONTACTS_RESPONSE);
    if (res) {
      const response = res.payload;
      /* eslint-disable */
      const jsonData = JSON.parse(response._bodyInit);
      /* eslint-enable */
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
            data: jsonData.data,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_USERS_CONTACTS_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
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
    const res = yield take(actions.GROUPS_GET_COMMENTS_RESPONSE);
    if (res) {
      const response = res.payload;
      /* eslint-disable */
      const jsonData = JSON.parse(response._bodyInit);
      /* eslint-enable */
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
            data: jsonData.data,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_COMMENTS_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
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
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      },
      action: actions.GROUPS_SAVE_COMMENT_RESPONSE,
    },
  });

  try {
    const res = yield take(actions.GROUPS_SAVE_COMMENT_RESPONSE);
    if (res) {
      const response = res.payload;
      /* eslint-disable */
      const jsonData = JSON.parse(response._bodyInit);
      /* eslint-enable */
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
            data: jsonData.data,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SAVE_COMMENT_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
      },
    });
  }
}

export function* getLocations({ domain, token }) {
  yield put({ type: actions.GROUPS_GET_LOCATIONS_START });

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/mapping_module/search_geonames_by_name?filter=all`,
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
    const res = yield take(actions.GROUPS_GET_LOCATIONS_RESPONSE);
    if (res) {
      const response = res.payload;
      /* eslint-disable */
      const jsonData = JSON.parse(response._bodyInit);
      /* eslint-enable */
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_GET_LOCATIONS_SUCCESS,
          geonames: jsonData.geonames,
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_LOCATIONS_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
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
    const res = yield take(actions.GROUPS_GET_PEOPLE_GROUPS_RESPONSE);
    if (res) {
      const response = res.payload;
      /* eslint-disable */
      const jsonData = JSON.parse(response._bodyInit);
      /* eslint-enable */
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_GET_PEOPLE_GROUPS_SUCCESS,
          peopleGroups: jsonData.posts,
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
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
    const res = yield take(actions.GROUPS_GET_ACTIVITIES_RESPONSE);
    if (res) {
      const response = res.payload;
      /* eslint-disable */
      const jsonData = JSON.parse(response._bodyInit);
      /* eslint-enable */
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
            data: jsonData.data,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_ACTIVITIES_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
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
    const res = yield take(actions.GROUPS_SEARCH_RESPONSE);
    if (res) {
      const response = res.payload;
      /* eslint-disable */
      const jsonData = JSON.parse(response._bodyInit);
      /* eslint-enable */
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_SEARCH_SUCCESS,
          search: jsonData.posts,
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SEARCH_FAILURE,
      error: {
        code: '400',
        message: error.toString(),
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
  ]);
}
