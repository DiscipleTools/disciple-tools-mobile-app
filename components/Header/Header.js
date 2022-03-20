import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ChevronBackIcon, ChevronForwardIcon, CommentEditIcon } from "components/Icon";
import KebabMenu from "components/KebabMenu";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { localStyles } from "./Header.styles";

export const HeaderLeft = ({ startIcons, endIcons, style, iconStyle }) => {
  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { isRTL } = useI18N();
  const onBack = () => navigation.pop();
  return(
    <View style={[
      globalStyles.rowContainer,
      style
    ]}>
      { startIcons?.map() }
      { isRTL ? (
        <ChevronForwardIcon
          onPress={onBack}
          style={[
            styles.navIcon,
            iconStyle
          ]}
        />
       ) : (
        <ChevronBackIcon
          onPress={onBack}
          style={[
            styles.navIcon,
            iconStyle
          ]}
        />
      )}
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