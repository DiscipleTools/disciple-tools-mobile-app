import React from "react";
import { Pressable, Text, View } from "react-native";
import { ActionSheet, Icon } from "native-base";

import { useNavigation } from "@react-navigation/native";

import PostItemSkeleton from "./PostItemSkeleton";

import useAPI from "hooks/useAPI";
import useI18N from "hooks/useI18N";
import useSettings from "hooks/useSettings";
import useStyles from "hooks/useStyles";
import useTheme from "hooks/useTheme";
import useType from "hooks/useType";

import { localStyles } from "./PostItem.styles";

const PostItem = ({ item, loading, mutate }) => {

  const navigation = useNavigation();
  const { i18n, isRTL } = useI18N();
  // TODO: move to useStyles?
  const { getSelectorColor } = useTheme();
  const { styles, globalStyles } = useStyles(localStyles);
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
      <Text style={[
        globalStyles.text,
        styles.title
      ]}>
        { item?.name ? item.name : item?.title}
      </Text>
  );

  const PostSubtitle = () => {
    const { isContact, isGroup } = useType();
    const { settings } = useSettings();
    if (!settings) return null;
    return (
        <Text style={[
          globalStyles.caption,
          styles.subtitle
        ]}>
          {isContact && (
            <>
              {settings.fields.overall_status?.values[item?.overall_status]
                ? settings.fields.overall_status.values[item?.overall_status]
                  .label
                : ""}
              {settings.fields.overall_status?.values[item?.overall_status] &&
              settings.fields.seeker_path.values[item?.seeker_path]
                ? " • "
                : ""}
              {settings.fields.seeker_path?.values[item?.seeker_path]
                ? settings.fields.seeker_path.values[item?.seeker_path].label
                : ""}
            </>
          )}
          {isGroup && (
            <>
              {settings.fields.group_status.values[item?.group_status]
                ? settings.fields.group_status.values[item?.group_status].label
                : ""}
              {settings.fields.group_status.values[item?.group_status] &&
              settings.fields.group_type.values[item?.group_type]
                ? " • "
                : ""}
              {settings.fields.group_type.values[item?.group_type]
                ? settings.fields.group_type.values[item?.group_type].label
                : ""}
              {settings.fields.group_type.values[item?.group_type] &&
              item?.member_count
                ? " • "
                : ""}
              {item?.member_count ? item.member_count : ""}
            </>
          )}
        </Text>
    );
  };

  const StatusDot = () => {
    const backgroundColor = getSelectorColor(isContact ? item?.overall_status : item?.group_status);
    return (
      <View style={[
          globalStyles.rowIcon,
          styles.statusDot,
          { backgroundColor }
        ]}
      />
    );
  };

  const FavoriteStar = () => (
    <View style={globalStyles.columnContainer}>
      <Pressable onPress={() => updatePost({ favorite: !item?.favorite }, Number(item?.ID), item?.post_type, mutate)}>
        <View style={globalStyles.rowIcon}>
          <Icon
            type="FontAwesome"
            name={item?.favorite ? "star" : "star-o"}
            style={globalStyles.icon}
          />
        </View>
      </Pressable>
    </View>
  );

  const PostDetails = () => (
    <View style={[
      globalStyles.columnContainer,
      styles.postDetails,
    ]}>
      <PostTitle />
      <PostSubtitle />
    </View>
  );

  if (!item || loading) return <PostItemSkeleton />;

  return (
    <Pressable
      key={item?.ID}
      onPress={() => goToDetailsScreen(item) }
      onLongPress={() => onLongPress()}
    >
      <View style={[
        globalStyles.rowContainer,
        styles.postItem
      ]}>
        <FavoriteStar />
        <PostDetails />
        <StatusDot />
      </View>
    </Pressable>
  );
};
export default PostItem;