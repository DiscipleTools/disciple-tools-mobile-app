import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

import { Container } from "native-base";
//import { Html5Entities } from 'html-entities';

import FilterList from "components/FilterList";
import OfflineBar from "components/OfflineBar";

import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";
import useNotifications from "hooks/useNotifications.js";
//import useMyUser from 'hooks/useMyUser.js';

import Colors from "constants/Colors";

import { styles } from "./NotificationsScreen.styles";

const NotificationsScreen = ({ navigation }) => {
  const DEFAULT_LIMIT = 10;

  const isConnected = useNetworkStatus();
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

  //const { userData, error: userError } = useMyUser();
  /*
  const notifications = [];
  const notificationsError = null;
  const isLoading = false;
  const isValidating = false;
  const mutate = () => {};
  */

  const userData = null;

  const unreadNotifications = notifications?.filter((notification) => {
    if (notification.is_new === "1") return notification;
  });

  const [isAll, setIsAll] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10); // fails: useState(DEFAULT_LIMIT);

  const NotificationItem = ({ item, loading }) => {
    //console.log(JSON.stringify(item));
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
    return (
      <View
        style={
          isNew
            ? { backgroundColor: "rgba(63, 114, 155, 0.19)" }
            : { backgroundColor: Colors.mainBackgroundColor }
        }
      >
        <View
          style={[
            styles.notificationContainer,
            { flex: 1, flexDirection: "row" },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={isRTL ? { textAlign: "left" } : {}}>
              {/*<Text>{entities.decode(newNotificationNoteA)}</Text>*/}
              <Text>{newNotificationNoteA}</Text>
              <Text
                style={{ color: Colors.primary }}
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
            </Text>
            <Text
              style={[
                styles.prettyTime,
                isRTL ? { textAlign: "left", flex: 1 } : {},
              ]}
            >
              {/*TODOmoment(notification.date_notified).fromNow() +
                ' ~ ' +
              moment(notification.date_notified).format('L')*/}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              toggleReadUnread(item, isNew);
            }}
          >
            <View style={styles.buttonContainer}>
              <View
                style={
                  isNew
                    ? styles.notificationUnreadButton
                    : styles.notificationReadButton
                }
              />
            </View>
          </TouchableOpacity>
        </View>
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

  const renderItem = ({ item }) => <NotificationItem item={item} loading={isLoading||isValidating||isError} />;

  return (
    <Container style={styles.container}>
      {!isConnected && <OfflineBar />}
      <FilterList
        items={(notifications?.length > 0) ? notifications : []}
        renderItem={renderItem}
        onRefresh={mutate}
        // TODO: add term and translate
        placeholder={"NOTIFICATIONS PLACEHOLDER TEXT"}
      />
    </Container>
  );
};
NotificationsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
export default NotificationsScreen;
