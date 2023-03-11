import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

import Card from "components/Card/Card";

import useI18N from "hooks/use-i18n";
import useActivityLog from "hooks/use-activity-log";

import useStyles from "hooks/use-styles";

import { ScreenConstants } from "constants";

import { localStyles } from "./ActivityLogCard.styles";
import RenderActivityLog from "components/RenderActivityLog";
import { TypeConstants } from "constants";

const ActivityLogCard = ({ preview, refreshing }) => {
  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();

  const [accordionState, setAccordionState] = useState([]);
  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n, numberFormat } = useI18N();

  useEffect(() => {
    if (groupedActivityLog) {
      setAccordionState(
        new Array(Object.keys(groupedActivityLog).length).fill(false)
      );
    }
  }, [groupedActivityLog]);

  // force data refresh on reload
  useEffect(() => {
    if (refreshing && mutate) mutate();
  }, [refreshing]);

  const handleAccordionChange = (groupIndex) => {
    const updatedAccordionState = accordionState.map((item, index) =>
      index === groupIndex ? !item : item
    );
    setAccordionState(updatedAccordionState);
  };

  // TODO: FilterList
  const renderActivityLog = (logs, idx) => {
    return (
      <RenderActivityLog
        key={logs?.[0] ?? Math.random()}
        logs={logs}
        index={idx}
        accordionState={accordionState}
        handleAccordionChange={handleAccordionChange}
      />
    );
  };

  const { data: activityLog, mutate } = useActivityLog();
  if (!activityLog) return null;

  // sort activity log (grouped sort below depends on it - using 0th index)
  activityLog.sort((a, b) => new Date(b?.hist_time) - new Date(a?.hist_time));

  // group by post
  let groupedActivityLog = {};
  activityLog?.forEach((element) => {
    let logKey = element?.object_id;
    const logType = element?.object_type;
    if (logType === TypeConstants.CONTACT || logType === TypeConstants.GROUP) {
      if (!groupedActivityLog?.[logKey]) {
        groupedActivityLog[logKey] = [];
      }
      groupedActivityLog[logKey].push({ ...element });
    }
  });

  // sort posts by most recent activity
  const sortedGroupedActivityLog = Object.entries(groupedActivityLog).sort(
    (a, b) => {
      // 0th is most recent bc 'Activity Log' already sorted (by 'hist_time')
      const aLatestLog = a[1][0];
      const bLatestLog = b[1][0];
      return (
        new Date(Number(bLatestLog?.hist_time) * 1000) -
        new Date(Number(aLatestLog?.hist_time) * 1000)
      );
    }
  );

  const renderExpandedCard = () => {
    navigation.navigate(ScreenConstants.ALL_ACTIVITY_LOGS, {
      paramsData: {
        title,
        data: sortedGroupedActivityLog,
      },
    });
  };

  const renderPartialCard = () => (
    <>
      <View>
        {sortedGroupedActivityLog.slice(0, preview).map(renderActivityLog)}
      </View>
      <View style={styles.etcetera}>
        <Text>...</Text>
      </View>
    </>
  );

  const title = i18n.t("global.activityLog");
  return (
    <Card
      border
      title={title}
      body={renderPartialCard()}
      onPress={() => renderExpandedCard()}
    />
  );
};
export default ActivityLogCard;
