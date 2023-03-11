import React, { useRef, useState } from "react";
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
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import SelectSheet from "components/Sheet/SelectSheet";
import StatusBorder from "components/StatusBorder";

import useAPI from "hooks/use-api";
import useHaptics from "hooks/use-haptics";
import useI18N from "hooks/use-i18n";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";

import { getStatusKey } from "helpers";

import { ScreenConstants, SubTypeConstants, TypeConstants } from "constants";

import { parseDateSafe, titleize, truncate } from "utils";

import { localStyles } from "./PostItem.styles";

const getProgressKey = ({ postType }) => {
  if (postType === TypeConstants.CONTACT) return "seeker_path";
  if (postType === TypeConstants.GROUP) return "group_type";
  return "progress";
};

const FavoriteStar = ({ ID, post_type, favorite, globalStyles }) => {
  const { vibrate } = useHaptics();
  const { updatePost } = useAPI();
  const [isFavorite, setIsFavorite] = useState(favorite);
  return (
    <Pressable
      onPress={() => {
        vibrate();
        updatePost({
          id: Number(ID),
          type: post_type,
          data: { favorite: !favorite },
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

const PostTitle = ({ title, name, styles, globalStyles }) => {
  if (!title && !name) return null;
  return (
    <Text style={[globalStyles.text, styles.title]}>
      {titleize(name ?? title)}
    </Text>
  );
};

const PostSubtitle1 = ({ fields, item, numberFormat, globalStyles }) => {
  if (!fields) return null;
  const isGroup = item?.post_type === TypeConstants.GROUP;
  const statusKey = getStatusKey({ postType: item?.post_type });
  const progressKey = getProgressKey({ postType: item?.post_type });
  const subtitle1 =
    fields?.[statusKey]?.default?.[item?.[statusKey]?.key]?.label;
  const subtitle2 =
    fields?.[progressKey]?.default?.[item?.[progressKey]?.key]?.label;
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

const InfoIcons = ({ requires_update, isGroupLeader, styles }) => (
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

const PostSubtitle2 = ({
  last_modified,
  requires_update,
  isGroupLeader,
  moment,
  styles,
  globalStyles,
}) => {
  if (!last_modified?.timestamp) return null;
  const lastModDate = moment(parseDateSafe(last_modified.timestamp)).format(
    "L"
  );
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
        styles={styles}
      />
    </View>
  );
};

const PostItem = ({ item, loading }) => {
  const navigation = useNavigation();
  const { i18n, moment, numberFormat } = useI18N();
  const { styles, globalStyles } = useStyles(localStyles);

  const { settings } = useSettings();

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

  const onLongPress = () => null;

  if (!item || loading) return <PostItemSkeleton />;

  const fields = settings?.post_types?.[item?.post_type]?.fields;
  const title = item?.name;
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

  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = `${title}_modal`;
  const defaultIndex = getDefaultIndex({ items: sections?.[0]?.data });

  return (
    <>
      <View style={[globalStyles.rowContainer, styles.container]}>
        <Pressable
          key={item?.ID}
          onPress={() => {
            navigation.push(ScreenConstants.DETAILS, {
              id: item?.ID,
              name: item?.post_title,
              type: item?.post_type,
            });
          }}
          onLongPress={() => onLongPress()}
          style={[globalStyles.rowContainer, styles.subcontainer]}
        >
          <StatusBorder fields={fields} item={item} />
          <View style={[globalStyles.rowContainer, styles.subsubcontainer]}>
            <FavoriteStar
              ID={item?.ID}
              post_type={item?.post_type}
              favorite={item?.favorite}
              globalStyles={globalStyles}
            />
            <View
              style={[globalStyles.columnContainer, styles.detailsContainer]}
            >
              <PostTitle
                title={item?.post_title}
                name={item?.name}
                styles={styles}
                globalStyles={globalStyles}
              />
              <PostSubtitle1
                fields={fields}
                item={item}
                numberFormat={numberFormat}
                globalStyles={globalStyles}
              />
              <PostSubtitle2
                last_modified={item?.last_modified}
                requires_update={item?.requires_update}
                isGroupLeader={item?.group_leader?.values?.length > 0}
                moment={moment}
                styles={styles}
                globalStyles={globalStyles}
              />
            </View>
          </View>
        </Pressable>
        <Pressable
          onPress={() => modalRef?.current?.present()}
          style={[styles.icon, styles.actionIcon]}
        >
          <MeatballIcon />
        </Pressable>
      </View>
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={title}
        defaultIndex={defaultIndex}
      >
        <SelectSheet sections={sections} onChange={onChange} />
      </ModalSheet>
    </>
  );
};
export default PostItem;
