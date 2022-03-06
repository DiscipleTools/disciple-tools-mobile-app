import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Button,
  View,
  Text,
} from "react-native";
import { Icon } from "native-base";

import { Container } from "native-base";
//import { Html5Entities } from 'html-entities';

import FilterList from "components/FilterList";
import OfflineBar from "components/OfflineBar";
import SelectSheet from "components/Sheet/SelectSheet";
import { HelpSheet } from "components/Sheet/ModalSheet";

import useI18N from "hooks/useI18N";
import useNotifications from "hooks/useNotifications.js";
//import useMyUser from 'hooks/useMyUser.js';
import useStyles from "hooks/useStyles";

import { localStyles } from "./NotificationsScreen.styles";

const NotificationsScreen = ({ navigation }) => {
  const DEFAULT_LIMIT = 10;

  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n, isRTL } = useI18N();
  const {
    data: notifications,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useNotifications();

  let isError = false;
  if (error) {
    isError = true;
    // TODO
    //toast(error, true);
    console.error(error);
  };

  const [_notifications, _setNotifications] = useState(notifications ?? []);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    if (_notifications?.length !== notifications?.length) _setNotifications(notifications);
  }, [notifications]);

  //const { userData, error: userError } = useMyUser();
  /*
  const notifications = [];
  const notificationsError = null;
  const isLoading = false;
  const isValidating = false;
  const mutate = () => {};
  */

  const userData = null;

  const [isAll, setIsAll] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10); // fails: useState(DEFAULT_LIMIT);

  const NotificationItem = ({ item, loading }) => {
    const str1 = item?.notification_note?.search("<");
    const str2 = item?.notification_note?.search(">");
    const str3 = item?.notification_note?.length - 4;
    const newNotificationNoteA = item?.notification_note?.substr(0, str1);
    const newNotificationNoteB = item?.notification_note?.substr(
      str2,
      str3
    );
    const str4 = newNotificationNoteB?.search("<") - 1;
    const newNotificationNoteC = newNotificationNoteB?.substr(1, str4);
    let entityLink = item?.notification_note?.substring(
      item?.notification_note?.lastIndexOf('href="') + 6,
      item?.notification_note?.lastIndexOf('">')
    );
    let entityId = entityLink?.split("/")[4];
    let entityName = entityLink?.split("/")[3];
    // TODO
    //const entities = new Html5Entities();
    const isNew = item?.is_new === "1" ? true : false;
    const name = item?.notification_name;
    const action = item?.notification_action;

    const NotificationTypeIcon = () => {
      const getIcon = () => {
        if (isNew) return {
          type: "Entypo",
          name: "new"
        };
        if (name === "mention" || action === "mentioned") return {
          type: "Octicons",
          name: "mention"
        };
        return {
          type: "MaterialIcons",
          name: "notifications-none"
        };
      };
      const { type: iconType, name: iconName }= getIcon();
      return(
        <View style={globalStyles.columnContainer}>
          <View style={globalStyles.rowIcon}>
            <Icon
              type={iconType}
              name={iconName}
              style={[
                globalStyles.icon,
                { fontSize: 18 }
              ]}
            />
          </View>
        </View>
      );
    };

    const NotificationDetails = () => (
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
    );

    const NotificationDate = () => {
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
      if (!item?.date_notified) return null;
      const parsedDate = parseDate(item.date_notified);
      return(
        <View style={globalStyles.columnContainer}>
          <View style={globalStyles.rowIcon}>
            <Text style={globalStyles.caption}>
              {parsedDate}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <View style={[
        globalStyles.rowContainer,
        styles.container
      ]}>
        <NotificationTypeIcon />
        <NotificationDetails />
        <NotificationDate />
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

  const renderItem = ({ item }) => <NotificationItem item={item} loading={isLoading||isValidating} />;

  const filterGroup = [
    {
      //label: 'Unread',
      label: 'Comments',
      query: ''
    },
    {
      label: 'All',
      query: ''
    },
    {
      //label: 'Read',
      label: "Activities",
      query: ''
    },
  ];

  /*
  const unreadNotifications = notifications?.filter((notification) => {
    if (notification.is_new === "1") return notification;
  });
  */
  const onSearch = (search) => {
    if (search?.length < 1) {
      _setNotifications(notifications);
      return;
    };
    _setNotifications(
      _notifications?.filter(notification => notification?.notification_note?.includes(search))
    );
    return;
  };

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

  return (
    <View style={globalStyles.screenContainer}>
      <OfflineBar />
      <FilterList
        items={_notifications}
        renderItem={renderItem}
        onRefresh={mutate}
        // TODO: add term and translate
        placeholder={"NOTIFICATIONS PLACEHOLDER TEXT"}
        //search={search}
        onSearch={onSearch}
        filterGroup={filterGroup}
        onSort={()=>showSort(true)}
        onShowFilters={()=>showFilter(true)}
      />
    </View>
  );
};
export default NotificationsScreen;
