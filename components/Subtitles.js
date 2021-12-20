import React from "react";
import { View, Text } from "react-native";

import useType from "hooks/useType";

import { styles } from "./Subtitles.styles";

const Subtitles = ({ record, settings }) => {
  const { isContact, isGroup } = useType();
  if (!settings) return null;
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.subtitle}>
        {isContact && (
          <>
            {settings.fields.overall_status?.values[record.overall_status]
              ? settings.fields.overall_status.values[record.overall_status]
                .label
              : ""}
            {settings.fields.overall_status?.values[record.overall_status] &&
            settings.fields.seeker_path.values[record.seeker_path]
              ? " • "
              : ""}
            {settings.fields.seeker_path?.values[record.seeker_path]
              ? settings.fields.seeker_path.values[record.seeker_path].label
              : ""}
          </>
        )}
        {isGroup && (
          <>
            {settings.fields.group_status.values[record.group_status]
              ? settings.fields.group_status.values[record.group_status].label
              : ""}
            {settings.fields.group_status.values[record.group_status] &&
            settings.fields.group_type.values[record.group_type]
              ? " • "
              : ""}
            {settings.fields.group_type.values[record.group_type]
              ? settings.fields.group_type.values[record.group_type].label
              : ""}
            {settings.fields.group_type.values[record.group_type] &&
            record.member_count
              ? " • "
              : ""}
            {record.member_count ? record.member_count : ""}
          </>
        )}
      </Text>
    </View>
  );
};
export default Subtitles;