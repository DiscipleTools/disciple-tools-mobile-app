import React, { forwardRef, useMemo } from "react";

import SelectSheet from "components/Sheets/SelectSheet";

const SortConstants = {
  LAST_MOD_ASC: "sort_last_mod_asc",
  LAST_MOD_DESC: "sort_last_mod_desc",
  CREATED_ASC: "sort_created_asc",
  CREATED_DESC: "sort_created_desc",
};

const SortSheet = forwardRef((props, ref) => {

  const { items, setItems } = props;

  const sections = [
    {
      title: "Last Modified Date",
      data: [
        {
          key: SortConstants.LAST_MOD_ASC,
          // TODO: translate
          label: "Most Recent",
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'sort-ascending',
          },
          selected: true,
        },
        {
          key: SortConstants.LAST_MOD_DESC,
          // TODO: translate
          label: "Least Recent",
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'sort-descending',
          },
          selected: false,
        },
      ]
    },
    {
      title: "Created Date",
      data: [
        {
          key: SortConstants.CREATED_ASC,
          // TODO: translate
          label: "Newest",
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'sort-ascending',
          },
          selected: false,
        },
        {
          key: SortConstants.CREATED_DESC,
          // TODO: translate
          label: "Oldest",
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'sort-descending',
          },
          selected: false,
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

  const onChange = (selectedKeys) => {
    // sort is mutually exclusive, so only select first
    let selectedKey = selectedKeys[0];
    // default to most recently modified, if none selected (should not happen)
    if (!selectedKey) selectedKey = SortConstants.LAST_MOD_ASC;
    sort(selectedKey);
  };

  const snapPoints = useMemo(() => ['50%', '95%'], []);

  // TODO: translate
  const title = "Sort by";

  return(
    <SelectSheet
      ref={ref}
      //multiple={true}
      //required={required}
      snapPoints={snapPoints}
      title={title}
      sections={sections}
      onChange={onChange}
    />
  );
});
export default SortSheet;