import React, { useLayoutEffect, useState, useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";

import useStyles from "hooks/use-styles";
import OfflineBar from "components/OfflineBar";
import { ArrowBackIcon } from "components/Icon";
import RenderActivityLog from "components/RenderActivityLog";

import { localStyles } from "./AllActivityLogsScreen.styles";

const DEFAULT_ACCORDION_STATE = true; // true=expanded, false=collapsed

const AllActivityLogsScreen = ({ navigation, route }) => {
  const { title, data: groupedActivityLog } = route.params.paramsData;

  const [accordionState, setAccordionState] = useState([]);
  const { styles, globalStyles } = useStyles(localStyles);

  useEffect(() => {
    if (groupedActivityLog) {
      setAccordionState(
        new Array(Object.keys(groupedActivityLog).length).fill(
          DEFAULT_ACCORDION_STATE
        )
      );
    }
    return;
  }, []);

  const handleAccordionChange = (groupIndex) => {
    const updatedAccordionState = accordionState.map((item, index) =>
      index === groupIndex ? !item : item
    );
    setAccordionState(updatedAccordionState);
  };

  const renderHeaderLeft = () => (
    <Pressable onPress={() => navigation.goBack()}>
      <ArrowBackIcon />
    </Pressable>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
      headerLeft: () => renderHeaderLeft(),
    });
  }, []);

  return (
    <View style={styles.container}>
      <OfflineBar />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {Object.entries(groupedActivityLog).map((logs, idx) => (
          <RenderActivityLog
            key={logs?.[0] ?? Math.random()}
            logs={logs}
            index={idx}
            accordionState={accordionState}
            handleAccordionChange={handleAccordionChange}
          />
        ))}
      </ScrollView>
    </View>
  );
};
export default AllActivityLogsScreen;
