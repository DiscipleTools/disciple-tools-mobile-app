import React, { useState, useEffect } from "react";
import { ActivityIndicator, Image, View, Keyboard, KeyboardAvoidingView, TextInput, Text, Platform, TouchableWithoutFeedback, Button, StatusBar, Pressable } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as Clipboard from 'expo-clipboard';

import { ActionSheet, Container, Icon } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";

import ParsedText from "react-native-parsed-text";
import MentionsTextInput from "react-native-mentions";

import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import PostItemSkeleton from "components/PostItem/PostItemSkeleton";

import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";
import useComments from "hooks/useComments";
import useActivity from "hooks/useActivity";
import useMyUser from "hooks/useMyUser";
import useRequestQueue from "hooks/useRequestQueue";
import useToast from "hooks/useToast";

// TODO: refactor out
import Colors from "constants/Colors";
import utils from "utils";

import { styles } from "./CommentsActivityScreen.styles";

const CommentsActivityScreen = ({ navigation, route }) => {

  const isConnected = useNetworkStatus();
  const { i18n, isRTL } = useI18N();
  const toast = useToast();
  const { userData } = useMyUser();

  const { request } = useRequestQueue();

  const [excludeComments, setExcludeComments] = useState(false);
  const [excludeActivity, setExcludeActivity] = useState(false);

  /*
  const [expandedTextInput, toggleExpandedTextInput] = useState(false);
  useEffect(() => {
    if (expandedTextInput) navigation.navigate("FullScreenModal", {
      title: "...",
      renderView: () => null
    };
    return;
  }, [expandedTextInput])
  */

  const [search, setSearch] = useState(null);
  const [filter, setFilter] = useState(null);

  const onSearch = (search) => setSearch(search);
  const onFilter = (filter) => null; //dispatchFilter({ type: "SET_FILTER", filter });

  const items = [];
  const { data: comments, error, isLoading, isValidating, mutate } = useComments({ exclude: excludeComments });
  const { data: activity } = useActivity({ exclude: excludeActivity });
  if (!excludeComments && !comments) return null;
  if (!excludeActivity && !activity) return null;
  if (comments) items.push(...comments);
  if (activity) items.push(...activity);

  let isError = false;
  if (error) {
    isError = true;
    // TODO
    //toast(error, true);
    console.error(error);
  };

  const username = userData?.display_name;

  const onClear = () => {
    //setComment('');
    console.log("*** ON CLEAR ***");
    Keyboard.dismiss();
    mutate();
  };

  // TODO: implement this skeleton 
  const CommentsActivityItemLoadingSkeleton = () => <PostItemSkeleton />;

  const CommentsActivityItem = ({ item, loading }) => {
    const message = item?.comment_content || item?.object_note;
    const author = item?.comment_author || item?.name;
    const userIsAuthor = author?.toLowerCase() === username?.toLowerCase();
    if (!item || loading) return <CommentsActivityItemLoadingSkeleton />;
    const onCopy = () => Clipboard.setString(message);
    // TODO: add support for Activity type
    const onDelete = async() => {
      const postType = route?.params?.type;
      const postId = route?.params?.id;
      const commentId = item?.comment_ID;
      const url = `/dt-posts/v2/${postType}/${postId}/comments/${commentId}`;
      try {
        await request({
          url,
          method: 'DELETE',
        });
        mutate();
      } catch (error) {
        toast(error, true);
      };
    };
    const onLongPress = () => {
      // TODO: add term and translate "Copy"
      ActionSheet.show({
          options: userIsAuthor ? [
            "Copy",
            i18n.t("global.edit"),
            i18n.t("global.delete"),
            i18n.t("global.cancel"),
          ] : [
            "Copy",
            i18n.t("global.cancel"),
          ],
          cancelButtonIndex: userIsAuthor ? 3 : 1,
          destructiveButtonIndex: userIsAuthor ? 2 : null,
          title: null 
        },
        buttonIndex => {
          if (buttonIndex === 0) onCopy();
          if (userIsAuthor && buttonIndex === 2) onDelete(item);
          //if (userIsAuthor && buttonIndex === 1) onEdit(item);
        }
      );
    };
    return(
      <Pressable onLongPress={() => onLongPress()}>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={{ uri: item?.gravatar ?? "https://www.gravatar.com/avatar/?d=mp" }}
          />
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Grid>
                <Row>
                  <Col>
                    <Text
                      style={[
                        styles.name,
                        isRTL ? { textAlign: "left", flex: 1 } : {},
                      ]}
                    >
                      { author }
                    </Text>
                  </Col>
                  <Col style={{ width: 110 }}>
                    <Text
                      style={[
                        styles.time,
                        isRTL
                          ? { textAlign: "left", flex: 1 }
                          : { textAlign: "right" },
                      ]}
                    >
                      {/*utils.formatDateToView(item.date)*/}
                      {item?.date}
                    </Text>
                  </Col>
                </Row>
              </Grid>
            </View>
            <ParsedText
              //selectable
              style={[
                {
                  paddingLeft: 10,
                  paddingRight: 10,
                },
                item?.object_note ? { color: "#B4B4B4", fontStyle: "italic" } : {},
                isRTL ? { textAlign: "left", flex: 1 } : {},
                //index > 0 ? { marginTop: 20 } : {},
              ]}
              parse={[
                {
                  pattern: utils.mentionPattern,
                  style: { color: Colors.primary },
                  renderText: utils.renderMention,
                },
              ]}
            >
              { message }
            </ParsedText>
        </View>
      </View>
    </Pressable>
  );
};

const CustomKeyboardAvoidingView = ({ children, style }) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [bottomPadding, setBottomPadding] = useState(insets.bottom)
  const [topPadding, setTopPadding] = useState(insets.top)

  useEffect(() => {
    // This useEffect is needed because insets are undefined at first for some reason
    // https://github.com/th3rdwave/react-native-safe-area-context/issues/54
    setBottomPadding(insets.bottom)
    setTopPadding(insets.top)
  }, [insets.bottom, insets.top])

  return (
    <KeyboardAvoidingView
      style={style}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight + topPadding + StatusBar.currentHeight}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const CommentInput = () => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const onSave = async(comment) => {
    setLoading(true);
    if (comment?.length > 0) {
      // TODO: useURL() ?
      const postType = route?.params?.type;
      const postId = route?.params?.id;
      const url = `/dt-posts/v2/${postType}/${postId}/comments`;
      try {
        const res = await request({
          url,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: { comment }
        });
        toast("OK!");
        setComment(''); 
        mutate();
      } catch (error) {
        toast(error, true);
      } finally {
        setLoading(false);
      };
    };
    return;
  };
  return(
    <>
      { comment?.length > 0 && (
        <View style={{ flexGrow: 1, marginLeft: "auto", paddingTop: 5, paddingBottom: 15 }}>
          <Icon
            type="MaterialCommunityIcons"
            name="arrow-expand"
            style={{ fontSize: 24, color: Colors.gray }}
            //onPress={() => toggleExpandedTextInput(false)}
          />
        </View>
      )}
      <View style={styles.commentInput}>
        <TextInput
          editable={!loading}
          multiline={true}
          value={comment}
          onChangeText={(text) => setComment(text)}
          // TODO: translate
          placeholder={"Comment"}
          //autoFocus={true}
          style={{ flex: 1, fontSize: 16 }}
        />
        { !loading ? (
          <Icon
            type="MaterialCommunityIcons"
            name="send-circle"
            style={{ fontSize: 42, color: Colors.primary }}
            onPress={() => onSave(comment)}
          />
        ) : (
          <ActivityIndicator size="small" color={Colors.primary} />
        )}
      </View>
    </>
  );
};

// TODO: RTL support
const ExpandableTextInput = () => {
  const insets = useSafeAreaInsets();
  return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <CustomKeyboardAvoidingView style={{ backgroundColor: "#fff", flexGrow: 1, flexDirection: "column", justifyContent: "space-between", borderTopWidth: 1, borderColor: "#ccc" }}>
          <View style={{ height: 100, paddingLeft: 10, paddingRight: 10 }}>
            <CommentInput />
          </View>
        </CustomKeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  };

  const renderItem = ({ item }) => <CommentsActivityItem item={item} loading={isLoading||isValidating||isError} />;

  return (
    <Container>
      {!isConnected && <OfflineBar />}
      <FilterList
        items={(items?.length > 0) ? items : []}
        renderItem={renderItem}
        onRefresh={mutate}
        search={search}
        onSearch={onSearch}
        filter={filter}
        onFilter={onFilter}
        // TODO: add term and translate
        placeholder={"COMMENTS ACTIVITY PLACEHOLDER TEXT"}
      />
      <ExpandableTextInput />
    </Container>
  );
};
export default CommentsActivityScreen;