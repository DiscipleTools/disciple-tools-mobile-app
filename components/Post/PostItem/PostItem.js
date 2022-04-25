import React from "react";
import { Pressable, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import {
  CommentActivityIcon,
  MeatballIcon,
  StarIcon,
  StarOutlineIcon
} from "components/Icon";
import PostItemSkeleton from "./PostItemSkeleton";
import SelectSheet from "components/Sheet/SelectSheet";
import SheetHeader from "components/Sheet/SheetHeader";

import useAPI from "hooks/use-api";
import useBottomSheet from "hooks/use-bottom-sheet";
import useHaptics from "hooks/use-haptics";
import useI18N from "hooks/use-i18n";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import { ScreenConstants, SubTypeConstants } from "constants";

import { parseDateShort, truncate } from "utils";

import { localStyles } from "./PostItem.styles";

const PostItem = ({ item, loading, mutate }) => {
  const navigation = useNavigation();
  const { expand } = useBottomSheet();
  const { i18n } = useI18N();
  const { vibrate } = useHaptics();
  const { styles, globalStyles } = useStyles(localStyles);
  const { updatePost } = useAPI();
  const { settings } = useSettings();
  if (!settings) return null;

  const generateOptions = () => {
    const sections = [
      {
        data: [
          {
            key: "commentsActivity",
            label: i18n.t("global.commentsActivity"),
            icon: <CommentActivityIcon />,
          },
        ],
      },
    ];
    return sections;
  };

  const onChange = (value) => {
    const key = value?.key;
    if (key === "commentsActivity") {
      navigation.push(ScreenConstants.COMMENTS_ACTIVITY, {
        id: item?.ID,
        name: item?.title,
        type: item?.post_type,
        subtype: SubTypeConstants.COMMENTS_ACTIVITY
      });
    };
    return null;
  };

  const showSheet = (item) => {
    const title = item?.name;
    const sections = generateOptions();
    expand({
      snapPoints: ["33%","95%"],
      dismissable: true,
      defaultIndex: 0,
      renderHeader: () => (
        <SheetHeader
          expandable
          dismissable
          title={title}
        />
      ),
      renderContent: () => (
        <SelectSheet
          sections={sections}
          onChange={onChange}
        />
      )
    });
  };

  const onLongPress = () => null;

  const PostTitle = () => {
    const title = item?.name ? item.name : item?.title;
    return (
      <Text style={[globalStyles.text, styles.title]}>
        {truncate(title, { maxLength: 33 })}
      </Text>
    );
  };

  const PostSubtitle = () => {
    const { isContact, isGroup } = useType();
    return (
      <Text style={globalStyles.caption}>
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

  const getStatusColor = () => {
    if (item?.overall_status) return settings?.fields?.overall_status?.values?.[item.overall_status]?.color;
    if (item?.group_status) return settings?.fields?.group_status?.values?.[item.group_status]?.color;
    return settings?.fields?.status?.values?.[item?.status]?.color;
  };

  const StatusBorder = () => {
    const backgroundColor = getStatusColor();
    return(
      <View
        style={{
          width: 10,
          backgroundColor
        }}
      />
    );
  };

  const FavoriteStar = () => {
    return (
      <Pressable
        onPress={() => {
          vibrate();
          updatePost({
            fields: { favorite: !item?.favorite },
            id: Number(item?.ID),
            type: item?.post_type,
            mutate,
          })
        }}
        style={globalStyles.columnContainer}
      >
        <View style={globalStyles.icon}>
          {item?.favorite ? (
            <StarIcon />
          ) : (
            <StarOutlineIcon />
          )}
        </View>
      </Pressable>
    );
  };
  const PostDetails = () => (
    <View style={[globalStyles.columnContainer, styles.detailsContainer]}>
      <PostTitle />
      <PostSubtitle />
    </View>
  );

  /*
  const LastModifiedDate = () => (
    <Text style={styles.lastModifiedDateText}>
      { parseDateShort(item?.last_modified) }
    </Text>
  );
  */

  const SheetOptions = () => (
    <Pressable
      onPress={() => showSheet(item)}
      style={styles.meatballIcon}
    >
      <MeatballIcon />
    </Pressable>
  );

  if (!item || loading) return <PostItemSkeleton />;
  return (
    <View
      style={[
        globalStyles.rowContainer,
        styles.container
      ]}
    >
      <Pressable
        key={item?.ID}
        onPress={() => {
          navigation.push(ScreenConstants.DETAILS, {
            id: item?.ID,
            name: item?.title,
            type: item?.post_type,
          });
        }}
        //onLongPress={() => onLongPress()}
        style={[
          globalStyles.rowContainer,
          styles.subcontainer
        ]}
      >
        <StatusBorder />
        <View style={[
          globalStyles.rowContainer,
          styles.subsubcontainer
        ]}>
          <FavoriteStar />
          <PostDetails />
        </View>
      </Pressable>
      <SheetOptions />
    </View>
  );
};

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps?.item?.ID === nextProps?.item?.ID;
};

export default React.memo(PostItem, arePropsEqual);
