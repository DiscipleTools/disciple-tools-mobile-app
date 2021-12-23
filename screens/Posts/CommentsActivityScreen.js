import React, { useState, useEffect } from "react";
/*
import {
  Keyboard,
  KeyboardAvoidingView,
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
*/
import { Image, View, Keyboard, KeyboardAvoidingView, TextInput, Text, Platform, TouchableWithoutFeedback, Button, StatusBar } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, Icon } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";

import ParsedText from "react-native-parsed-text";
import MentionsTextInput from "react-native-mentions";

import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import PostItemSkeleton from "components/PostItem/PostItemSkeleton";

import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";
import useDetails from "hooks/useDetails";
import useComments from "hooks/useComments";
import useActivity from "hooks/useActivity";
import useMyUser from "hooks/useMyUser";

// TODO: refactor out
import Colors from "constants/Colors";
import utils from "utils";

import { styles } from "./CommentsActivityScreen.styles";

const CommentsActivityScreen = ({ navigation, route }) => {

  const isConnected = useNetworkStatus();
  const { i18n, isRTL } = useI18N();
  const { userData } = useMyUser();

  const { save } = useDetails();

  const [excludeComments, setExcludeComments] = useState(false);
  const [excludeActivity, setExcludeActivity] = useState(false);

  const [expandedTextInput, toggleExpandedTextInput] = useState(false);

  /*
  useEffect(() => {
    if (expandedTextInput) navigation.navigate("FullScreenModal", {
      title: "...",
      renderView: () => null
    };
    return;
  }, [expandedTextInput])
  */

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

  // TODO: implement this skeleton 
  const CommentsActivityItemLoadingSkeleton = () => <PostItemSkeleton />;

  const CommentsActivityItem = ({ item, loading }) => {
    const message = item?.comment_content || item?.object_note;
    const author = item?.comment_author || item?.name;
    const userIsAuthor = author?.toLowerCase() === username?.toLowerCase();
    if (!item || loading) return <CommentsActivityItemLoadingSkeleton />;
    return(
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
            selectable
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
          { userIsAuthor && (
            <Grid style={{ marginTop: 20 }}>
              <Row
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
            >
                <Row
                  style={{ marginLeft: 0, marginRight: "auto" }}
                  onPress={() => {
                    //openCommentDialog(item, true);
                  }}
              >
                  <Icon
                    type="MaterialCommunityIcons"
                    name="delete"
                    style={{
                    color: Colors.iconDelete,
                    fontSize: 20,
                  }}
                />
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: 14,
                  }}
              >
                  {i18n.t("global.delete")}
                </Text>
              </Row>
              <Row
                style={{
                  marginLeft: "auto",
                  marginRight: 0,
                }}
                onPress={() => {
                  //openCommentDialog(item);
                }}
            >
                <Icon
                  type="MaterialCommunityIcons"
                  name="pencil"
                  style={{
                    color: Colors.primary,
                    fontSize: 20,
                    marginLeft: "auto",
                  }}
                />
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: 14,
                  }}
              >
                  {i18n.t("global.edit")}
                </Text>
              </Row>
            </Row>
          </Grid>
        )}
      </View>
    </View>
  );
};

const CustomKeyboardAvoidingView = ({ children, style }) => {
  const headerHeight = useHeaderHeight();
  console.log("headerHeight: " + headerHeight)
  console.log("StatusBar.currentHeight: " + StatusBar.currentHeight)

  const insets = useSafeAreaInsets();
  const [bottomPadding, setBottomPadding] = useState(insets.bottom)
  const [topPadding, setTopPadding] = useState(insets.top)

  useEffect(() => {
    // This useEffect is needed because insets are undefined at first for some reason
    // https://github.com/th3rdwave/react-native-safe-area-context/issues/54
    setBottomPadding(insets.bottom)
    setTopPadding(insets.top)

    console.log("topPadding: " + topPadding)
    console.log("bottomPadding: " + bottomPadding)
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
  return(
    <>
      { comment?.length > 0 && (
        <View style={{ flexGrow: 1, marginLeft: "auto", paddingTop: 5, paddingBottom: 15 }}>
          <Icon
            type="MaterialCommunityIcons"
            name="arrow-expand"
            style={{ fontSize: 24, color: Colors.gray }}
            onPress={() => toggleExpandedTextInput(false)}
          />
        </View>
      )}
      <View style={styles.commentInput}>
        <TextInput
          multiline={true}
          value={comment}
          onChangeText={(text) => setComment(text)}
          // TODO: translate
          placeholder={"Comment"}
          //autoFocus={true}
          style={{ flex: 1, fontSize: 16 }}
        />
        <Icon
          type="MaterialCommunityIcons"
          name="send-circle"
          style={{ fontSize: 42, color: Colors.primary }}
          onPress={() => save(comment)}
        />
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


  const ZZExpandableTextInput = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{
            padding: 24,
            flex: 1,
            justifyContent: "space-around"
        }}>
          <TextInput
            multiline={true}
            onChangeText={(text) => {
              console.log(text);
            }}
            defaultValue={"ZZ"}
            //autoFocus={true}
            style={{ borderTopWidth: 1, borderColor: "#ccc", height: 200 }}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

  const renderItem = ({ item }) => <CommentsActivityItem item={item} loading={isLoading||isValidating||isError} />;

  return (
    <Container>
      {!isConnected && <OfflineBar />}
      <FilterList
        items={(items?.length > 0) ? items : []}
        renderItem={renderItem}
        onRefresh={mutate}
        // TODO: add term and translate
        placeholder={"COMMENTS ACTIVITY PLACEHOLDER TEXT"}
      />
      <ExpandableTextInput />
    </Container>
  );
};
export default CommentsActivityScreen;