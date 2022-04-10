import React from "react";

import { SortAscIcon, SortDescIcon } from "components/Icon";
import useI18N from "hooks/use-i18n";
import SelectSheet from "./SelectSheet";
import SheetHeader from "./SheetHeader";

import { SortConstants } from "constants";

const SortSheet = ({ items, setItems, filter, onFilter }) => {
  const { i18n } = useI18N();
  const sortKey = filter?.query?.sort;
  const sections = [
    {
      title: i18n.t("global.lastModifiedDate"),
      data: [
        {
          key: SortConstants.LAST_MOD_ASC,
          label: i18n.t("global.mostRecent"),
          icon: <SortAscIcon />,
          selected: SortConstants.LAST_MOD_ASC === sortKey,
        },
        {
          key: SortConstants.LAST_MOD_DESC,
          label: i18n.t("global.leastRecent"),
          icon: <SortDescIcon />,
          selected: SortConstants.LAST_MOD_DESC === sortKey,
        },
      ],
    },
    {
      title: i18n.t("global.createdDate"),
      data: [
        {
          key: SortConstants.CREATED_ASC,
          label: i18n.t("global.newest"),
          icon: <SortAscIcon />,
          selected: SortConstants.CREATED_ASC === sortKey,
        },
        {
          key: SortConstants.CREATED_DESC,
          label: i18n.t("global.oldest"),
          icon: <SortDescIcon />,
          selected: SortConstants.CREATED_DESC === sortKey,
        },
      ],
    },
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
    }
  };

  const sort = (selectedKey) => {
    const { asc, sortKey } = getSortParams(selectedKey);
    const sortedItems = [...items].sort((a, b) =>
      asc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    );
    setItems(sortedItems);
  };

  const onChange = (sortValue) => {
    if (sortValue?.key) {
      sort(sortValue.key);
      if (filter?.query?.sort) {
        const newFilter = filter;
        newFilter.query.sort = sortValue.key;
        onFilter(newFilter);
      }
    }
  };

  const title = i18n.t("global.sortBy");

  return (
    <>
      <SheetHeader expandable dismissable title={title} />
      <SelectSheet require sections={sections} onChange={onChange} />
    </>
  );
};
export default SortSheet;
