import React from "react";
import { View } from "react-native";
import { useWindowDimensions } from "react-native";

import ContentLoader, { Rect, Circle } from "react-content-loader/native";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { localStyles } from "./PostItemSkeleton.styles";

const PostItemSkeleton = () => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { isRTL } = useI18N();
  const windowWidth = useWindowDimensions().width;
  return (
    <View style={styles.container}>
      <ContentLoader
        rtl={isRTL}
        speed={3}
        width={windowWidth}
        height={77}
        viewBox={"0 " + "0 " + windowWidth + " 80"}
        backgroundColor={styles.skeletonBackground.backgroundColor}
        foregroundColor={styles.skeletonForeground.backgroundColor}
      >
        <Circle cx="385" cy="25" r="8" />
        <Rect x="10" y="20" rx="2" ry="2" width="150" height="8" />
        <Rect x="10" y="45" rx="2" ry="2" width="100" height="5" />
        <Circle cx="120" cy="47" r="2" />
        <Rect x="130" y="45" rx="2" ry="2" width="150" height="5" />
        <Rect x="0" y="75" rx="2" ry="2" width="400" height="1" />
      </ContentLoader>
    </View>
  );
};
export default PostItemSkeleton;