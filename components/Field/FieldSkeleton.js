import React from "react";

// 3rd-party Components
import ContentLoader, { Rect } from "react-content-loader/native";

const FieldSkeleton = ({ isRTL, windowWidth }) => (
  <ContentLoader
    rtl={isRTL}
    speed={1}
    width={windowWidth}
    height={50}
    backgroundColor="#e7e7e7"
    foregroundColor="#b7b7b7"
  >
    <Rect x="0" y="0" rx="5" ry="5" width={windowWidth-10} height="50" />
  </ContentLoader>
);
export default FieldSkeleton;
