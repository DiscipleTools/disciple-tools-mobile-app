import React, { useLayoutEffect, useRef, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";

import { TabView, TabBar } from "react-native-tab-view";

import { HeaderLeft, HeaderRight } from "components/Header/Header";
import {
  CommentActivityIcon,
  StarIcon,
  StarOutlineIcon,
  SearchIcon,
  AddNewIcon,
  UpdateRequiredIcon,
  TasksIcon,
  FollowingIcon,
  ShareIcon,
  ExternalLinkIcon,
  HelpIcon,
} from "components/Icon";
import OfflineBar from "components/OfflineBar";
import TitleBar from "components/TitleBar";
import Tile from "components/Post/Tile";
import PostSkeleton from "components/Post/PostSkeleton";
import { PostFAB } from "components/FAB";
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import UsersSheet from "components/Field/UserSelect/UsersSheet";

import useAPI from "hooks/use-api";
import useDetails from "hooks/use-details";
import useHaptics from "hooks/use-haptics";
import useI18N from "hooks/use-i18n";
import useMyUser from "hooks/use-my-user";
import useSettings from "hooks/use-settings";
import useShares from "hooks/use-shares";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";

import { getSharesURL } from "helpers/urls";

import { ScreenConstants, SubTypeConstants, TileNames } from "constants";

import { localStyles } from "./DetailsScreen.styles";
import { FieldNames } from "constants";

// expects fields in Object.entries(...) format
const filterPostFields = ({ fields, post }) =>
  fields?.filter(([key, _]) => key in post);

// expects fields in Object.entries(...) format
const filterTileFields = ({ fields, tileKey }) =>
  fields?.filter(([_, field]) => field?.tile === tileKey);

const DetailsScreen = ({ navigation, route }) => {
  const layout = useWindowDimensions();
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { vibrate } = useHaptics();
  const {
    cacheKey,
    data: post,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useDetails();

  const postType = post?.post_type;
  const postId = post?.ID;
  const postName = route?.params?.name || post?.name || "";
  const favoriteValue = post?.favorite;
  const [isFavorite, setIsFavorite] = useState(
    favoriteValue === true || favoriteValue === "1"
  );

  const { data: shareData } = useShares(
    post ? getSharesURL({ postType, postId }) : null
  );
  let sharedIDs = [];
  if (shareData && shareData.length !== 0) {
    sharedIDs = shareData.map((item) => parseInt(item.user_id));
  }

  const { settings } = useSettings();

  const { updatePost, createShare } = useAPI();
  const { data: userData } = useMyUser();
  const toast = useToast();

  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = "share_modal";
  const defaultIndex = getDefaultIndex();
  const modalTitle = i18n.t("global.share");

  const _onChange = async (selectedUser) => {
    try {
      await createShare({ userId: selectedUser?.key });
    } catch (err) {
      toast(err, true);
    }
  };

  useLayoutEffect(() => {
    const kebabItems = [
      {
        label: i18n.t("global.viewOnWeb"),
        urlPath: `${postType}/${postId}`,
      },
      {
        label: i18n.t("global.documentation"),
        url: `https://disciple.tools/user-docs/disciple-tools-mobile-app/how-to-use/record-screens/#${postType}-screen`,
      },
    ];
    navigation.setOptions({
      title: "",
      headerLeft: (props) => <HeaderLeft props />,
      headerRight: (props) => (
        <HeaderRight
          kebabItems={kebabItems}
          renderStartIcons={() => (
            <>
              <Pressable onPress={() => modalRef?.current?.present()}>
                <ShareIcon />
              </Pressable>
              <Pressable
                onPress={() => {
                  vibrate();
                  const data = { favorite: !isFavorite };
                  updatePost({ data });
                  setIsFavorite(!isFavorite);
                }}
                style={[globalStyles.headerIcon, styles.headerIcon]}
              >
                {isFavorite ? (
                  <StarIcon style={globalStyles.icon} />
                ) : (
                  <StarOutlineIcon style={globalStyles.icon} />
                )}
              </Pressable>
              <View style={globalStyles.headerIcon}>
                <CommentActivityIcon
                  onPress={() => {
                    navigation.push(ScreenConstants.COMMENTS_ACTIVITY, {
                      post: { ...post },
                      id: postId,
                      name: postName,
                      type: postType,
                      subtype: SubTypeConstants.COMMENTS_ACTIVITY,
                    });
                  }}
                />
              </View>
              <ModalSheet
                ref={modalRef}
                name={modalName}
                title={modalTitle}
                defaultIndex={defaultIndex}
              >
                <UsersSheet
                  id={parseInt(userData.ID)}
                  onChange={_onChange}
                  sharedIDs={sharedIDs}
                />
              </ModalSheet>
            </>
          )}
          props
        />
      ),
    });
  }, [postId, postType, isFavorite]);

  const [index, setIndex] = useState(0);

  if (!settings || isLoading || !postType) return <PostSkeleton />;

  const fields = settings?.post_types?.[postType]?.fields;

  // TODO: open a bug report with API?
  /*
   * NOTE: the API does not specify a 'tile' property for some fields, so we
   * add the property here in order to have it be displayed under the expected
   * tile. (eg, "members", "reason_paused")
   *
   * (not doing the same for "leaders" because it is not currently displayed)
   */
  if (fields?.[FieldNames.MEMBERS] && !fields[FieldNames.MEMBERS]?.tile) {
    fields[FieldNames.MEMBERS]["tile"] = TileNames.RELATIONSHIPS;
  }
  if (fields?.[FieldNames.OVERALL_STATUS]) {
    const overallStatus = post?.[FieldNames.OVERALL_STATUS]?.key;
    if (
      overallStatus === "unassignable" ||
      overallStatus === "paused" ||
      overallStatus === "closed"
    ) {
      const reasonSettings = fields?.[`reason_${overallStatus}`];
      if (reasonSettings) {
        // this will mutate the settings/fields object, which is what we *want*
        reasonSettings["tile"] = TileNames.STATUS;
      }
    }
  }

  // filter fields where tile property does not exist
  const fieldEntries = Object.entries(fields || {});

  const tiles = settings?.post_types?.[postType]?.tiles;
  const tileEntries = Object.entries(tiles || {});

  // sort tiles by tile_priority
  const sortedTileEntries = [...tileEntries].sort(
    (a, b) => a[1]?.tile_priority - b[1]?.tile_priority
  );

  // tab view component routes
  const routes = sortedTileEntries.map(([key, val]) => ({
    key,
    title: val?.label ?? "",
  }));

  // tab view component render
  const renderScene = ({ route }) => {
    const tileFields = filterTileFields({
      fields: fieldEntries,
      tileKey: route.key,
    });
    const idx = routes.findIndex((_route) => _route.key === route);
    return (
      <Tile
        idx={idx}
        post={post}
        fields={tileFields}
        save={updatePost}
        mutate={mutate}
        cacheKey={cacheKey}
      />
    );
  };

  // TODO: switch to toggle Update Required
  // updatePost({ data: { "requires_update": true|false }});
  return (
    <>
      <OfflineBar />
      <TitleBar center title={postName} style={styles.titleBar} />
      <TabView
        lazy
        renderLazyPlaceholder={() => <PostSkeleton />}
        keyboardDismissMode="auto"
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBarContainer}
            activeColor={styles.tabBarLabelActive.color}
            inactiveColor={styles.tabBarLabelInactive.color}
            scrollEnabled
            tabStyle={styles.tabBarTab}
            indicatorStyle={styles.tabBarIndicator}
            //renderLabel={({ route, color }) => (
            //  <Text style={styles.tabBarLabel}>{route.title}</Text>
            //)}
          />
        )}
        style={globalStyles.surface}
      />
      <PostFAB />
    </>
  );
};
export default DetailsScreen;
