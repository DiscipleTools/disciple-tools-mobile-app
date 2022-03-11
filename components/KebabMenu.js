import React, { useState } from "react";
import { Icon } from "native-base";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";

import useStyles from "hooks/use-styles";

const KebabMenu = ({ menuItems }) => {
  const { globalStyles } = useStyles();
  const [visible, setVisible] = useState(false);
  return (
    <Menu
      visible={visible}
      anchor={
        <Icon
          type="Entypo"
          name="dots-three-vertical"
          onPress={() => setVisible(true)}
          style={globalStyles.icon}
        />
      }
      onRequestClose={() => setVisible(false)}
    >
      {menuItems?.map((menuItem, idx) => (
        <React.Fragment key={menuItem?.label ?? idx}>
          <MenuItem
            onPress={() => {
              menuItem.callback();
              setVisible(false);
            }}
          >
            {menuItem?.label}
          </MenuItem>
          <MenuDivider />
        </React.Fragment>
      ))}
    </Menu>
  );
};
export default KebabMenu;