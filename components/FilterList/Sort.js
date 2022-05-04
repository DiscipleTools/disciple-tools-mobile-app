import React, { useEffect, useMemo, useState } from "react";

import { SortIcon } from "components/Icon";
import SortSheet from "components/Sheet/SortSheet";

import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";

const Sort = ({ items, setItems, filter, onFilter }) => {
  const { globalStyles } = useStyles();
  const { expand, collapse, snapPoints } = useBottomSheet();

  const sortSheetContent = useMemo(() => (
    <SortSheet
      items={items}
      setItems={setItems}
      filter={filter}
      onFilter={onFilter}
    />
  ), [items, filter]);

  const showSort = (show) => show ? expand({
    defaultIndex: 2,
    renderContent: () => sortSheetContent
  }) : collapse();

  return(
    <SortIcon
      style={globalStyles.icon}
      onPress={() => showSort(true)}
    />
  );
};
export default Sort;