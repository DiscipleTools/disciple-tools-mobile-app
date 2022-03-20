import React from "react";

import Card from "components/Card/Card";
import SheetHeader from "components/Sheet/SheetHeader";

import useBottomSheet from "hooks/use-bottom-sheet";
import useI18N from "hooks/use-i18n";

const ExpandableCard = ({
  border,
  center,
  title,
  count,
  renderPartialCard,
  renderExpandedCard,
}) => {

  const { isRTL } = useI18N();
  const { expand } = useBottomSheet();

  const showSheet = () => {
    expand({
      snapPoints: ['66%','95%'],
      renderContent: () => (
        <>
          <SheetHeader
            expandable
            dismissable
            title={title}
          />
          {renderExpandedCard()}
        </>
      )
    });
  };

  // NOTE: no need to check RTL bc I18NManager.isRTL is auto-handling it via "flexDirection: row" in TitleBar
  if (count) title = `${title} (${count})`;
  return (
    <Card
      border={border}
      center={center}
      title={title}
      body={renderPartialCard()}
      onPress={() => showSheet()}
    />
  );
};
export default ExpandableCard;