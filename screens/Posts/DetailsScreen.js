import React, {
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { HeaderLeft, HeaderRight } from "components/Header/Header";
import { CommentEditIcon } from "components/Icon";
import OfflineBar from "components/OfflineBar";
import TitleBar from "components/TitleBar";
import TabScrollView from "components/TabScrollView";
import Tile from "components/Post/Tile";
import PostSkeleton from "components/Post/PostSkeleton";
import FAB from "components/FAB";

import useI18N from "hooks/use-i18n";
import useDetails from "hooks/use-details";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";
import useAPI from "hooks/use-api";

import { ScreenConstants, SubTypeConstants } from "constants";

import { localStyles } from "./DetailsScreen.styles";

const DetailsScreen = ({ navigation }) => {
  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();

  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
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

  const [index, onIndexChange] = useState(0);
  const [scenes, setScenes] = useState(null);

  /*
   * NOTE: we need to stringify 'post' otherwise React will consider it
   * a new object and re-render until max update update depth is exceeded
   */
  useEffect(() => {
    if (!post || !settings) return;
    if (settings?.tiles?.length > 0) {
      const sortKey = "tile_priority";
      const sortedTiles = [...settings.tiles].sort((a, b) =>
        true ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
      );
      setScenes(
        sortedTiles.map((tile) => ({
          label: tile?.label,
          component: (
            <Tile
              post={post}
              fields={tile?.fields}
              save={updatePost}
              mutate={mutate}
            />
          ),
        }))
      );
    }
  }, [JSON.stringify(post), settings?.tiles?.length]);

  useLayoutEffect(() => {
    const kebabItems = [
      {
        label: i18n.t("global.viewOnWeb"),
        urlPath: `/${postType}/${postId}/`,
      },
      {
        label: i18n.t("global.helpSupport"),
        url: `https://disciple.tools/user-docs/getting-started-info/${postType}/${postType}-record-page/`,
      },
    ];
    navigation.setOptions({
      title: "",
      headerLeft: (props) => <HeaderLeft props />,
      headerRight: (props) => (
        <HeaderRight
          kebabItems={kebabItems}
          renderStartIcons={() => (
            <View style={globalStyles.headerIcon}>
              <CommentEditIcon
                onPress={() => {
                  navigation.push(ScreenConstants.COMMENTS_ACTIVITY, {
                    type: postType,
                    subtype: SubTypeConstants.COMMENTS_ACTIVITY
                  });
                }}
              />
            </View>
          )}
          props
        />
      ),
    });
    //}, [navigation, route?.params?.name]);
    //}, []);
  });

  if (!post || !settings || isLoading) return <PostSkeleton />;
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
