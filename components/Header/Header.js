import React from "react";
import { Image, Text, View } from "react-native";
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
  return (
    <View style={[globalStyles.rowContainer, style]}>
      {startIcons?.map()}
      <ArrowIcon
        header
        onPress={() => {
          navigation.navigate(ScreenConstants.LIST, {
            type: postType,
          });
        }}
        style={[globalStyles.icon, iconStyle]}
      />
      {endIcons?.map()}
    </View>
  );
};

export const HeaderRight = ({
  kebabItems,
  renderStartIcons,
  renderEndIcons,
  style,
  iconStyle,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return (
    <View style={globalStyles.rowContainer}>
      {renderStartIcons ? renderStartIcons() : null}
      <View style={styles.headerIcon}>
        <KebabMenu items={kebabItems} />
      </View>
      {renderEndIcons ? renderEndIcons() : null}
    </View>
  );
};

export const LogoHeader = ({ props }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return (
    <View style={globalStyles.rowContainer}>
      <Image
        defaultSource={require("assets/dt-icon.png")}
        source={require("assets/dt-icon.png")}
        resizeMethod="scale"
        resizeMode="cover"
        style={styles.logo}
      />
      <Text style={styles.brandText}>D.T</Text>
    </View>
  );
};
