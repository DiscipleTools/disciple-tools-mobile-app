import React, { useState } from "react";
import { Linking } from "react-native";
import { KebabIcon } from "components/Icon";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";

import useStyles from "hooks/use-styles";

import axios from "services/axios";

const KebabMenu = ({ items }) => {
  const { globalStyles } = useStyles();
  const [visible, setVisible] = useState(false);
  return (
    <Menu
      visible={visible}
      anchor={
        <KebabIcon
          onPress={() => setVisible(true)}
          style={globalStyles.icon}
        />
      }
      onRequestClose={() => setVisible(false)}
    >
      {items?.map((item, idx) => {
        let url = null;
        if (item?.url) url = item?.url;
        if (item?.urlPath) {
          const baseUrl = axios?.defaults?.baseURL?.split("/wp-json")?.[0];
          if (baseUrl) url = `${baseUrl}/${item?.urlPath}`;
        };
        return(
          <>
            <MenuItem
              onPress={() => {
                if (item?.callback) {
                  item.callback();
                } else {
                  if (url) Linking.openURL(url);
                };
                setVisible(false);
              }}
            >
              {item?.label}
            </MenuItem>
            <MenuDivider />
          </>
        );
      })}
    </Menu>
  );
};
export default KebabMenu;