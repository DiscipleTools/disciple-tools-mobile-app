import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

import ExpandableCard from "components/Card/ExpandableCard";
import useI18N from "hooks/use-i18n";
import useActivityLog from "hooks/use-activity-log";
import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import { ScreenConstants } from "constants";

import { localStyles } from "./ActivityLogCard.styles";

const ActivityLogCard = ({ preview, refreshing }) => {

  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();

  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { getTabScreenFromType } = useType();
  const { collapse } = useBottomSheet();
  const { i18n } = useI18N();

  // TODO: FilterList
  const renderActivityLog = (log, idx) => {
    const _key = `${ log.object_id }-${ idx }`;
    return(
      <View
        key={_key}
        style={[
          globalStyles.columnContainer,
          styles.activityView
        ]}
      >
        <Pressable
          onPress={() => {
            const type = log?.post_type;
            const tabScreen = getTabScreenFromType(type);
            navigation.jumpTo(tabScreen, {
              screen: ScreenConstants.DETAILS,
              id: log?.object_id,
              name: log?.object_name,
              type,
            });
            collapse();
          }}
        >
          <Text style={styles.activityLink}>{log?.object_name}</Text>
        </Pressable>
        <Text style={styles.activityText}>{log?.object_note}</Text>
      </View>
    );
  };

  const {
    data: activityLog,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useActivityLog();

  // force data refresh on reload
  useEffect(() => {
    if (refreshing && mutate) mutate();
  }, [refreshing]);

  const renderExpandedCard = () => (
    <ScrollView
      style={{
        padding: 10,
      }}
    >
      {activityLog?.map((log, idx) => renderActivityLog(log, idx))}
    </ScrollView>
  );

  const renderPartialCard = () => (
    <>
      <View>{activityLog?.slice(0, preview ?? 3)?.map(renderActivityLog)}</View>
      {activityLog?.length > 1 && (
        <View style={styles.etcetera}>
          <Text>...</Text>
        </View>
      )}
    </>
  );

  const title = i18n.t("global.activityLog");
  if (!activityLog) return null;
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
