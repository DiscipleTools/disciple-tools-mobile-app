import React from "react";
import { View, Text } from "react-native";

import useType from "hooks/useType";
import useSettings from "hooks/useSettings";

import { styles } from "./Subtitles.styles";

const Subtitles = ({ item }) => {
  const { isContact, isGroup } = useType();
  const { settings } = useSettings();
  if (!settings) return null;
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.subtitle}>
        {isContact && (
          <>
            {settings.fields.overall_status?.values[item?.overall_status]
              ? settings.fields.overall_status.values[item?.overall_status]
                .label
              : ""}
            {settings.fields.overall_status?.values[item?.overall_status] &&
            settings.fields.seeker_path.values[item?.seeker_path]
              ? " • "
              : ""}
            {settings.fields.seeker_path?.values[item?.seeker_path]
              ? settings.fields.seeker_path.values[item?.seeker_path].label
              : ""}
          </>
        )}
        {isGroup && (
          <>
            {settings.fields.group_status.values[item?.group_status]
              ? settings.fields.group_status.values[item?.group_status].label
              : ""}
            {settings.fields.group_status.values[item?.group_status] &&
            settings.fields.group_type.values[item?.group_type]
              ? " • "
              : ""}
            {settings.fields.group_type.values[item?.group_type]
              ? settings.fields.group_type.values[item?.group_type].label
              : ""}
            {settings.fields.group_type.values[item?.group_type] &&
            item?.member_count
              ? " • "
              : ""}
            {item?.member_count ? item.member_count : ""}
          </>
        )}
      </Text>
    </View>
  );
};
export default Subtitles;