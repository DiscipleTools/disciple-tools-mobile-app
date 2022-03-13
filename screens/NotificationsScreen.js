import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { useIsFocused } from '@react-navigation/native';

//import { Html5Entities } from 'html-entities';

import {
  CheckIcon,
  CircleOutlineIcon,
  CommentIcon,
  CommentAlertIcon,
  MentionIcon
} from "components/Icon";
import FilterList from "components/FilterList";
import OfflineBar from "components/OfflineBar";
import SelectSheet from "components/Sheet/SelectSheet";
//import { HelpSheet } from "components/Sheet/ModalSheet";
import { PostItemSkeleton } from "components/Post/PostItem/index";

import useFilter from "hooks/use-filter";
//import useI18N from "hooks/use-i18n";
import useNotifications from "hooks/use-notifications";
//import useMyUser from 'hooks/use-my-user.js';
import useStyles from "hooks/use-styles";

import { NotificationActionConstants } from "constants";

import { localStyles } from "./NotificationsScreen.styles";

const NotificationsScreen = ({ navigation }) => {

  const DEFAULT_LIMIT = 10;

  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();

  const { styles, globalStyles } = useStyles(localStyles);
  //const { i18n, isRTL } = useI18N();
  const { defaultFilter, filter, onFilter, search, onSearch } = useFilter();
  const { data: items, error, isLoading, isValidating, mutate } = useNotifications({ search, filter });
  /*
  const [_notifications, _setNotifications] = useState(items ?? []);
  useEffect(() => {
    if (_notifications?.length !== notifications?.length) _setNotifications(notifications);
  }, [notifications]);
  */
  //const { userData, error: userError } = useMyUser();
  const userData = null;

  const [isAll, setIsAll] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10); // fails: useState(DEFAULT_LIMIT);

  const NotificationItem = ({ item }) => {
    const str1 = item?.notification_note?.search("<");
    const str2 = item?.notification_note?.search(">");
    const str3 = item?.notification_note?.length-4;
    const newNotificationNoteA = item?.notification_note?.substr(0, str1);
    const newNotificationNoteB = item?.notification_note?.substr(
      str2,
      str3
    );
    const str4 = newNotificationNoteB?.search("<")-1;
    const newNotificationNoteC = newNotificationNoteB?.substr(1, str4);
    let entityLink = item?.notification_note?.substring(
      item?.notification_note?.lastIndexOf('href="')+6,
      item?.notification_note?.lastIndexOf('">')
    );
    let entityId = entityLink?.split("/")[4];
    let entityName = entityLink?.split("/")[3];
    // TODO
    //const entities = new Html5Entities();
    const isNew = item?.is_new === "1" ? true : false;
    const name = item?.notification_name;
    const action = item?.notification_action;

    const parseDate = (dateStr) => {
      try {
        const today = new Date();
        //const parsedDateMS = Date.parse(dateStr?.trim());
        const parsedDateMS = Date.parse(dateStr?.trim()?.split(' ')[0]);
        const diffMS = today - parsedDateMS;
        const aDay = 24*60*60*1000;
        const isToday = diffMS < aDay;
        const diffDays = Math.floor(diffMS/aDay);
        if (isNaN(diffDays)) return null;
        // TODO: translate
        if (isToday) return "today";
        return `${ diffDays }d`
      } catch (error) {
        return null;
      };
    };

    const NotificationIcon = () => {
      const renderIcon = () => {
        if (item?.notification_action == NotificationActionConstants.COMMENT) return <CommentIcon />;
        if (item?.notification_action == NotificationActionConstants.ALERT) return <CommentAlertIcon />;
        if (item?.notification_action == NotificationActionConstants.MENTION) return <MentionIcon />;
        return null;
      };
      return(
        <View style={[
          globalStyles.rowIcon,
          styles.startIcon
        ]}>
          { renderIcon() }
        </View>
      );
    };

    const NotificationDetails = () => (
      <View style={globalStyles.columnContainer}>
          <View style={[
            globalStyles.rowContainer,
            styles.notificationDetails
          ]}>
            {/*<Text>{entities.decode(newNotificationNoteA)}</Text>*/}
            <Text>{newNotificationNoteA}</Text>
            <Text
              style={styles.link}
              onPress={() =>
                redirectToDetailView(
                  entityName,
                  entityId,
                  newNotificationNoteC
                )
              }
            >
              {newNotificationNoteC}
              {/*entities.decode(newNotificationNoteC)*/}
            </Text>
          </View>
        <View>
          { item?.pretty_time?.[0] ? (
            <Text style={globalStyles.caption}>
              {item.pretty_time[0]}
              {item.pretty_time?.[1] ? `, ${ item.pretty_time[1] }` : ""}
            </Text>
          ) : (
            <Text style={globalStyles.caption}>
              {parseDate(item?.date_notified)}
            </Text>
          )}
        </View>
      </View>
    );

    const NotificationButton = () => (
      <View style={[
        globalStyles.rowIcon,
        styles.endIcon
      ]}>
        <Pressable onPress={() => {
          if (isNew) {
            console.log("*** MARK AS READ ***");
            console.log(`item: ${ JSON.stringify(item) }`);
          } else {
            console.log("*** MARK AS UNREAD ***");
            console.log(`item: ${ JSON.stringify(item) }`);
          }
        }}>
          { isNew ? (
            <CircleOutlineIcon />
          ) : (
            <CheckIcon style={globalStyles.selectedIcon} />
          )}
        </Pressable>
      </View>
    );

    return (
      <View style={[
        globalStyles.rowContainer,
        styles.container(isNew),
      ]}>
        <NotificationIcon />
        <NotificationDetails />
        <NotificationButton />
      </View>
    );
  };

  const toggleReadUnread = async (notification, isNew) =>
    isNew
      ? await markViewed(notification?.id)
      : await markUnread(notification?.id);

  const redirectToDetailView = (viewName, entityId, entityTitle) => {
    let view, prop;
    switch (viewName) {
      case "contacts":
        view = "ContactDetail";
        prop = "contact";
        break;
      case "groups":
        view = "GroupDetail";
        prop = "group";
        break;
      default:
    }
    navigation.push(view, {
      [`${prop}Id`]: entityId,
      onlyView: true,
      [`${prop}Name`]: entityTitle,
      fromNotificationView: true,
    });
  };

  const renderItem = ({ item }) => {
    /*
    console.log("**********************************");
    console.log(`post_id: ${ item?.post_id}`)
    console.log(`action: ${ item?.notification_action}`)
    console.log(`field_key: ${ item?.field_key}`)
    console.log(`is_new: ${ item?.is_new}`)
    */
    return <NotificationItem item={item} />;
  };

  /*
  const unreadNotifications = notifications?.filter((notification) => {
    if (notification.is_new === "1") return notification;
  });
  */

  const bottomSheetRefSort = useRef(null);
  const bottomSheetRefFilter = useRef(null);
  const showSort = () => bottomSheetRefSort.current.expand();
  //const showFilter = () => bottomSheetRefFilter.current.snapToIndex(1);
  const showFilter = () => bottomSheetRefFilter.current.snapToIndex(0);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
      />
    ), []);

  const SortSheet = () => {
    const onClose = () => bottomSheetRefSort.current.close();
    const onSnap = useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);
    const snapPoints = useMemo(() => ['33%'], []);
    return(
      <BottomSheet
        ref={bottomSheetRefSort}
        index={-1}
        snapPoints={snapPoints}
        onChange={onSnap}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        //detached={true}
        // add bottom inset to elevate the sheet
        //bottomInset={50}
      >
        <View style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: 20,
        }}>
          <Text>Sort 🎉</Text>
          <Button title="Dismiss" onPress={() => onClose()} />
        </View>
      </BottomSheet>
    );
  };

  //const FilterSheet = () => <HelpSheet ref={bottomSheetRefFilter} />;

  const FilterSheet = () => {
    const onDismiss = () => bottomSheetRefFilter.current.close();
    const onDone = () => {
      console.log('onDone');
    };
    const onSnap = useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);
    const snapPoints = useMemo(() => ['25%', '50%', '95%'], []);
    const items = useMemo(
      () =>
        Array(50)
          .fill(0)
          .map((_, index) => ({
            key: index,
            label: `index-${index}`,
            selected: index % 2 === 0 ? true : false,
          })),
      []
    );

    const renderItem = useCallback(
      (item) => (
        <View key={item} style={styles.itemContainer}>
          <Text>{item}</Text>
        </View>
      ),
      []
    );

    return(
      <SelectSheet
        ref={bottomSheetRefFilter}
        snapPoints={snapPoints}
        onSnap={onSnap}
        items={items}
        renderItem={renderItem}
        onDismiss={onDismiss}
        onDone={onDone}
      />
    );
  };

  const ListSkeleton = () => Array(10).fill(null).map((_, ii) => <PostItemSkeleton key={ii} />);

  /*
  {
    "id":"963",
    "user_id":"2237",
    "source_user_id":"637",
    "post_id":"119",
    "secondary_item_id":"424",
    "notification_name":"mention",
    "notification_action":"mentioned",
    "notification_note":"Mike Allbutt mentioned you on <a href=\"https://dtdemo.disciple.tools/contacts/119\">Mike Allbutt</a> saying: \r\n\r\n @Some1 hi3",
    "date_notified":"2021-03-19 23:11:52",
    "is_new":"0",
    "channels":null,
    "field_key":"comments",
    "field_value":"",
    "post_title":"Mike Allbutt",
    "pretty_time":["11 months ago","03/19/2021"]
  }
  */
  if (!items) return null;
  return (
    <>
      <OfflineBar />
      {!items ? (
        <ListSkeleton />
      ) : (
        <>
          <FilterList
            display
            sortable
            items={items}
            renderItem={renderItem}
            //renderHiddenItem={renderHiddenItem}
            search={search}
            onSearch={onSearch}
            defaultFilter={defaultFilter}
            filter={filter}
            onFilter={onFilter}
            onRefresh={mutate}
            //leftOpenValue={Constants.SWIPE_BTN_WIDTH * Constants.NUM_SWIPE_BUTTONS_LEFT}
            //rightOpenValue={Constants.SWIPE_BTN_WIDTH * Constants.NUM_SWIPE_BUTTONS_RIGHT}
          />
        </>
      )}
    </>
  );
};
export default NotificationsScreen;