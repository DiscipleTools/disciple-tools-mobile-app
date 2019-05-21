import {
  put, take, takeEvery, takeLatest, all,
} from 'redux-saga/effects';
import * as actions from '../actions/contacts.actions';

export function* getAll({ domain, token }) {
  yield put({ type: actions.CONTACTS_GETALL_START });

  // get all contacts
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/contacts`,
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

  // handle response
  try {
    // TODO: will this block and cause responses to be missed?
    // use channel instead
    const res = yield take(actions.CONTACTS_GETALL_RESPONSE);
    if (res) {
      const response = res.payload;
      const jsonData = yield response.json();
      if (response.status === 200) {
        if (jsonData.contacts) {
          yield put({
            type: actions.CONTACTS_GETALL_SUCCESS,
            contacts: jsonData.contacts.map(contact => ({
              key: contact.ID.toString(),
              assigned_to: contact.assigned_to.name,
              groups: contact.groups,
              is_team_contact: contact.is_team_contact,
              last_modified: contact.last_modified,
              locations: [], // contact.locations,
              milestone_baptized: contact.milestone_baptized,
              overall_status: contact.overall_status,
              permalink: contact.permalink,
              contact_phone: contact.phone_numbers,
              name: contact.post_title,
              requires_update: contact.requires_update,
              seeker_path: contact.seeker_path,
              shared_with_user: contact.shared_with_user,
            })),
          });
        } else {
          // TODO: empty list; display placeholder
        }
      } else {
        yield put({
          type: actions.CONTACTS_GETALL_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
            data: jsonData.data,
          },
        });
      }
    }
  } catch (error) {
    yield put({ type: actions.CONTACTS_GETALL_FAILURE, error: { code: '400', message: '(400) Unable to process the request. Please try again later.' } });
  }
}

function* delayPostInitialComment(user, comment, contactId) {
  // post the delayed initial comment
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${user.domain}/wp-json/dt/v1/contact/${contactId}/comment`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          comment: `${comment}`,
        }),
      },
    },
  });
}

export function* saveContact({ user, contact }) {
  yield put({ type: actions.CONTACTS_SAVECONTACT_START });

  const urlPart = contact.key ? contact.key : 'create';
  // sources: [{values: [{ value: `${contact.sources }` }]}],
  // locations: [{ value: `${contact.locations}` }],
  // create new contact or update existing contact
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${user.domain}/wp-json/dt/v1/contact/${urlPart}`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title: `${contact.name}`,
          // contact_phone: [{ value: `${contact.contact_phone}` }, { value: "999-99-9999" }],
          // contact_phone: [{ value: `${contact.contact_phone}` }],
          // contact_email: [{ value: `${contact.contact_email}` }],
          // sources: { values: [{ value: "linkedin" }, { value: "referral" }]},
          // locations: { values: [{ value: "36" }, { value: 35 }]}
        }),
      },
      action: actions.CONTACTS_SAVECONTACT_RESPONSE,
    },
  });

  // handle response
  try {
    // TODO: will this block and cause responses to be missed?
    // use channel instead
    const res = yield take(actions.CONTACTS_SAVECONTACT_RESPONSE);
    if (res) {
      const response = res.payload;
      // console.log('*** SAVE CONTACT RESPONSE ***', response);
      const jsonData = yield response.json();
      if (response.status === 200) {
        // NOTE: create contact endpoint only returns 'post_id' and 'permalink'
        const key = jsonData.post_id ? jsonData.post_id.toString() : jsonData.ID.toString();
        // refresh state w/ D.T key/ID for new contact, or to sync existing
        yield put({ type: actions.CONTACTS_SAVECONTACT_SUCCESS, contact, key });
        if (contact.initial_comment) {
          // submit the comment now, AFTER receiving the D.T key/ID
          delayPostInitialComment(user, contact.initial_comment, key);
        }
      } else {
        yield put({
          type: actions.CONTACTS_SAVECONTACT_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    }
  } catch (error) {
    // console.log('*** SAVE CONTACT ERROR ***', error);
    yield put({ type: actions.CONTACTS_SAVECONTACT_FAILURE, error: { code: '400', message: '(400) Unable to process the request. Please try again later.' } });
  }
}

export default function* contactsSaga() {
  yield all([
    takeLatest(actions.CONTACTS_GETALL, getAll),
    takeEvery(actions.CONTACTS_SAVECONTACT, saveContact),
  ]);
}
