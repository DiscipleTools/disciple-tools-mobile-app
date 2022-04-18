import React from "react";

import SheetHeader from "components/Sheet/SheetHeader";
import Picker from "components/Picker/Picker";

import { TranslateIcon } from "components/Icon";
import LanguageSheet from "components/Sheet/LanguageSheet";

import useBottomSheet from "hooks/use-bottom-sheet";
import useI18N from "hooks/use-i18n";

const LanguagePicker = () => {
  const { i18n, selectedEndonym } = useI18N();
  const { expand } = useBottomSheet();
  const showLanguageSheet = () => {
    expand({
      renderHeader: () => <SheetHeader expandable dismissable title={i18n.t("global.language")} />,
      renderContent: () => <LanguageSheet />,
    });
  };
  return(
    <Picker
      icon={<TranslateIcon />}
      label={selectedEndonym}
      onOpen={() => showLanguageSheet()}
    />
  );
};
export default LanguagePicker;