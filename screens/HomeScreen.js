import React, { useEffect, useLayoutEffect, useReducer, useState } from "react";
import { Image, RefreshControl, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from '@react-navigation/native';

import { BellIcon, CogIcon } from "components/Icon";
import { HeaderRight } from "components/Header/Header";
import MetricCard from "components/Card/MetricCard";
import PendingContactsCard from "components/Card/PendingContactsCard";
import ActivityLogCard from "components/Card/ActivityLogCard";

import useFilters from "hooks/use-filters";
import useI18N from "hooks/use-i18n";
import useNotifications from "hooks/use-notifications";
import useStyles from "hooks/use-styles";

import { ScreenConstants, TypeConstants } from "constants";

import { findFilterById, labelize } from "utils";

import { localStyles } from './HomeScreen.styles';

const HomeScreen = ({ navigation, route }) => {

  const isFocused = useIsFocused();
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { data: contactFilters, mutate: mutateContactFilters } = useFilters({ type: TypeConstants.CONTACT });
  const { data: groupFilters, mutate: mutateGroupFilters } = useFilters({ type: TypeConstants.GROUP });
  const { hasNotifications } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);

  const hasAccountUpdates = false;

  const onRefresh = () => {
    setRefreshing(true);
    if (mutateContactFilters) mutateContactFilters();
    if (mutateGroupFilters) mutateGroupFilters();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    return;
  };

  const renderHeaderLeft = (props) => (
    <View style={globalStyles.rowContainer}>
      <Image source={require("assets/dt-icon.png")} style={styles.logo} />
      <Text style={styles.brandText}>
        D.T
      </Text>
    </View>
  );

  useLayoutEffect(() => {
    const kebabItems = [
      {
        label: i18n.t('global.viewOnMobileWeb'),
        urlPath: "/settings/",
      },
      {
        label: i18n.t('settingsScreen.helpSupport'),
        url: "https://disciple.tools/user-docs/getting-started-info/admin/settings-dt/general-settings-dt/",
      }
    ];
    const renderStartIcons = () => (
      <>
        <View style={styles.headerIcon}>
          <BellIcon
            onPress={() => navigation.push(ScreenConstants.NOTIFICATIONS)}
          />
          { hasNotifications && (
            <View style={styles.notificationsDot(hasNotifications)} />
          )}
        </View>
        <View style={styles.headerIcon}>
          <CogIcon
            onPress={() => navigation.push(ScreenConstants.SETTINGS)}
          />
          { hasAccountUpdates && (
            <View style={styles.notificationsDot(hasAccountUpdates)} />
          )}
        </View>
      </>
    );
    navigation.setOptions({
      title: '',
      headerLeft: (props) => renderHeaderLeft(props),
      headerRight: (props) => (
        <HeaderRight
          kebabItems={kebabItems}
          renderStartIcons={renderStartIcons}
          props
        />
      )
    });
  }, [navigation, hasNotifications, hasAccountUpdates]);

  useEffect(() => {
    onRefresh();
  }, [isFocused]);

  const FavoriteContactsCard = () => {
    const filter = findFilterById("favorite", contactFilters);
    return(
      <MetricCard
        title={filter?.name}
        filter={filter}
        type={TypeConstants.CONTACT}
      />
    );
  };

  const FavoriteGroupsCard = () => {
    const filter = findFilterById("favorite", groupFilters);
    return(
      <MetricCard
        title={filter?.name}
        filter={filter}
        type={TypeConstants.GROUP}
      />
    );
  };

  /*
  const CustomQueryCard = () => {
    const filter = {
      ID: "contacts_requires_update",
      // TODO: translate
      name: "Custom Query",
      query: {
        "assigned_to":["me"],
        "subassigned":["me"],
        "combine":["subassigned"],
        "overall_status":["active"],
        //"group_status":["active"],
        "requires_update":[true],
        "type":["access"],
        //"sort":"seeker_path"
      }
    };
    return (
      <MetricCard
        title={filter?.name}
        filter={filter}
        type={TypeConstants.CONTACT}
      />
    );
  };
  */

  const ActiveContactsCard = () => {
    const filter = findFilterById("my_active", contactFilters);
    const title = `${ filter?.name } ${ labelize (TypeConstants.CONTACT) }`;
    return(
      <MetricCard
        title={title}
        filter={filter}
        type={TypeConstants.CONTACT}
      />
    );
  };

  const ActiveGroupsCard = () => {
    const filter = findFilterById("my_active", groupFilters);
    const title = `${ filter?.name } ${ labelize(TypeConstants.GROUP) }`;
    return(
      <MetricCard
        title={title}
        filter={filter}
        type={TypeConstants.GROUP}
      />
    );
  };

  return (
    <ScrollView style={[
      globalStyles.screenContainer,
      styles.container
    ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={[
        globalStyles.rowContainer,
        styles.cardRowContainer
      ]}>
        <FavoriteContactsCard />
        <FavoriteGroupsCard />
      </View>
      <View style={[
        globalStyles.rowContainer,
        styles.cardRowContainer
      ]}>
        <ActiveContactsCard />
        <ActiveGroupsCard />
      </View>
      <PendingContactsCard filters={contactFilters} refreshing={refreshing} onRefresh={onRefresh} />
      <ActivityLogCard preview={5} refreshing={refreshing} />
    </ScrollView>
  );
};
export default HomeScreen;