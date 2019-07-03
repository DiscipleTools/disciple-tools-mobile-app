import { put, take, takeEvery, takeLatest, all } from "redux-saga/effects";
import * as actions from "../actions/contacts.actions";

export function* getAll({ domain, token }) {
  yield put({ type: actions.CONTACTS_GETALL_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.CONTACTS_GETALL_RESPONSE
    }
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
            contacts: jsonData.posts
          });
        } else {
          yield put({
            type: actions.CONTACTS_GETALL_SUCCESS,
            contacts: []
          });
        }
      } else {
        yield put({
          type: actions.CONTACTS_GETALL_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message
          }
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GETALL_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

function* delayPostInitialComment(domain, token, comment, contactId) {
  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt/v1/contact/${contactId}/comment`,
      data: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          comment: `${comment}`
        })
      }
    }
  });
}

export function* save({ domain, token, contactData }) {
  yield put({ type: actions.CONTACTS_SAVE_START });
  let contact = contactData,
    contactInitialComment;
  if (contact.initial_comment) {
    contactInitialComment = contact.initial_comment;
    delete contact.initial_comment;
  }
  const urlPart = contact.ID ? contact.ID : "";
  delete contact.ID;
  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${urlPart}`,
      data: {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(contact)
      },
      action: actions.CONTACTS_SAVE_RESPONSE
    }
  });

  try {
    const responseAction = yield take(actions.CONTACTS_SAVE_RESPONSE);
    if (responseAction) {
      const response = responseAction.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        contact = jsonData;
        yield put({
          type: actions.CONTACTS_SAVE_SUCCESS,
          contact: {
            ID: contact.ID,
            title: contact.title,
            contact_phone: contact.contact_phone.map(phone => {
              return {
                key: phone.key,
                value: phone.value
              };
            }),
            contact_email: contact.contact_email.map(email => {
              return {
                key: email.key,
                value: email.value
              };
            }),
            sources: {
              values: contact.sources.map(source => {
                return {
                  name: source,
                  value: source
                };
              })
            },
            geonames: {
              values: contact.geonames
                ? contact.geonames.map(geoname => {
                    return {
                      name: geoname.label,
                      value: geoname.id.toString()
                    };
                  })
                : []
            },
            overall_status: contact.overall_status.key,
            assigned_to: contact.assigned_to
              ? parseInt(contact.assigned_to.id)
              : null,
            seeker_path: contact.seeker_path.key,
            subassigned: {
              values: contact.subassigned.map(user => {
                return {
                  name: user.post_title,
                  value: user.ID.toString()
                };
              })
            },
            contact_facebook: {
              values: contact.contact_facebook
                ? contact.contact_facebook.map(contact => {
                    return {
                      name: contact.value,
                      value: contact.value
                    };
                  })
                : []
            },
            contact_instagram: {
              values: contact.contact_instagram
                ? contact.contact_instagram.map(contact => {
                    return {
                      name: contact.value,
                      value: contact.value
                    };
                  })
                : []
            },
            contact_other: {
              values: contact.contact_other
                ? contact.contact_other.map(contact => {
                    return {
                      name: contact.value,
                      value: contact.value
                    };
                  })
                : []
            },
            contact_skype: {
              values: contact.contact_skype
                ? contact.contact_skype.map(contact => {
                    return {
                      name: contact.value,
                      value: contact.value
                    };
                  })
                : []
            },
            contact_twitter: {
              values: contact.contact_twitter
                ? contact.contact_twitter.map(contact => {
                    return {
                      name: contact.value,
                      value: contact.value
                    };
                  })
                : []
            },
            baptism_date:
              contact.baptism_date && contact.baptism_date.formatted.length > 0
                ? contact.baptism_date.formatted
                : null,
            milestones: {
              values: contact.milestones
                ? contact.milestones.map(milestone => ({
                    value: milestone
                  }))
                : []
            },
            age: contact.age ? contact.age.key : null,
            gender: contact.gender ? contact.gender.key : null,
            groups: {
              values: contact.groups
                ? contact.groups.map(group => ({
                    name: group.post_title,
                    value: group.ID.toString()
                  }))
                : []
            },
            relation: {
              values: contact.relation
                ? contact.relation.map(relationItem => ({
                    name: relationItem.post_title,
                    value: relationItem.ID.toString(),
                    post_date: relationItem.post_date
                  }))
                : []
            },
            baptized_by: {
              values: contact.baptized_by
                ? contact.baptized_by.map(baptizedByItem => ({
                    name: baptizedByItem.post_title,
                    value: baptizedByItem.ID.toString(),
                    post_date: baptizedByItem.post_date
                  }))
                : []
            },
            baptized: {
              values: contact.baptized
                ? contact.baptized.map(baptizedItem => ({
                    name: baptizedItem.post_title,
                    value: baptizedItem.ID.toString(),
                    post_date: baptizedItem.post_date
                  }))
                : []
            },
            coached_by: {
              values: contact.coached_by
                ? contact.coached_by.map(coachedItem => ({
                    name: coachedItem.post_title,
                    value: coachedItem.ID.toString(),
                    post_date: coachedItem.post_date
                  }))
                : []
            }
          }
        });
        if (contactInitialComment) {
          delayPostInitialComment(
            domain,
            token,
            contactInitialComment,
            contact.ID
          );
        }
      } else {
        yield put({
          type: actions.CONTACTS_SAVE_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message
          }
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_SAVE_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* getById({ domain, token, contactId }) {
  yield put({ type: actions.CONTACTS_GETBYID_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.CONTACTS_GETBYID_RESPONSE
    }
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
          contact: {
            ID: contact.ID,
            title: contact.title,
            contact_phone: contact.contact_phone.map(phone => {
              return {
                key: phone.key,
                value: phone.value
              };
            }),
            contact_email: contact.contact_email.map(email => {
              return {
                key: email.key,
                value: email.value
              };
            }),
            sources: {
              values: contact.sources.map(source => {
                return {
                  name: source,
                  value: source
                };
              })
            },
            geonames: {
              values: contact.geonames
                ? contact.geonames.map(geoname => {
                    return {
                      name: geoname.label,
                      value: geoname.id.toString()
                    };
                  })
                : []
            },
            overall_status: contact.overall_status.key,
            assigned_to: contact.assigned_to
              ? parseInt(contact.assigned_to.id)
              : null,
            seeker_path: contact.seeker_path.key,
            subassigned: {
              values: contact.subassigned.map(user => {
                return {
                  name: user.post_title,
                  value: user.ID.toString()
                };
              })
            },
            contact_facebook: {
              values: contact.contact_facebook
                ? contact.contact_facebook.map(contact => {
                    return {
                      name: contact.value,
                      value: contact.value
                    };
                  })
                : []
            },
            contact_instagram: {
              values: contact.contact_instagram
                ? contact.contact_instagram.map(contact => {
                    return {
                      name: contact.value,
                      value: contact.value
                    };
                  })
                : []
            },
            contact_other: {
              values: contact.contact_other
                ? contact.contact_other.map(contact => {
                    return {
                      name: contact.value,
                      value: contact.value
                    };
                  })
                : []
            },
            contact_skype: {
              values: contact.contact_skype
                ? contact.contact_skype.map(contact => {
                    return {
                      name: contact.value,
                      value: contact.value
                    };
                  })
                : []
            },
            contact_twitter: {
              values: contact.contact_twitter
                ? contact.contact_twitter.map(contact => {
                    return {
                      name: contact.value,
                      value: contact.value
                    };
                  })
                : []
            },
            baptism_date:
              contact.baptism_date && contact.baptism_date.formatted.length > 0
                ? contact.baptism_date.formatted
                : null,
            milestones: {
              values: contact.milestones
                ? contact.milestones.map(milestone => ({
                    value: milestone
                  }))
                : []
            },
            age: contact.age ? contact.age.key : null,
            gender: contact.gender ? contact.gender.key : null,
            groups: {
              values: contact.groups
                ? contact.groups.map(group => ({
                    name: group.post_title,
                    value: group.ID.toString()
                  }))
                : []
            },
            relation: {
              values: contact.relation
                ? contact.relation.map(relationItem => ({
                    name: relationItem.post_title,
                    value: relationItem.ID.toString(),
                    post_date: relationItem.post_date
                  }))
                : []
            },
            baptized_by: {
              values: contact.baptized_by
                ? contact.baptized_by.map(baptizedByItem => ({
                    name: baptizedByItem.post_title,
                    value: baptizedByItem.ID.toString(),
                    post_date: baptizedByItem.post_date
                  }))
                : []
            },
            baptized: {
              values: contact.baptized
                ? contact.baptized.map(baptizedItem => ({
                    name: baptizedItem.post_title,
                    value: baptizedItem.ID.toString(),
                    post_date: baptizedItem.post_date
                  }))
                : []
            },
            coached_by: {
              values: contact.coached_by
                ? contact.coached_by.map(coachedItem => ({
                    name: coachedItem.post_title,
                    value: coachedItem.ID.toString(),
                    post_date: coachedItem.post_date
                  }))
                : []
            }
          }
        });
      } else {
        yield put({
          type: actions.CONTACTS_GETBYID_FAILURE,
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
      type: actions.CONTACTS_GETBYID_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* getCommentsByContact({ domain, token, contactId }) {
  yield put({ type: actions.CONTACTS_GET_COMMENTS_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/comments`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.CONTACTS_GET_COMMENTS_RESPONSE
    }
  });

  try {
    const res = yield take(actions.CONTACTS_GET_COMMENTS_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_GET_COMMENTS_SUCCESS,
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
          type: actions.CONTACTS_GET_COMMENTS_FAILURE,
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
      type: actions.CONTACTS_GET_COMMENTS_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* saveComment({ domain, token, contactId, commentData }) {
  yield put({ type: actions.CONTACTS_SAVE_COMMENT_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/comments`,
      data: {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(commentData)
      },
      action: actions.CONTACTS_SAVE_COMMENT_RESPONSE
    }
  });

  try {
    const res = yield take(actions.CONTACTS_SAVE_COMMENT_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_SAVE_COMMENT_SUCCESS,
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
          type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
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
      type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
    });
  }
}

export function* getActivitiesByContact({ domain, token, contactId }) {
  yield put({ type: actions.CONTACTS_GET_ACTIVITIES_START });

  yield put({
    type: "REQUEST",
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/activity`,
      data: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      action: actions.CONTACTS_GET_ACTIVITIES_RESPONSE
    }
  });

  try {
    const res = yield take(actions.CONTACTS_GET_ACTIVITIES_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_GET_ACTIVITIES_SUCCESS,
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
          type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
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
      type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
      error: {
        code: "400",
        message: error.toString()
      }
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
    takeEvery(actions.CONTACTS_GET_ACTIVITIES, getActivitiesByContact)
  ]);
}
