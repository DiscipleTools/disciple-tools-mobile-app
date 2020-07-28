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
  geonames: [],
  peopleGroups: null,
  totalComments: null,
  totalActivities: null,
  loadingComments: false,
  loadingActivities: false,
  saved: false,
  settings: null,
  offset: 0,
  foundGeonames: [],
  geonamesLastModifiedDate: null,
  geonamesLength: 0,
};

export default function groupsReducer(state = initialState, action) {
  let newState = {
    ...state,
    group: null,
    peopleGroups: null,
    newComment: null,
    error: null,
    comments: null,
    totalComments: null,
    activities: null,
    totalActivities: null,
    saved: false,
    foundGeonames: null,
  };
  switch (action.type) {
    case actions.GROUPS_GET_LOCATIONS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GET_LOCATIONS_SUCCESS:
      return {
        ...newState,
        geonames: Object.keys(action.geonames).map((key) => ({
          value: key,
          name: action.geonames[key],
        })),
        loading: false,
        geonamesLength: Object.keys(action.geonames).length,
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
        peopleGroups: action.peopleGroups.map((peopleGroup) => ({
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
    case actions.GROUPS_GETALL_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GETALL_SUCCESS: {
      let { groups } = action;
      const { offline, offset } = action;
      const localGroups = newState.groups.filter((localGroup) => isNaN(localGroup.ID));
      if (!offline) {
        const dataBaseGroups = [...groups].map((group) => {
          const mappedGroup = {};
          Object.keys(group).forEach((key) => {
            // Omit restricted properties
            if (
              key !== 'last_modified' &&
              key !== 'created_from_contact_id' &&
              key !== '_sample' &&
              key !== 'geonames' &&
              key !== 'created_date' &&
              key !== 'permalink' &&
              key !== 'baptized_member_count'
            ) {
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
                  if (
                    Object.prototype.hasOwnProperty.call(value, 'key') &&
                    Object.prototype.hasOwnProperty.call(value, 'label')
                  ) {
                    // key_select
                    mappedGroup[key] = value.key;
                  } else if (Object.prototype.hasOwnProperty.call(value, 'timestamp')) {
                    // date
                    mappedGroup[key] = value.timestamp;
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
                          if (
                            Object.prototype.hasOwnProperty.call(
                              valueTwo,
                              'baptized_member_count',
                            ) &&
                            Object.prototype.hasOwnProperty.call(valueTwo, 'member_count')
                          ) {
                            object = {
                              ...object,
                              post_title: valueTwo.post_title,
                              baptized_member_count: valueTwo.baptized_member_count,
                              member_count: valueTwo.member_count,
                            };
                          }
                          if (Object.prototype.hasOwnProperty.call(valueTwo, 'is_church')) {
                            object = {
                              ...object,
                              is_church: valueTwo.is_church,
                            };
                          }
                          return object;
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
        });
        groups = localGroups.concat(dataBaseGroups);
      }
      if (offset > 0) {
        groups = newState.groups.concat(groups);
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
          if (
            key !== 'last_modified' &&
            key !== 'created_from_contact_id' &&
            key !== '_sample' &&
            key !== 'geonames' &&
            key !== 'created_date' &&
            key !== 'permalink' &&
            key !== 'baptized_member_count'
          ) {
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
                if (
                  Object.prototype.hasOwnProperty.call(value, 'key') &&
                  Object.prototype.hasOwnProperty.call(value, 'label')
                ) {
                  // key_select
                  mappedGroup[key] = value.key;
                } else if (Object.prototype.hasOwnProperty.call(value, 'timestamp')) {
                  // date
                  mappedGroup[key] = value.timestamp;
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
                          name: valueTwo.post_title,
                          value: valueTwo.ID.toString(),
                        };
                        // groups
                        if (
                          Object.prototype.hasOwnProperty.call(valueTwo, 'baptized_member_count') &&
                          Object.prototype.hasOwnProperty.call(valueTwo, 'member_count')
                        ) {
                          object = {
                            ...object,
                            post_title: valueTwo.post_title,
                            baptized_member_count: valueTwo.baptized_member_count,
                            member_count: valueTwo.member_count,
                          };
                        }
                        if (Object.prototype.hasOwnProperty.call(valueTwo, 'is_church')) {
                          object = {
                            ...object,
                            is_church: valueTwo.is_church,
                          };
                        }
                        return object;
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

      const oldId = mappedGroup.oldID ? mappedGroup.oldID : null;

      newState = {
        ...newState,
        group: mappedGroup,
        saved: true,
      };
      const groupIndex = newState.groups.findIndex(
        (groupItem) => groupItem.ID.toString() === group.ID.toString(),
      );
      // Search entity in list (groups) if exists: updated it, otherwise: added it to group list
      if (groupIndex > -1) {
        let newGroupData;
        if (offline) {
          // Editing D.B. entity in OFFLINE mode
          newGroupData = {
            ...newState.groups[groupIndex],
          };
          // Apply modifications from request (mappedGroup) in newGroupData
          Object.keys(mappedGroup).forEach((key) => {
            const value = mappedGroup[key];
            const valueType = Object.prototype.toString.call(value);
            if (
              valueType === '[object Array]' ||
              Object.prototype.hasOwnProperty.call(value, 'values')
            ) {
              let collection;
              let oldCollection;
              if (valueType === '[object Array]') {
                collection = value;
                oldCollection = newGroupData[key] ? [...newGroupData[key]] : [];
              } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                collection = value.values;
                oldCollection = newGroupData[key] ? [...newGroupData[key].values] : [];
              }
              // compare newCollection with old and merge differences.
              collection.forEach((object) => {
                // search object in newGroupData
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
          // Update members length in OFFLINE mode
          if (
            newGroupData.members &&
            newGroupData.members.values &&
            newGroupData.members.values.length != parseInt(newGroupData.member_count)
          ) {
            newGroupData = {
              ...newGroupData,
              member_count: newGroupData.members.values.length.toString(),
            };
          }
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
        const oldGroupIndex = newState.groups.findIndex(
          (groupItem) => groupItem.ID.toString() === oldId,
        );
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
      if (isNaN(group.ID) || group.isOffline) {
        // Search local group
        const foundGroup = newState.groups.find(
          (groupItem) => groupItem.ID.toString() === group.ID,
        );
        group = {
          ...foundGroup,
        };
      } else {
        const mappedGroup = {};
        // MAP GROUP TO CAN SAVE IT LATER
        Object.keys(group).forEach((key) => {
          // Omit restricted properties
          if (
            key !== 'last_modified' &&
            key !== 'created_from_contact_id' &&
            key !== '_sample' &&
            key !== 'geonames' &&
            key !== 'created_date' &&
            key !== 'permalink' &&
            key !== 'baptized_member_count'
          ) {
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
                if (
                  Object.prototype.hasOwnProperty.call(value, 'key') &&
                  Object.prototype.hasOwnProperty.call(value, 'label')
                ) {
                  // key_select
                  mappedGroup[key] = value.key;
                } else if (Object.prototype.hasOwnProperty.call(value, 'timestamp')) {
                  // date
                  mappedGroup[key] = value.timestamp;
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
                          name: valueTwo.post_title,
                          value: valueTwo.ID.toString(),
                        };
                        // groups
                        if (
                          Object.prototype.hasOwnProperty.call(valueTwo, 'baptized_member_count') &&
                          Object.prototype.hasOwnProperty.call(valueTwo, 'member_count')
                        ) {
                          object = {
                            ...object,
                            post_title: valueTwo.post_title,
                            baptized_member_count: valueTwo.baptized_member_count,
                            member_count: valueTwo.member_count,
                          };
                        }
                        if (Object.prototype.hasOwnProperty.call(valueTwo, 'is_church')) {
                          object = {
                            ...object,
                            is_church: valueTwo.is_church,
                          };
                        }
                        return object;
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
        const groupIndex = newState.groups.findIndex(
          (groupItem) => groupItem.ID.toString() === group.ID,
        );
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
        return {
          ...newState,
          comments: comments.map((comment) => ({
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
        comments: comments.map((comment) => ({
          ID: comment.comment_ID,
          date: `${comment.comment_date_gmt.replace(' ', 'T')}Z`,
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
            date: `${comment.comment_date_gmt.replace(' ', 'T')}Z`,
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
        activities: action.activities.map((activity) => ({
          ID: activity.histid,
          date: new Date(parseInt(activity.hist_time, 10) * 1000).toISOString(),
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
        groups: [],
        geonames: null,
        settings: null,
        geonamesLastModifiedDate: null,
        geonamesLength: 0,
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
    case actions.GROUPS_LOCATIONS_SEARCH_SUCCESS: {
      const { offline, filteredGeonames, queryText } = action;
      let foundGeonames = [],
        oldGeonames = [];
      if (offline) {
        // Get geonames by queryText
        oldGeonames = filteredGeonames;
        foundGeonames = oldGeonames.filter((oldGeoname) =>
          oldGeoname.name.toLowerCase().includes(queryText.toLowerCase()),
        );
      } else {
        // Get geonames by queryText
        /* eslint-disable */
        oldGeonames = newState.geonames;
        geonamesToAdd = [];
        /* eslint-enable */
        foundGeonames = filteredGeonames.map((geoname) => ({
          value: geoname.ID,
          name: geoname.name,
        }));
        // Add non persisted geonames to state
        geonamesToAdd = foundGeonames.filter(
          (foundGeoname) =>
            oldGeonames.find((oldGeoname) => oldGeoname.value == foundGeoname.value) === undefined,
        );
      }
      return {
        ...newState,
        foundGeonames,
        geonames: (geonamesToAdd
          ? [...oldGeonames, ...geonamesToAdd]
          : [...oldGeonames]
        ).sort((a, b) => a.value.localeCompare(b.value)),
        loading: false,
      };
    }
    case actions.GROUPS_LOCATIONS_SEARCH_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_LOCATIONS_MODIFIED_DATE_SUCCESS: {
      const { geonamesLastModifiedDate } = action;
      return {
        ...newState,
        geonamesLastModifiedDate,
      };
    }
    case actions.GROUPS_LOCATIONS_MODIFIED_DATE_FAILURE: {
      return {
        ...newState,
        error: action.error,
      };
    }
    default:
      return newState;
  }
}
