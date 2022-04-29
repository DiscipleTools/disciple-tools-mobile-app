import React, {
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Pressable, View, useWindowDimensions } from "react-native";

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { HeaderLeft, HeaderRight } from "components/Header/Header";
import { CommentActivityIcon, StarIcon, StarOutlineIcon } from "components/Icon";
import OfflineBar from "components/OfflineBar";
import TitleBar from "components/TitleBar";
import Tile from "components/Post/Tile";
import PostSkeleton from "components/Post/PostSkeleton";
import FAB from "components/FAB";

import useAPI from "hooks/use-api";
import useDetails from "hooks/use-details";
import useHaptics from "hooks/use-haptics";
import useI18N from "hooks/use-i18n";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";

import { ScreenConstants, SubTypeConstants } from "constants";

import { localStyles } from "./DetailsScreen.styles";

const DetailsScreen = ({ navigation }) => {

  const layout = useWindowDimensions();
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { vibrate } = useHaptics();
  const {
    data: post,
    error,
    isLoading,
    isValidating,
    mutate,
    postId,
    postType,
  } = useDetails();
  const { settings } = useSettings();
  const { updatePost } = useAPI();

  const [index, setIndex] = useState(0);
  const [scenes, setScenes] = useState(null);
  const [routes, setRoutes] = useState([]);

  const renderScene = SceneMap(scenes);

  /*
   * NOTE: we need to stringify 'post' otherwise React will consider it
   * a new object and re-render until max update update depth is exceeded
   */
  useEffect(() => {
    if (!post || !settings) return;
    if (settings?.tiles?.length > 0) {
      let _scenes = {};
      let _routes = [];
      // TODO: constant
      const sortKey = "tile_priority";
      const sortedTiles = [...settings.tiles].sort((a, b) =>
        true ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
      );
      sortedTiles.forEach((tile, idx) => {
        if (tile?.name && tile?.label) {
          _scenes[tile.name] = () => (
            <Tile
              idx={idx}
              post={post}
              fields={tile?.fields}
              save={updatePost}
              mutate={mutate}
            />
          );
          _routes.push({
            key: tile.name,
            title: tile.label,
          });
        };
      });
      setScenes(_scenes);
      setRoutes(_routes);
    };
  }, [JSON.stringify(post), settings?.tiles?.length]);

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
            <Pressable
              onPress={() => {
                vibrate();
                updatePost({
                  fields: { favorite: !post?.favorite },
                  id: Number(post?.ID),
                  type: post?.post_type,
                  mutate,
                });
              }}
              style={[
                globalStyles.headerIcon,
                styles.headerIcon
              ]}
            >
              {post?.favorite ? (
                <StarIcon style={globalStyles.icon} />
              ) : (
                <StarOutlineIcon style={globalStyles.icon} />
              )}
            </Pressable>
            <View style={globalStyles.headerIcon}>
              <CommentActivityIcon
                onPress={() => {
                  navigation.push(ScreenConstants.COMMENTS_ACTIVITY, {
                    id: post?.ID,
                    name: post?.name,
                    type: post?.post_type,
                    subtype: SubTypeConstants.COMMENTS_ACTIVITY
                  });
                }}
              />
            </View>
            </>
          )}
          props
        />
      ),
    });
    //}, [navigation, route?.params?.name]);
    //}, []);
  });


  if (!scenes || !post || !settings || isLoading) return <PostSkeleton />;
  // TODO: switch to toggle Update Required
  // updatePost({ fields: { "requires_update": true|false }});
  return(
    <>
      <OfflineBar />
      <TitleBar
        center
        title={post?.title}
        style={styles.titleBar}
      />
      <TabView
        lazy
        renderLazyPlaceholder={() => <PostSkeleton />}
        keyboardDismissMode="none"
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
      <FAB />
    </>
  );
  return (
    <>
      <OfflineBar />
      <TitleBar
        center
        title={post?.title}
        style={styles.titleBar}
      />
      <TabScrollView
        index={index}
        onIndexChange={onIndexChange}
        scenes={scenes}
        style={globalStyles.screenContainer}
        contentContainerStyle={globalStyles.screenGutter}
      />
      <FAB />
    </>
  );
};
export default DetailsScreen;
