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

  // group by post 
  const groupedActivityLog = {};
  activityLog?.forEach((element) => {
    let logKey = element?.object_id;
    const logType = element?.object_type;
    if (logType === TypeConstants.CONTACT || logType === TypeConstants.GROUP) {
      groupedActivityLog[logKey] = !groupedActivityLog?.[logKey] ? [{ ...element}] : [...groupedActivityLog[logKey], { ...element}];
    };
  });

  // TODO: sort
  /*
  // sort each group's array by hist_time
  Object.entries(groupedActivityLog).forEach(([key, value]) => {
    value?.sort((a, b) => {
      return new Date(b?.hist_time)-new Date(a?.hist_time);
    });
  });

  // sort by each group's latest log
  Object.entries(groupedActivityLog).sort((a, b) => {
    const aLatestLog = a[1][a[1].length-1];
    const bLatestLog = b[1][b[1].length-1];
    return new Date(bLatestLog?.created_at)-new Date(aLatestLog?.created_at);
  });
  */

  const renderExpandedCard = () => {
    navigation.navigate(ScreenConstants.ALL_ACTIVITY_LOGS, {
      paramsData: {
        title,
        data: groupedActivityLog,
      },
    });
  };

  const renderPartialCard = () => (
    <>
      <View>
        {Object.entries(groupedActivityLog)
          .slice(0, preview)
          .map(renderActivityLog)}
      </View>
      {Object.keys(groupedActivityLog).length > 1 && (
        <View style={styles.etcetera}>
          <Text>...</Text>
        </View>
      )}
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