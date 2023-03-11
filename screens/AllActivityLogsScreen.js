import React, { useLayoutEffect, useState, useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { HeaderRight } from "components/Header/Header";
import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";
import OfflineBar from "components/OfflineBar";
import { ArrowBackIcon } from "components/Icon";
import RenderActivityLog from "components/RenderActivityLog";

import { localStyles } from "./AllActivityLogsScreen.styles";

const DEFAULT_ACCORDION_STATE = true; // true=expanded, false=collapsed

const AllActivityLogsScreen = ({ navigation, route }) => {
  const { i18n } = useI18N();
  const { title, data: groupedActivityLog } = route.params.paramsData;

  const [accordionState, setAccordionState] = useState([]);
  const { styles } = useStyles(localStyles);

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
    const kebabItems = [
      {
        label: i18n.t("global.viewOnWeb"),
        urlPath: `metrics/personal/activity-log`,
      },
      {
        label: i18n.t("global.documentation"),
        url: `https://disciple.tools/user-docs/disciple-tools-mobile-app/how-to-use/`,
      },
    ];
    navigation.setOptions({
      title: title,
      headerLeft: () => renderHeaderLeft(),
      headerRight: (props) => (
        <HeaderRight kebabItems={kebabItems} props={props} />
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <OfflineBar />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {groupedActivityLog.map((logs, idx) => (
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
