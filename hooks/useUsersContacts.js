import useUsers from "hooks/useUsers";
import useList from "hooks/useList";

import { TypeConstants } from "constants";

const useUsersContacts = ({ search }) => {
  const { data: users } = useUsers();
  //const { data: contacts } = useList({ search, type: TypeConstants.CONTACT });
  const contacts = [];
  const merged = [];
  if (users) merged.push(...users);
  // filter out any contacts that are also users
  const filteredContacts = contacts?.filter(contact => users?.filter(user => user?.contact_id !== Number(contact?.ID)));
  if (filteredContacts) merged.push(...filteredContacts);
  return merged;
};
export default useUsersContacts;
