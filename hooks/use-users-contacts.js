import useList from "hooks/use-list";
import useUsers from "hooks/use-users";

import { TypeConstants } from "constants";
import { complementListByObjProps } from "utils";

// TODO: users/contacts not being excluded
const useUsersContacts = ({ search, filter, exclude }) => {
  const { data: users, error: errorUsers, isLoading: isLoadingUsers, isValidating: isValidatingUsers, mutate } = useUsers({ search, exclude });
  const { data: contacts, error: errorContacts, isLoading: isLoadingContacts, isValidating: isValidatingContacts } = useList({ search, filter, exclude, type: TypeConstants.CONTACT });
  if (isLoadingUsers || isLoadingContacts || !users || !contacts) return {
    data: null,
    error: errorUsers || errorContacts,
    isLoading: isLoadingUsers || isLoadingContacts,
    isValidating: isValidatingUsers || isValidatingContacts,
    mutate
  };
  // find users that do not have a contact record, otherwise use the contact record with more detail
  complementListByObjProps({ aList: users, aProp: "contact_id", bList: contacts, bProp: "ID", bTransform: Number });
  const merged = [];
  if (users) merged.push(...users);
  if (contacts) merged.push(...contacts);
  return {
    data: merged,
    error: null,
    isLoading: null,
    isValidating: null, 
    mutate
  };
};
export default useUsersContacts;
