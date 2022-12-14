import { View } from "react-native";

import { getStatusKey } from "helpers";

const StatusBorder = ({ fields, item }) => {
  const statusKey = getStatusKey({ postType: item?.post_type });
  const backgroundColor =
    fields?.[statusKey]?.default?.[item?.[statusKey]?.key]?.color ?? null;
  return <View style={{ height: "100%", width: 10, backgroundColor }} />;
};
export default StatusBorder;
