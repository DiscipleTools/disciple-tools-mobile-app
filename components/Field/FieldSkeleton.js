import React from "react";

import ContentLoader, { Rect } from "react-content-loader/native";

import useStyles from "hooks/use-styles";

import { localStyles } from "./FieldSkeleton.styles";

const FieldSkeleton = ({ isRTL, windowWidth }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return(
    <ContentLoader
      rtl={isRTL}
      speed={1}
      width={windowWidth}
      height={50}
      backgroundColor={styles.skeletonBackground.backgroundColor}
      foregroundColor={styles.skeletonForeground.backgroundColor}
    >
      <Rect x="0" y="0" rx="5" ry="5" width={windowWidth-10} height="50" />
    </ContentLoader>
  );
};
export default FieldSkeleton;
