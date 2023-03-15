import React, { useRef } from "react";

import { SortIcon } from "components/Icon";
import ModalSheet from "components/Sheet/ModalSheet";
import SortSheet from "components/Sheet/SortSheet";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

const Sort = ({ filter, onFilter }) => {
  const { globalStyles } = useStyles();
  const { i18n } = useI18N();
  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = `sort_${filter?.ID ?? ""}_modal`;
  const defaultIndex = 3;
  const title = i18n.t("global.sortBy");
  return (
    <>
      <SortIcon
        onPress={() => modalRef.current?.present()}
        style={globalStyles.icon}
      />
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={title}
        defaultIndex={defaultIndex}
      >
        <SortSheet filter={filter} onFilter={onFilter} />
      </ModalSheet>
    </>
  );
};
export default Sort;
