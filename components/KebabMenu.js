import React, { useState } from "react";
import { Linking } from "react-native";
import { KebabIcon } from "components/Icon";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import axios from "services/axios";

const KebabMenu = ({ items }) => {
  const { globalStyles } = useStyles();
  const { i18n } = useI18N();
  const [visible, setVisible] = useState(false);
  if (!items) items = [
    {
      label: i18n.t("global.viewOnWeb"),
      urlPath: "/notifications/",
    },
    {
      label: i18n.t("global.helpDocs"),
      url: "https://disciple.tools/user-docs/getting-started-info/profile-settings/notifications/",
    },
  ];
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