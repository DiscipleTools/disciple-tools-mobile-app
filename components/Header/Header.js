import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ArrowIcon } from "components/Icon";
import KebabMenu from "components/KebabMenu";

import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import { ScreenConstants } from "constants";

import { localStyles } from "./Header.styles";

export const HeaderLeft = ({ startIcons, endIcons, style, iconStyle }) => {
  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { postType } = useType();
  return(
    <View style={[
      globalStyles.rowContainer,
      style
    ]}>
      { startIcons?.map() }
      <ArrowIcon
        header  
        onPress={() => {
          navigation.navigate(ScreenConstants.LIST, {
            type: postType,
          });
        }}
        style={[
          styles.navIcon,
          iconStyle
        ]}
      />
      { endIcons?.map() }
    </View>
  );
};

export const HeaderRight = ({ kebabItems, renderStartIcons, renderEndIcons, style, iconStyle }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return(
    <View style={globalStyles.rowContainer}>
      { renderStartIcons ? renderStartIcons() : null }
      <View style={styles.headerIcon}>
        <KebabMenu items={kebabItems} />
      </View>
      { renderEndIcons ? renderEndIcons() : null }
    </View>
  );
};