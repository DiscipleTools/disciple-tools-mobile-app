import React from "react";

import SelectSheet from "components/Sheets/SelectSheet";
import SheetHeader from "components/Sheets/SheetHeader";

const SortConstants = {
  LAST_MOD_ASC: "sort_last_mod_asc",
  LAST_MOD_DESC: "sort_last_mod_desc",
  CREATED_ASC: "sort_created_asc",
  CREATED_DESC: "sort_created_desc",
};

const ZZSortConstants = {
  LAST_MOD_ASC: "-last_modified",
  LAST_MOD_DESC: "last_modified",
  CREATED_ASC: "-post_date",
  CREATED_DESC: "post_date",
};

// NOTE: need to pass these props in vs. useFilter()
const SortSheet = ({ items, setItems, filter, onFilter }) => {

  const sortKey = filter?.query?.sort;
  const sections = [
    {
      title: "Last Modified Date",
      data: [
        {
          key: ZZSortConstants.LAST_MOD_ASC,
          // TODO: translate
          label: "Most Recent",
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'sort-ascending',
          },
          selected: ZZSortConstants.LAST_MOD_ASC === sortKey,
        },
        {
          key: ZZSortConstants.LAST_MOD_DESC,
          // TODO: translate
          label: "Least Recent",
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'sort-descending',
          },
          selected: ZZSortConstants.LAST_MOD_DESC === sortKey,
        },
      ]
    },
    {
      title: "Created Date",
      data: [
        {
          key: ZZSortConstants.CREATED_ASC,
          // TODO: translate
          label: "Newest",
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'sort-ascending',
          },
          selected: ZZSortConstants.CREATED_ASC === sortKey,
        },
        {
          key: ZZSortConstants.CREATED_DESC,
          // TODO: translate
          label: "Oldest",
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'sort-descending',
          },
          selected: ZZSortConstants.CREATED_DESC === sortKey,
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
    // NOTE: copy the array so we do not mutate the original inplace
    const sortedItems = [...items].sort((a,b) =>  asc ? a[sortKey]-b[sortKey] : b[sortKey]-a[sortKey]);
    setItems(sortedItems);
  };

  const onChange = (sortValue) => { //selectedKeys) => {
    /*
    // sort is mutually exclusive, so only select first
    let selectedKey = selectedKeys[0];
    // default to most recently modified, if none selected (should not happen)
    if (!selectedKey) selectedKey = SortConstants.LAST_MOD_ASC;
    sort(selectedKey);
    */
    if (filter?.query) {
      filter.query["sort"] = sortValue[0];
      onFilter(filter);
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
//<SheetFooterDone onDone={onDone} />
export default SortSheet;
