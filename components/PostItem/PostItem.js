import React from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";

import { useNavigation } from "@react-navigation/native";

// (native base does not have a Skeleton component)
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

import Subtitles from "components/Subtitles";
import PostItemSkeleton from "components/PostItem/PostItemSkeleton";

import useI18N from "hooks/useI18N";
import useTheme from "hooks/useTheme";
import useType from "hooks/useType";

import Constants from "constants";

import { styles } from "./PostItem.styles";

const PostItem = ({ item, loading }) => {

  const navigation = useNavigation();
  const { isRTL } = useI18N();
  const { getSelectorColor } = useTheme();
  const { isContact, isGroup, postType } = useType();

  /*
  const truncateChars = (displayValue) => {
    const THRESHOLD = 40;
    if (displayValue?.length > THRESHOLD) return `${ displayValue?.substring(0, threshold) } ...`;
    return displayValue;
  };
  */

  const goToDetailsScreen = (postData = null, isPhoneImport = false) => {
    if (postData && isPhoneImport) {
      navigation.navigate("Details", {
        importContact: contactData,
        type: postType,
      });
    } else if (postData) {
      // Detail
      navigation.navigate("Details", {
        id: postData.ID,
        name: postData.title,
        type: postType,
        onGoBack: () => onRefresh(),
      });
    } else {
      // Create
      navigation.navigate("Details", {
        create: true,
        type: postType,
      });
    }
  };

  if (!item || loading) return <PostItemSkeleton />;
  return (
    <Pressable
      onPress={() => {
        goToDetailsScreen(item);
      }}
      style={styles.rowFront}
      key={item?.ID}
    >
      <View style={{ flexDirection: "row", height: "100%" }}>
        <View style={{ flexDirection: "column", flexGrow: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                textAlign: "left",
                flex: 1,
                flexWrap: "wrap",
                fontWeight: "bold",
              }}
            >
              { item?.name ? item.name : item?.title}
            </Text>
          </View>
          <Subtitles item={item} />
        </View>
        <View
          style={[
            {
              flexDirection: "column",
              width: Constants.STATUS_CIRCLE_SIZE,
              paddingTop: 0,
              marginTop: "auto",
              marginBottom: "auto",
            },
            isRTL ? { marginRight: 5 } : { marginLeft: 5 },
          ]}
        >
          <View
            style={{
              width: Constants.STATUS_CIRCLE_SIZE,
              height: Constants.STATUS_CIRCLE_SIZE,
              borderRadius: Constants.STATUS_CIRCLE_SIZE / 2,
              backgroundColor: getSelectorColor(isContact ? item?.overall_status : item?.group_status),
              marginTop: "auto",
              marginBottom: "auto",
            }}
          ></View>
        </View>
      </View>
    </Pressable>
  );
};
export default PostItem;