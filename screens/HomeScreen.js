import React, { useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

import * as Notifications from "expo-notifications";

import { HeaderRight, LogoHeader } from "components/Header/Header";
import OfflineBar from "components/OfflineBar";

import MetricCard from "components/Card/MetricCard";
import PendingContactsCard from "components/Card/PendingContactsCard";
import ActivityLogCard from "components/Card/ActivityLogCard";

import useDevice from "hooks/use-device";
//import useFilters from "hooks/use-filters";
import useI18N from "hooks/use-i18n";
import useList from "hooks/use-list";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import {
  NotificationPermissionConstants,
  ScreenConstants,
  TypeConstants,
} from "constants";

import { getDefaultFavoritesFilter } from "helpers";

//import { findFilterById } from "utils";

import { localStyles } from "./HomeScreen.styles";

const FavoriteCard = ({ type }) => {
  const navigation = useNavigation();
  const { i18n } = useI18N();
  const { getTabScreenFromType } = useType({ type });
  const filter = getDefaultFavoritesFilter({ i18n, type });
  const { data: items } = useList({ filter, type, filterByAPI: true });
  const value = items?.length;
  return (
    <MetricCard
      title={filter?.name}
      value={value}
      onPress={() => {
        const tabScreen = getTabScreenFromType(type);
        navigation.jumpTo(tabScreen, {
          screen: ScreenConstants.LIST,
          type,
          filter: filter,
          filterByAPI: true,
        });
      }}
    />
  );
};

const FavoriteContactsCard = () => (
  <FavoriteCard type={TypeConstants.CONTACT} />
);
const FavoriteGroupsCard = () => <FavoriteCard type={TypeConstants.GROUP} />;

const HomeScreen = ({ navigation }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { isDevice } = useDevice();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    return;
  };

  // Request permission for Push Notifications
  useEffect(() => {
    if (isDevice) {
      (async () => {
        const { status } = await Notifications.getPermissionsAsync();
        if (status === NotificationPermissionConstants.UNDETERMINED) {
          await Notifications.requestPermissionsAsync();
        }
        return;
      })();
    }
    return;
  }, []);

  useLayoutEffect(() => {
    const kebabItems = [
      {
        label: i18n.t("global.viewOnWeb"),
        urlPath: "#",
      },
      {
        label: i18n.t("global.documentation"),
        url: `https://disciple.tools/user-docs/disciple-tools-mobile-app/how-to-use/home-screen/`,
      },
      {
        label: "Share App",
        shareApp: true,
      },
    ];
    navigation.setOptions({
      title: "",
      headerLeft: (props) => <LogoHeader props={props} />,
      headerRight: (props) => (
        <HeaderRight
          kebabItems={kebabItems}
          //renderStartIcons={() => (
          //  <>
          //    <SearchIcon style={globalStyles.placeholder} />
          //    <AddNewIcon style={globalStyles.placeholder} />
          //  </>
          //)}
          props={props}
        />
      ),
    });
  }, []);

  return (
    <>
      <OfflineBar />
      <ScrollView style={[globalStyles.screenContainer, styles.container]}>
        <View style={[globalStyles.rowContainer, styles.cardRowContainer]}>
          <FavoriteContactsCard />
          <FavoriteGroupsCard />
        </View>
        <PendingContactsCard refreshing={refreshing} onRefresh={onRefresh} />
        <ActivityLogCard preview={5} refreshing={refreshing} />
      </ScrollView>
    </>
  );
};
export default HomeScreen;
