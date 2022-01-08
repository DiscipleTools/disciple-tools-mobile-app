import React, { useLayoutEffect, useReducer, useState } from "react";
import { Linking, Platform, Text } from "react-native";
import { Icon } from "native-base";
import { Row } from "react-native-easy-grid";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Tab, Tabs, TabHeading, ScrollableTab } from "native-base";

import OfflineBar from "components/OfflineBar";
import Tile from "./Tile";
import PostSkeleton from "./PostSkeleton";
import KebabMenu from "components/KebabMenu";

import useI18N from "hooks/useI18N";
import useDetails from "hooks/useDetails";
import useSettings from "hooks/useSettings";
import useToast from "hooks/useToast";
import useAPI from "hooks/useAPI";

import axios from "services/axios";

import { styles } from "./Post.styles";

const Post = ({ editOnly=false }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { i18n, isRTL } = useI18N();
  const {
    data: post,
    error: postError,
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
    const onBack = () => navigation.goBack();
    return(
      <Row
        style={[
          styles.headerRow,
          isRTL ? { direction: "rtl" } : { direction: "ltr" },
        ]}
      >
        <Icon
          type="Feather"
          name={ isRTL ? "arrow-right" : "arrow-left" }
          onPress={onBack}
          style={styles.headerIcon}
        />
      </Row>
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
      <Row
        style={[
          styles.headerRow,
          isRTL ? { direction: "rtl" } : { direction: "ltr" },
        ]}
      >
        <KebabMenu menuItems={kebabMenuItems} />
      </Row>
    );
  };

  useLayoutEffect(() => {
    const title = route?.params?.name ?? i18n.t('contactDetailScreen.addNewContact');
    navigation.setOptions({
      title,
      headerLeft: (props) => isRTL ? renderHeaderRight(props) : renderHeaderLeft(props),
      headerRight: (props) => isRTL ? renderHeaderLeft(props) : renderHeaderRight(props),
      headerStyle: styles.headerStyle, 
      headerTintColor: styles.headerTintColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        width: Platform.select({
          android: 180,
          ios: 140,
        }),
      },
    });
  }, [navigation, route?.params?.name]);

  if (isLoading) return <PostSkeleton />;
  return(
    <>
      <OfflineBar />
      <Tabs
        renderTabBar={() => <ScrollableTab />}
        tabBarUnderlineStyle={styles.tabBarUnderline}
        // TODO:
        //initialPage={index}
        onChangeTab={(evt) => {
          if (evt?.i === settings?.tiles?.length) {
            //setIndex(0);
            // TODO: constant
            navigation.navigate('CommentsActivity', {
              id: postId,
              type: postType,
              subtype: "comments_activity"
            });
          };
        }}
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
                fields={tile.fields}
                save={updatePost}
                mutate={mutate}
              />
            </Tab>
          );
        })}
        <Tab
          heading={
            <TabHeading style={styles.tabHeadingStyle}>
              <Text style={styles.tabHeading}>{i18n.t('global.commentsActivity')}</Text>
            </TabHeading>
          }
        />
      </Tabs>
    </>
  );
};
export default Post;