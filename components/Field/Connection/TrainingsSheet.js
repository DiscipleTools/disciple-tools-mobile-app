import React from "react";

import ConnectionSheet from "./ConnectionSheet";

import useFilter from "hooks/use-filter";
//import useTrainings from "hooks/use-trainings";

const GroupsSheet = ({ id, values, onChange }) => {

  const { search, onSearch } = useFilter();

  // exclude currently selected values from options list
  const exclude = values?.map(item => item?.value);
  // exclude the the current post (ie, contact or group)
  if (id) exclude.push(id);

  //const items = useTrainings({ search, exclude });
  const items = [];
  if (!items) return null;

  //const renderItem = (item) => null;

  return(
    <ConnectionSheet
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