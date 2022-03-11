import { Html5Entities } from "html-entities";

import useNetwork from "./use-network";
import useType from "hooks/use-type.js";
import useRequest from "hooks/use-request";
import useMyUser from "hooks/use-my-user";

import { searchObjList } from "utils";

const useList = ({ search, filter, exclude, type, subtype } = {}) => {

  const { isContact, isGroup, postType } = useType({ type, subtype });
  const { data: userData } = useMyUser();

  // TODO: duplicated in useDetails
  const mapContacts = (contacts, entities) => {
    //if (!entities) entities = new Html5Entities();
    return contacts.map((contact) => {
      const mappedContact = {};
      Object.keys(contact).forEach((key) => {
        const value = contact[key];
        const valueType = Object.prototype.toString.call(value);
        switch (valueType) {
          case "[object Boolean]": {
            mappedContact[key] = value;
            return;
          }
          case "[object Number]": {
            if (key === "ID") {
              mappedContact[key] = value.toString();
            } else {
              mappedContact[key] = value;
            }
            return;
          }
          case "[object String]": {
            let dateRegex = /^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/;
            if (value.includes("quick_button")) {
              mappedContact[key] = parseInt(value, 10);
            } else if (key === "post_title") {
              // Decode HTML strings
              //TODO
              //mappedContact.title = entities.decode(value);
              mappedContact.title = value;
            } else if (dateRegex.test(value)) {
              // Date (post_date)
              var match = value.match(
              /^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/
            );
              var date = new Date(
              match[1],
              match[2] - 1,
              match[3],
              match[4],
              match[5],
              match[6]
            );
              mappedContact[key] = (date.getTime() / 1000).toString();
            } else {
              //TODO
              //mappedContact[key] = entities.decode(value);
              mappedContact[key] = value;
            }
            return;
          }
          case "[object Object]": {
            if (
              Object.prototype.hasOwnProperty.call(value, "key") &&
              Object.prototype.hasOwnProperty.call(value, "label")
            ) {
              // key_select
              mappedContact[key] = value.key;
            } else if (
            Object.prototype.hasOwnProperty.call(value, "timestamp")
          ) {
              // date
              mappedContact[key] = value.timestamp;
            } else if (key === "assigned_to") {
              // assigned-to property
              mappedContact[key] = {
                key: parseInt(value["assigned-to"].replace("user-", "")),
                label: value["display"],
              };
            }
            return;
          }
          case "[object Array]": {
            const mappedValue = value.map((valueTwo) => {
              const valueTwoType = Object.prototype.toString.call(valueTwo);
              switch (valueTwoType) {
                case "[object Object]": {
                  if (
                Object.prototype.hasOwnProperty.call(valueTwo, "post_title")
              ) {
                    // connection
                    return {
                      value: valueTwo.ID.toString(),
                      //name: entities.decode(valueTwo.post_title),
                      name: valueTwo.post_title,
                    };
                  }
                  if (
                    Object.prototype.hasOwnProperty.call(valueTwo, "key") &&
                    Object.prototype.hasOwnProperty.call(valueTwo, "value")
                  ) {
                    return {
                      key: valueTwo.key,
                      value: valueTwo.value,
                    };
                  }
                  if (
                    Object.prototype.hasOwnProperty.call(valueTwo, "id") &&
                    Object.prototype.hasOwnProperty.call(valueTwo, "label")
                  ) {
                    return {
                      value: valueTwo.id.toString(),
                      name: valueTwo.label,
                    };
                  }
                  break;
                }
                case "[object String]": {
                  return {
                    value: valueTwo,
                  };
                }
                default:
              }
              return valueTwo;
            });
            if (key.includes("contact_")) {
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

  const mapGroups = (groups, entities) => {
    //if (!entities) entities = new Html5Entities();
    return groups.map((group) => {
      const mappedGroup = {};
      Object.keys(group).forEach((key) => {
        const value = group[key];
        const valueType = Object.prototype.toString.call(value);
        switch (valueType) {
          case "[object Boolean]": {
            mappedGroup[key] = value;
            return;
          }
          case "[object Number]": {
            if (key === "ID") {
              mappedGroup[key] = value.toString();
            } else {
              mappedGroup[key] = value;
            }
            return;
          }
          case "[object String]": {
            let dateRegex = /^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/;
            if (value.includes("quick_button")) {
              mappedGroup[key] = parseInt(value, 10);
            } else if (key === "post_title") {
              // Decode HTML strings
              // TODO
              //mappedGroup.title = entities.decode(value);
              mappedGroup.title = value;
            } else if (dateRegex.test(value)) {
              // Date (post_date)
              var match = value.match(
              /^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/
            );
              var date = new Date(
              match[1],
              match[2] - 1,
              match[3],
              match[4],
              match[5],
              match[6]
            );
              mappedGroup[key] = (date.getTime() / 1000).toString();
            } else {
              // TODO
              //mappedGroup[key] = entities.decode(value);
              mappedGroup[key] = value;
            }
            return;
          }
          case "[object Object]": {
            if (
              Object.prototype.hasOwnProperty.call(value, "key") &&
              Object.prototype.hasOwnProperty.call(value, "label")
            ) {
              // key_select
              mappedGroup[key] = value.key;
            } else if (
            Object.prototype.hasOwnProperty.call(value, "timestamp")
          ) {
              // date
              mappedGroup[key] = value.timestamp;
            } else if (key === "assigned_to") {
              // assigned-to property
              mappedGroup[key] = {
                key: parseInt(value["assigned-to"].replace("user-", "")),
                label: value["display"],
              };
            }
            return;
          }
          case "[object Array]": {
            const mappedValue = value.map((valueTwo) => {
              const valueTwoType = Object.prototype.toString.call(valueTwo);
              switch (valueTwoType) {
                case "[object Object]": {
                  if (
                Object.prototype.hasOwnProperty.call(valueTwo, "post_title")
              ) {
                    // connection
                    let object = {
                      value: valueTwo.ID.toString(),
                      //name: entities.decode(valueTwo.post_title),
                      name: valueTwo.post_title,
                    };
                    // groups
                    if (
                  Object.prototype.hasOwnProperty.call(
                    valueTwo,
                    "baptized_member_count"
                  )
                ) {
                      object = {
                        ...object,
                        baptized_member_count: valueTwo.baptized_member_count,
                      };
                    }
                    if (
                  Object.prototype.hasOwnProperty.call(
                    valueTwo,
                    "member_count"
                  )
                ) {
                      object = {
                        ...object,
                        member_count: valueTwo.member_count,
                      };
                    }
                    if (
                  Object.prototype.hasOwnProperty.call(
                    valueTwo,
                    "is_church"
                  )
                ) {
                      object = {
                        ...object,
                        is_church: valueTwo.is_church,
                      };
                    }
                    return object;
                  }
                  if (
                    Object.prototype.hasOwnProperty.call(valueTwo, "key") &&
                    Object.prototype.hasOwnProperty.call(valueTwo, "value")
                  ) {
                    return {
                      key: valueTwo.key,
                      value: valueTwo.value,
                    };
                  }
                  if (
                    Object.prototype.hasOwnProperty.call(valueTwo, "id") &&
                    Object.prototype.hasOwnProperty.call(valueTwo, "label")
                  ) {
                    return {
                      value: valueTwo.id.toString(),
                      name: valueTwo.label,
                    };
                  }
                  break;
                }
                case "[object String]": {
                  return {
                    value: valueTwo,
                  };
                }
                default:
              }
              return valueTwo;
            });
            if (key.includes("contact_")) {
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

  const mapPosts = (posts) => {
    if (isContact) return mapContacts(posts);
    if (isGroup) return mapGroups(posts);
    return null;
  };

  // TODO: [object Object]
  // /dt-posts/v2/contacts?&fields%5B%5D=[object Object]&sort=name&fields_to_return%5B%5D=name&fields_to_return%5B%5D=favorite&fields_to_return%5B%5D=overall_status&fields_to_return%5B%5D=seeker_path&fields_to_return%5B%5D=milestones&fields_to_return%5B%5D=assigned_to&fields_to_return%5B%5D=groups&fields_to_return%5B%5D=last_modified
  const mapFilterOnQueryParams = (filter, userData) => {
    let queryParams = '';
    Object.keys(filter).forEach((key) => {
      let filterValue = filter[key];
      let filterValueType = Object.prototype.toString.call(filterValue);
      if (filterValueType === "[object Array]") {
        filterValue.forEach((value) => {
          queryParams = `${queryParams}&${key}%5B%5D=${value === userData?.display_name ? "me" : value}`;
        });
      } else if (filterValueType === "[object Object]") {
        // TODO: implement?
        //mapFilterOnQueryParams(filterValue, null, userData);
      } else {
        if (filterValue?.length > 0) {
          queryParams = `${queryParams}&${key}=${filterValue === userData?.display_name ? "me" : filterValue}`;
        }
      }
    });
    return queryParams;
  };

  let url = `/dt-posts/v2/${postType}`;
  if (filter?.query) url += '?';
  //if (search || filter?.query) url += '?';
  //if (search) url += `text=${search}`;
  // TODO
  if (filter?.query && userData) url += mapFilterOnQueryParams(filter?.query, userData);
  if (!search && !filter?.query) url += "?dt_recent=true";

  // TODO: offline filtering
  //const initialData = null;

  const { data, error, isLoading, isValidating, mutate } = useRequest({ url });
  if (error || isLoading || !data?.posts) return {
    data: null,
    error,
    isLoading,
    isValidating,
    mutate
  };
  let filtered = data.posts.filter(item => !exclude?.includes(item?.ID));
  //if (filtered?.length > 0 && search && isConnected == false) filtered = searchObjList(filtered, search);
  if (filtered?.length > 0 && search) filtered = searchObjList(filtered, search);
  const posts = filtered?.length > 0 ? mapPosts(filtered) : null;
  return {
    data: posts,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useList;
