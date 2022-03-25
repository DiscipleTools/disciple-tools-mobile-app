import React, { useCallback, useMemo, useReducer, useRef, useState } from "react";

//import useNetwork from "hooks/use-network";
import useType from "hooks/use-type";
import useRequest from "hooks/use-request";

import { NotificationActionConstants } from "constants";

const useFilters = ({ type } = {}) => {

  //const { isConnected } = useNetwork();
  const { isPost, isNotification, isCommentsActivity, postType } = useType({ type });

  const url = isPost ? `/dt/v1/users/get_filters?post_type=${postType}&force_refresh=1` : null;
  let { data, error, isLoading, isValidating, mutate } = useRequest({ url });

  if (isCommentsActivity) data = [
    {
      title: "Type",
      //count: 1350,
      content: [
        {
          ID: "comments_activity_type_all",
          //count: 1350,
          name: "All",
          query: null,
          subfilter: false
        },
        {
          ID: "comments_activity_type_comments_only",
          //count: 450,
          name: "Comments",
          query: {
            key: "comment_ID",
          },
          subfilter: false
        },
        {
          ID: "comments_activity_type_activity_only",
          //count: 850,
          name: "Activity",
          query: {
            key: "histid",
          },
          subfilter: false
        },
        /*
        {
          ID: "comments_activity_type_facebook_only",
          //count: 50,
          name: "Facebook",
          query: null,
          subfilter: false
        }
        */
      ]
    }
  ];

  if (isNotification) data = [
    {
      title: "Status",
      //count: 99,
      content: [
        {
          ID: "notifications_status_all",
          //count: 99,
          name: "All",
          query: null,
          subfilter: false 
        },
        {
          ID: "notifications_status_unread",
          //count: 76,
          name: "Unread only",
          query: {
            key: "is_new",
            value: "1"
          },
          subfilter: false
        },
        {
          ID: "notifications_status_read",
          //count: 23,
          name: "Read only",
          query: {
            key: "is_new",
            value: "0"
          },
          subfilter: false
        }
      ]
    },
    {
      title: "Type",
      //count: 99,
      content: [
        {
          ID: NotificationActionConstants.MENTION,
          //count: 99,
          name: "Mention",
          query: {
            key: "notification_action",
            value: NotificationActionConstants.MENTION
          },
          subfilter: false 
        },
        {
          ID: NotificationActionConstants.ALERT,
          //count: 19,
          name: "Alert",
          query: {
            key: "notification_action",
            value: NotificationActionConstants.ALERT
          },
          subfilter: false
        },
        {
          ID: NotificationActionConstants.COMMENT,
          //count: 19,
          name: "Comment",
          query: {
            key: "notification_action",
            value: NotificationActionConstants.COMMENT
          },
          subfilter: false
        }
      ]
    }
  ];

  const mapCustomFiltersByTab = (customFilters, tab) => {
    const mappedCustomFilters = [];
    customFilters?.filters.forEach((filter) => {
      if (filter?.tab === tab) {
        const ID = filter?.ID ?? null;
        const name = filter?.name ?? "";
        const count = filter?.count ?? 0;
        const subfilter = filter?.subfilter ?? false;
        const query = filter?.query ?? {};
        mappedCustomFilters.push({
          ID,
          name,
          count,
          subfilter,
          query,
        });
      };
    });
    return mappedCustomFilters;
  };

  const mapCustomFilters = (customFilters) => {
    const mappedCustomFilters = [];
    customFilters?.tabs.forEach((tab) => {
      const key = tab?.key ?? null;
      const title = tab?.label ?? "";
      let content = [];
      if (title) content = mapCustomFiltersByTab(customFilters, key);
      mappedCustomFilters.push({
        title,
        count: 0,
        content,
      });
    });
    return mappedCustomFilters;
  };

  const filters = data?.filters?.length > 0 ? mapCustomFilters(data) : data;
  return {
    data: filters,
    error,
    isLoading,
    isValidating,
    mutate
  };
};
export default useFilters;
