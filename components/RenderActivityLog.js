//import liraries
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ScreenConstants } from "constants";
import ParsedText from "react-native-parsed-text";
import useI18N from "hooks/use-i18n";

import { ChevronDownIcon, ChevronUpIcon } from "components/Icon";
import { localStyles } from "./RenderActivityLog.styles";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

// create a component
const RenderActivityLog = ({
  logs,
  index,
  accordionState,
  handleAccordionChange,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { getTabScreenFromType } = useType();
  const { moment } = useI18N();
  const navigation = useNavigation();
  const MENTION_PATTERN = /@\[\w* \w* \(\w*\)\]\(\.?\w*\)*/g;
  const MENTION_PATTERN_2 = /@\[\w*\]\(\.?\w*\)*/g;
  const BAPTISM_DATE_PATTERN = /\{(\d+)\}+/;
  if (!logs || logs.length === 0 || accordionState.length === 0) return null;

  const renderMention = (matchingString, matches) => {
    let mentionText = matchingString.substring(
      matchingString.lastIndexOf("[") + 1,
      matchingString.lastIndexOf("]")
    );
    return `@${mentionText}`;
  };

  const timestamptoDate = (match, timestamp) => {
    match = match.replace('{','');
    match = match.replace('}','');
    if ( isNaN(match*1000) ){
      return false;
    }
    return moment(match*1000).format('MMM D, YYYY');
  }

  return (
    <>
      <View
        style={{
          ...globalStyles.rowContainer,
          justifyContent: "space-between",
          marginVertical: 5,
        }}
      >
        <Pressable
          onPress={() => {
            if (logs?.[1][0]) {
              const type = logs[1][0]?.post_type;
              const tabScreen = getTabScreenFromType(type);
              navigation.jumpTo(tabScreen, {
                screen: ScreenConstants.DETAILS,
                id: logs[1][0]?.object_id,
                name: logs[1][0]?.object_name,
                type,
              });
            }
          }}
        >
          <Text style={styles.activityLink}>
            {logs?.[1][0]?.object_name ?? " "}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            handleAccordionChange(index);
          }}
        >
          {accordionState[index] ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Pressable>
      </View>

      {accordionState[index] ? (
        logs?.[1]?.map((log, index) => (
          <>
            {/* Show all the entries. */}
            <Text key={`${log.object_id}-${index}`} style={styles.activityText}>
            <ParsedText
              //selectable
              style={styles.commentText(true)}
              parse={[
                {
                  pattern: MENTION_PATTERN,
                  style: styles.parseText,
                  renderText: renderMention,
                },
                {
                  pattern: MENTION_PATTERN_2,
                  style: styles.parseText,
                  renderText: renderMention,
                },
                {
                  pattern: BAPTISM_DATE_PATTERN,
                  style: styles.activityText,
                  renderText: timestamptoDate,
                },
              ]}
            >
              {log?.object_note}
            </ParsedText>
              {/* {log?.object_note} */}
            </Text>
          </>
        ))
      ) : (
        <>
          {/* Show only one entry. */}
          <Text style={styles.activityText}><ParsedText
              //selectable
              style={styles.commentText(true)}
              parse={[
                {
                  pattern: MENTION_PATTERN,
                  style: styles.parseText,
                  renderText: renderMention,
                },
                {
                  pattern: MENTION_PATTERN_2,
                  style: styles.parseText,
                  renderText: renderMention,
                },
                {
                  pattern: BAPTISM_DATE_PATTERN,
                  style: styles.activityText,
                  renderText: timestamptoDate,
                },
              ]}
            >
              {logs?.[1][0]?.object_note}
            </ParsedText></Text>
        </>
      )}
    </>
  );
};

export default RenderActivityLog;
