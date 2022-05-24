import React from "react";

import SelectSheet from "./SelectSheet";

import useAPI from "hooks/use-api";
import useI18N from "hooks/use-i18n";
import useMyUser from "hooks/use-my-user";

const LanguageSheet = () => {
  const { data: userData } = useMyUser();
  const { updateUser } = useAPI();

  const { i18n, locale, setLocale } = useI18N();

  // ITEMS
  const items = i18n?.translations;

  // ON CHANGE
  const _onChange = (newValue) => {
    const newLocale = newValue?.key;
    if (newLocale) {
      // set locale remotely
      if (userData?.locale !== newLocale) updateUser({ locale: newLocale });
      // set locale locally
      setLocale(newLocale);
    }
  };

  // MAP ITEMS
  const mapItems = (items) => {
    return Object.keys(items).map((key) => ({
      key,
      label: items[key]?.endonym,
      selected: locale === key,
    }));
  };

  // SECTIONS
  const sections = [{ data: mapItems(items) }];

  return <SelectSheet required sections={sections} onChange={_onChange} />;
};
export default LanguageSheet;
