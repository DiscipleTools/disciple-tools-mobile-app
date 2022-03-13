import React from "react";

import Picker from "components/Picker/Picker";

import { TranslateIcon } from "components/Icon";
import LanguageSheet from "components/Sheet/LanguageSheet";

import useBottomSheet from "hooks/use-bottom-sheet";
import useI18N from "hooks/use-i18n";

const LanguagePicker = () => {
  const { selectedEndonym } = useI18N();
  const { expand, snapPoints } = useBottomSheet();
  const showLanguageSheet = () => {
    expand({
      index: 0,
      snapPoints,
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