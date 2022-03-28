import React from "react";

import ConnectionSheet from "./ConnectionSheet";

import useFilter from "hooks/use-filter";
import useList from "hooks/use-list";

import { TypeConstants } from "constants";

const GroupsSheet = ({ id, values, onChange }) => {

  const { search, onSearch } = useFilter();

  // exclude currently selected values from options list
  const exclude = values?.map(item => item?.value);
  // exclude the the current post (ie, contact or group)
  if (id) exclude.push(id);

  const { data: items, error, isLoading, isValidating, mutate } = useList({ search, exclude, type: TypeConstants.GROUP });
  if (!items) return [];

  //const renderItem = (item) => null;

  return(
    <ConnectionSheet
      title={title}
      items={items}
      //renderItem={renderItem}
      values={values}
      onChange={onChange}
      search={search}
      onSearch={onSearch}
    />
  );
};
export default GroupsSheet;
