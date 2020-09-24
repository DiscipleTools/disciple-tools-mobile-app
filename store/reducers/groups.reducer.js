import * as actions from '../actions/groups.actions';
import * as userActions from '../actions/user.actions';
import { Html5Entities } from 'html-entities';

const initialState = {
  loading: false,
  error: null,
  groups: [],
  group: null,
  comments: {},
  newComment: false,
  activities: {},
  loadingComments: false,
  loadingActivities: false,
  saved: false,
  settings: null,
  offset: 0,
  peopleGroups: null,
  geonames: [],
  foundGeonames: [],
  geonamesLastModifiedDate: null,
  geonamesLength: 0,
  previousGroups: [],
};

export default function groupsReducer(state = initialState, action) {
  let newState = {
    ...state,
    group: null,
    newComment: false,
    error: null,
    saved: false,
    peopleGroups: null,
    foundGeonames: null,
  };
  const entities = new Html5Entities();
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
                  if (key === 'ID') {
                    mappedGroup[key] = value.toString();
                  } else {
                    mappedGroup[key] = value;
                  }
                  return;
                }
                case '[object String]': {
                  if (value.includes('quick_button')) {
                    mappedGroup[key] = parseInt(value, 10);
                  } else if (key === 'post_title') {
                    // Decode HTML strings
                    mappedGroup.title = entities.decode(value);
                  } else {
                    mappedGroup[key] = entities.decode(value);
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
                    mappedGroup[key] = {
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
                          let object = {
                            value: valueTwo.ID.toString(),
                            name: entities.decode(valueTwo.post_title),
                          };
                          // groups
                          if (
                            Object.prototype.hasOwnProperty.call(valueTwo, 'baptized_member_count')
                          ) {
                            object = {
                              ...object,
                              baptized_member_count: valueTwo.baptized_member_count,
                            };
                          }
                          if (Object.prototype.hasOwnProperty.call(valueTwo, 'member_count')) {
                            object = {
                              ...object,
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
                if (key === 'ID') {
                  mappedGroup[key] = value.toString();
                } else {
                  mappedGroup[key] = value;
                }
                return;
              }
              case '[object String]': {
                if (value.includes('quick_button')) {
                  mappedGroup[key] = parseInt(value, 10);
                } else if (key === 'post_title') {
                  // Decode HTML strings
                  mappedGroup.title = entities.decode(value);
                } else {
                  mappedGroup[key] = entities.decode(value);
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
                  mappedGroup[key] = {
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
                        let object = {
                          value: valueTwo.ID.toString(),
                          name: entities.decode(valueTwo.post_title),
                        };
                        // groups
                        if (
                          Object.prototype.hasOwnProperty.call(valueTwo, 'baptized_member_count')
                        ) {
                          object = {
                            ...object,
                            baptized_member_count: valueTwo.baptized_member_count,
                          };
                        }
                        if (Object.prototype.hasOwnProperty.call(valueTwo, 'member_count')) {
                          object = {
                            ...object,
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
          let oldGroupData = {
            ...newState.groups[groupIndex],
          };
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
          // Update member_count according to current members list.
          let oldMembersListLength = oldGroupData.members ? oldGroupData.members.values.length : 0;
          if (newGroupData.members && newGroupData.members.values.length !== oldMembersListLength) {
            let newMemberCount;
            // If member list length > oldMembersListLength -> set newMemberCount as member list length
            if (newGroupData.members.values.length > oldMembersListLength) {
              newMemberCount = newGroupData.members.values.length.toString();
            }
            // If member list length < oldMembersListLength -> set newMemberCount as current member count minus removed members
            if (newGroupData.members.values.length < oldMembersListLength) {
              let difference = oldMembersListLength - newGroupData.members.values.length;
              newMemberCount = newGroupData.member_count
                ? parseInt(newGroupData.member_count) - difference
                : newGroupData.members.values.length;
            }
            newGroupData = {
              ...newGroupData,
              member_count: newMemberCount,
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
        loading: false,
      };
    }
    case actions.GROUPS_SAVE_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
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
        // Fix to error when App try to get detail of non existing group (browsing between several groups) in OFFLINE mode
        if (foundGroup) {
          group = {
            ...foundGroup,
          };
        }
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
                if (key === 'ID') {
                  mappedGroup[key] = value.toString();
                } else {
                  mappedGroup[key] = value;
                }
                return;
              }
              case '[object String]': {
                if (value.includes('quick_button')) {
                  mappedGroup[key] = parseInt(value, 10);
                } else if (key === 'post_title') {
                  // Decode HTML strings
                  mappedGroup.title = entities.decode(value);
                } else {
                  mappedGroup[key] = entities.decode(value);
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
                  mappedGroup[key] = {
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
                        let object = {
                          value: valueTwo.ID.toString(),
                          name: entities.decode(valueTwo.post_title),
                        };
                        // groups
                        if (
                          Object.prototype.hasOwnProperty.call(valueTwo, 'baptized_member_count')
                        ) {
                          object = {
                            ...object,
                            baptized_member_count: valueTwo.baptized_member_count,
                          };
                        }
                        if (Object.prototype.hasOwnProperty.call(valueTwo, 'member_count')) {
                          object = {
                            ...object,
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
        } else {
          // Add retrieved group to groups array (persist to OFFLINE mode)
          newState.groups.unshift(group);
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
      const { comments, groupId, pagination } = action;

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
      if (pagination.offset > 0 && newState.comments[groupId]) {
        previousComments = newState.comments[groupId].data;
      }

      let newCommentState = {
        ...newState.comments,
        [groupId]: {
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
      const { comment, groupId, offline } = action;
      let newComment;

      // Check previous records/pagination existence and return it
      let previousComments = [],
        pagination = {
          limit: 10,
          offset: 0,
          total: 0,
        };
      if (newState.comments[groupId]) {
        previousComments = newState.comments[groupId].data;
        pagination = newState.comments[groupId].pagination;
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
          [groupId]: {
            data: [...previousComments],
            pagination,
          },
        };
      } else {
        // Add new comment
        newCommentState = {
          ...newState.comments,
          [groupId]: {
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
    case actions.GROUPS_GET_ACTIVITIES_SUCCESS: {
      const { activities, groupId, pagination } = action;

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
      if (pagination.offset > 0 && newState.activities[groupId]) {
        previousActivities = newState.activities[groupId].data;
      }

      let newActivityState = {
        ...newState.activities,
        [groupId]: {
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
    case actions.GROUPS_DELETE_COMMENT_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.GROUPS_DELETE_COMMENT_SUCCESS: {
      const { groupId, commentId } = action;

      // Check previous records/pagination existence and return it
      let previousComments = [],
        pagination = {
          limit: 10,
          offset: 0,
          total: 0,
        };
      if (newState.comments[groupId]) {
        previousComments = newState.comments[groupId].data;
        pagination = newState.comments[groupId].pagination;
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
        [groupId]: {
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
    case actions.GROUPS_DELETE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.GROUPS_LOADING_FALSE:
      return {
        ...newState,
        loading: false,
      };
    case actions.GROUPS_UPDATE_PREVIOUS: {
      let { previousGroups } = action;
      return {
        ...newState,
        previousGroups,
      };
    }
    default:
      return newState;
  }
}
