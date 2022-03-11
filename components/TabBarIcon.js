import React from "react";
import { Icon } from "native-base";

import useStyles from "hooks/use-styles";

import { localStyles } from "./TabBarIcon.styles";

// TODO: replace with components/Icon
function TabBarIcon({ type, name, focused }) {
  const { styles } = useStyles(localStyles);
  return (
    <Icon
      type={type}
      name={name}
      style={styles.icon(focused)}
    />
  );
}
export default TabBarIcon;
