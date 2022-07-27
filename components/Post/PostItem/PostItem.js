import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import {
  UpdateRequiredIcon,
  CommentActivityIcon,
  LeaderIcon,
  MeatballIcon,
  StarIcon,
  StarOutlineIcon,
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

import { parseDateSafe, titleize, truncate } from "utils";

import { localStyles } from "./PostItem.styles";
import { mutate } from "swr";

const StatusBorder = ({ overall_status, group_status, status }) => {
  const { settings } = useSettings();
  if (!settings) return null;

  const getStatusColor = (settings) => {
    if (overall_status) {
      return settings?.fields?.overall_status?.values?.[overall_status]?.color;
    }
    if (group_status) {
      return settings?.fields?.group_status?.values?.[group_status]?.color;
    }
    return settings?.fields?.status?.values?.[status]?.color;
  };

  const backgroundColor = getStatusColor(settings);
  return (
    <View
      style={{
        width: 10,
        backgroundColor,
      }}
    />
  );
};

const FavoriteStar = ({ ID, post_type, favorite, mutate }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { vibrate } = useHaptics();
  const { updatePost } = useAPI();
  const [isFavorite, setIsFavorite] = useState(favorite);
  return (
    <Pressable
      onPress={() => {
        vibrate();
        updatePost({
          fields: { favorite: !favorite },
          id: Number(ID),
          type: post_type,
          mutate,
        });
        setIsFavorite(!isFavorite);
      }}
      style={globalStyles.columnContainer}
    >
      <View style={globalStyles.icon}>
        {isFavorite ? <StarIcon /> : <StarOutlineIcon />}
      </View>
    </Pressable>
  );
};

const PostTitle = ({ title, name }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  if (!title && !name) return null;
  return (
    <Text style={[globalStyles.text, styles.title]}>
      {titleize(name ?? title)}
    </Text>
  );
};

const PostSubtitle1 = ({ item }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { isGroup, postType } = useType();
  const { numberFormat } = useI18N();
  const { settings } = useSettings({ type: postType });
  if (!settings) return null;
  // TODO: constants?
  let subtitle1Key = "overall_status";
  if (isGroup) subtitle1Key = "group_status";
  let subtitle2Key = "seeker_path";
  if (isGroup) subtitle2Key = "group_type";
  //
  const subtitle1 =
    settings?.fields?.[subtitle1Key]?.values[item?.[subtitle1Key]]?.label;
  const subtitle2 =
    settings?.fields?.[subtitle2Key]?.values[item?.[subtitle2Key]]?.label;
  //
  let subtitle = "";
  if (subtitle1) subtitle += subtitle1;
  if (subtitle2) {
    if (subtitle1) subtitle += " • ";
    subtitle += subtitle2;
  }
  if (isGroup && item?.member_count)
    subtitle += ` • ${numberFormat(item.member_count)}`;
  return (
    <Text style={globalStyles.caption}>
      {truncate(subtitle, { maxLength: 70 })}
    </Text>
  );
};

const InfoIcons = ({ requires_update, isGroupLeader }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return (
    <>
      {requires_update && (
        <View style={styles.infoIconContainer}>
          <UpdateRequiredIcon style={[styles.alertIcon, styles.infoIcon]} />
        </View>
      )}
      {isGroupLeader && (
        <View style={styles.infoIconContainer}>
          <LeaderIcon style={styles.infoIcon} />
        </View>
      )}
    </>
  );
};

const PostSubtitle2 = ({ last_modified, requires_update, isGroupLeader }) => {
  const { moment } = useI18N();
  const { styles, globalStyles } = useStyles(localStyles);
  const lastModDate = moment(parseDateSafe(last_modified)).format("L");
  if (!lastModDate) return null;
  return (
    <View style={globalStyles.rowContainer}>
      <View>
        <Text style={[globalStyles.caption, styles.caption]}>
          {lastModDate}
        </Text>
      </View>
      <InfoIcons
        requires_update={requires_update}
        isGroupLeader={isGroupLeader}
      />
    </View>
  );
};

const PostItem = ({ item, loading }) => {
  const navigation = useNavigation();
  const { expand } = useBottomSheet();
  const { i18n } = useI18N();
  const { styles, globalStyles } = useStyles(localStyles);

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
        subtype: SubTypeConstants.COMMENTS_ACTIVITY,
      });
    }
    return null;
  };

  const showSheet = (item) => {
    const title = item?.name;
    const sections = generateOptions();
    expand({
      snapPoints: ["33%", "95%"],
      dismissable: true,
      defaultIndex: 0,
      renderHeader: () => <SheetHeader expandable dismissable title={title} />,
      renderContent: () => (
        <SelectSheet sections={sections} onChange={onChange} />
      ),
    });
  };

  const onLongPress = () => null;

  const SheetOptions = () => (
    <Pressable
      onPress={() => showSheet(item)}
      style={[styles.icon, styles.actionIcon]}
    >
      <MeatballIcon />
    </Pressable>
  );

  if (!item || loading) return <PostItemSkeleton />;
  return (
    <View style={[globalStyles.rowContainer, styles.container]}>
      <Pressable
        key={item?.ID}
        onPress={() => {
          navigation.push(ScreenConstants.DETAILS, {
            id: item?.ID,
            name: item?.title,
            type: item?.post_type,
          });
        }}
        onLongPress={() => onLongPress()}
        style={[globalStyles.rowContainer, styles.subcontainer]}
      >
        <StatusBorder
          overall_status={item?.overall_status}
          group_status={item?.group_status}
          status={item?.status}
        />
        <View style={[globalStyles.rowContainer, styles.subsubcontainer]}>
          <FavoriteStar
            ID={item?.ID}
            post_type={item?.post_type}
            favorite={item?.favorite}
            mutate={mutate}
          />
          <View style={[globalStyles.columnContainer, styles.detailsContainer]}>
            <PostTitle title={item?.title} name={item?.name} />
            <PostSubtitle1 item={item} />
            <PostSubtitle2
              last_modified={item?.last_modified}
              requires_update={item?.requires_update}
              isGroupLeader={item?.group_leader?.values?.length > 0}
            />
          </View>
        </View>
      </Pressable>
      <SheetOptions />
    </View>
  );
};
export default PostItem;
