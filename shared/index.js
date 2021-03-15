import _ from 'lodash';
import moment from '../languages/moment';

const diff = (obj1, obj2) => {
  // Make sure an object to compare is provided
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1;
  }

  //
  // Variables
  //

  const diffs = {};
  // let key;

  //
  // Methods
  //

  /**
   * Check if two arrays are equal
   * @param  {Array}   arr1 The first array
   * @param  {Array}   arr2 The second array
   * @return {Boolean}      If true, both arrays are equal
   */
  const arraysMatch = (value, other) => {
    // Get the value type
    const type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    const compare = (item1, item2) => {
      // Get the object type
      const itemType = Object.prototype.toString.call(item1);

      // If an object or array, compare recursively
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!arraysMatch(item1, item2)) return false;
      } else {
        // Otherwise, do a simple comparison
        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) return false;

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) return false;
        } else if (item1 !== item2) return false;
      }
      return true;
    };

    // Compare properties
    if (type === '[object Array]') {
      for (let i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) return false;
      }
    } else {
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          if (compare(value[key], other[key]) === false) return false;
        }
      }
    }

    // If nothing failed, return true
    return true;
  };

  /**
   * Compare two items and push non-matches to object
   * @param  {*}      item1 The first item
   * @param  {*}      item2 The second item
   * @param  {String} key   The key in our object
   */
  const compare = (item1, item2, key) => {
    // Get the object type
    const type1 = Object.prototype.toString.call(item1);
    const type2 = Object.prototype.toString.call(item2);

    // If type2 is undefined it has been removed
    if (type2 === '[object Undefined]') {
      diffs[key] = null;
      return;
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[key] = item2;
      return;
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      const objDiff = diff(item1, item2);
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff;
      }
      return;
    }

    // If an array, compare
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
      return;
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2;
      }
    } else if (item1 !== item2) {
      diffs[key] = item2;
    }
  };

  //
  // Compare our objects
  //

  // Loop through the first object
  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      compare(obj1[key], obj2[key], key);
    }
  }

  // Loop through the second object and find missing items
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }

  // Return the object of differences
  return diffs;
};

const formatDateToBackEnd = (dateString) => {
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  const month =
    dateObject.getMonth() + 1 < 10 ? `0${dateObject.getMonth() + 1}` : dateObject.getMonth() + 1;
  const day = dateObject.getDate() < 10 ? `0${dateObject.getDate()}` : dateObject.getDate();
  const newDate = `${year}-${month}-${day}`;
  return newDate;
};

const formatDateToView = (date) => {
  return moment(new Date(date)).utc().format('LL');
};

const formatDateToDatePicker = (timestamp = null) => {
  let date = timestamp ? new Date(timestamp) : new Date();
  // Keep date value to current timezone
  date = new Date(
    date.getTime() + date.getTimezoneOffset() * 60 * 1000 * Math.sign(date.getTimezoneOffset()),
  );
  return date;
};

const getSelectorColor = (status) => {
  let newColor;
  if (status === 'new' || status === 'unassigned' || status === 'closed' || status === 'inactive') {
    newColor = '#d9534f';
  } else if (status === 'unassignable' || status === 'assigned' || status === 'paused') {
    newColor = '#f0ad4e';
  } else if (status === 'active') {
    newColor = '#5cb85c';
  } else if (status === 'from_facebook') {
    newColor = '#366184';
  }
  return newColor;
};

const debounce = (fn, time) => {
  let timeout;

  return function () {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

const commentFieldMinHeight = 50;
const commentFieldMinContainerHeight = 120;
let handle,
  onlyExecuteLastCall = (parameter, functionName, timeout) => {
    if (handle) {
      clearTimeout(handle);
    }
    handle = setTimeout(function () {
      handle = 0;
      functionName(parameter);
    }, timeout);
  };

const mentionPattern = /@\[.+?\]\((.*)\)/g;
const renderMention = (matchingString, matches) => {
  let mentionText = matchingString.substring(
    matchingString.lastIndexOf('[') + 1,
    matchingString.lastIndexOf(']'),
  );
  return `@${mentionText}`;
};

// Sort Comments and Acitivities by date, and group it by type (comment, activity) and user
const groupCommentsActivities = (list) => {
  // Sort list by: new to old
  list = _.orderBy(list, 'date', 'desc');
  let groupedList = [];
  list.forEach((item, index, array) => {
    if (index > 0) {
      let previousCommentActivity = { ...array[index - 1] };
      let previousGroupedCommentActivity = groupedList[groupedList.length - 1];
      let lastGroupedCommentActivity =
        previousGroupedCommentActivity.data[previousGroupedCommentActivity.data.length - 1];
      let differenceBetweenDates = new Date(lastGroupedCommentActivity.date) - new Date(item.date),
        hourOnMilliseconds = 3600000;
      let authorName = item.author ? item.author : item.name,
        previousAuthorName = previousCommentActivity.author
          ? previousCommentActivity.author
          : previousCommentActivity.name;
      // current comment/activity same previous comment/activity, same type and current comment/activity date less than 1 day of difference
      if (previousAuthorName === authorName && differenceBetweenDates < hourOnMilliseconds) {
        groupedList[groupedList.length - 1] = {
          ...previousGroupedCommentActivity,
          data: [...previousGroupedCommentActivity.data, { ...item }],
        };
      } else {
        groupedList.push({
          data: [
            {
              ...item,
            },
          ],
        });
      }
    } else {
      groupedList.push({
        data: [
          {
            ...item,
          },
        ],
      });
    }
  });
  return groupedList;
};

const filterExistInEntity = (filterValueType, filterValue, value) => {
  let result = false;
  switch (filterValueType) {
    case '[object Boolean]': {
      if (filterValue === value) {
        result = true;
      }
      break;
    }
    case '[object Number]': {
      if (filterValue === value) {
        result = true;
      }
      break;
    }
    case '[object String]': {
      // is date filter
      if (
        Object.prototype.hasOwnProperty.call(filterValue, 'start') &&
        Object.prototype.hasOwnProperty.call(filterValue, 'end')
      ) {
        let startDate = new Date(filterValue.start).getTime(),
          endDate = new Date(filterValue.end).getTime(),
          valueDate = new Date(parseInt(value) * 1000).getTime();
        if (valueDate >= startDate && valueDate <= endDate) {
          result = true;
        }
      } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
        // locations - milestones
        value['values'].forEach((object) => {
          if (filterValue === object['value']) {
            result = true;
          }
        });
      } else if (filterValue === value) {
        result = true;
      }
      break;
    }
    case '[object Object]': {
      if (Object.prototype.hasOwnProperty.call(value, 'values')) {
        value['values'].forEach((object) => {
          if (filterValue === object['name']) {
            result = true;
            //Detect custom values (tags)
          } else if (filterValue === object['value']) {
            result = true;
          }
        });
      } else if (
        Object.prototype.hasOwnProperty.call(value, 'key') &&
        Object.prototype.hasOwnProperty.call(value, 'label')
      ) {
        if (filterValue === value['label']) {
          result = true;
        }
      }
      break;
    }
  }

  return result;
};

const contactsByFilter = (contactsList, query) => {
  // Temporal fix => set 'created_on' prop to 'post_date'
  Object.keys(query).map(function (key) {
    if (key == 'created_on') {
      query['post_date'] = query[key];
      delete query[key];
    }
    if (key == 'combine' || key == 'sort' || key == 'type') {
      delete query[key];
    }
  });
  return contactsList
    .filter((contact) => {
      let resp = [];
      for (let key in query) {
        let result = false;
        //Property exist in object
        if (Object.prototype.hasOwnProperty.call(contact, key)) {
          let value = contact[key];
          let filterValues = query[key];
          let filterValuesType = Object.prototype.toString.call(filterValues);
          if (filterValuesType == '[object Array]') {
            // Use filter with multiple props
            for (let index = 0; index <= filterValues.length - 1; index++) {
              let filterValue = filterValues[index];
              // Boolean props (requires_update)
              if (filterValue === '0') {
                filterValue = false;
              } else if (filterValue === '1') {
                filterValue = true;
              }
              let filterValueType = Object.prototype.toString.call(filterValue);
              result = filterExistInEntity(filterValueType, filterValue, value);
              // Return contacts with status different of '-closed'
              if (filterValue.toString().startsWith('-')) {
                if (value !== filterValue.replace('-', '')) {
                  result = true;
                }
                // Detect 'assigned_to' or 'subassigned' value
              } else if (key == 'assigned_to') {
                // Search in 'assigned_to'
                filterValues.forEach((assignedContact) => {
                  if (assignedContact === value.label || parseInt(assignedContact) === value.key) {
                    result = true;
                  }
                });
                // If record does not match 'assigned_to' value, search by 'subassigned'
                if (
                  !result &&
                  Object.prototype.hasOwnProperty.call(query, 'subassigned') &&
                  Object.prototype.hasOwnProperty.call(contact, 'subassigned')
                ) {
                  // Search in 'subassigned'
                  query['subassigned'].forEach((filterValue) => {
                    contact['subassigned'].values.forEach((subassignedContact) => {
                      if (filterValue === subassignedContact.value) {
                        result = true;
                      }
                    });
                  });
                }
              } else if (key == 'subassigned') {
                // Search in 'subassigned'
                filterValues.forEach((filterValue) => {
                  value.values.forEach((subassignedContact) => {
                    if (filterValue === subassignedContact.value) {
                      result = true;
                    }
                  });
                });
                // If record does not match 'subassigned' value, search by 'assigned_to'
                if (
                  !result &&
                  Object.prototype.hasOwnProperty.call(query, 'assigned_to') &&
                  Object.prototype.hasOwnProperty.call(contact, 'assigned_to')
                ) {
                  // Search in 'assigned_to'
                  query['assigned_to'].forEach((assignedContact) => {
                    if (
                      assignedContact === contact['assigned_to'].label ||
                      parseInt(assignedContact) === contact['assigned_to'].key
                    ) {
                      result = true;
                    }
                  });
                }
              }
              // Exit for to stop doing unnecessary loops
              if (result) {
                break;
              }
            }
          } else if (filterValuesType == '[object Object]') {
            // Date range filter
            if (
              Object.prototype.hasOwnProperty.call(filterValues, 'start') &&
              Object.prototype.hasOwnProperty.call(filterValues, 'end')
            ) {
              let startDate = new Date(filterValues.start).getTime(),
                endDate = new Date(filterValues.end).getTime(),
                valueDate = new Date(parseInt(value) * 1000).getTime();
              if (valueDate >= startDate && valueDate <= endDate) {
                result = true;
              }
            }
          }
        }
        resp.push(result);
      }
      return resp.every((respValue) => respValue);
    })
    .sort((a, b) => {
      // Sort contacts 'desc'
      return new Date(parseInt(a.last_modified)) < new Date(parseInt(b.last_modified));
    });
};

const groupsByFilter = (groupsList, query) => {
  // Temporal fix => set 'created_on' prop to 'post_date'
  Object.keys(query).map(function (key) {
    if (key == 'created_on') {
      query['post_date'] = query[key];
      delete query[key];
    }
    if (key == 'sort') {
      delete query[key];
    }
  });
  return groupsList.filter((group) => {
    let resp = [];
    for (let key in query) {
      let result = false;
      //Property exist in object
      if (Object.prototype.hasOwnProperty.call(group, key)) {
        const value = group[key];
        const filterValues = query[key];
        const filterValuesType = Object.prototype.toString.call(filterValues);
        if (filterValuesType == '[object Array]') {
          for (let index = 0; index <= filterValues.length - 1; index++) {
            let filterValue = filterValues[index];
            // Boolean props (requires_update)
            if (filterValue === '0') {
              filterValue = false;
            } else if (filterValue === '1') {
              filterValue = true;
            }
            let filterValueType = Object.prototype.toString.call(filterValue);
            result = filterExistInEntity(filterValueType, filterValue, value);
            // Return groups with status different of '-closed'
            if (filterValue.toString().startsWith('-')) {
              if (value !== filterValue.replace('-', '')) {
                result = true;
              }
              // Detect 'assigned_to' or 'subassigned' value
            } else if (key == 'assigned_to') {
              // Search in 'assigned_to'
              filterValues.forEach((assignedContact) => {
                if (assignedContact === value.label || parseInt(assignedContact) === value.key) {
                  result = true;
                }
              });
            }
            // Exit for to stop doing unnecessary loops
            if (result) {
              break;
            }
          }
        } else if (filterValuesType == '[object Object]') {
          // Date range filter
          if (
            Object.prototype.hasOwnProperty.call(filterValues, 'start') &&
            Object.prototype.hasOwnProperty.call(filterValues, 'end')
          ) {
            let startDate = new Date(filterValues.start).getTime(),
              endDate = new Date(filterValues.end).getTime(),
              valueDate = new Date(parseInt(value) * 1000).getTime();
            if (valueDate >= startDate && valueDate <= endDate) {
              result = true;
            }
          }
        }
      }
      resp.push(result);
    }
    return resp.every((respValue) => respValue);
  });
};

const getSelectizeValuesToSave = (dbData, selectedValues) => {
  const dbItems = [...dbData];
  const localItems = [];
  // Map selectize value to get selected options
  Object.keys(selectedValues.entities.item).forEach((itemValue) => {
    const item = selectedValues.entities.item[itemValue];
    localItems.push(item);
  });
  // Remove of D.B items that were removed of the field
  dbItems.forEach((dbItem) => {
    const foundDatabaseInLocal = localItems.find((localItem) => dbItem.value === localItem.value);
    if (!foundDatabaseInLocal) {
      localItems.push({
        ...dbItem,
        delete: true,
      });
    }
  });
  return localItems;
};

const mapContacts = (contacts, entities) => {
  return contacts.map((contact) => {
    const mappedContact = {};
    Object.keys(contact).forEach((key) => {
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
          let dateRegex = /^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/;
          if (value.includes('quick_button')) {
            mappedContact[key] = parseInt(value, 10);
          } else if (key === 'post_title') {
            // Decode HTML strings
            mappedContact.title = entities.decode(value);
          } else if (dateRegex.test(value)) {
            // Date (post_date)
            var match = value.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
            var date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
            mappedContact[key] = (date.getTime() / 1000).toString();
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
                return {
                  value: valueTwo,
                };
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
    });
    return mappedContact;
  });
};

const mapContact = (contact, entities) => {
  return mapContacts([contact], entities)[0];
};

const isNumeric = (string) => {
  if (typeof string != 'string') return false; // we only process strings!
  return (
    !isNaN(string) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(string))
  ); // ...and ensure strings of whitespace fail
};

const mapGroups = (groups, entities) => {
  return groups.map((group) => {
    const mappedGroup = {};
    Object.keys(group).forEach((key) => {
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
          let dateRegex = /^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/;
          if (value.includes('quick_button')) {
            mappedGroup[key] = parseInt(value, 10);
          } else if (key === 'post_title') {
            // Decode HTML strings
            mappedGroup.title = entities.decode(value);
          } else if (dateRegex.test(value)) {
            // Date (post_date)
            var match = value.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
            var date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
            mappedGroup[key] = (date.getTime() / 1000).toString();
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
                  if (Object.prototype.hasOwnProperty.call(valueTwo, 'baptized_member_count')) {
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
                return {
                  value: valueTwo,
                };
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
    });
    return mappedGroup;
  });
};

const mapGroup = (group, entities) => {
  return mapGroups([group], entities)[0];
};

const recursivelyMapFilterOnQueryParams = (filter, parentKey, queryParams, userData) => {
  for (let key in filter) {
    const val = filter[key];
    if (typeof val === 'object') {
      queryParams = recursivelyMapFilterOnQueryParams(val, key, queryParams, userData);
    } else {
      const paramVal = filter[key];
      const paramKey = parentKey.length > 0 ? `${parentKey}%5B%5D` : key;
      if (paramVal.length !== 0) {
        queryParams = `${queryParams}${queryParams === '' ? '?' : '&'}${paramKey}=${
          paramVal === userData.displayName ? 'me' : String(paramVal).trim()
        }`;
      }
    }
  }
  return queryParams;
};

// TODO: deprecate if `recursivelyMapFilterOnQueryParams` works as expected
const mapFilterOnQueryParams = (filter, userData) => {
  let queryParams = '?';
  Object.keys(filter).forEach((key) => {
    let filterValue = filter[key];
    let filterValueType = Object.prototype.toString.call(filterValue);
    if (filterValueType === '[object Array]') {
      filterValue.flat().forEach((value) => {
        if (typeof value === 'string' && value.length === 0) {
          // continue
        } else if (typeof value == 'object') {
          Object.keys(value).forEach((subkey) => {
            let subfilterValue = value[subkey];
            subfilterValue.forEach((subvalue) => {
              queryParams = `${queryParams}${queryParams === '?' ? '' : '&'}${subkey}%5B%5D=${
                subvalue === userData.displayName ? 'me' : subvalue.trim()
              }`;
            });
          });
        } else {
          if (value.length > 0) {
            queryParams = `${queryParams}${queryParams === '?' ? '' : '&'}${key}%5B%5D=${
              value === userData.displayName ? 'me' : value.trim()
            }`;
          }
        }
      });
    } else {
      queryParams = `${queryParams}${queryParams === '?' ? '' : '&'}${key}=${
        filterValue === userData.displayName ? 'me' : filterValue
      }`;
    }
  });
  return queryParams;
};

const mergeContactList = (mappedContacts, persistedContacts) => {
  // Detect if any mappedContacts exist in persistedContacts list
  let updatedContacts = mappedContacts.filter((mappedContact) => {
    return (
      persistedContacts.findIndex((persistedContact) => persistedContact.ID === mappedContact.ID) >
      -1
    );
  });
  // If exist => update persistedContact with mappedContact changes
  updatedContacts.forEach((updatedContact) => {
    let index = persistedContacts.findIndex(
      (persistedContact) => persistedContact.ID === updatedContact.ID,
    );
    persistedContacts[index] = { ...updatedContact };
  });
  // Only get newContacts of DataBase. This way we avoid repeated contacts records caused by pagination
  let newContacts = mappedContacts.filter((mappedContact) => {
    return (
      persistedContacts.findIndex(
        (persistedContact) => persistedContact.ID === mappedContact.ID,
      ) === -1
    );
  });
  return {
    persistedContacts,
    newContacts,
  };
};

const mergeGroupList = (mappedGroups, persistedGroups) => {
  // Detect if any mappedGroups exist in persistedGroups list
  let updatedGroups = mappedGroups.filter((mappedGroup) => {
    return persistedGroups.findIndex((persistedGroup) => persistedGroup.ID === mappedGroup.ID) > -1;
  });
  // If exist => update persistedGroup with mappedGroup changes
  updatedGroups.forEach((updatedGroup) => {
    let index = persistedGroups.findIndex(
      (persistedGroup) => persistedGroup.ID === updatedGroup.ID,
    );
    persistedGroups[index] = { ...updatedGroup };
  });
  // Only get newGroups of DataBase. This way we avoid repeated groups records caused by pagination
  let newGroups = mappedGroups.filter((mappedGroup) => {
    return (
      persistedGroups.findIndex((persistedGroup) => persistedGroup.ID === mappedGroup.ID) === -1
    );
  });
  return {
    persistedGroups,
    newGroups,
  };
};

export default {
  diff,
  formatDateToBackEnd,
  getSelectorColor,
  debounce,
  commentFieldMinHeight,
  commentFieldMinContainerHeight,
  onlyExecuteLastCall,
  mentionPattern,
  renderMention,
  groupCommentsActivities,
  filterExistInEntity,
  contactsByFilter,
  groupsByFilter,
  paginationLimit: 100,
  getSelectizeValuesToSave,
  mapContacts,
  mapContact,
  isNumeric,
  mapGroups,
  mapGroup,
  formatDateToView,
  formatDateToDatePicker,
  mapFilterOnQueryParams,
  recursivelyMapFilterOnQueryParams,
  mergeContactList,
  mergeGroupList,
};
