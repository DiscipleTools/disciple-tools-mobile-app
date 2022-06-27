//import liraries
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ScreenConstants } from "constants";

import PrefetchCacheRecord from "components/PrefetchCacheRecord";
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
  const navigation = useNavigation();

  if (!logs || logs.length === 0 || accordionState.length === 0) return null;

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
          <Text style={styles.activityLink}>{logs?.[0] ?? " "}</Text>
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
              {log?.object_note}
            </Text>
            {
              // Prefetch any posts in the ActivityLog so that the records
              // are available if the user goes OFFLINE.
            }
            {log?.object_id && log?.post_type && (
              <PrefetchCacheRecord id={log.object_id} type={log.post_type} />
            )}
          </>
        ))
      ) : (
        <>
          {/* Show only one entry. */}
          <Text style={styles.activityText}>{logs?.[1][0]?.object_note}</Text>
          {
            // Prefetch any posts in the ActivityLog so that the records
            // are available if the user goes OFFLINE.
          }
          {logs?.[1][0]?.object_id && logs?.[1][0]?.post_type && (
            <PrefetchCacheRecord
              id={logs[1][0].object_id}
              type={logs[1][0].post_type}
            />
          )}
        </>
      )}
    </>
  );
};

export default RenderActivityLog;
