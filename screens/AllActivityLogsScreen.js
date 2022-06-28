import React, { useLayoutEffect, useState, useEffect } from "react";
import { Pressable, ScrollView } from "react-native";

import useStyles from "hooks/use-styles";
import OfflineBar from "components/OfflineBar";
import { ArrowBackIcon } from "components/Icon";
import RenderActivityLog from "components/RenderActivityLog";

import { localStyles } from "./AllActivityLogsScreen.styles";

const AllActivityLogsScreen = ({ navigation, route }) => {
  const { title, data: groupedActivityLog } = route.params.paramsData;

  const [accordionState, setAccordionState] = useState([]);
  const { styles, globalStyles } = useStyles(localStyles);

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
    <>
      <OfflineBar />
      <ScrollView contentContainerStyle={styles.container}>
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
    </>
  );
};
export default AllActivityLogsScreen;
