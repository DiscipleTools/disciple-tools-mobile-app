import React, { useRef } from "react";

import Card from "components/Card/Card";
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";

const ExpandableCard = ({
  border,
  center,
  title,
  count,
  renderPartialCard,
  renderExpandedCard,
}) => {
  // NOTE: no need to check RTL bc I18NManager.isRTL is auto-handling it via "flexDirection: row" in TitleBar
  if (count) title = `${title} (${count})`;

  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = `expandable_card_${title ?? ""}_modal`;
  const defaultIndex = getDefaultIndex();

  return (
    <>
      <Card
        border={border}
        center={center}
        title={title}
        body={renderPartialCard()}
        onPress={() => modalRef.current?.present()}
      />
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={title}
        defaultIndex={defaultIndex}
      >
        {renderExpandedCard()}
      </ModalSheet>
    </>
  );
};
export default ExpandableCard;
