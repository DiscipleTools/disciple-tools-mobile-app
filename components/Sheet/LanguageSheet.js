import React from "react";

import SelectSheet from "./SelectSheet";

import useAPI from "hooks/use-api";
import useI18N from "hooks/use-i18n";
import useMyUser from "hooks/use-my-user";

const LanguageSheet = ({ availableTranslations }) => {
  const { data: userData } = useMyUser();
  const { updateUser } = useAPI();

  const { i18n, locale, setLocale } = useI18N();

  /*
   * NOTE: we filter languages unsupported by D.T API here rather than in the
   * 'use-i18n' hook for performance reasons. Plus, this is where it matters
   * most since the user is switching and we attempt to update the API.
   */
  const getSupportedTranslations = () => {
    const supportedTranslations = {};
    for (const translation of Object.keys(i18n.translations)) {
      if (availableTranslations?.includes(translation)) {
        supportedTranslations[translation] = i18n.translations[translation];
      }
    }
    return supportedTranslations;
  };

  // ITEMS
  const items = getSupportedTranslations();

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
