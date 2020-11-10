import * as actions from '../actions/users.actions';
import sharedTools from '../../shared';

const initialState = {
  error: null,
  users: null,
  loading: null,
  contactFilters: {},
  groupFilters: {},
};

export default function usersReducer(state = initialState, action) {
  const newState = {
    ...state,
    error: null,
    users: null,
  };
  switch (action.type) {
    case actions.GET_USERS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GET_USERS_SUCCESS:
      return {
        ...newState,
        users: action.users,
        loading: false,
      };
    case actions.GET_USERS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GET_CONTACT_FILTERS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GET_CONTACT_FILTERS_SUCCESS: {
      let { contactFilters, isConnected, contactList, userData } = action;

      // Map filters
      contactFilters = {
        ...contactFilters,
        filters: contactFilters.filters.map((filter) => {
          let mappedFilter = {
            ...filter,
          };

          let newQuery = {};

          Object.keys(filter.query).forEach((key) => {
            let value = filter.query[key];
            let valueType = Object.prototype.toString.call(value);
            if (valueType === '[object Array]') {
              value = value[0];
            }

            // Replace 'me' value with user name
            if (value === 'me') {
              value = userData.displayName;
            }

            newQuery = {
              ...newQuery,
              [key]: value,
            };
          });

          delete newQuery.sort;
          delete newQuery.combine;

          return {
            ...mappedFilter,
            query: newQuery,
          };
        }),
      };

      // Only return filters that exist in data (contact[prop] exist)
      contactFilters = {
        ...contactFilters,
        filters: contactFilters.filters.filter((filter) => {
          let newQuery = { ...filter.query };
          Object.keys(filter.query).forEach((key) => {
            if (
              contactList.filter((contact) => Object.prototype.hasOwnProperty.call(contact, key))
                .length === 0
            ) {
              delete newQuery[key];
            }
          });
          return {
            ...filter,
            query: newQuery,
          };
        }),
      };

      // Only return filters that return data (result > 0) ONLY IN OFFLINE MODE
      if (!isConnected) {
        contactFilters = {
          ...contactFilters,
          filters: contactFilters.filters.filter((filter) => {
            return sharedTools.contactsByFilter(contactList, filter.query).length > 0;
          }),
        };
      }

      return {
        ...newState,
        contactFilters,
        loading: false,
      };
    }
    case actions.GET_CONTACT_FILTERS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GET_GROUP_FILTERS_SUCCESS: {
      let { groupFilters, isConnected, groupList, userData } = action;

      // Map filters
      groupFilters = {
        ...groupFilters,
        filters: groupFilters.filters.map((filter) => {
          let mappedFilter = {
            ...filter,
          };

          let newQuery = {};

          Object.keys(filter.query).forEach((key) => {
            let value = filter.query[key];
            let valueType = Object.prototype.toString.call(value);
            if (valueType === '[object Array]') {
              value = value[0];
            }

            // Replace 'me' value with user name
            if (value === 'me') {
              value = userData.displayName;
            }

            newQuery = {
              ...newQuery,
              [key]: value,
            };
          });

          delete newQuery.sort;
          delete newQuery.combine;

          return {
            ...mappedFilter,
            query: newQuery,
          };
        }),
      };

      // Only return filters that exist in data (group[prop] exist)
      groupFilters = {
        ...groupFilters,
        filters: groupFilters.filters.filter((filter) => {
          let newQuery = { ...filter.query };
          Object.keys(filter.query).forEach((key) => {
            if (
              groupList.filter((group) => Object.prototype.hasOwnProperty.call(group, key))
                .length === 0
            ) {
              delete newQuery[key];
            }
          });
          return {
            ...filter,
            query: newQuery,
          };
        }),
      };

      // Only return filters that return data (result > 0) ONLY IN OFFLINE MODE
      if (!isConnected) {
        groupFilters = {
          ...groupFilters,
          filters: groupFilters.filters.filter((filter) => {
            return sharedTools.groupsByFilter(groupList, filter.query).length > 0;
          }),
        };
      }

      return {
        ...newState,
        groupFilters,
        loading: false,
      };
    }
    case actions.GET_GROUP_FILTERS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.USER_LOGOUT:
      return {
        ...newState,
        users: null,
      };
    default:
      return newState;
  }
}
