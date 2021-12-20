import React, { useEffect, useState } from "react";
import * as Contacts from 'expo-contacts';

const useImportContacts = () => {

  const [importContacts, setImportContacts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(async() => {
    try {
      setLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();
      setLoading(false);
      if (status === 'granted') {
        const importContactsList = [];
        const { data } = await Contacts.getContactsAsync({});
        data.map((contact) => {
          const contactData = {};
          if (contact.contactType === 'person') {
            contactData['id'] = contact.id;
            contactData['title'] = contact.name;
            contactData['name'] = contact.name;
            if (contact.hasOwnProperty('emails') && contact.emails.length > 0) {
              contactData['contact_email'] = [];
              contact.emails.map((email, idx) => {
                contactData['contact_email'].push({
                  key: `contact_email_${idx}`,
                  value: email.email,
                });
              });
            }
            if (contact.hasOwnProperty('phoneNumbers') && contact.phoneNumbers.length > 0) {
              contactData['contact_phone'] = [];
              contact.phoneNumbers.map((phoneNumber, idx) => {
                contactData['contact_phone'].push({
                  key: `contact_phone_${idx}`,
                  value: phoneNumber.number,
                });
              });
            }
            importContactsList.push(contactData);
          }
        });
        setImportContacts(importContactsList);
      };
    } catch (error) {
      setError(error);
    };
  }, []);

  return {
    data: importContacts.reverse(),
    error,
    isLoading: loading,
  }
};
export default useImportContacts;