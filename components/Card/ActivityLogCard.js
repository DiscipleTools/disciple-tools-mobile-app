import React from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import ExpandableCard from "components/Card/ExpandableCard";

import useActivityLog from "hooks/use-activity-log";
import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import { ScreenConstants } from "constants";

import { localStyles } from "./ActivityLogCard.styles";

const ActivityLogCard = () => {
  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { getTabScreenFromType } = useType();
  const { collapse } = useBottomSheet();

  // TODO: FilterList
  const renderActivityLog = (log) => (
    <View style={[
      globalStyles.columnContainer,
      styles.activityView
    ]}>
      <Pressable onPress={() => {
        const type = log?.post_type;
        const tabScreen = getTabScreenFromType(type);
        console.log(`tabScreen: ${tabScreen}`);
        navigation.jumpTo(tabScreen, {
          screen: ScreenConstants.DETAILS,
          id: log?.object_id,
          name: log?.object_name,
          type,
        });
        collapse();
      }}>
        <Text style={styles.activityLink}>
          {log?.object_name}
        </Text>
      </Pressable>
      <Text style={styles.activityText}>
        {log?.object_note}
      </Text>
    </View>
  );

  const { data: activityLog, error, isLoading, isValidating, mutate } = useActivityLog();
  if (!activityLog) return null;

  const renderExpandedCard = () => (
    <ScrollView style={{
      padding: 10
    }}>
      {activityLog?.map(renderActivityLog)}
    </ScrollView>
  );

  const renderPartialCard = () => (
    <>
      <View>
        {activityLog?.slice(0,3)?.map(renderActivityLog)}
      </View>
      { activityLog?.length > 1 && (
        <Text>...</Text>
      )}
    </>
  );

  // TODO: translate
  const title = "Activity Log";
  //const title = "جهات الاتصال المعلقة";
  return (
    <ExpandableCard
      border
      title={title}
      count={activityLog?.length}
      renderPartialCard={renderPartialCard}
      renderExpandedCard={renderExpandedCard}
    />
  );
};
export default ActivityLogCard;