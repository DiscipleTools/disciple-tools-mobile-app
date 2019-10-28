import * as actions from '../actions/groups.actions';
import * as userActions from '../actions/user.actions';

const initialState = {
  loading: false,
  error: null,
  groups: [],
  group: null,
  comments: null,
  newComment: null,
  activities: null,
  usersContacts: null,
  geonames: null,
  peopleGroups: null,
  search: null,
  totalComments: null,
  totalActivities: null,
  loadingComments: false,
  loadingActivities: false,
  saved: false,
  settings: null,
};

export default function groupsReducer(state = initialState, action) {
  let newState = {
    ...state,
    group: null,
    usersContacts: null,
    peopleGroups: null,
    geonames: null,
    search: null,
    newComment: null,
    error: null,
    comments: null,
    totalComments: null,
    activities: null,
    totalActivities: null,
    saved: false,
  };

  switch (action.type) {
    case actions.GROUPS_GET_USERS_CONTACTS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GET_USERS_CONTACTS_SUCCESS:
      return {
        ...newState,
        usersContacts: action.usersContacts.map(user => ({
          value: user.ID.toString(),
          name: user.name,
        })),
        loading: false,
      };
    case actions.GROUPS_GET_USERS_CONTACTS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_GET_LOCATIONS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GET_LOCATIONS_SUCCESS:
      return {
        ...newState,
        geonames: action.geonames.map(geoname => ({
          value: geoname.ID,
          name: geoname.name,
        })),
        loading: false,
      };
    case actions.GROUPS_GET_LOCATIONS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_SUCCESS:
      return {
        ...newState,
        peopleGroups: action.peopleGroups.map(peopleGroup => ({
          value: peopleGroup.ID.toString(),
          name: peopleGroup.name,
        })),
        loading: false,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_SEARCH_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_SEARCH_SUCCESS:
      return {
        ...newState,
        search: action.search.map(group => ({
          name: group.name,
          value: group.ID,
        })),
        loading: false,
      };
    case actions.GROUPS_SEARCH_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_GETALL_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GETALL_SUCCESS: {
      let { groups } = action;
      const { offline } = action;
      /* eslint-disable */
      let localGroups = newState.groups.filter(localGroup => isNaN(localGroup.ID));
      /* eslint-enable */
      if (!offline) {
        const dataBaseGroups = [...groups].map((group) => {
          const mappedGroup = {};
          Object.keys(group).forEach((key) => {
            // Omit restricted properties
            if (key !== 'last_modified' && key !== 'created_from_contact_id' && key !== '_sample' && key !== 'geonames' && key !== 'created_date' && key !== 'permalink' && key !== 'baptized_member_count') {
              const value = group[key];
              const valueType = Object.prototype.toString.call(value);
              switch (valueType) {
                case '[object Boolean]': {
                  mappedGroup[key] = value;
                  return;
                }
                case '[object Number]': {
                  mappedGroup[key] = value;
                  return;
                }
                case '[object String]': {
                  if (value.includes('quick_button')) {
                    mappedGroup[key] = parseInt(value, 10);
                  } else if (key === 'post_title') {
                    mappedGroup.title = value;
                  } else {
                    mappedGroup[key] = value;
                  }
                  return;
                }
                case '[object Object]': {
                  if (Object.prototype.hasOwnProperty.call(value, 'key') && Object.prototype.hasOwnProperty.call(value, 'label')) {
                    // key_select
                    mappedGroup[key] = value.key;
                  } else if (Object.prototype.hasOwnProperty.call(value, 'formatted')) {
                    // date
                    mappedGroup[key] = value.formatted;
                  } else if (key === 'assigned_to') {
                    // assigned-to property
                    mappedGroup[key] = value['assigned-to'];
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
                          let object = {
                            value: valueTwo.ID.toString(),
                          };
                          // groups
                          if (Object.prototype.hasOwnProperty.call(valueTwo, 'baptized_member_count') && Object.prototype.hasOwnProperty.call(valueTwo, 'member_count')) {
                            object = {
                              ...object,
                              post_title: valueTwo.post_title,
                              baptized_member_count: valueTwo.baptized_member_count,
                              member_count: valueTwo.member_count,
                            };
                          }
                          return object;
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
                        if (key === 'sources' || key === 'health_metrics') {
                          // source or health_metric
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
                    mappedGroup[key] = mappedValue;
                  } else {
                    mappedGroup[key] = {
                      values: mappedValue,
                    };
                  }
                  break;
                }
                default:
              }
            }
          });
          return mappedGroup;
        }).sort((a, b) => parseInt(a.last_modified, 10) - parseInt(b.last_modified, 10)).reverse();
        groups = localGroups.concat(dataBaseGroups);
      }
      return {
        ...newState,
        groups,
        loading: false,
      };
    }
    case actions.GROUPS_GETALL_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_SAVE_SUCCESS: {
      const { group, offline } = action;
      let mappedGroup = {};
      if (offline) {
        mappedGroup = {
          ...group,
        };
      } else {
        Object.keys(group).forEach((key) => {
          // Omit restricted properties
          if (key !== 'last_modified' && key !== 'created_from_contact_id' && key !== '_sample' && key !== 'geonames' && key !== 'created_date' && key !== 'permalink' && key !== 'baptized_member_count') {
            const value = group[key];
            const valueType = Object.prototype.toString.call(value);
            switch (valueType) {
              case '[object Boolean]': {
                mappedGroup[key] = value;
                return;
              }
              case '[object Number]': {
                mappedGroup[key] = value;
                return;
              }
              case '[object String]': {
                if (value.includes('quick_button')) {
                  mappedGroup[key] = parseInt(value, 10);
                } else if (key === 'post_title') {
                  mappedGroup.title = value;
                } else {
                  mappedGroup[key] = value;
                }
                return;
              }
              case '[object Object]': {
                if (Object.prototype.hasOwnProperty.call(value, 'key') && Object.prototype.hasOwnProperty.call(value, 'label')) {
                  // key_select
                  mappedGroup[key] = value.key;
                } else if (Object.prototype.hasOwnProperty.call(value, 'formatted')) {
                  // date
                  mappedGroup[key] = value.formatted;
                } else if (key === 'assigned_to') {
                  // assigned-to property
                  mappedGroup[key] = value['assigned-to'];
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
                        let object = {
                          value: valueTwo.ID.toString(),
                        };
                        // groups
                        if (Object.prototype.hasOwnProperty.call(valueTwo, 'baptized_member_count') && Object.prototype.hasOwnProperty.call(valueTwo, 'member_count')) {
                          object = {
                            ...object,
                            post_title: valueTwo.post_title,
                            baptized_member_count: valueTwo.baptized_member_count,
                            member_count: valueTwo.member_count,
                          };
                        }
                        return object;
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
                      if (key === 'sources' || key === 'health_metrics') {
                        // source or health_metric
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
                  mappedGroup[key] = mappedValue;
                } else {
                  mappedGroup[key] = {
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

      const oldId = (mappedGroup.oldID) ? mappedGroup.oldID : null;

      newState = {
        ...newState,
        group: mappedGroup,
        saved: true,
      };
      const groupIndex = newState.groups.findIndex(groupItem => (groupItem.ID.toString() === group.ID.toString()));
      // Search entity in list (groups) if exists: updated it, otherwise: added it to group list
      if (groupIndex > -1) {
        let newGroupData;
        /* eslint-disable */
        if (offline && !isNaN(group.ID)) {
          /* eslint-enable */
          // Editing D.B. entity in OFFLINE mode
          newGroupData = {
            ...newState.groups[groupIndex],
          };
          // Apply modifications from request (mappedGroup) in newGroupData
          Object.keys(mappedGroup).forEach((key) => {
            const value = mappedGroup[key];
            const valueType = Object.prototype.toString.call(value);
            if (valueType === '[object Array]' || Object.prototype.hasOwnProperty.call(value, 'values')) {
              let collection; let
                oldCollection;
              if (valueType === '[object Array]') {
                collection = value;
                oldCollection = (newGroupData[key]) ? [...newGroupData[key]] : [];
              } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                collection = value.values;
                oldCollection = (newGroupData[key]) ? [...newGroupData[key].values] : [];
              }
              // compare newCollection with old and merge differences.
              collection.forEach((object) => {
                // search object in newGroupData
                let findObjectInOldRequestIndex;
                if (valueType === '[object Array]') {
                  findObjectInOldRequestIndex = oldCollection.findIndex(oldObject => (oldObject.key === object.key));
                } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                  findObjectInOldRequestIndex = oldCollection.findIndex(oldObject => (oldObject.value === object.value));
                }
                if (findObjectInOldRequestIndex > -1) {
                  // if exist
                  if (Object.prototype.hasOwnProperty.call(object, 'delete')) {
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
                newGroupData = {
                  ...newGroupData,
                  [key]: oldCollection,
                };
              } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                newGroupData = {
                  ...newGroupData,
                  [key]: {
                    values: oldCollection,
                  },
                };
              }
            } else {
              newGroupData = {
                ...newGroupData,
                [key]: value,
              };
            }
          });
        } else {
          newGroupData = {
            ...newState.groups[groupIndex],
            ...newState.group,
          };
        }
        newState.groups[groupIndex] = {
          ...newGroupData,
        };
        if (offline) {
          // Return all group data in response
          newState = {
            ...newState,
            group: {
              ...newGroupData,
            },
          };
        }
      } else if (oldId) {
        // Search entity with oldID, remove it and add updated entity
        const oldGroupIndex = newState.groups.findIndex(groupItem => (groupItem.ID === oldId));
        const previousGroupData = {
          ...newState.groups[oldGroupIndex],
        };
        const newGroupData = {
          ...previousGroupData,
          ...newState.group,
        };
        newState.groups.splice(oldGroupIndex, 1).unshift(newGroupData);
        if (offline) {
          // Return all group data in response
          newState = {
            ...newState,
            group: {
              ...newGroupData,
            },
          };
        }
      } else {
        // Create
        newState.groups.unshift({
          ...newState.group,
        });
      }
      return {
        ...newState,
      };
    }
    case actions.GROUPS_SAVE_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GETBYID_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GETBYID_SUCCESS: {
      let group = { ...action.group };
      /* eslint-disable */
      if (isNaN(group.ID) || group.isOffline) {
        /* eslint-enable */
        // Search local group
        const foundGroup = newState.groups.find(groupItem => (groupItem.ID.toString() === group.ID));
        group = {
          ...foundGroup,
        };
      } else {
        const mappedGroup = {};
        // MAP GROUP TO CAN SAVE IT LATER
        Object.keys(group).forEach((key) => {
          // Omit restricted properties
          if (key !== 'last_modified' && key !== 'created_from_contact_id' && key !== '_sample' && key !== 'geonames' && key !== 'created_date' && key !== 'permalink' && key !== 'baptized_member_count') {
            const value = group[key];
            const valueType = Object.prototype.toString.call(value);
            switch (valueType) {
              case '[object Boolean]': {
                mappedGroup[key] = value;
                return;
              }
              case '[object Number]': {
                mappedGroup[key] = value;
                return;
              }
              case '[object String]': {
                if (value.includes('quick_button')) {
                  mappedGroup[key] = parseInt(value, 10);
                } else if (key === 'post_title') {
                  mappedGroup.title = value;
                } else {
                  mappedGroup[key] = value;
                }
                return;
              }
              case '[object Object]': {
                if (Object.prototype.hasOwnProperty.call(value, 'key') && Object.prototype.hasOwnProperty.call(value, 'label')) {
                  // key_select
                  mappedGroup[key] = value.key;
                } else if (Object.prototype.hasOwnProperty.call(value, 'formatted')) {
                  // date
                  mappedGroup[key] = value.formatted;
                } else if (key === 'assigned_to') {
                  // assigned-to property
                  mappedGroup[key] = value['assigned-to'];
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
                        let object = {
                          value: valueTwo.ID.toString(),
                        };
                        // groups
                        if (Object.prototype.hasOwnProperty.call(valueTwo, 'baptized_member_count') && Object.prototype.hasOwnProperty.call(valueTwo, 'member_count')) {
                          object = {
                            ...object,
                            post_title: valueTwo.post_title,
                            baptized_member_count: valueTwo.baptized_member_count,
                            member_count: valueTwo.member_count,
                          };
                        }
                        return object;
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
                      if (key === 'sources' || key === 'health_metrics') {
                        // source or health_metric
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
                  mappedGroup[key] = mappedValue;
                } else {
                  mappedGroup[key] = {
                    values: mappedValue,
                  };
                }
                break;
              }
              default:
            }
          }
        });
        group = mappedGroup;
        // Update localGroup with dbGroup
        const groupIndex = newState.groups.findIndex(groupItem => (groupItem.ID === group.ID));
        if (groupIndex > -1) {
          newState.groups[groupIndex] = {
            ...group,
          };
        }
      }
      newState = {
        ...newState,
        group,
        loading: false,
      };
      return newState;
    }
    case actions.GROUPS_GETBYID_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_GET_COMMENTS_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.GROUPS_GET_COMMENTS_SUCCESS: {
      const { comments, total, offline } = action;
      if (offline) {
        const date = new Date();
        const year = date.getUTCFullYear();
        let day = date.getUTCDate();
        let month = (date.getUTCMonth() + 1);
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
        return {
          ...newState,
          comments: comments.map(comment => ({
            ID: comment.ID,
            author: comment.author,
            date: currentDate,
            content: comment.comment,
            gravatar: 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g',
            contactId: comment.contactId,
          })),
          totalComments: total,
          loadingComments: false,
        };
      }
      return {
        ...newState,
        comments: comments.map(comment => ({
          ID: comment.comment_ID,
          date: `${comment.comment_date.replace(' ', 'T')}Z`,
          author: comment.comment_author,
          content: comment.comment_content,
          gravatar: comment.gravatar,
        })),
        totalComments: total,
        loadingComments: false,
      };
    }
    case actions.GROUPS_GET_COMMENTS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.GROUPS_SAVE_COMMENT_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.GROUPS_SAVE_COMMENT_SUCCESS: {
      const { comment, offline } = action;
      if (offline) {
        const date = new Date();
        const year = date.getUTCFullYear();
        let day = date.getUTCDate();
        let month = (date.getUTCMonth() + 1);
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
        newState = {
          ...newState,
          newComment: {
            ID: comment.ID,
            author: comment.author,
            date: currentDate,
            content: comment.comment,
            gravatar: 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g',
            contactID: comment.contactID,
          },
          loadingComments: false,
        };
      } else {
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
      }
      return newState;
    }
    case actions.GROUPS_SAVE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.GROUPS_GET_ACTIVITIES_START:
      return {
        ...newState,
        loadingActivities: true,
      };
    case actions.GROUPS_GET_ACTIVITIES_SUCCESS:
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
    case actions.GROUPS_GET_ACTIVITIES_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingActivities: false,
      };
    case userActions.USER_LOGOUT:
      return {
        ...newState,
        usersContacts: null,
        geonames: null,
        peopleGroups: null,
        search: null,
      };
    case actions.GROUPS_GET_SETTINGS_SUCCESS: {
      const { settings } = action;
      let fieldList = {};
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
      return {
        ...newState,
        settings: fieldList,
        loading: false,
      };
    }
    case actions.GROUPS_GET_SETTINGS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    default:
      return newState;
  }
}
