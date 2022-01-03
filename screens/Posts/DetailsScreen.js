import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Linking, Text, View, useWindowDimensions } from "react-native";
//import PropTypes from "prop-types";

import { Tab, Tabs, TabHeading, ScrollableTab } from "native-base";

//import ExpoFileSystemStorage from "redux-persist-expo-filesystem";

import ContentLoader, { Rect, Circle } from "react-content-loader/native";

import FAB from "components/FAB";
import Tile from "components/Tile";
import OfflineBar from "components/OfflineBar";
import HeaderLeft from "components/HeaderLeft";
import KebabMenu from "components/KebabMenu";
import FieldSkeleton from "components/Field/FieldSkeleton";

import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";
import useType from "hooks/useType";
import useId from "hooks/useId";
import useDetails from "hooks/useDetails";
import useSettings from "hooks/useSettings";
import useMyUser from "hooks/useMyUser";
//import useDevice from "hooks/useDevice";
import useToast from "hooks/useToast";
import useAPI from "hooks/useAPI";

import Colors from "constants/Colors";

import { styles } from "./DetailsScreen.styles";

const DetailsScreen = ({ navigation, route }) => {
  const layout = useWindowDimensions();
  const windowWidth = layout.width;

  const isConnected = useNetworkStatus();

  const { i18n, isRTL } = useI18N();

  const toast = useToast();
  //const { isIOS } = useDevice();

  const { postType } = useType();

  const postId = useId();
  const {
    post,
    error: postError,
    isLoading,
    isValidating,
    mutate,
  } = useDetails(postId);

  const { settings } = useSettings();

  const { userData, error: userError } = useMyUser();

  const { updatePost } = useAPI();

  const [index, setIndex] = useState(0);
  const [showShare, setShowShare] = useState(false);

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

  useLayoutEffect(() => {
    const title = route.params?.name ?? i18n.t('contactDetailScreen.addNewContact');
    // TODO: use i18n translation for screen title
    navigation.setOptions({
      //title,
      headerLeft: (props) => <HeaderLeft {...props} onPress={() => navigation.goBack()} />,
      headerRight: () => <KebabMenu menuItems={[]} />,
      headerStyle: {
        backgroundColor: Colors.tintColor,
        shadowColor: 'transparent',
      },
      headerTintColor: Colors.headerTintColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        width: Platform.select({
          android: 180,
          ios: 140,
        }),
        //marginLeft: editing ? null : 25,
      },
    });
  }, [navigation]);

  /*
  useEffect(() => {
    //onLoad();
    // Add afterBack param to execute 'parents' functions (ContactsView, NotificationsView)
    //if (!navigation.state.params.afterBack) {
    //  params = {
    //    ...params,
    //    afterBack: afterBack.bind(this),
    //  };
    //}
    //navigation.setParams(params);
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    navigation.addListener('didFocus', () => {
      //Focus on 'detail mode' (going back or open detail view)
      console.log('*** DID FOCUS ***');
      //if (contactIsCreated()) {
      //  dispatch(loadingFalse());
      //  onRefresh(navigation.state.params.contactId, true);
      //}
    });
    // Android hardware back press listener
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('*** ANDROID HARDWARE BACK PRESS ***');
      // TODO
      //navigation.state.params.backButtonTap();
      //return true;
    });
    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
      navigation.removeListener('didFocus');
      backHandler.remove();
    };
  }, []);

  const keyboardDidShow = (event) => {
    setState({
      ...state,
      footerLocation: isIOS ? event.endCoordinates.height : 0,
    });
  };

  const keyboardDidHide = (event) => {
    setState({
      ...state,
      footerLocation: 0,
    });
  };

  const backButtonTap = () => {
    let { params } = navigation.state;
    if (params.hideTabBar) {
      setState(
        {
          ...state,
          executingBack: true,
        },
        () => {
          navigation.setParams({
            hideTabBar: false,
          });
        }
      );
    } else {
      //Fix to returning using Android back button! -> goBack(null)
      navigation.goBack(null);
      navigation.state.params.afterBack();
    }
  };

  const afterBack = () => {
    let newPreviousContacts = [...previousContacts];
    newPreviousContacts.pop();
    //dispatch(updatePrevious(newPreviousContacts));
    if (newPreviousContacts.length > 0) {
      //dispatch(loadingFalse());
      let currentParams = {
        ...newPreviousContacts[newPreviousContacts.length - 1],
      };
      setState({
        ...state,
        contact: {
          ID: currentParams.contactId,
          name: currentParams.contactName,
          sources: {
            values: [
              {
                value: "personal",
              },
            ],
          },
          seeker_path: "none",
        },
        overallStatusBackgroundColor: "#ffffff",
      });
      navigation.setParams({
        ...currentParams,
      });
      onRefresh(currentParams.contactId, true);
    } else if (navigation.state.params.fromNotificationView) {
      //const resetAction = StackActions.reset({
      //  index: 0,
      //  actions: [NavigationActions.navigate({ routeName: 'ContactList' })],
      //});
      //navigation.dispatch(resetAction);
      navigation.navigate("NotificationList");
    } else {
      // Prevent error when view loaded from GroupDetailScreen.js
      if (typeof navigation.state.params.onGoBack === "function") {
        navigation.state.params.onGoBack();
      }
    }
  };

  const getLists = async () => {
    let newState = {};
    const users = await ExpoFileSystemStorage.getItem("usersList");
    if (users !== null) {
      newState = {
        ...newState,
        users: JSON.parse(users).map((user) => {
          let newUser = {
            key: user.ID,
            label: user.name,
          };
          // Prevent 'null' values
          if (
            Object.prototype.hasOwnProperty.call(user, "contact_id") &&
            utils.isNumeric(user.contact_id)
          ) {
            newUser = {
              ...newUser,
              contactID: parseInt(user.contact_id),
            };
          }
          return newUser;
        }),
      };
    }

    const peopleGroups = await ExpoFileSystemStorage.getItem(
      "peopleGroupsList"
    );
    if (peopleGroups !== null) {
      newState = {
        ...newState,
        peopleGroups: JSON.parse(peopleGroups),
      };
    }

    const geonames = await ExpoFileSystemStorage.getItem("locationsList");
    if (geonames !== null) {
      newState = {
        ...newState,
        geonames: JSON.parse(geonames),
      };
    }

    let sourcesList = Object.keys(contactSettings.fields.sources.values).map(
      (key) => ({
        name: contactSettings.fields.sources.values[key].label,
        value: key,
      })
    );

    const mappedContacts = contactsList.map((contact) => {
      return {
        name: contact.title,
        value: contact.ID,
        avatarUri: null,
      };
    });
    const mappedUsers = JSON.parse(users).map((user) => {
      return {
        name: user.name,
        value: String(user.contact_id),
        avatarUri: user.avatar,
      };
    });
    newState = {
      ...newState,
      usersContacts: [...mappedContacts, ...mappedUsers],
      groups: groupsList.map((group) => ({
        name: group.title,
        value: group.ID,
      })),
      loadedLocal: true,
      sources: [...sourcesList],
      unmodifiedSources: [...sourcesList],
    };

    setState(newState, () => {
      // Only execute in detail mode
      if (contactIsCreated()) {
        onRefresh(state.record.ID);
      }
    });
  };
  */

  const Post = () => (
    <Tabs
      renderTabBar={() => <ScrollableTab />}
      tabBarUnderlineStyle={styles.tabBarUnderline}
      initialPage={index}
      onChangeTab={(evt) => {
        if (evt?.i === settings?.tiles?.length) {
          setIndex(0);
          navigation.navigate('CommentsActivity', {
            id: postId,
            type: postType,
            subtype: "comments_activity"
          });
        } else {
          setIndex(evt.i);
        };
      }}
    >
      {settings.tiles.map((tile) => {
        return (
          <Tab
            heading={
              <TabHeading>
                <Text style={styles.tabHeading}>{tile?.label}</Text>
              </TabHeading>
            }
            style={styles.background}
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
          <TabHeading>
            <Text style={styles.tabHeading}>{i18n.t('global.commentsActivity')}</Text>
          </TabHeading>
        }
        style={styles.background}
      />
    </Tabs>
  );

  const DetailsSkeleton = () => {
    const skeletons = Array(7).fill("");
    return (
      <>
        <ContentLoader
          rtl={isRTL}
          speed={3}
          width={windowWidth}
          height={65}
          viewBox={"0 " + "0 " + windowWidth + " 80"}
          backgroundColor="#e7e7e7"
          foregroundColor="#b7b7b7"
        >
          <Rect x="0" y="25" rx="2" ry="2" width="75" height="20" />
          <Rect x="0" y="50" rx="2" ry="2" width="100" height="8" />
          <Rect x="120" y="25" rx="2" ry="2" width="75" height="20" />
          <Rect x="240" y="25" rx="2" ry="2" width="75" height="20" />
          <Rect x="360" y="25" rx="2" ry="2" width="75" height="20" />
          <Rect x="0" y="65" rx="2" ry="2" width={windowWidth} height="1" />
        </ContentLoader>
        {skeletons.map((fieldSkeleton) => (
          <FieldSkeleton isRTL={isRTL} windowWidth={windowWidth} />
        ))}
        <ContentLoader
          rtl={isRTL}
          speed={3}
          width={windowWidth}
          height={100}
          viewBox={"0 " + "0 " + windowWidth + " 80"}
          backgroundColor="#e7e7e7"
          foregroundColor="#b7b7b7"
        >
          <Circle cx="350" cy="60" r="35" />
        </ContentLoader>
      </>
    );
  };

  const TitleBar = () => {
    let title = route.params?.name ?? null;
    const charThreshold = 35;
    if (title?.length > charThreshold) {
      title = title.substring(0, charThreshold) + "...";
    };
    return(
      <View style={styles.titleBar}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };

  //<KeyboardAvoidingView behavior="position" style={{ flexGrow: 1 }}></KeyboardAvoidingView>
  const Details = () => (
    <>
      {isLoading || isValidating ? (
        <DetailsSkeleton />
      ) : (
        <>
          {!isConnected && <OfflineBar />}
          <TitleBar />
          {isCreate ? <CreatePost /> : <Post />}
        </>
      )}
    </>
  );

  if (postError || userError || !postId)
    toast(
      postError?.message || userError?.message,
      true
    );

  const isCreate = route?.params?.create;
  //const isCreate = true;
  return (
    <>
      <Details />
      <FAB post={post} settings={settings} />
    </>
  );
};
/*
DetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};
*/
export default DetailsScreen;
