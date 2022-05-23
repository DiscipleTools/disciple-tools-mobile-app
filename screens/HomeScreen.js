import React, { useLayoutEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { HeaderRight } from "components/Header/Header";
import OfflineBar from "components/OfflineBar";

import MetricCard from "components/Card/MetricCard";
import PendingContactsCard from "components/Card/PendingContactsCard";
import ActivityLogCard from "components/Card/ActivityLogCard";

import {
  CommentActivityIcon,
  StarIcon,
  StarOutlineIcon,
  SearchIcon,
  AddNewIcon,
  UpdateRequiredIcon,
  TasksIcon,
  FollowingIcon,
  ShareIcon,
  ExternalLinkIcon,
  HelpIcon,
} from "components/Icon";

import useFilters from "hooks/use-filters";
import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { TypeConstants } from "constants";

import { findFilterById, labelize } from "utils";

import { localStyles } from "./HomeScreen.styles";

const HomeScreen = ({ navigation, route }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    return;
  };

  const renderHeaderLeft = (props) => (
    <View style={globalStyles.rowContainer}>
      <Image source={require("assets/dt-icon.png")} style={styles.logo} />
      <Text style={styles.brandText}>D.T</Text>
    </View>
  );

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
    ];
    navigation.setOptions({
      title: "",
      headerLeft: (props) => renderHeaderLeft(props),
      headerRight: (props) => (
        <HeaderRight
          kebabItems={kebabItems}
          renderStartIcons={() => (
            <>
              <SearchIcon style={globalStyles.placeholder} />
              <AddNewIcon style={globalStyles.placeholder} />
            </>
          )}
          props
        />
      ),
    });
  }, []);

  const FavoriteContactsCard = () => {
    const { data: contactFilters, mutate: mutateContactFilters } = useFilters({
      type: TypeConstants.CONTACT,
    });
    const filter = findFilterById("favorite", contactFilters);
    return (
      <MetricCard
        title={filter?.name}
        filter={filter}
        type={TypeConstants.CONTACT}
      />
    );
  };

  const FavoriteGroupsCard = () => {
    const { data: groupFilters, mutate: mutateGroupFilters } = useFilters({
      type: TypeConstants.GROUP,
    });
    const filter = findFilterById("favorite", groupFilters);
    return (
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

  /*
  const ActiveContactsCard = () => {
    const filter = findFilterById("my_active", contactFilters);
    const title = `${filter?.name} ${labelize(TypeConstants.CONTACT)}`;
    return (
      <MetricCard title={title} filter={filter} type={TypeConstants.CONTACT} />
    );
  };

  const ActiveGroupsCard = () => {
    const filter = findFilterById("my_active", groupFilters);
    const title = `${filter?.name} ${labelize(TypeConstants.GROUP)}`;
    return (
      <MetricCard title={title} filter={filter} type={TypeConstants.GROUP} />
    );
  };
  */

  return (
    <>
      <OfflineBar />
      <ScrollView
        style={[globalStyles.screenContainer, styles.container]}
        contentContainerStyle={globalStyles.screenGutter}
      >
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
