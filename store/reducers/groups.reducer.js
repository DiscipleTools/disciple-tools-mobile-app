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
        }).sort((a, b) => parseInt(a.ID, 10) < parseInt(b.ID, 10));
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
      if (oldId) {
        delete mappedGroup.oldID;
      }

      newState = {
        ...newState,
        group: mappedGroup,
        saved: true,
      };

      if (newState.group.start_date) {
        let newStartDate = new Date(newState.group.start_date);
        const year = newStartDate.getFullYear();
        const month = (newStartDate.getMonth() + 1) < 10 ? `0${newStartDate.getMonth() + 1}` : (newStartDate.getMonth() + 1);
        const day = (newStartDate.getDate() + 1) < 10 ? `0${newStartDate.getDate() + 1}` : (newStartDate.getDate() + 1);
        newStartDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          group: {
            ...newState.group,
            start_date: newStartDate,
          },
        };
      }
      if (newState.group.end_date) {
        let newEndDate = new Date(newState.group.end_date);
        const year = newEndDate.getFullYear();
        const month = (newEndDate.getMonth() + 1) < 10 ? `0${newEndDate.getMonth() + 1}` : (newEndDate.getMonth() + 1);
        const day = (newEndDate.getDate() + 1) < 10 ? `0${newEndDate.getDate() + 1}` : (newEndDate.getDate() + 1);
        newEndDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          group: {
            ...newState.group,
            end_date: newEndDate,
          },
        };
      }
      const groupIndex = newState.groups.findIndex(groupItem => (groupItem.ID.toString() === group.ID.toString()));
      // Search entity in list (groups) if exists: updated it, otherwise: added it to group list
      if (groupIndex > -1) {
        const newGroupData = {
          ...newState.groups[groupIndex],
          ...newState.group,
        };
        // MERGE FIELDS OF TYPE COLLECTION
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
        const previousGroupData = newState.groups[oldGroupIndex];
        // MERGE FIELDS OF TYPE COLLECTION
        const newGroupData = {
          ...previousGroupData,
          ...newState.group,
        };
        newState.groups.splice(oldGroupIndex, 1).unshift(newGroupData);
        if (offline) {
          // Return all contact data in response
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
      return newState;
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
      let { group } = action;

      /* eslint-disable */
      if (isNaN(group.ID) || group.isOffline) {
        /* eslint-enable */
        // Search local group
        group = newState.groups.find(groupItem => (groupItem.ID === group.ID));
      } else {
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
        group = mappedGroup;
        // Update localContact with dbContact
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

      if (newState.group.start_date) {
        let newStartDate = new Date(newState.group.start_date);
        const year = newStartDate.getFullYear();
        const month = (newStartDate.getMonth() + 1) < 10 ? `0${newStartDate.getMonth() + 1}` : (newStartDate.getMonth() + 1);
        const day = (newStartDate.getDate()) < 10 ? `0${newStartDate.getDate()}` : (newStartDate.getDate());
        newStartDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          group: {
            ...newState.group,
            start_date: newStartDate,
          },
        };
      } else {
        newState = {
          ...newState,
          group: {
            ...newState.group,
            start_date: '',
          },
        };
      }
      if (newState.group.end_date) {
        let newEndDate = new Date(newState.group.end_date);
        const year = newEndDate.getFullYear();
        const month = (newEndDate.getMonth() + 1) < 10 ? `0${newEndDate.getMonth() + 1}` : (newEndDate.getMonth() + 1);
        const day = (newEndDate.getDate()) < 10 ? `0${newEndDate.getDate()}` : (newEndDate.getDate());
        newEndDate = `${year}-${month}-${day}`;
        newState = {
          ...newState,
          group: {
            ...newState.group,
            end_date: newEndDate,
          },
        };
      } else {
        newState = {
          ...newState,
          group: {
            ...newState.group,
            end_date: '',
          },
        };
      }
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
    case actions.GROUPS_GET_COMMENTS_SUCCESS:
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
      const { comment } = action;
      return {
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
    default:
      return newState;
  }
}
