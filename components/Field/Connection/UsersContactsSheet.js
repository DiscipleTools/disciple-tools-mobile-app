import React from "react";

import ConnectionSheet from "./ConnectionSheet";

import useFilter from "hooks/useFilter";
import useUsersContacts from "hooks/use-users-contacts";

/*
 * NOTE: we need these ConnectionSheet abstractions bc we cannot conditionally
 * render hooks. We could instead conditionally pass null values, but that can
 * get messy passing the null thru the chain of hooks.
 * 
 * Also, IF we want a custom rendering of items, this abstraction enables it. 
 */
const UsersContactsSheet = ({ id, title, values, onChange }) => {

  const { search, onSearch } = useFilter();

  // exclude currently selected values from options list
  const exclude = values?.map(item => item?.value);
  // exclude the the current post (ie, contact or group)
  if (id) exclude.push(id);

  const { data: items, error, isLoading, isValidating, mutate } = useUsersContacts({ search, exclude });
  if (!items) return [];

  return(
    <ConnectionSheet
      title={title}
      items={items}
      values={values}
      onChange={onChange}
      search={search}
      onSearch={onSearch}
    />
  );
};
export default UsersContactsSheet;