import * as actions from '../actions/contacts.actions';
import * as userActions from '../actions/user.actions';
import { Html5Entities } from 'html-entities';

const initialState = {
  loading: false,
  error: null,
  contacts: [],
  contact: null,
  comments: {},
  newComment: false,
  activities: {},
  loadingComments: false,
  loadingActivities: false,
  saved: false,
  settings: null,
  offset: 0,
  previousContacts: [],
};

export default function contactsReducer(state = initialState, action) {
  let newState = {
    ...state,
    contact: null,
    newComment: false,
    error: null,
    saved: false,
  };
  const entities = new Html5Entities();
  switch (action.type) {
    case actions.CONTACTS_GETALL_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.CONTACTS_GETALL_SUCCESS: {
      let { contacts } = action;
      const { offline, offset } = action;
      const localContacts = newState.contacts.filter((localContact) => isNaN(localContact.ID));
      if (!offline) {
        const dataBaseContacts = [...action.contacts].map((contact) => {
          const mappedContact = {};
          Object.keys(contact).forEach((key) => {
            // Omit restricted properties
            if (
              key !== '_sample' &&
              key !== 'geonames' &&
              key !== 'created_date' &&
              key !== 'permalink' &&
              key !== 'last_modified'
            ) {
              const value = contact[key];
              const valueType = Object.prototype.toString.call(value);
              switch (valueType) {
                case '[object Boolean]': {
                  mappedContact[key] = value;
                  return;
                }
                case '[object Number]': {
                  if (key === 'ID') {
                    mappedContact[key] = value.toString();
                  } else {
                    mappedContact[key] = value;
                  }
                  return;
                }
                case '[object String]': {
                  if (value.includes('quick_button')) {
                    mappedContact[key] = parseInt(value, 10);
                  } else if (key === 'post_title') {
                    // Decode HTML strings
                    mappedContact.title = entities.decode(value);
                  } else {
                    mappedContact[key] = entities.decode(value);
                  }
                  return;
                }
                case '[object Object]': {
                  if (
                    Object.prototype.hasOwnProperty.call(value, 'key') &&
                    Object.prototype.hasOwnProperty.call(value, 'label')
                  ) {
                    // key_select
                    mappedContact[key] = value.key;
                  } else if (Object.prototype.hasOwnProperty.call(value, 'timestamp')) {
                    // date
                    mappedContact[key] = value.timestamp;
                  } else if (key === 'assigned_to') {
                    // assigned-to property
                    mappedContact[key] = {
                      key: parseInt(value['assigned-to'].replace('user-', '')),
                      label: value['display'],
                    };
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
                            name: entities.decode(valueTwo.post_title),
                          };
                        }
                        if (
                          Object.prototype.hasOwnProperty.call(valueTwo, 'key') &&
                          Object.prototype.hasOwnProperty.call(valueTwo, 'value')
                        ) {
                          return {
                            key: valueTwo.key,
                            value: valueTwo.value,
                          };
                        }
                        if (
                          Object.prototype.hasOwnProperty.call(valueTwo, 'id') &&
                          Object.prototype.hasOwnProperty.call(valueTwo, 'label')
                        ) {
                          return {
                            value: valueTwo.id.toString(),
                            name: valueTwo.label,
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
        });
        contacts = localContacts.concat(dataBaseContacts);
      }
      if (offset > 0) {
        contacts = newState.contacts.concat(contacts);
      }
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
          if (
            key !== '_sample' &&
            key !== 'geonames' &&
            key !== 'created_date' &&
            key !== 'permalink' &&
            key !== 'last_modified'
          ) {
            const value = contact[key];
            const valueType = Object.prototype.toString.call(value);
            switch (valueType) {
              case '[object Boolean]': {
                mappedContact[key] = value;
                return;
              }
              case '[object Number]': {
                if (key === 'ID') {
                  mappedContact[key] = value.toString();
                } else {
                  mappedContact[key] = value;
                }
                return;
              }
              case '[object String]': {
                if (value.includes('quick_button')) {
                  mappedContact[key] = parseInt(value, 10);
                } else if (key === 'post_title') {
                  // Decode HTML strings
                  mappedContact.title = entities.decode(value);
                } else {
                  mappedContact[key] = entities.decode(value);
                }
                return;
              }
              case '[object Object]': {
                if (
                  Object.prototype.hasOwnProperty.call(value, 'key') &&
                  Object.prototype.hasOwnProperty.call(value, 'label')
                ) {
                  // key_select
                  mappedContact[key] = value.key;
                } else if (Object.prototype.hasOwnProperty.call(value, 'timestamp')) {
                  // date
                  mappedContact[key] = value.timestamp;
                } else if (key === 'assigned_to') {
                  // assigned-to property
                  mappedContact[key] = {
                    key: parseInt(value['assigned-to'].replace('user-', '')),
                    label: value['display'],
                  };
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
                          name: entities.decode(valueTwo.post_title),
                        };
                      }
                      if (
                        Object.prototype.hasOwnProperty.call(valueTwo, 'key') &&
                        Object.prototype.hasOwnProperty.call(valueTwo, 'value')
                      ) {
                        return {
                          key: valueTwo.key,
                          value: valueTwo.value,
                        };
                      }
                      if (
                        Object.prototype.hasOwnProperty.call(valueTwo, 'id') &&
                        Object.prototype.hasOwnProperty.call(valueTwo, 'label')
                      ) {
                        return {
                          value: valueTwo.id.toString(),
                          name: valueTwo.label,
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
      const oldId = mappedContact.oldID ? mappedContact.oldID : null;
      newState = {
        ...newState,
        contact: mappedContact,
        saved: true,
      };
      const contactIndex = newState.contacts.findIndex(
        (contactItem) => contactItem.ID.toString() === contact.ID.toString(),
      );
      // Search entity in list (contacts) if exists: updated it, otherwise: added it to contacts list
      if (contactIndex > -1) {
        // Merge all data of request with found entity
        let newContactData;
        if (offline) {
          // Editing D.B. entity in OFFLINE mode
          newContactData = {
            ...newState.contacts[contactIndex],
          };
          // Apply modifications from request (mappedContact) in newContactData
          Object.keys(mappedContact).forEach((key) => {
            const value = mappedContact[key];
            const valueType = Object.prototype.toString.call(value);
            if (
              valueType === '[object Array]' ||
              Object.prototype.hasOwnProperty.call(value, 'values')
            ) {
              let collection;
              let oldCollection;
              if (valueType === '[object Array]') {
                collection = value;
                oldCollection = newContactData[key] ? [...newContactData[key]] : [];
              } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                collection = value.values;
                oldCollection = newContactData[key] ? [...newContactData[key].values] : [];
              }
              // compare newCollection with old and merge differences.
              collection.forEach((object) => {
                // search object in newContactData
                let findObjectInOldRequestIndex;
                if (valueType === '[object Array]') {
                  findObjectInOldRequestIndex = oldCollection.findIndex(
                    (oldObject) => oldObject.key === object.key,
                  );
                } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                  findObjectInOldRequestIndex = oldCollection.findIndex(
                    (oldObject) => oldObject.value === object.value,
                  );
                }
                if (findObjectInOldRequestIndex > -1) {
                  // if exist
                  if (
                    Object.prototype.hasOwnProperty.call(object, 'delete') &&
                    object.delete === true
                  ) {
                    oldCollection.splice(findObjectInOldRequestIndex, 1);
                  } else {
                    // update the object
                    oldCollection[findObjectInOldRequestIndex] = {
                      ...object,
                    };
                  }
                } else {
                  // add the object
                  oldCollection.push({
                    ...object,
                  });
                }
              });
              if (valueType === '[object Array]') {
                newContactData = {
                  ...newContactData,
                  [key]: oldCollection,
                };
              } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                newContactData = {
                  ...newContactData,
                  [key]: {
                    values: oldCollection,
                  },
                };
              }
            } else {
              newContactData = {
                ...newContactData,
                [key]: value,
              };
            }
          });
        } else {
          newContactData = {
            ...newState.contacts[contactIndex],
            ...newState.contact,
          };
        }
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
        const oldContactIndex = newState.contacts.findIndex(
          (contactItem) => contactItem.ID.toString() === oldId,
        );
        const previousContactData = {
          ...newState.contacts[oldContactIndex],
        };
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
      return {
        ...newState,
        loading: false,
      };
    }
    case actions.CONTACTS_SAVE_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.CONTACTS_GETBYID_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.CONTACTS_GETBYID_SUCCESS: {
      let contact = { ...action.contact };
      if (isNaN(contact.ID) || contact.isOffline) {
        // Search local contact
        const foundContact = newState.contacts.find(
          (contactItem) => contactItem.ID.toString() === contact.ID,
        );
        // Fix to error when App try to get detail of non existing contact (browsing between several contacts) in OFFLINE mode
        if (foundContact) {
          contact = {
            ...foundContact,
          };
        }
      } else {
        const mappedContact = {};
        // MAP CONTACT TO CAN SAVE IT LATER
        Object.keys(contact).forEach((key) => {
          // Omit restricted properties
          if (
            key !== '_sample' &&
            key !== 'geonames' &&
            key !== 'created_date' &&
            key !== 'permalink' &&
            key !== 'last_modified'
          ) {
            const value = contact[key];
            const valueType = Object.prototype.toString.call(value);
            switch (valueType) {
              case '[object Boolean]': {
                mappedContact[key] = value;
                return;
              }
              case '[object Number]': {
                if (key === 'ID') {
                  mappedContact[key] = value.toString();
                } else {
                  mappedContact[key] = value;
                }
                return;
              }
              case '[object String]': {
                if (value.includes('quick_button')) {
                  mappedContact[key] = parseInt(value, 10);
                } else if (key === 'post_title') {
                  // Decode HTML strings
                  mappedContact.title = entities.decode(value);
                } else {
                  mappedContact[key] = entities.decode(value);
                }
                return;
              }
              case '[object Object]': {
                if (
                  Object.prototype.hasOwnProperty.call(value, 'key') &&
                  Object.prototype.hasOwnProperty.call(value, 'label')
                ) {
                  // key_select
                  mappedContact[key] = value.key;
                } else if (Object.prototype.hasOwnProperty.call(value, 'timestamp')) {
                  // date
                  mappedContact[key] = value.timestamp;
                } else if (key === 'assigned_to') {
                  // assigned-to property
                  mappedContact[key] = {
                    key: parseInt(value['assigned-to'].replace('user-', '')),
                    label: value['display'],
                  };
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
                          name: entities.decode(valueTwo.post_title),
                        };
                      }
                      if (
                        Object.prototype.hasOwnProperty.call(valueTwo, 'key') &&
                        Object.prototype.hasOwnProperty.call(valueTwo, 'value')
                      ) {
                        return {
                          key: valueTwo.key,
                          value: valueTwo.value,
                        };
                      }
                      if (
                        Object.prototype.hasOwnProperty.call(valueTwo, 'id') &&
                        Object.prototype.hasOwnProperty.call(valueTwo, 'label')
                      ) {
                        return {
                          value: valueTwo.id.toString(),
                          name: valueTwo.label,
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
        const contactIndex = newState.contacts.findIndex(
          (contactItem) => contactItem.ID.toString() === contact.ID,
        );
        if (contactIndex > -1) {
          newState.contacts[contactIndex] = {
            ...contact,
          };
        } else {
          // Add retrieved contact to contacts array (persist to OFFLINE mode)
          newState.contacts.unshift(contact);
        }
      }
      newState = {
        ...newState,
        contact,
        loading: false,
      };
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
    case actions.CONTACTS_GET_COMMENTS_SUCCESS: {
      const { comments, contactId, pagination } = action;

      let mappedComments = comments.map((comment) => ({
        ID: comment.comment_ID,
        date: `${comment.comment_date_gmt.replace(' ', 'T')}Z`,
        author: comment.comment_author,
        // Decode HTML strings
        content: entities.decode(comment.comment_content),
        gravatar: comment.gravatar,
      }));
      // Check previous records existence; Only retrieve previous data if pagination its active (offset > 0)
      let previousComments = [];
      if (pagination.offset > 0 && newState.comments[contactId]) {
        previousComments = newState.comments[contactId].data;
      }

      let newCommentState = {
        ...newState.comments,
        [contactId]: {
          data: [...previousComments, ...mappedComments],
          pagination: {
            ...pagination,
            offset: pagination.offset + pagination.limit, // UPDATE OFFSET
          },
        },
      };

      return {
        ...newState,
        comments: newCommentState,
        loadingComments: false,
      };
    }
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
      const { comment, contactId, offline } = action;
      let newComment;

      // Check previous records/pagination existence and return it
      let previousComments = [],
        pagination = {
          limit: 10,
          offset: 0,
          total: 0,
        };
      if (newState.comments[contactId]) {
        previousComments = newState.comments[contactId].data;
        pagination = newState.comments[contactId].pagination;
      }
      // Search existent comment with ID (update comment)
      let foundCommentIndex = previousComments.findIndex(
        (previousComment) => previousComment.ID === (comment.ID ? comment.ID : comment.comment_ID),
      );

      if (offline) {
        if (foundCommentIndex > -1) {
          newComment = {
            ...comment,
          };
        } else {
          const date = new Date();
          const year = date.getUTCFullYear();
          let day = date.getUTCDate();
          let month = date.getUTCMonth() + 1;
          if (day < 10) day = `0${day}`;
          if (month < 10) month = `0${month}`;
          const curDay = `${year}-${month}-${day}`;
          let hours = date.getUTCHours();
          let minutes = date.getUTCMinutes();
          let seconds = date.getUTCSeconds();
          if (hours < 10) hours = `0${hours}`;
          if (minutes < 10) minutes = `0${minutes}`;
          if (seconds < 10) seconds = `0${seconds}`;
          const currentDate = `${curDay}T${hours}:${minutes}:${seconds}Z`;
          newComment = {
            ID: comment.ID,
            author: comment.author,
            date: currentDate,
            content: comment.comment,
            gravatar: 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g',
          };
        }
      } else {
        if (foundCommentIndex > -1) {
          newComment = {
            ...comment,
          };
        } else {
          newComment = {
            ID: comment.comment_ID,
            author: comment.comment_author,
            date: `${comment.comment_date_gmt.replace(' ', 'T')}Z`,
            // Decode HTML strings
            content: entities.decode(comment.comment_content),
            gravatar: 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g',
          };
        }
      }

      let newCommentState;
      if (foundCommentIndex > -1) {
        previousComments[foundCommentIndex] = newComment;

        newCommentState = {
          ...newState.comments,
          [contactId]: {
            data: [...previousComments],
            pagination,
          },
        };
      } else {
        // Add new comment
        newCommentState = {
          ...newState.comments,
          [contactId]: {
            data: [...previousComments, newComment],
            pagination,
          },
        };
      }

      return {
        ...newState,
        comments: newCommentState,
        newComment: true,
        loadingComments: false,
      };
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
    case actions.CONTACTS_GET_ACTIVITIES_SUCCESS: {
      const { activities, contactId, pagination } = action;

      let mappedActivities = activities.map((activity) => ({
        ID: activity.histid,
        date: new Date(parseInt(activity.hist_time, 10) * 1000).toISOString(),
        // Decode HTML strings
        object_note: entities.decode(activity.object_note),
        gravatar:
          activity.gravatar === ''
            ? 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g'
            : activity.gravatar,
        meta_id: activity.meta_id,
        meta_key: activity.meta_key,
        name: activity.name,
      }));
      // Check previous records existence; Only retrieve previous data if pagination its active (offset > 0)
      let previousActivities = [];
      if (pagination.offset > 0 && newState.activities[contactId]) {
        previousActivities = newState.activities[contactId].data;
      }

      let newActivityState = {
        ...newState.activities,
        [contactId]: {
          data: [...previousActivities, ...mappedActivities],
          pagination: {
            ...pagination,
            offset: pagination.offset + pagination.limit, // UPDATE OFFSET
          },
        },
      };

      return {
        ...newState,
        activities: newActivityState,
        loadingActivities: false,
      };
    }
    case actions.CONTACTS_GET_ACTIVITIES_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingActivities: false,
      };
    case actions.CONTACTS_GET_SETTINGS_SUCCESS: {
      const { settings } = action;
      let fieldList = {};
      // Get fieldlist
      Object.keys(settings.fields).forEach((fieldName) => {
        const fieldData = settings.fields[fieldName];
        if (fieldData.type === 'key_select' || fieldData.type === 'multi_select') {
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
        } else {
          fieldList = {
            ...fieldList,
            [fieldName]: {
              name: fieldData.name,
            },
          };
        }
      });
      // Get channels
      let channels = {};
      Object.keys(settings.channels).forEach((channelName) => {
        const channelData = settings.channels[channelName];
        channels = {
          ...channels,
          [channelName]: {
            label: channelData.label,
            value: channelName,
          },
        };
      });
      return {
        ...newState,
        settings: {
          fields: fieldList,
          channels,
          labelPlural: settings.label_plural,
        },
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
        contacts: [],
      };
    case actions.CONTACTS_DELETE_COMMENT_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.CONTACTS_DELETE_COMMENT_SUCCESS: {
      const { contactId, commentId } = action;

      // Check previous records/pagination existence and return it
      let previousComments = [],
        pagination = {
          limit: 10,
          offset: 0,
          total: 0,
        };
      if (newState.comments[contactId]) {
        previousComments = newState.comments[contactId].data;
        pagination = newState.comments[contactId].pagination;
      }
      // Search existent comment with ID (update comment)
      let foundCommentIndex = previousComments.findIndex(
        (previousComment) => previousComment.ID === commentId,
      );

      // Delete comment
      if (foundCommentIndex > -1) {
        previousComments.splice(foundCommentIndex, 1);
      }

      let newCommentState = {
        ...newState.comments,
        [contactId]: {
          data: [...previousComments],
          pagination,
        },
      };
      return {
        ...newState,
        comments: newCommentState,
        loadingComments: false,
      };
    }
    case actions.CONTACTS_DELETE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.CONTACTS_LOADING_FALSE:
      return {
        ...newState,
        loading: false,
      };
    case actions.CONTACTS_UPDATE_PREVIOUS: {
      let { previousContacts } = action;
      return {
        ...newState,
        previousContacts,
      };
    }
    default:
      return newState;
  }
}
