import React, { useState, useLayoutEffect, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
//import { useIsFocused } from "@react-navigation/native";

//import { Html5Entities } from 'html-entities';

import {
  ReadIcon,
  ReadAllIcon,
  UnreadIcon,
  CommentIcon,
  CommentAlertIcon,
  MentionIcon,
} from "components/Icon";
import { HeaderRight } from "components/Header/Header";
import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import PostItemSkeleton from "components/Post/PostItem/PostItemSkeleton";

import useFilter from "hooks/use-filter";
import useHaptics from "hooks/use-haptics";
import useI18N from "hooks/use-i18n";
//import useMyUser from 'hooks/use-my-user.js';
import useNotifications from "hooks/use-notifications";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import { NotificationActionConstants, ScreenConstants } from "constants";

import { parseDateShort, truncate } from "utils";

import { localStyles } from "./NotificationsScreen.styles";

const NotificationsScreen = ({ navigation }) => {
  // TODO: constant
  const DEFAULT_LIMIT = 1000;

  const { vibrate } = useHaptics();
  const { i18n } = useI18N();
  const tabBarHeight = useBottomTabBarHeight();
  const { styles, globalStyles } = useStyles(localStyles);
  const { getTabScreenFromType } = useType();

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const { defaultFilter, filter, onFilter, search, onSearch } = useFilter();

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    markViewed,
    markUnread,
  } = useNotifications({ search, filter, offset, limit });

  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems(data);
  }, [search, filter]);

  //const { userData, error: userError } = useMyUser();

  // TODO: custom useHeaderLayoutEffect hook for reuse
  useLayoutEffect(() => {
    const kebabItems = [
      {
        label: i18n.t("global.viewOnWeb"),
        urlPath: "notifications",
      },
      {
        label: i18n.t("global.documentation"),
        url: "https://disciple.tools/user-docs/disciple-tools-mobile-app/how-to-use/notifications-screen/",
      },
    ];
    navigation.setOptions({
      headerRight: (props) => {
        return (
          <View style={globalStyles.rowContainer}>
            <ReadAllIcon
              style={globalStyles.selectedIcon}
              onPress={markAllRead}
            />
            <HeaderRight kebabItems={kebabItems} props />
          </View>
        );
      },
    });
  });

  const markAllRead = () => {
    markViewed();
    let newItems = items.map((item) => ({ ...item, is_new: "0" }));
    setItems(newItems);
  };

  const NotificationItem = ({ item, loading, mutate }) => {
    const [isNew, setIsNew] = useState(item?.is_new === "1" ? true : false);

    if (!item || loading) return <PostItemSkeleton />;
    const str1 = item?.notification_note?.search("<");
    const str2 = item?.notification_note?.search(">");
    const str3 = item?.notification_note?.length - 4;
    const newNotificationNoteA = item?.notification_note?.substr(0, str1);
    const newNotificationNoteB = item?.notification_note?.substr(str2, str3);
    const str4 = newNotificationNoteB?.search("<") - 1;
    const newNotificationNoteC = newNotificationNoteB?.substr(1, str4);
    let entityLink = item?.notification_note?.substring(
      item?.notification_note?.lastIndexOf('href="') + 6,
      item?.notification_note?.lastIndexOf('">')
    );
    let id = entityLink?.split("/")[4];
    let type = entityLink?.split("/")[3];
    // TODO
    //const entities = new Html5Entities();
    const name = item?.notification_name;
    const action = item?.notification_action;

    const NotificationIcon = () => {
      const renderIcon = () => {
        if (item?.notification_action == NotificationActionConstants.COMMENT)
          return <CommentIcon />;
        if (item?.notification_action == NotificationActionConstants.ALERT)
          return <CommentAlertIcon />;
        if (item?.notification_action == NotificationActionConstants.MENTION)
          return <MentionIcon />;
        return null;
      };
      return (
        <View style={[globalStyles.rowIcon, styles.startIcon]}>
          {renderIcon()}
        </View>
      );
    };

    const NotificationDetails = () => (
      <View style={globalStyles.columnContainer}>
        <View style={[globalStyles.rowContainer, styles.notificationDetails]}>
          {/*<Text>{entities.decode(newNotificationNoteA)}</Text>*/}
          <Text>{truncate(newNotificationNoteA, { maxLength: 35 })}</Text>
          <Pressable
            onPress={() => {
              const tabScreen = getTabScreenFromType(type);
              navigation.jumpTo(tabScreen, {
                screen: ScreenConstants.DETAILS,
                id,
                name: item?.post_title,
                type,
              });
            }}
          >
            <Text style={globalStyles.link}>
              {truncate(newNotificationNoteC, { maxLength: 35 })}
              {/*entities.decode(newNotificationNoteC)*/}
            </Text>
          </Pressable>
        </View>
        <View>
          {item?.pretty_time?.[0] ? (
            <Text style={globalStyles.caption}>
              {item.pretty_time[0]}
              {item.pretty_time?.[1] ? `, ${item.pretty_time[1]}` : ""}
            </Text>
          ) : (
            <Text style={globalStyles.caption}>
              {parseDateShort(item?.date_notified)}
            </Text>
          )}
        </View>
      </View>
    );

    const NotificationButton = () => (
      <Pressable
        onPress={() => {
          vibrate();
          const id = item?.id;
          if (id) {
            if (isNew) {
              markViewed({ id });
              setIsNew(false);
              return;
            }
            markUnread({ id });
            setIsNew(true);
            return;
          }
        }}
        style={[globalStyles.rowIcon, styles.markIcon]}
      >
        {isNew ? (
          <UnreadIcon />
        ) : (
          <ReadIcon style={globalStyles.selectedIcon} />
        )}
      </Pressable>
    );

    return (
      <View style={[globalStyles.rowContainer, styles.container(isNew)]}>
        <View
          style={{
            flex: 1,
          }}
        >
          <NotificationIcon />
        </View>
        <View
          style={{
            flex: 6,
          }}
        >
          <NotificationDetails />
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
          }}
        >
          <NotificationButton />
        </View>
      </View>
    );
  };

  // NOTE: wrap in empty view, otherwise `react-native-swipe-view` requires React.forwardRef
  const renderItem = ({ item }) => (
    <>
      <NotificationItem item={item} loading={isLoading} mutate={mutate} />
    </>
  );

  // TODO: reusable component
  const ListSkeleton = () =>
    Array(10)
      .fill(null)
      .map((_, ii) => <PostItemSkeleton key={ii} />);

  if (!items) return <ListSkeleton />;
  return (
    <View style={[globalStyles.container(tabBarHeight)]}>
      <OfflineBar />
      <FilterList
        display
        //sortable
        items={items}
        renderItem={renderItem}
        //renderHiddenItem={renderHiddenItem}
        keyExtractor={(item) => item?.id?.toString()}
        search={search}
        onSearch={onSearch}
        defaultFilter={defaultFilter}
        filter={filter}
        onFilter={onFilter}
        onRefresh={mutate}
        //leftOpenValue={Constants.SWIPE_BTN_WIDTH * Constants.NUM_SWIPE_BUTTONS_LEFT}
        //rightOpenValue={Constants.SWIPE_BTN_WIDTH * Constants.NUM_SWIPE_BUTTONS_RIGHT}
      />
    </View>
  );
};
export default NotificationsScreen;
