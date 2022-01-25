import React, { forwardRef, useCallback, useMemo, useReducer, useRef, useState } from "react";

import SelectSheet from "components/Sheets/SelectSheet";

const FilterSheet = forwardRef((props, ref) => {

  const { filter, onFilter } = props;

  const onDismiss = () => ref.current.close();
  const onDone = () => {
    // onFilter();
  };
  const snapPoints = useMemo(() => ['50%', '95%'], []);
  const items = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => ({
          key: index,
          label: `index-${index}`,
          selected: index % 2 === 0 ? true : false,
        })),
    []
  );

  const renderItem = useCallback(
    (item) => (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );

  return(
    <SelectSheet
      ref={ref}
      snapPoints={snapPoints}
      items={items}
      renderItem={renderItem}
      onDismiss={onDismiss}
      onDone={onDone}
    />
  );
});
export default FilterSheet;
