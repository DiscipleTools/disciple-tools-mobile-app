import * as actions from '../actions/contacts.actions';

// ref: https://github.com/DiscipleTools/disciple-tools-theme/blob/master/dt-contacts/contacts-post-type.php
/*
const contact = {
  key: null,
  assigned_to: null,
  groups: null,
  is_team_contact: null,
  last_modified: null,
  locations: null,
  milestone_baptized: null,
  overall_status: null,
  permalink: null,
  contact_phone: null,
  name: null,
  requires_update: null,
  seeker_path: null,
  shared_with_user: null,
  contact_email: null,
  sources: null,
  source_details: null,
  initial_comment: null,
  milestones: null,
  baptism_date: null,
  baptism_generation: null,
  gender: null,
  age: null,
  reason_unassignable: null,
  reason_paused: null,
  reason_closed: null,
  accepted: null,
  quick_button_no_answer: null,
  quick_button_contact_established: null,
  quick_button_meeting_scheduled: null,
  quick_button_meeting_complete: null,
  quick_button_no_show: null,
  corresponds_to_user: null,
  type: null,
  duplicate_data: null,
  tags: null,
  follow: null,
  unfollow: null,
  tags: null,
  duplicate_of: null,
  subassigned: null
}
*/

const initialState = {
  isLoading: false,
  error: null,
  items: [],
};

export default function contactsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.CONTACTS_DELETECONTACT:
      return Object.assign({}, state, {
        // remove the contact from the contactsReducer state
        items: [...state.items.filter(existing => existing.key != action.contact.key)]
      })
    case actions.CONTACTS_SAVECONTACT:
      // check whether already exists; if exists, remove and add new edit
      return Object.assign({}, state, {
        items: [...state.items.filter(existing => existing.name != action.contact.name), action.contact],
      })
    case actions.CONTACTS_SAVECONTACT_SUCCESS:
      /*
      NOTE: assumes a successful responses from a D.T API contact create/update.
      remove the previous contact in contactsReducer state, and add incoming; 
      this is required in the case of contact creation (bc we need to set the 
      key/ID provided to us in the D.T API response. it is superfluous with a
      contact update, but we just keep things consistent
      */ 
      contact_with_id = action.contact
      contact_with_id['key'] = action.key
      state = Object.assign({}, state, {
        isLoading: false,
        items: [...state.items.filter(existing => existing != action.contact), contact_with_id],
      })
      return state
    case actions.CONTACTS_GETALL_START:
      return Object.assign({}, state, {
        isLoading: true,
        error: null,
      });
    case actions.CONTACTS_GETALL_RESPONSE:
      return Object.assign({}, state, {
        isLoading: false,
      });
    case actions.CONTACTS_GETALL_SUCCESS:
      // success; sync local contact list with D.T API list 
      return Object.assign({}, state, {
        isLoading: false,
        items: action.contacts,
      });
    case actions.CONTACTS_GETALL_FAILURE:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error,
      });
    default:
      return state;
  }
}
