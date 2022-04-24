import React from "react";
import { View } from "react-native";
import { useWindowDimensions } from "react-native";

import ContentLoader, { Rect, Circle } from "react-content-loader/native";

import FieldSkeleton from "components/Field/FieldSkeleton";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { localStyles } from "./PostSkeleton.styles";

const PostSkeleton = () => {
  const { styles, globalStyles } = useStyles(localStyles);
  const layout = useWindowDimensions();
  const windowWidth = layout.width;
  const windowHeight = layout.height;
  const { isRTL } = useI18N();
  const skeletons = Array(5)
    .fill("")
    .map((_, i) => ({ key: `${i}`, text: `item #${i}` }));
  return (
    <View style={styles.container}>
      <View style={styles.titleBarMock} />
      <ContentLoader
        rtl={isRTL}
        speed={1}
        width={windowWidth}
        height={80}
        viewBox={"0 " + "0 " + windowWidth + " 80"}
        backgroundColor={styles.skeletonBackground.backgroundColor}
        foregroundColor={styles.skeletonForeground.backgroundColor}
      >
        <Rect x="0" y="0" rx="0" ry="0" width={windowWidth} height="35" />
        <Rect x="0" y="40" rx="2" ry="2" width="85" height="20" />
        <Rect x="120" y="40" rx="2" ry="2" width="85" height="20" />
        <Rect x="240" y="40" rx="2" ry="2" width="85" height="20" />
        <Rect x="360" y="40" rx="2" ry="2" width="85" height="20" />
        <Rect x="0" y="65" rx="2" ry="2" width="85" height="5" />
        <Rect x="0" y="80" rx="2" ry="2" width={windowWidth} height="1" />
      </ContentLoader>
      {skeletons.map((fieldSkeleton, idx) => (
        <View
          key={idx}
          style={{ marginVertical: 25, marginHorizontal: 5 }}
        >
          <FieldSkeleton
            isRTL={isRTL}
            windowWidth={windowWidth}
          />
        </View>
      ))}
      <ContentLoader
        rtl={isRTL}
        speed={1}
        width={windowWidth}
        height={windowHeight/3}
        viewBox={"0 " + "0 " + windowWidth + " 80"}
        backgroundColor={styles.skeletonBackground.backgroundColor}
        foregroundColor={styles.skeletonForeground.backgroundColor}
      >
        <Circle cx="350" cy="60" r="35" />
      </ContentLoader>
    </View>
  );
};
export default PostSkeleton;
