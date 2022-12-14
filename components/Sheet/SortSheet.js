import React from "react";

import {
  SortAscIconDate,
  SortDescIconDate,
  SortAscIconMod,
  SortDescIconMod
} from "components/Icon";
import SelectSheet from "./SelectSheet";

import useI18N from "hooks/use-i18n";
import useSettings from "hooks/use-settings";

import { SortConstants } from "constants";

const SortSheet = ({ items, setItems, filter, onFilter }) => {
  const { i18n } = useI18N();
  const { settings } = useSettings();

  // TODO: default to English in this way?
  const lastModifiedDateLabel =
    settings?.fields?.last_modified?.name ?? "Last Modified Date";
  const createdDateLabel = settings?.fields?.post_date?.name ?? "Created Date";

  const sortKey = filter?.query?.sort;

  const sections = [
    {
      title: lastModifiedDateLabel,
      data: [
        {
          key: SortConstants.LAST_MOD_DESC,
          label: i18n.t("global.newest"),
          icon: <SortDescIconMod />,
          selected: SortConstants.LAST_MOD_DESC === sortKey,
        },
        {
          key: SortConstants.LAST_MOD_ASC,
          label: i18n.t("global.oldest"),
          icon: <SortAscIconMod />,
          selected: SortConstants.LAST_MOD_ASC === sortKey,
        },
      ],
    },
    {
      title: createdDateLabel,
      data: [
        {
          key: SortConstants.CREATED_DESC,
          label: i18n.t("global.newest"),
          icon: <SortDescIconDate />,
          selected: SortConstants.CREATED_DESC === sortKey,
        },
        {
          key: SortConstants.CREATED_ASC,
          label: i18n.t("global.oldest"),
          icon: <SortAscIconDate />,
          selected: SortConstants.CREATED_ASC === sortKey,
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
  return <SelectSheet require sections={sections} onChange={onChange} />;
};
export default SortSheet;
