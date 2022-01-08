import React, { useState } from "react";
import { Icon } from "native-base";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";

import { styles } from "./KebabMenu.styles";

const KebabMenu = ({ menuItems }) => {
  const [visible, setVisible] = useState(false);
  return (
    <Menu
      visible={visible}
      anchor={
        <Icon
          type="Entypo"
          name="dots-three-vertical"
          onPress={() => setVisible(true)}
          style={styles.kebabMenu}
        />
      }
      onRequestClose={() => setVisible(false)}
    >
      {menuItems?.map((menuItem) => (
        <>
          <MenuItem
            onPress={() => {
              menuItem.callback();
              setVisible(false);
            }}
          >
            {menuItem?.label}
          </MenuItem>
          <MenuDivider />
        </>
      ))}
    </Menu>
  );
};
export default KebabMenu;