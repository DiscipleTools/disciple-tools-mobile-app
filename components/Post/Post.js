import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabView, TabBar } from 'react-native-tab-view';

import { HeaderLeft, HeaderRight } from "components/Header/Header";
import { CommentEditIcon } from "components/Icon";
import OfflineBar from "components/OfflineBar";
import TitleBar from "components/TitleBar";
import Tile from "./Tile";
// TODO: complete implementation
import PostSkeleton from "./PostSkeleton";
import CommentsActivity from "components/CommentsActivity";

import useBottomSheet from "hooks/use-bottom-sheet";
import useI18N from "hooks/use-i18n";
import useDetails from "hooks/use-details";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";
import useAPI from "hooks/use-api";

import { SubTypeConstants } from "constants";

import { localStyles } from "./Post.styles";

// TODO: move back to DetailsScreen? bc it is more intuitive
const Post = () => {

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { expand } = useBottomSheet();
  const { i18n } = useI18N();
  const {
    data: post,
    error,
    isLoading,
    isValidating,
    mutate,
    postId,
    postType
  } = useDetails();
  const { settings } = useSettings();
  const { updatePost } = useAPI();

  const [state, setState] = useState({
    index: 0,
    routes: []
  });

  useEffect(() => {
    if (settings?.tiles?.length > 0) {
      setState({
        ...state,
        routes: settings?.tiles?.map((tile, idx) => ({
          key: tile?.name ?? idx,
          title: tile?.label
        })) ?? []
      });
    };
    return;
  }, [settings?.tiles?.length]);

  useLayoutEffect(() => {
    const kebabItems = [
      {
        label: i18n.t('global.viewOnMobileWeb'),
        urlPath: `/${postType}/${postId}/`
      },
      {
        label: i18n.t('settingsScreen.helpSupport'),
        url: `https://disciple.tools/user-docs/getting-started-info/${postType}/${postType}-record-page/`
      }
    ];
    navigation.setOptions({
      title: '',
      headerLeft: (props) => (
        <HeaderLeft props />
      ),
      headerRight: (props) => (
        <HeaderRight
          kebabItems={kebabItems}
          renderStartIcons={() => (
            <View style={globalStyles.headerIcon}>
              <CommentEditIcon onPress={showCommentsActivitySheet} />
            </View>
          )}
          props
        />
      ),
    });
  //}, [navigation, route?.params?.name]);
  //}, []);
  });

  const showCommentsActivitySheet = () => {
    navigation.setParams({
      subtype: SubTypeConstants.COMMENTS_ACTIVITY
    });
    expand({
      hideFooter: true,
      snapPoints: ['66%','95%'],
      renderContent: () => (
        <CommentsActivity
          headerHeight={headerHeight}
          insets={insets}
        /> 
      )
    });
  };

  const handleIndexChange = (index) => setState({ ...state, index });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  );

  const renderScene = ({ route }) => {
    const tile = settings?.tiles?.find(tile => tile?.name === route?.key);
    return(
      <Tile
        post={post}
        fields={tile?.fields}
        save={updatePost}
        mutate={mutate}
      />
    );
  };

  if (!post || !settings || isLoading) return <PostSkeleton />;
  return(
    <View style={styles.screenContainer}>
      <OfflineBar />
      <TitleBar center title={post?.title} />
      <TabView
        lazy
        navigationState={state}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
      />
    </View>
  );
};
export default Post;