import { put, take, all, takeLatest, takeEvery } from "redux-saga/effects";
import * as actions from "../actions/groups.actions";

export function* getAll({ domain, token }) {
  yield put({ type: actions.GROUPS_GETALL_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt/v1/groups`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.GROUPS_GETALL_RESPONSE
    }
  });

  try {
    const res = yield take(actions.GROUPS_GETALL_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        if (jsonData.groups) {
          yield put({
            type: actions.GROUPS_GETALL_SUCCESS,
            groups: jsonData.groups
          });
        } else {
          yield put({
            type: actions.GROUPS_GETALL_SUCCESS,
            groups: []
          });
        }
      } else {
        yield put({
          type: actions.GROUPS_GETALL_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message
          }
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GETALL_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* saveGroup({ domain, token, groupData }) {
  yield put({ type: actions.GROUPS_SAVE_START });
  let group = groupData;
  const urlPart = group.ID ? group.ID : "";
  delete group.ID;
  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${urlPart}`,
      data: {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(group)
      },
      action: actions.GROUPS_SAVE_RESPONSE
    }
  });

  try {
    const responseAction = yield take(actions.GROUPS_SAVE_RESPONSE);
    if (responseAction) {
      const response = responseAction.payload;
      const jsonData = yield response.json();
      // response.status === 200
      if (jsonData.ID) {
        group = jsonData;
        yield put({
          type: actions.GROUPS_SAVE_SUCCESS,
          group: {
            ID: group.ID,
            title: group.title,
            group_status:
              group.group_status && group.group_status.key
                ? group.group_status.key
                : null,
            assigned_to: group.assigned_to ? group.assigned_to.id : null,
            coaches: {
              values: group.coaches
                ? group.coaches.map(coach => ({
                    value: coach.ID.toString(),
                    name: coach.post_title
                  }))
                : []
            },
            geonames: {
              values: group.geonames
                ? group.geonames.map(geoname => ({
                    value: geoname.id.toString(),
                    name: geoname.label
                  }))
                : []
            },
            people_groups: {
              values: group.people_groups
                ? group.people_groups.map(peopleGroup => ({
                    value: peopleGroup.ID.toString(),
                    name: peopleGroup.post_title
                  }))
                : []
            },
            contact_address: group.contact_address
              ? group.contact_address.map(contact => ({
                  key: contact.key,
                  value: contact.value
                }))
              : [],
            start_date:
              group.start_date && group.start_date.formatted.length > 0
                ? group.start_date.formatted
                : null,
            end_date:
              group.end_date && group.end_date.formatted.length > 0
                ? group.end_date.formatted
                : null,
            group_type: group.group_type ? group.group_type.key : null,
            health_metrics: {
              values: group.health_metrics
                ? group.health_metrics.map(healthMetric => ({
                    value: healthMetric
                  }))
                : []
            }
          }
        });
      } else {
        yield put({
          type: actions.GROUPS_SAVE_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message
          }
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SAVE_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* getById({ domain, token, groupId }) {
  yield put({ type: actions.GROUPS_GETBYID_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt/v1/group/${groupId}`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.GROUPS_GETBYID_RESPONSE
    }
  });

  try {
    const res = yield take(actions.GROUPS_GETBYID_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        const group = jsonData;
        yield put({
          type: actions.GROUPS_GETBYID_SUCCESS,
          group: {
            ID: group.ID,
            title: group.title,
            group_status:
              group.group_status && group.group_status.key
                ? group.group_status.key
                : null,
            assigned_to: group.assigned_to ? group.assigned_to.id : null,
            coaches: {
              values: group.coaches
                ? group.coaches.map(coach => ({
                    value: coach.ID.toString(),
                    name: coach.post_title
                  }))
                : []
            },
            geonames: {
              values: group.geonames
                ? group.geonames.map(geoname => ({
                    value: geoname.id.toString(),
                    name: geoname.label
                  }))
                : []
            },
            people_groups: {
              values: group.people_groups
                ? group.people_groups.map(peopleGroup => ({
                    value: peopleGroup.ID.toString(),
                    name: peopleGroup.post_title
                  }))
                : []
            },
            contact_address: group.contact_address
              ? group.contact_address.map(contact => ({
                  key: contact.key,
                  value: contact.value
                }))
              : [],
            start_date:
              group.start_date && group.start_date.formatted.length > 0
                ? group.start_date.formatted
                : null,
            end_date:
              group.end_date && group.end_date.formatted.length > 0
                ? group.end_date.formatted
                : null,
            group_type: group.group_type ? group.group_type.key : null,
            health_metrics: {
              values: group.health_metrics
                ? group.health_metrics.map(healthMetric => ({
                    value: healthMetric
                  }))
                : []
            }
          }
        });
      } else {
        yield put({
          type: actions.GROUPS_GETBYID_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
            data: jsonData.data
          }
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GETBYID_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* getUsersAndContacts({ domain, token }) {
  yield put({ type: actions.GROUPS_GET_USERS_CONTACTS_START });
  // get all groups
  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt/v1/contacts/compact?s=`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.GROUPS_GET_USERS_CONTACTS_RESPONSE
    }
  });

  try {
    const res = yield take(actions.GROUPS_GET_USERS_CONTACTS_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        if (jsonData.posts) {
          yield put({
            type: actions.GROUPS_GET_USERS_CONTACTS_SUCCESS,
            usersContacts: jsonData.posts.map(user => ({
              value: user.ID,
              name: user.name
            }))
          });
        } else {
          yield put({
            type: actions.GROUPS_GET_USERS_CONTACTS_SUCCESS,
            usersContacts: []
          });
        }
      } else {
        yield put({
          type: actions.GROUPS_GET_USERS_CONTACTS_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
            data: jsonData.data
          }
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_USERS_CONTACTS_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* getCommentsByGroup({ domain, token, groupId }) {
  yield put({ type: actions.GROUPS_GET_COMMENTS_START });

  // get all groups
  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/comments`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.GROUPS_GET_COMMENTS_RESPONSE
    }
  });

  try {
    const res = yield take(actions.GROUPS_GET_COMMENTS_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_GET_COMMENTS_SUCCESS,
          comments: jsonData.map(comment => ({
            ID: comment.comment_ID,
            date: `${comment.comment_date.replace(" ", "T")}Z`,
            author: comment.comment_author,
            content: comment.comment_content,
            gravatar: comment.gravatar
          }))
        });
      } else {
        yield put({
          type: actions.GROUPS_GET_COMMENTS_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
            data: jsonData.data
          }
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_COMMENTS_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* saveComment({ domain, token, groupId, commentData }) {
  yield put({ type: actions.GROUPS_SAVE_COMMENT_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/comments`,
      data: {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(commentData)
      },
      action: actions.GROUPS_SAVE_COMMENT_RESPONSE
    }
  });

  try {
    const res = yield take(actions.GROUPS_SAVE_COMMENT_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_SAVE_COMMENT_SUCCESS,
          comment: {
            ID: jsonData.comment_ID,
            author: jsonData.comment_author,
            date: `${jsonData.comment_date.replace(" ", "T")}Z`,
            content: jsonData.comment_content,
            gravatar: "https://secure.gravatar.com/avatar/?s=16&d=mm&r=g"
          }
        });
      } else {
        yield put({
          type: actions.GROUPS_SAVE_COMMENT_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
            data: jsonData.data
          }
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SAVE_COMMENT_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* getLocations({ domain, token }) {
  yield put({ type: actions.GROUPS_GET_LOCATIONS_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt/v1/mapping_module/search_geonames_by_name?filter=all`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.GROUPS_GET_LOCATIONS_RESPONSE
    }
  });

  try {
    const res = yield take(actions.GROUPS_GET_LOCATIONS_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_GET_LOCATIONS_SUCCESS,
          geonames: jsonData.geonames.map(geoname => ({
            value: geoname.ID,
            name: geoname.name
          }))
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_LOCATIONS_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* getPeopleGroups({ domain, token }) {
  yield put({ type: actions.GROUPS_GET_PEOPLE_GROUPS_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt/v1/people-groups/compact/?s=`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.GROUPS_GET_PEOPLE_GROUPS_RESPONSE
    }
  });

  try {
    const res = yield take(actions.GROUPS_GET_PEOPLE_GROUPS_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_GET_PEOPLE_GROUPS_SUCCESS,
          peopleGroups: jsonData.posts.map(peopleGroup => ({
            value: peopleGroup.ID.toString(),
            name: peopleGroup.name
          }))
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* getActivitiesByGroup({ domain, token, groupId }) {
  yield put({ type: actions.GROUPS_GET_ACTIVITIES_START });

  // get all groups
  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/activity`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.GROUPS_GET_ACTIVITIES_RESPONSE
    }
  });

  try {
    const res = yield take(actions.GROUPS_GET_ACTIVITIES_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_GET_ACTIVITIES_SUCCESS,
          activities: jsonData.map(activity => ({
            ID: activity.histid,
            date: new Date(
              parseInt(activity.hist_time, 10) * 1000
            ).toISOString(),
            object_note: activity.object_note,
            gravatar:
              activity.gravatar === ""
                ? "https://secure.gravatar.com/avatar/?s=16&d=mm&r=g"
                : activity.gravatar,
            meta_id: activity.meta_id,
            meta_key: activity.meta_key,
            name: activity.name
          }))
        });
      } else {
        yield put({
          type: actions.GROUPS_GET_ACTIVITIES_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
            data: jsonData.data
          }
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_ACTIVITIES_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* search({ domain, token }) {
  yield put({ type: actions.GROUPS_SEARCH_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/compact/?s=`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.GROUPS_SEARCH_RESPONSE
    }
  });

  try {
    const res = yield take(actions.GROUPS_SEARCH_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_SEARCH_SUCCESS,
          search: jsonData.posts.map(group => ({
            name: group.name,
            value: group.ID
          }))
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SEARCH_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
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
    takeEvery(actions.GROUPS_SEARCH, search)
  ]);
}
