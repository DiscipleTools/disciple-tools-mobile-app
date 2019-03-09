import { put, takeLatest, all } from 'redux-saga/effects';
import * as actions from '../actions/contacts.actions';

export function* getAll({ domain, token }) {
  yield put({ type: actions.CONTACTS_GETALL_START });

  let response;
  try {
    response = yield fetch(`https://${domain}/wp-json/dt/v1/contacts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    // console.log(error);
    yield put({
      type: actions.CONTACTS_GETALL_FAILURE,
      error,
    });
  }

  const jsonData = yield response.json();
  if (jsonData.contacts) {
    yield put({
      type: actions.CONTACTS_GETALL_SUCCESS,
      contacts: jsonData.contacts.map(contact => ({
        key: contact.ID.toString(),
        name: contact.post_title,
        status: contact.overall_status,
        seekerPath: contact.seeker_path,
        faithMilestones: contact.milestones,
        assignedTo: contact.assigned_to.name,
        locations: contact.locations,
        groups: contact.groups,
      })),
    });
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

export default function* contactsSaga() {
  yield all([
    takeLatest(actions.CONTACTS_GETALL, getAll),
  ]);
}
