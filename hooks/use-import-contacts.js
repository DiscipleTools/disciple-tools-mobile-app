import { useEffect, useState } from "react";

import * as Contacts from "expo-contacts";

import { searchObjList } from "utils";

const useImportContacts = ({ search }) => {
  const [importContacts, setImportContacts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // TODO: use-list Contacts and exclude by title
  const exclude = [];

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { status } = await Contacts.requestPermissionsAsync();
        setLoading(false);
        if (status === "granted") {
          const importContactsList = [];
          const { data } = await Contacts.getContactsAsync({});
          data.map((contact) => {
            const contactData = {};
            if (contact.contactType === "person") {
              const name =
                (
                  contact?.name ||
                  (contact?.firstName ?? "") + " " + (contact?.lastName ?? "")
                )?.trim() ?? "";
              // TODO: constant?
              // API and component differ, for now have user manually choose
              //contactData["type"] = { key: "personal" };
              contactData["name"] = name;
              if (
                contact.hasOwnProperty("emails") &&
                contact.emails.length > 0
              ) {
                contactData["contact_email"] = [];
                contact.emails.map((email, idx) => {
                  contactData["contact_email"].push({
                    key: `contact_email_${idx}`,
                    value: email.email,
                  });
                });
              }
              if (
                contact.hasOwnProperty("phoneNumbers") &&
                contact.phoneNumbers.length > 0
              ) {
                contactData["contact_phone"] = [];
                contact.phoneNumbers.map((phoneNumber, idx) => {
                  contactData["contact_phone"].push({
                    key: `contact_phone_${idx}`,
                    value: phoneNumber.number,
                  });
                });
              }
              importContactsList.push(contactData);
            }
          });
          setImportContacts(importContactsList);
        }
      } catch (error) {
        setError(error);
      }
    })();
  }, []);

  // filter any items marked to be excluded
  let filtered = importContacts?.filter(
    (item) => !exclude?.includes(item?.name)
  );
  // search
  if (search) {
    const searchOptions = {
      caseInsensitive: true,
      include: ["name", "title"],
    };
    filtered = searchObjList(filtered, search, searchOptions);
  }
  return {
    data: filtered, //filtered?.reverse(),
    error,
    isLoading: loading,
    isValidating: null,
    mutate: () => null,
  };
};
export default useImportContacts;
