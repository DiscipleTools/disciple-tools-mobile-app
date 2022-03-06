import React, { useEffect, useMemo, useState } from "react";

import { SortIcon } from "components/Icon";
import SortSheet from "components/Sheet/SortSheet";

import useBottomSheet from "hooks/useBottomSheet";
import useFilter from "hooks/useFilter";
import useStyles from "hooks/useStyles";

const Sort = () => {
  const { globalStyles } = useStyles();
  const { expand, collapse, snapPoints } = useBottomSheet();
  const { items, setItems, filter, onFilter } = useFilter();

  const sortSheetContent = useMemo(() => (
    <SortSheet
      items={items}
      setItems={setItems}
      filter={filter}
      onFilter={onFilter}
    />
  ), [items, filter]);

  const showSort = (show) => show ? expand({
    index: 1,
    snapPoints,
    multi: false,
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