import * as actions from '../actions/contacts.actions';
import * as userActions from '../actions/user.actions';

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
  settings: null,
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
    case actions.CONTACTS_GETALL_SUCCESS: {
      let { contacts } = action;
      const { offline } = action;
      /* eslint-disable */
      let localContacts = newState.contacts.filter(localContact => isNaN(localContact.ID));
      if (!offline) {
        let dataBaseContacts = [...action.contacts].map(contact => {

          let mappedContact = {};
          Object.keys(contact).forEach((key) => {
            // Omit restricted properties
            if (key !== '_sample' && key !== 'geonames' && key !== 'created_date' && key !== 'permalink' && key !== 'last_modified') {
              const value = contact[key];
              const valueType = Object.prototype.toString.call(value);
              switch (valueType) {
                case '[object Boolean]': {
                  mappedContact[key] = value;
                  return;
                }
                case '[object Number]': {
                  mappedContact[key] = value;
                  return;
                }
                case '[object String]': {
                  if (value.includes('quick_button')) {
                    mappedContact[key] = parseInt(value, 10);
                  } else if (key === 'post_title') {
                    mappedContact.title = value;
                  } else {
                    mappedContact[key] = value;
                  }
                  return;
                }
                case '[object Object]': {
                  if (Object.prototype.hasOwnProperty.call(value, 'key') && Object.prototype.hasOwnProperty.call(value, 'label')) {
                    // key_select
                    mappedContact[key] = value.key;
                  } else if (Object.prototype.hasOwnProperty.call(value, 'formatted')) {
                    // date
                    mappedContact[key] = value.formatted;
                  } else if (key === 'assigned_to') {
                    // assigned-to property
                    mappedContact[key] = value['assigned-to'];
                  }
                  return;
                }
                case '[object Array]': {
                  const mappedValue = value.map((valueTwo) => {
                    const valueTwoType = Object.prototype.toString.call(valueTwo);
                    switch (valueTwoType) {
                      case '[object Object]': {
                        if (Object.prototype.hasOwnProperty.call(valueTwo, 'post_title')) {
                          // connection
                          return {
                            value: valueTwo.ID.toString(),
                          };
                        } if (Object.prototype.hasOwnProperty.call(valueTwo, 'key') && Object.prototype.hasOwnProperty.call(valueTwo, 'value')) {
                          return {
                            key: valueTwo.key,
                            value: valueTwo.value,
                          };
                        } if (Object.prototype.hasOwnProperty.call(valueTwo, 'id') && Object.prototype.hasOwnProperty.call(valueTwo, 'label')) {
                          return {
                            value: valueTwo.id.toString(),
                          };
                        }
                        break;
                      }
                      case '[object String]': {
                        if (key === 'sources' || key === 'milestones') {
                          // source or milestone
                          return {
                            value: valueTwo,
                          };
                        }
                        return valueTwo;
                      }
                      default:
                    }
                    return valueTwo;
                  });
                  if (key.includes('contact_')) {
                    mappedContact[key] = mappedValue;
                  } else {
                    mappedContact[key] = {
                      values: mappedValue,
                    };
                  }
                  break;
                }
                default:
              }
            }
          });
          return mappedContact;
        }).sort((a, b) => parseInt(a.ID) < parseInt(b.ID));
        contacts = localContacts.concat(dataBaseContacts);
      }
      /* eslint-enable */
      return {
        ...newState,
        contacts,
        loading: false,
      };
    }
    case actions.CONTACTS_GETALL_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.CONTACTS_SAVE_SUCCESS: {
      const { contact, offline } = action;

      let mappedContact = {};
      if (offline) {
        mappedContact = {
          ...contact,
        };
      } else {
        Object.keys(contact).forEach((key) => {
          // Omit restricted properties
          if (key !== '_sample' && key !== 'geonames' && key !== 'created_date' && key !== 'permalink' && key !== 'last_modified') {
            const value = contact[key];
            const valueType = Object.prototype.toString.call(value);
            switch (valueType) {
              case '[object Boolean]': {
                mappedContact[key] = value;
                return;
              }
              case '[object Number]': {
                mappedContact[key] = value;
                return;
              }
              case '[object String]': {
                if (value.includes('quick_button')) {
                  mappedContact[key] = parseInt(value, 10);
                } else if (key === 'post_title') {
                  mappedContact.title = value;
                } else {
                  mappedContact[key] = value;
                }
                return;
              }
              case '[object Object]': {
                if (Object.prototype.hasOwnProperty.call(value, 'key') && Object.prototype.hasOwnProperty.call(value, 'label')) {
                  // key_select
                  mappedContact[key] = value.key;
                } else if (Object.prototype.hasOwnProperty.call(value, 'formatted')) {
                  // date
                  mappedContact[key] = value.formatted;
                } else if (key === 'assigned_to') {
                  // assigned-to property
                  mappedContact[key] = value['assigned-to'];
                }
                return;
              }
              case '[object Array]': {
                const mappedValue = value.map((valueTwo) => {
                  const valueTwoType = Object.prototype.toString.call(valueTwo);
                  switch (valueTwoType) {
                    case '[object Object]': {
                      if (Object.prototype.hasOwnProperty.call(valueTwo, 'post_title')) {
                        // connection
                        return {
                          value: valueTwo.ID.toString(),
                        };
                      } if (Object.prototype.hasOwnProperty.call(valueTwo, 'key') && Object.prototype.hasOwnProperty.call(valueTwo, 'value')) {
                        return {
                          key: valueTwo.key,
                          value: valueTwo.value,
                        };
                      } if (Object.prototype.hasOwnProperty.call(valueTwo, 'id') && Object.prototype.hasOwnProperty.call(valueTwo, 'label')) {
                        return {
                          value: valueTwo.id.toString(),
                        };
                      }
                      break;
                    }
                    case '[object String]': {
                      if (key === 'sources' || key === 'milestones') {
                        // source or milestone
                        return {
                          value: valueTwo,
                        };
                      }
                      return valueTwo;
                    }
                    default:
                  }
                  return valueTwo;
                });
                if (key.includes('contact_')) {
                  mappedContact[key] = mappedValue;
                } else {
                  mappedContact[key] = {
                    values: mappedValue,
                  };
                }
                break;
              }
              default:
            }
          }
        });
      }

      const oldId = (mappedContact.oldID) ? mappedContact.oldID : null;
      if (oldId) {
        delete mappedContact.oldID;
      }

      newState = {
        ...newState,
        contact: mappedContact,
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
      }
      const contactIndex = newState.contacts.findIndex(contactItem => (contactItem.ID.toString() === contact.ID.toString()));
      // Search entity in list (contacts) if exists: updated it, otherwise: added it to contacts list
      if (contactIndex > -1) {
        const newContactData = {
          ...newState.contacts[contactIndex],
          ...newState.contact,
        };
        // MERGE FIELDS OF TYPE COLLECTION
        newState.contacts[contactIndex] = {
          ...newContactData,
        };
        if (offline) {
          // Return all contact data in response
          newState = {
            ...newState,
            contact: {
              ...newContactData,
            },
          };
        }
      } else if (oldId) {
        // Search entity with oldID, remove it and add updated entity
        const oldContactIndex = newState.contacts.findIndex(contactItem => (contactItem.ID === oldId));
        const previousContactData = newState.contacts[oldContactIndex];
        // MERGE FIELDS OF TYPE COLLECTION
        const newContactData = {
          ...previousContactData,
          ...newState.contact,
        };
        newState.contacts.splice(oldContactIndex, 1).unshift(newContactData);
        if (offline) {
          // Return all contact data in response
          newState = {
            ...newState,
            contact: {
              ...newContactData,
            },
          };
        }
      } else {
        // Create
        newState.contacts.unshift({
          ...newState.contact,
        });
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
      let { contact } = action;
      /* eslint-disable */
      if (isNaN(contact.ID) || contact.isOffline) {
        /* eslint-enable */
        // Search local contact
        contact = newState.contacts.find(contactItem => (contactItem.ID === contact.ID));
      } else {
        const mappedContact = {};
        Object.keys(contact).forEach((key) => {
          // Omit restricted properties
          if (key !== '_sample' && key !== 'geonames' && key !== 'created_date' && key !== 'permalink' && key !== 'last_modified') {
            const value = contact[key];
            const valueType = Object.prototype.toString.call(value);
            switch (valueType) {
              case '[object Boolean]': {
                mappedContact[key] = value;
                return;
              }
              case '[object Number]': {
                mappedContact[key] = value;
                return;
              }
              case '[object String]': {
                if (value.includes('quick_button')) {
                  mappedContact[key] = parseInt(value, 10);
                } else if (key === 'post_title') {
                  mappedContact.title = value;
                } else {
                  mappedContact[key] = value;
                }
                return;
              }
              case '[object Object]': {
                if (Object.prototype.hasOwnProperty.call(value, 'key') && Object.prototype.hasOwnProperty.call(value, 'label')) {
                  // key_select
                  mappedContact[key] = value.key;
                } else if (Object.prototype.hasOwnProperty.call(value, 'formatted')) {
                  // date
                  mappedContact[key] = value.formatted;
                } else if (key === 'assigned_to') {
                  // assigned-to property
                  mappedContact[key] = value['assigned-to'];
                }
                return;
              }
              case '[object Array]': {
                const mappedValue = value.map((valueTwo) => {
                  const valueTwoType = Object.prototype.toString.call(valueTwo);
                  switch (valueTwoType) {
                    case '[object Object]': {
                      if (Object.prototype.hasOwnProperty.call(valueTwo, 'post_title')) {
                        // connection
                        return {
                          value: valueTwo.ID.toString(),
                        };
                      } if (Object.prototype.hasOwnProperty.call(valueTwo, 'key') && Object.prototype.hasOwnProperty.call(valueTwo, 'value')) {
                        return {
                          key: valueTwo.key,
                          value: valueTwo.value,
                        };
                      } if (Object.prototype.hasOwnProperty.call(valueTwo, 'id') && Object.prototype.hasOwnProperty.call(valueTwo, 'label')) {
                        return {
                          value: valueTwo.id.toString(),
                        };
                      }
                      break;
                    }
                    case '[object String]': {
                      if (key === 'sources' || key === 'milestones') {
                        // source or milestone
                        return {
                          value: valueTwo,
                        };
                      }
                      return valueTwo;
                    }
                    default:
                  }
                  return valueTwo;
                });
                if (key.includes('contact_')) {
                  mappedContact[key] = mappedValue;
                } else {
                  mappedContact[key] = {
                    values: mappedValue,
                  };
                }
                break;
              }
              default:
            }
          }
        });
        contact = mappedContact;
        // Update localContact with dbContact
        const contactIndex = newState.contacts.findIndex(contactItem => (contactItem.ID === contact.ID));
        if (contactIndex > -1) {
          newState.contacts[contactIndex] = {
            ...contact,
          };
        }
      }
      newState = {
        ...newState,
        contact,
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
    case actions.CONTACTS_GET_SETTINGS_SUCCESS: {
      const { settings } = action;
      let fieldList = {};
      Object.keys(settings.fields)
        .filter((fieldName) => {
          if (settings.fields[fieldName].type === 'key_select'
            || settings.fields[fieldName].type === 'multi_select') {
            if (Object.prototype.toString.call(settings.fields[fieldName].default) === '[object Object]') {
              return true;
            }
          }
          return false;
        })
        .forEach((fieldName) => {
          const fieldData = settings.fields[fieldName];
          let fieldValues = {};
          Object.keys(fieldData.default).forEach((value) => {
            fieldValues = {
              ...fieldValues,
              [value]: {
                label: fieldData.default[value].label,
              },
            };
          });
          fieldList = {
            ...fieldList,
            [fieldName]: {
              name: fieldData.name,
              values: fieldValues,
            },
          };
        });
      return {
        ...newState,
        settings: fieldList,
        loading: false,
      };
    }
    case actions.CONTACTS_GET_SETTINGS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case userActions.USER_LOGOUT:
      return {
        ...newState,
        settings: null,
      };
    default:
      return newState;
  }
}
