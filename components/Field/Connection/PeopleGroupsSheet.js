import React from "react";

import ConnectionSheet from "./ConnectionSheet";

import useFilter from "hooks/use-filter";
import usePeopleGroups from "hooks/use-people-groups";

const PeopleGroupsSheet = ({ title, values, onChange }) => {

  const { search, onSearch } = useFilter();

  // exclude currently selected values from options list
  const exclude = values?.map(item => item?.value);

  const items = usePeopleGroups({ search, exclude });
  if (!items) return null;

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
export default PeopleGroupsSheet;