import React, { useLayoutEffect, useReducer, useState } from "react";
import { Linking, Platform, Text } from "react-native";
import { Icon } from "native-base";
import { Row } from "react-native-easy-grid";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Tab, Tabs, TabHeading, ScrollableTab } from "native-base";

import OfflineBar from "components/OfflineBar";
import Tile from "./Tile";
import TitleBar from "./TitleBar";
import PostSkeleton from "./PostSkeleton";
import KebabMenu from "components/KebabMenu";

import useI18N from "hooks/useI18N";
import useDetails from "hooks/useDetails";
import useSettings from "hooks/useSettings";
import useAPI from "hooks/useAPI";

import { styles } from "./Post.styles";

/*
const initialState = {};

const actions = {
  UPDATE: 'UDPATE',
  CANCEL: 'CANCEL',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.UPDATE:
      console.log("*** UPDATE ***");
      console.log(JSON.stringify(action.fields));
      return { ...state, ...action.fields };
    case actions.CANCEL:
      return initialState;
    default:
      return state;
  };
};
  const [state, dispatch] = useReducer(reducer, initialState);
  const tileSave = (fields) => dispatch({ type: actions.UPDATE, fields });
*/

const Post = ({ editOnly=false }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { i18n } = useI18N();
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
  const { updatePost } = useAPI();
  //const [index, setIndex] = useState(0);

  const [editing, setEditing] = useState(editOnly ? true : false);

  const renderHeaderLeft = (props) => {
    const onBack = () => {
      // TODO: test this
      //dispatch({ type: actions.CANCEL });
      //setEditing(false);
      navigation.goBack();
    };
    const onCancel = () => {
      //setEditing(false);
      dispatch({ type: actions.CANCEL });
    };
    return(
      <Row
        style={[
          styles.headerRow,
          isRTL ? { direction: "rtl" } : { direction: "ltr" },
        ]}
      >
        { editing && !editOnly ? (
          <Icon
            type="AntDesign"
            name={"close"}
            onPress={onCancel}
            style={styles.headerIcon}
          />
        ) : (
          <Icon
            type="Feather"
            name={ isRTL ? "arrow-right" : "arrow-left" }
            onPress={onBack}
            style={styles.headerIcon}
          />
        )}
      </Row>
    );
  };

  /*
  const kebabMenuItems = [
    {
      label: i18n.t('global.share'),
      callback: () => setShowShare(!showShare),
    },
    {
      label: i18n.t('global.viewOnMobileWeb'),
      callback: () => {
        const domain = userData?.domain;
        if (domain && postId) {
          Linking.openURL(`https://${domain}/${postType}/${postId}/`);
        } else {
          toast(i18n.t('global.error.recordData'), true);
        }
      },
    },
  ];
  */

  const renderHeaderRight = (props) => {
    const onEdit = () => null; //setEditing(true);
    const onSave = () => {
      console.log("*** ON SAVE ***");
      console.log(JSON.stringify(state));
    };
    return(
      <Row
        style={[
          styles.headerRow,
          isRTL ? { direction: "rtl" } : { direction: "ltr" },
        ]}
      >
        { editing || editOnly ? (
          <Icon
            type="AntDesign"
            name="save"
            onPress={onSave}
            style={styles.headerIcon}
          />
        ) : (
          <>
            <Icon
              type="AntDesign"
              name="edit"
              onPress={onEdit}
              style={styles.headerIcon}
            />
            <KebabMenu menuItems={null} />
          </>
        )}
      </Row>
    );
  };

  useLayoutEffect(() => {
    const title = route.params?.name ? '' : i18n.t('contactDetailScreen.addNewContact');
    navigation.setOptions({
      title,
      //headerLeft: (props) => isRTL ? renderHeaderRight(props) : renderHeaderLeft(props),
      //headerRight: (props) => isRTL ? renderHeaderLeft(props) : renderHeaderRight(props),
      headerStyle: styles.headerStyle, 
      headerTintColor: styles.headerTintColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        width: Platform.select({
          android: 180,
          ios: 140,
        }),
        //marginLeft: editing ? null : 25,
      },
    });
  }, [navigation, editing]);

  if (isLoading || isValidating) return <PostSkeleton />;
  return(
    <>
      <TitleBar />
      <OfflineBar />
      <Tabs
        renderTabBar={() => <ScrollableTab />}
        tabBarUnderlineStyle={styles.tabBarUnderline}
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
                //editing
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