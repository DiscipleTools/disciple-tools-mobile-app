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

  const {
    data: activityLog,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useActivityLog();

  let groupedActivityLog = {};

  // Group by name
  activityLog?.forEach((element) => {
    let makeKey = element.object_name;
    const baptismDateRegex = /\{(\d+)\}+/;
    if (!groupedActivityLog[makeKey]) {
      groupedActivityLog[makeKey] = [];
    }
    //element.object_note = baptismDateRegex.test(element.object_note)?element.object_note.replace(baptismDateRegex, timestamptoDate):element.object_note;
    //element.object_note = mentionName.test(element.object_note)?element.object_note.replace(mentionName, stringtoMention):element.object_note;
    groupedActivityLog[makeKey].push({
      ...element,
    });
  });

  // force data refresh on reload
  useEffect(() => {
    if (refreshing && mutate) mutate();
  }, [refreshing]);

  const renderExpandedCard = () => {
    navigation.navigate(ScreenConstants.ALL_ACTIVITY_LOGS, {
      paramsData: {
        title: `${title} (${numberFormat(activityLog?.length)})`,
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

  if (!activityLog || activityLog?.length === 0) return null;

  const title = i18n.t("global.activityLog");

  return (
    <Card
      border
      title={`${title} (${numberFormat(activityLog?.length)})`}
      body={renderPartialCard()}
      onPress={() => renderExpandedCard()}
    />
  );
};
export default ActivityLogCard;
