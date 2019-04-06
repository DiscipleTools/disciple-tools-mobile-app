import * as contactActions from '../actions/contact.actions';

const initialState = {
  name: null,
  error: null
}

export default function contactReducer(state = initialState, action) {
  switch (action.type) {
    case contactActions.CONTACT_ADDNEWCONTACT_START:
      return Object.assign({}, state, {
        error: null,
      });
    case contactActions.CONTACT_ADDNEWCONTACT_SUCCESS:
      return Object.assign({}, state, {
        name: action.name,
        error: null,
      });
    case contactActions.CONTACT_ADDNEWCONTACT_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    default:
      return state;
  }
}
