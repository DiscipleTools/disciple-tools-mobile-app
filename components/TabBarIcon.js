import React from "react";
import PropTypes from "prop-types";
import { Icon } from "native-base";

import Colors from "../constants/Colors";

function TabBarIcon({ type, name, focused }) {
  return (
    <Icon
      type={type}
      name={name}
      style={{
        marginBottom: -3,
        color: focused ? Colors.tabIconSelected : Colors.tabIconDefault,
        fontSize: 26
      }}
    />
  );
}

TabBarIcon.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired
};
export default TabBarIcon;
