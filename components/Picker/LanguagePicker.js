import React, { useRef } from "react";

import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import LanguageSheet from "components/Sheet/LanguageSheet";
import Picker from "components/Picker/Picker";

import { TranslateIcon } from "components/Icon";

import useI18N from "hooks/use-i18n";
import useSettings from "hooks/use-settings";

const LanguagePicker = () => {
  const { i18n, selectedEndonym } = useI18N();
  const { settings } = useSettings();
  let availableTranslations = settings?.available_translations?.map(
    (translation) => translation?.language
  );
  if (!availableTranslations) {
    availableTranslations = Object.keys(i18n.translations);
  };
  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = `language_modal`;
  const defaultIndex =  getDefaultIndex();
  return (
    <>
      <Picker
        icon={<TranslateIcon />}
        label={selectedEndonym}
        onOpen={() => modalRef.current?.present()} 
      />
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={i18n.t("global.language")}
        defaultIndex={defaultIndex}
      >
        <LanguageSheet availableTranslations={availableTranslations} />
      </ModalSheet>
    </>
  );
};
export default LanguagePicker;
