import React from "react";
import { useWindowDimensions } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

import FieldSkeleton from "components/Field/FieldSkeleton";

import useI18N from "hooks/useI18N";
import useTheme from "hooks/useTheme";

const PostSkeleton = () => {
  const layout = useWindowDimensions();
  const windowWidth = layout.width;
  const { theme } = useTheme();
  const { isRTL } = useI18N();
  const skeletons = Array(7)
    .fill("")
    .map((_, i) => ({ key: `${i}`, text: `item #${i}` }));
  return (
    <>
      <ContentLoader
        rtl={isRTL}
        speed={3}
        width={windowWidth}
        height={80}
        viewBox={"0 " + "0 " + windowWidth + " 80"}
        //backgroundColor={theme.background.primary}
        backgroundColor="#0FF"
        foregroundColor={theme.divider}
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
        <FieldSkeleton
          key={idx}
          isRTL={isRTL}
          windowWidth={windowWidth}
        />
      ))}
      <ContentLoader
        rtl={isRTL}
        speed={3}
        width={windowWidth}
        height={100}
        viewBox={"0 " + "0 " + windowWidth + " 80"}
        backgroundColor={theme.background.primary}
        //foregroundColor={theme.divider}
        foregroundColor="#0FF"
      >
        <Circle cx="350" cy="60" r="35" />
      </ContentLoader>
    </>
  );
};
export default PostSkeleton;
