import React from "react";

import Card from "components/Card/Card";
import SheetHeader from "components/Sheet/SheetHeader";

import useBottomSheet from "hooks/use-bottom-sheet";

const ExpandableCard = ({
  border,
  center,
  title,
  count,
  renderPartialCard,
  renderExpandedCard,
}) => {

  const { expand } = useBottomSheet();

  const showSheet = () => {
    expand({
      renderHeader: () => (
        <SheetHeader
          expandable
          dismissable
          title={title}
        />
      ),
      renderContent: () => (
        <>
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