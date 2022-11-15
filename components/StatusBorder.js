import React from "react";
import { View } from "react-native";

import useSettings from "hooks/use-settings";

const StatusBorder = ({ overall_status, group_status, status, type }) => {
  const { settings } = useSettings({ type });
  if (!settings) return null;

  const getStatusColor = (settings) => {
    if (overall_status) {
      return settings?.fields?.overall_status?.values?.[overall_status]?.color;
    }
    if (group_status) {
      return settings?.fields?.group_status?.values?.[group_status]?.color;
    }
    return settings?.fields?.status?.values?.[status]?.color;
  };

  const backgroundColor = getStatusColor(settings);
  const style = {
    width: 10,
    height: "100%",
    backgroundColor,
  };
  return <View style={style} />;
};

export default StatusBorder;
