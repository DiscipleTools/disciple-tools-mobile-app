import React from "react";
import { Pressable, Text, View } from "react-native";
import { ActionSheet, Icon } from "native-base";

import { useNavigation } from "@react-navigation/native";

import Subtitles from "components/Subtitles";
import PostItemSkeleton from "./PostItemSkeleton";

import useI18N from "hooks/useI18N";
import useTheme from "hooks/useTheme";
import useType from "hooks/useType";
import useAPI from "hooks/useAPI";

import Constants from "constants";

import { styles } from "./PostItem.styles";

const PostItem = ({ item, loading, mutate }) => {

  const navigation = useNavigation();
  const { i18n, isRTL } = useI18N();
  const { getSelectorColor } = useTheme();
  const { isContact, isGroup, postType } = useType();
  const { updatePost } = useAPI();

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

  const onLongPress = () => {
    ActionSheet.show({
        options: [
          i18n.t('global.commentsActivity'),
          i18n.t("global.cancel"),
        ],
        cancelButtonIndex: 1,
        //destructiveButtonIndex: userIsAuthor ? 2 : null,
        title: null 
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          const postId = Number(item?.ID);
          const postType = item?.post_type;
          // TODO: constant
          navigation.navigate('CommentsActivity', {
            id: postId,
            type: postType,
            subtype: "comments_activity"
          });
        };
        //if (userIsAuthor && buttonIndex === 1) onEdit();
        //if (userIsAuthor && buttonIndex === 2) onDelete();
      }
    );
  };

  const PostTitle = () => (
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
  );

  const StatusDot = () => (
    <View
      style={[
        {
          flexDirection: "column",
          width: Constants.STATUS_CIRCLE_SIZE,
          paddingTop: 0,
          marginTop: "auto",
          marginBottom: "auto",
          marginLeft: 10,
          marginRight: 10,
        },
      ]}
    >
      <View
        style={{
          width: Constants.STATUS_CIRCLE_SIZE,
          height: Constants.STATUS_CIRCLE_SIZE,
          borderRadius: Constants.STATUS_CIRCLE_SIZE / 2,
          backgroundColor: getSelectorColor(isContact ? item?.overall_status : item?.group_status),
          //marginTop: "auto",
          //marginBottom: "auto",
        }}
      />
    </View>
  );

  const FavoriteStar = () => (
    <Pressable onPress={() => updatePost({ favorite: !item?.favorite }, Number(item?.ID), item?.post_type, mutate)}>
      <View
        style={[
          styles.favoriteStarView,
          isRTL ? { marginLeft: 15, marginRight: 0 } : { marginLeft: 0, marginRight: 15 },
        ]}
      >
        <Icon
          type="FontAwesome"
          name={ item?.favorite ? "star" : "star-o" }
          style={[styles.favoriteStarIcon, item?.favorite ? { color: "#000" } : { color: "#ccc" }]}
        />
      </View>
    </Pressable>
  );

  const PostDetails = () => (
    <View style={{ flexDirection: "column", flexGrow: 1 }}>
      <View style={{ flexDirection: "row" }}>
        <PostTitle />
      </View>
      <Subtitles item={item} />
    </View>
  );

  if (!item || loading) return <PostItemSkeleton />;
  return (
    <Pressable
      onPress={() => goToDetailsScreen(item) }
      onLongPress={() => onLongPress()}
      style={styles.rowFront}
      key={item?.ID}
    >
      <View style={{ flexDirection: "row", height: "100%" }}>
        <View style={{ flexDirection: "column" }}>
          <FavoriteStar />
        </View>
        <PostDetails />
        <StatusDot />
      </View>
    </Pressable>
  );
};
export default PostItem;