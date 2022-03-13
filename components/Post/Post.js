import React, { useLayoutEffect } from "react";
import { Linking, Text, View } from "react-native";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Tab, Tabs, TabHeading, ScrollableTab } from "native-base";

import { ArrowLeftIcon, ArrowRightIcon, CommentEditIcon } from "components/Icon";
import OfflineBar from "components/OfflineBar";
import Tile from "./Tile";
// TODO: complete implementation
import PostSkeleton from "./PostSkeleton";
import KebabMenu from "components/KebabMenu";
import CommentsActivity from "components/CommentsActivity";

import useBottomSheet from "hooks/use-bottom-sheet";
import useI18N from "hooks/use-i18n";
import useDetails from "hooks/use-details";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";
import useAPI from "hooks/use-api";

import axios from "services/axios";

import { SubTypeConstants } from "constants";

import { localStyles } from "./Post.styles";

const Post = ({ editOnly=false }) => {

  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { styles, globalStyles } = useStyles(localStyles);
  const { expand } = useBottomSheet();
  const { i18n, isRTL } = useI18N();
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
  const toast = useToast();
  const { updatePost } = useAPI();

  const renderHeaderLeft = (props) => {
    const onBack = () => navigation.pop(); //ToTop(); //goBack();
    return(
      <View style={globalStyles.rowContainer}>
        {isRTL ? <ArrowRightIcon onPress={onBack} /> : <ArrowLeftIcon onPress={onBack} />}
      </View>
    );
  };

  const renderHeaderRight = (props) => {
    const kebabMenuItems = [
      /*
      {
        label: i18n.t('global.share'),
        callback: () => null
      },
      */
      {
        label: i18n.t('global.viewOnMobileWeb'),
        callback: () => {
          const url = axios.defaults.baseURL?.split("/wp-json")[0];
          if (url && postId) {
            Linking.openURL(`${url}/${postType}/${postId}/`);
          } else {
            toast(i18n.t('global.error.noRecords'), true);
          }
        },
      },
    ];
    return(
      <View style={globalStyles.rowContainer}>
        <CommentEditIcon onPress={showCommentsActivitySheet} />
        <KebabMenu menuItems={kebabMenuItems} />
      </View>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: (props) => isRTL ? renderHeaderRight(props) : renderHeaderLeft(props),
      headerRight: (props) => isRTL ? renderHeaderLeft(props) : renderHeaderRight(props),
      //headerStyle: globalStyles.header, 
      headerTintColor: globalStyles.text.primary,
      headerTitleStyle: styles.headerTitle
    });
  }, [navigation, route?.params?.name]);

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

  const TitleBar = () => {
    const TITLE_THRESHOLD = 45;
    return(
      <View style={styles.titleBarContainer}>
        <Text style={styles.titleBarText}>
          {post?.title?.length > TITLE_THRESHOLD ? post.title.substring(0, TITLE_THRESHOLD) + "..." : post?.title}
        </Text>
      </View>
    );
  };

  if (!post || !settings || isLoading) return <PostSkeleton />;
  return(
    <>
      <OfflineBar />
      <TitleBar />
      <Tabs
        renderTabBar={() => <ScrollableTab />}
        tabBarUnderlineStyle={styles.tabBarUnderline}
        //initialPage={index}
        //onChangeTab={(evt) => {}}
      >
        {settings?.tiles?.map((tile, idx) => {
          return (
            <Tab
              key={tile?.name ?? idx}
              heading={
                <TabHeading style={styles.tabHeadingStyle}>
                  <Text style={styles.tabHeading}>{tile?.label}</Text>
                </TabHeading>
              }
              style={styles.tabStyle}
            >
              <Tile
                post={post}
                fields={tile?.fields}
                save={updatePost}
                mutate={mutate}
              />
            </Tab>
          );
        })}
      </Tabs>
    </>
  );
};
export default Post;
