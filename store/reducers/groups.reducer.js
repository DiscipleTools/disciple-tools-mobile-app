import * as actions from '../actions/groups.actions';

const initialState = {
  loading: false,
  error: null,
  groups: [],
  group: null,
  comments: [],
  newComment: null,
  activities: [],
  usersContacts: [],
  geonames: [],
  peopleGroups: [],
  search: [],
  totalComments: null,
  totalActivities: null,
  loadingComments: false,
  loadingActivities: false,
  type: null, // delete
};

export default function groupsReducer(state = initialState, action) {
  let newState = {
    ...state,
    type: action.type, // delete
    group: null,
    newComment: null,
    error: null,
    comments: null,
    totalComments: null,
    activities: null,
    totalActivities: null,
  };

  switch (action.type) {
    case actions.GROUPS_GET_USERS_CONTACTS_SUCCESS:
      return {
        ...newState,
        usersContacts: action.usersContacts.map(user => ({
          value: user.ID.toString(),
          name: user.name,
        })),
      };
    case actions.GROUPS_GET_USERS_CONTACTS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_LOCATIONS_SUCCESS:
      return {
        ...newState,
        geonames: action.geonames.map(geoname => ({
          value: geoname.ID,
          name: geoname.name,
        })),
      };
    case actions.GROUPS_GET_LOCATIONS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_SUCCESS:
      return {
        ...newState,
        peopleGroups: action.peopleGroups.map(peopleGroup => ({
          value: peopleGroup.ID.toString(),
          name: peopleGroup.name,
        })),
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_SEARCH_SUCCESS:
      return {
        ...newState,
        search: action.search.map(group => ({
          name: group.name,
          value: group.ID,
        })),
      };
    case actions.GROUPS_SEARCH_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GETALL_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GETALL_SUCCESS:
      return {
        ...newState,
        groups: action.groups.map(group => ({
          ID: group.ID,
          post_title: group.post_title,
          group_status: group.group_status.label,
          group_type: group.group_type.label,
          member_count: (group.member_count) ? group.member_count : 0,
        })),
        loading: false,
      };
    case actions.GROUPS_GETALL_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_SAVE_SUCCESS: {
      const { group } = action;
      newState = {
        ...newState,
        group: {
          ID: group.ID,
          title: group.title,
          group_status:
            group.group_status && group.group_status.key
              ? group.group_status.key
              : null,
          assigned_to: group.assigned_to
            ? `user-${group.assigned_to.id}`
            : null,
          coaches: {
            values: group.coaches
              ? group.coaches.map(coach => ({
                value: coach.ID.toString(),
                name: coach.post_title,
              }))
              : [],
          },
          geonames: {
            values: group.geonames
              ? group.geonames.map(geoname => ({
                value: geoname.id.toString(),
                name: geoname.label,
              }))
              : [],
          },
          people_groups: {
            values: group.people_groups
              ? group.people_groups.map(peopleGroup => ({
                value: peopleGroup.ID.toString(),
                name: peopleGroup.post_title,
              }))
              : [],
          },
          contact_address: group.contact_address
            ? group.contact_address.map(contact => ({
              key: contact.key,
              value: contact.value,
            }))
            : [],
          start_date:
            group.start_date && group.start_date.formatted.length > 0
              ? group.start_date.formatted
              : null,
          end_date:
            group.end_date && group.end_date.formatted.length > 0
              ? group.end_date.formatted
              : null,
          group_type: group.group_type ? group.group_type.key : null,
          health_metrics: {
            values: group.health_metrics
              ? group.health_metrics.map(healthMetric => ({
                value: healthMetric,
              }))
              : [],
          },
          parent_groups: {
            values: group.parent_groups.map(parentGroup => ({
              name: parentGroup.post_title,
              value: parentGroup.ID.toString(),
            })),
          },
          peer_groups: {
            values: group.peer_groups.map(peerGroup => ({
              name: peerGroup.post_title,
              value: peerGroup.ID.toString(),
            })),
          },
          child_groups: {
            values: group.child_groups.map(childGroup => ({
              name: childGroup.post_title,
              value: childGroup.ID.toString(),
            })),
          },
        },
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
        const day = (newEndDate.getDate() + 1) < 10 ? `0${newEndDate.getDate() + 1}` : (newEndDate.getDate() + 1);
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
      const { group } = action;
      newState = {
        ...newState,
        group: {
          ID: group.ID,
          title: group.title,
          group_status:
            group.group_status && group.group_status.key
              ? group.group_status.key
              : null,
          assigned_to: group.assigned_to
            ? `user-${group.assigned_to.id}`
            : null,
          coaches: {
            values: group.coaches
              ? group.coaches.map(coach => ({
                value: coach.ID.toString(),
                name: coach.post_title,
              }))
              : [],
          },
          geonames: {
            values: group.geonames
              ? group.geonames.map(geoname => ({
                value: geoname.id.toString(),
                name: geoname.label,
              }))
              : [],
          },
          people_groups: {
            values: group.people_groups
              ? group.people_groups.map(peopleGroup => ({
                value: peopleGroup.ID.toString(),
                name: peopleGroup.post_title,
              }))
              : [],
          },
          contact_address: group.contact_address
            ? group.contact_address.map(contact => ({
              key: contact.key,
              value: contact.value,
            }))
            : [],
          start_date:
            group.start_date && group.start_date.formatted.length > 0
              ? group.start_date.formatted
              : null,
          end_date:
            group.end_date && group.end_date.formatted.length > 0
              ? group.end_date.formatted
              : null,
          group_type: group.group_type ? group.group_type.key : null,
          health_metrics: {
            values: group.health_metrics
              ? group.health_metrics.map(healthMetric => ({
                value: healthMetric,
              }))
              : [],
          },
          parent_groups: {
            values: group.parent_groups.map(parentGroup => ({
              name: parentGroup.post_title,
              value: parentGroup.ID.toString(),
            })),
          },
          peer_groups: {
            values: group.peer_groups.map(peerGroup => ({
              name: peerGroup.post_title,
              value: peerGroup.ID.toString(),
            })),
          },
          child_groups: {
            values: group.child_groups.map(childGroup => ({
              name: childGroup.post_title,
              value: childGroup.ID.toString(),
            })),
          },
        },
        loading: false,
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
        const day = (newEndDate.getDate() + 1) < 10 ? `0${newEndDate.getDate() + 1}` : (newEndDate.getDate() + 1);
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
          ID: `${comment.comment_ID}-c`,
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
    case actions.GROUPS_SAVE_COMMENT_SUCCESS: {
      const { comment } = action;
      return {
        ...newState,
        newComment: {
          ID: `${comment.comment_ID}-c`,
          author: comment.comment_author,
          date: `${comment.comment_date.replace(' ', 'T')}Z`,
          content: comment.comment_content,
          gravatar: 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g',
        },
      };
    }
    case actions.GROUPS_SAVE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
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
          ID: `${activity.histid}-a`,
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
    default:
      return newState;
  }
}
