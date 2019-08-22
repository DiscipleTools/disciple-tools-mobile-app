import * as actions from '../actions/contacts.actions';

const initialState = {
  loading: false,
  error: null,
  contacts: [],
  contact: null,
  comments: [],
  newComment: null,
  activities: [],
  totalComments: null,
  totalActivities: null,
  loadingComments: false,
  loadingActivities: false,
  saved: false,
};

export default function contactsReducer(state = initialState, action) {
  let newState = {
    ...state,
    contact: null,
    newComment: null,
    error: null,
    comments: null,
    totalComments: null,
    activities: null,
    totalActivities: null,
    saved: false,
  };

  switch (action.type) {
    case actions.CONTACTS_GETALL_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.CONTACTS_GETALL_SUCCESS:
      return {
        ...newState,
        contacts: action.contacts.map(contact => ({
          ID: contact.ID,
          post_title: contact.post_title,
          overall_status: contact.overall_status.key,
          seeker_path: contact.seeker_path.key,
        })),
        loading: false,
      };
    case actions.CONTACTS_GETALL_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.CONTACTS_SAVE_SUCCESS: {
      const { contact } = action;
      newState = {
        ...newState,
        contact: {
          ID: contact.ID,
          title: contact.title,
          contact_phone: contact.contact_phone
            ? contact.contact_phone
              .filter((obj, pos, arr) => (
                arr
                  .map(mapObj => mapObj.value)
                  .indexOf(obj.value) === pos
              ))
              .map(phone => ({
                key: phone.key,
                value: phone.value,
              }))
            : [],
          contact_email: contact.contact_email
            ? contact.contact_email
              .filter((obj, pos, arr) => (
                arr
                  .map(mapObj => mapObj.value)
                  .indexOf(obj.value) === pos
              ))
              .map(email => ({
                key: email.key,
                value: email.value,
              }))
            : [],
          contact_address: contact.contact_address
            ? contact.contact_address
              .filter((obj, pos, arr) => (
                arr
                  .map(mapObj => mapObj.value)
                  .indexOf(obj.value) === pos
              ))
              .map(address => ({
                key: address.key,
                value: address.value,
              }))
            : [],
          sources: {
            values: contact.sources
              ? contact.sources.map(source => ({
                name: source.charAt(0).toUpperCase() + source.slice(1),
                value: source,
              }))
              : [],
          },
          geonames: {
            values: contact.geonames
              ? contact.geonames.map(geoname => ({
                name: geoname.label,
                value: geoname.id.toString(),
              }))
              : [],
          },
          overall_status: contact.overall_status.key,
          assigned_to: contact.assigned_to
            ? `user-${contact.assigned_to.id}`
            : null,
          seeker_path: contact.seeker_path.key,
          subassigned: {
            values: contact.subassigned.map(user => ({
              name: user.post_title,
              value: user.ID.toString(),
            })),
          },
          baptism_date:
            contact.baptism_date && contact.baptism_date.formatted.length > 0
              ? contact.baptism_date.formatted
              : null,
          milestones: {
            values: contact.milestones
              ? contact.milestones.map(milestone => ({
                value: milestone,
              }))
              : [],
          },
          age: contact.age ? contact.age.key : null,
          gender: contact.gender ? contact.gender.key : null,
          groups: {
            values: contact.groups
              ? contact.groups.map(group => ({
                name: group.post_title,
                value: group.ID.toString(),
              }))
              : [],
          },
          relation: {
            values: contact.relation
              ? contact.relation.map(relationItem => ({
                name: relationItem.post_title,
                value: relationItem.ID.toString(),
              }))
              : [],
          },
          baptized_by: {
            values: contact.baptized_by
              ? contact.baptized_by.map(baptizedByItem => ({
                name: baptizedByItem.post_title,
                value: baptizedByItem.ID.toString(),
              }))
              : [],
          },
          baptized: {
            values: contact.baptized
              ? contact.baptized.map(baptizedItem => ({
                name: baptizedItem.post_title,
                value: baptizedItem.ID.toString(),
              }))
              : [],
          },
          coached_by: {
            values: contact.coached_by
              ? contact.coached_by.map(coachedItem => ({
                name: coachedItem.post_title,
                value: coachedItem.ID.toString(),
              }))
              : [],
          },
          coaching: {
            values: contact.coaching
              ? contact.coaching.map(coachingItem => ({
                name: coachingItem.post_title,
                value: coachingItem.ID.toString(),
              }))
              : [],
          },
          people_groups: {
            values: contact.people_groups
              ? contact.people_groups.map(peopleGroup => ({
                value: peopleGroup.ID.toString(),
                name: peopleGroup.post_title,
              }))
              : [],
          },
          quick_button_no_answer: contact.quick_button_no_answer
            ? contact.quick_button_no_answer
            : '0',
          quick_button_contact_established: contact.quick_button_contact_established
            ? contact.quick_button_contact_established
            : '0',
          quick_button_meeting_scheduled: contact.quick_button_meeting_scheduled
            ? contact.quick_button_meeting_scheduled
            : '0',
          quick_button_meeting_complete: contact.quick_button_meeting_complete
            ? contact.quick_button_meeting_complete
            : '0',
          quick_button_no_show: contact.quick_button_no_show
            ? contact.quick_button_no_show
            : '0',
        },
        saved: true,
      };
      if (newState.contact.baptism_date) {
        let newBaptismDate = new Date(newState.contact.baptism_date);
        const year = newBaptismDate.getFullYear();
        const month = (newBaptismDate.getMonth() + 1) < 10 ? `0${newBaptismDate.getMonth() + 1}` : (newBaptismDate.getMonth() + 1);
        const day = (newBaptismDate.getDate()) < 10 ? `0${newBaptismDate.getDate()}` : (newBaptismDate.getDate());
        newBaptismDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          contact: {
            ...newState.contact,
            baptism_date: newBaptismDate,
          },
        };
      } else {
        newState = {
          ...newState,
          contact: {
            ...newState.contact,
            baptism_date: '',
          },
        };
      }
      return newState;
    }
    case actions.CONTACTS_SAVE_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.CONTACTS_GETBYID_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.CONTACTS_GETBYID_SUCCESS: {
      const { contact } = action;
      newState = {
        ...newState,
        contact: {
          ID: contact.ID,
          title: contact.title,
          contact_phone: contact.contact_phone
            ? contact.contact_phone
              .filter((obj, pos, arr) => (
                arr
                  .map(mapObj => mapObj.value)
                  .indexOf(obj.value) === pos
              ))
              .map(phone => ({
                key: phone.key,
                value: phone.value,
              }))
            : [],
          contact_email: contact.contact_email
            ? contact.contact_email
              .filter((obj, pos, arr) => (
                arr
                  .map(mapObj => mapObj.value)
                  .indexOf(obj.value) === pos
              ))
              .map(email => ({
                key: email.key,
                value: email.value,
              }))
            : [],
          contact_address: contact.contact_address
            ? contact.contact_address
              .filter((obj, pos, arr) => (
                arr
                  .map(mapObj => mapObj.value)
                  .indexOf(obj.value) === pos
              ))
              .map(address => ({
                key: address.key,
                value: address.value,
              }))
            : [],
          sources: {
            values: contact.sources
              ? contact.sources.map(source => ({
                name: source.charAt(0).toUpperCase() + source.slice(1),
                value: source,
              }))
              : [],
          },
          geonames: {
            values: contact.geonames
              ? contact.geonames.map(geoname => ({
                name: geoname.label,
                value: geoname.id.toString(),
              }))
              : [],
          },
          overall_status: contact.overall_status.key,
          assigned_to: contact.assigned_to
            ? `user-${contact.assigned_to.id}`
            : null,
          seeker_path: contact.seeker_path.key,
          subassigned: {
            values: contact.subassigned.map(user => ({
              name: user.post_title,
              value: user.ID.toString(),
            })),
          },
          baptism_date:
            contact.baptism_date && contact.baptism_date.formatted.length > 0
              ? contact.baptism_date.formatted
              : null,
          milestones: {
            values: contact.milestones
              ? contact.milestones.map(milestone => ({
                value: milestone,
              }))
              : [],
          },
          age: contact.age ? contact.age.key : null,
          gender: contact.gender ? contact.gender.key : null,
          groups: {
            values: contact.groups
              ? contact.groups.map(group => ({
                name: group.post_title,
                value: group.ID.toString(),
              }))
              : [],
          },
          relation: {
            values: contact.relation
              ? contact.relation.map(relationItem => ({
                name: relationItem.post_title,
                value: relationItem.ID.toString(),
              }))
              : [],
          },
          baptized_by: {
            values: contact.baptized_by
              ? contact.baptized_by.map(baptizedByItem => ({
                name: baptizedByItem.post_title,
                value: baptizedByItem.ID.toString(),
              }))
              : [],
          },
          baptized: {
            values: contact.baptized
              ? contact.baptized.map(baptizedItem => ({
                name: baptizedItem.post_title,
                value: baptizedItem.ID.toString(),
              }))
              : [],
          },
          coached_by: {
            values: contact.coached_by
              ? contact.coached_by.map(coachedItem => ({
                name: coachedItem.post_title,
                value: coachedItem.ID.toString(),
              }))
              : [],
          },
          coaching: {
            values: contact.coaching
              ? contact.coaching.map(coachingItem => ({
                name: coachingItem.post_title,
                value: coachingItem.ID.toString(),
              }))
              : [],
          },
          people_groups: {
            values: contact.people_groups
              ? contact.people_groups.map(peopleGroup => ({
                value: peopleGroup.ID.toString(),
                name: peopleGroup.post_title,
              }))
              : [],
          },
          quick_button_no_answer: contact.quick_button_no_answer
            ? contact.quick_button_no_answer
            : '0',
          quick_button_contact_established: contact.quick_button_contact_established
            ? contact.quick_button_contact_established
            : '0',
          quick_button_meeting_scheduled: contact.quick_button_meeting_scheduled
            ? contact.quick_button_meeting_scheduled
            : '0',
          quick_button_meeting_complete: contact.quick_button_meeting_complete
            ? contact.quick_button_meeting_complete
            : '0',
          quick_button_no_show: contact.quick_button_no_show
            ? contact.quick_button_no_show
            : '0',
          /* quick_button_phone_off: contact.quick_button_phone_off
            ? contact.quick_button_phone_off
            : "0" */
        },
        loading: false,
      };
      if (newState.contact.baptism_date) {
        let newBaptismDate = new Date(newState.contact.baptism_date);
        const year = newBaptismDate.getFullYear();
        const month = (newBaptismDate.getMonth() + 1) < 10 ? `0${newBaptismDate.getMonth() + 1}` : (newBaptismDate.getMonth() + 1);
        const day = (newBaptismDate.getDate()) < 10 ? `0${newBaptismDate.getDate()}` : (newBaptismDate.getDate());
        newBaptismDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          contact: {
            ...newState.contact,
            baptism_date: newBaptismDate,
          },
        };
      } else {
        newState = {
          ...newState,
          contact: {
            ...newState.contact,
            baptism_date: '',
          },
        };
      }
      return newState;
    }
    case actions.CONTACTS_GETBYID_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.CONTACTS_GET_COMMENTS_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.CONTACTS_GET_COMMENTS_SUCCESS:
      return {
        ...newState,
        comments: action.comments.map(comment => ({
          ID: comment.comment_ID,
          date: `${comment.comment_date.replace(' ', 'T')}Z`,
          author: comment.comment_author,
          content: comment.comment_content,
          gravatar: comment.gravatar,
        })),
        totalComments: action.total,
        loadingComments: false,
      };
    case actions.CONTACTS_GET_COMMENTS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.CONTACTS_SAVE_COMMENT_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.CONTACTS_SAVE_COMMENT_SUCCESS: {
      const { comment } = action;
      newState = {
        ...newState,
        newComment: {
          ID: comment.comment_ID,
          author: comment.comment_author,
          date: `${comment.comment_date.replace(' ', 'T')}Z`,
          content: comment.comment_content,
          gravatar: 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g',
        },
        loadingComments: false,
      };
      return newState;
    }
    case actions.CONTACTS_SAVE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.CONTACTS_GET_ACTIVITIES_START:
      return {
        ...newState,
        loadingActivities: true,
      };
    case actions.CONTACTS_GET_ACTIVITIES_SUCCESS:
      return {
        ...newState,
        activities: action.activities.map(activity => ({
          ID: activity.histid,
          date: new Date(
            parseInt(activity.hist_time, 10) * 1000,
          ).toISOString(),
          object_note: activity.object_note,
          gravatar:
            activity.gravatar === ''
              ? 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g'
              : activity.gravatar,
          meta_id: activity.meta_id,
          meta_key: activity.meta_key,
          name: activity.name,
        })),
        totalActivities: action.total,
        loadingActivities: false,
      };
    case actions.CONTACTS_GET_ACTIVITIES_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingActivities: false,
      };
    default:
      return newState;
  }
}
