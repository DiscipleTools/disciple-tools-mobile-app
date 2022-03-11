import React from "react";

import { SortAscIcon, SortDescIcon } from "components/Icon";
import SelectSheet from "./SelectSheet";
import SheetHeader from "./SheetHeader";

import { SortConstants } from "constants";

const SortSheet = ({ items, setItems, filter, onFilter }) => {

  const sortKey = filter?.query?.sort;
  const sections = [
    {
      title: "Last Modified Date",
      data: [
        {
          key: SortConstants.LAST_MOD_DESC,
          // TODO: translate
          label: "Most Recent",
          icon: <SortDescIcon />,
          selected: SortConstants.LAST_MOD_DESC === sortKey,
        },
        {
          key: SortConstants.LAST_MOD_ASC,
          // TODO: translate
          label: "Least Recent",
          icon: <SortAscIcon />,
          selected: SortConstants.LAST_MOD_ASC === sortKey,
        },
      ]
    },
    {
      title: "Created Date",
      data: [
        {
          key: SortConstants.CREATED_DESC,
          // TODO: translate
          label: "Newest",
          icon: <SortDescIcon />,
          selected: SortConstants.CREATED_DESC === sortKey,
        },
        {
          key: SortConstants.CREATED_ASC,
          // TODO: translate
          label: "Oldest",
          icon: <SortAscIcon />,
          selected: SortConstants.CREATED_ASC === sortKey,
        },
      ]
    }
  ];

  const getSortParams = (selectedKey) => {
    switch (selectedKey) {
      case SortConstants.LAST_MOD_ASC:
        return { asc: true, sortKey: "last_modified" };
      case SortConstants.LAST_MOD_DESC:
        return { asc: false, sortKey: "last_modified" };
      case SortConstants.CREATED_ASC:
        return { asc: true, sortKey: "post_date" };
      case SortConstants.CREATED_DESC:
        return { asc: false, sortKey: "post_date" };
      default:
        return "last_modified";
    };
  };
 
  const sort = (selectedKey) => {
    const { asc, sortKey } = getSortParams(selectedKey);
    const sortedItems = [...items].sort((a,b) =>  asc ? a[sortKey]-b[sortKey] : b[sortKey]-a[sortKey]);
    setItems(sortedItems);
  };

  const onChange = (sortValue) => {
    if (sortValue?.key) {
      sort(sortValue.key);
      if (filter?.query?.sort) {
        const newFilter = filter;
        newFilter.query.sort = sortValue.key;
        onFilter(newFilter);
      };
    };
  };

  // TODO: translate
  const title = "Sort by";

  return(
    <>
      <SheetHeader
        expandable
        dismissable
        title={title}
      />
      <SelectSheet
        require
        sections={sections}
        onChange={onChange}
      />
    </>
  );
};
export default SortSheet;
