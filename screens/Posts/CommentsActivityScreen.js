import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, View, Keyboard, KeyboardAvoidingView, TextInput, Text, Platform, TouchableWithoutFeedback, Button, StatusBar, Pressable } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as Clipboard from 'expo-clipboard';

import { ActionSheet, Icon } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";

import ParsedText from "react-native-parsed-text";
import MentionsTextInput from "react-native-mentions";

import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import PostItemSkeleton from "components/Post/PostItem/PostItemSkeleton";

import useI18N from "hooks/useI18N";
import useComments from "hooks/useComments";
import useActivity from "hooks/useActivity";
import useMyUser from "hooks/useMyUser";
import useStyles from "hooks/useStyles";
import useToast from "hooks/useToast";
import useAPI from "hooks/useAPI";

// TODO: refactor out
import utils from "utils";

import { localStyles } from "./CommentsActivityScreen.styles";

const CommentsActivityScreen = ({ navigation, route }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n, isRTL } = useI18N();
  const toast = useToast();
  const { data: userData } = useMyUser();

  const [editComment, setEditComment] = useState({
    id: null,
    message: ''
  });

  const { createComment, updateComment, deleteComment } = useAPI();

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

  const onClear = () => {
    //setComment('');
    Keyboard.dismiss();
    mutate();
  };

  // TODO: implement this skeleton 
  const CommentsActivityItemLoadingSkeleton = () => <PostItemSkeleton />;

  const CommentsActivityItem = ({ item, loading }) => {
    const message = item?.comment_content || item?.object_note;
    const datetime = item?.comment_date || new Date(Number('1611715906')*1000).toString();
    const author = item?.comment_author || item?.name;
    const authorId = Number(item?.user_id);
    const userIsAuthor = authorId === userData?.ID;
    if (!item || loading) return <CommentsActivityItemLoadingSkeleton />;
    const onCopy = () => Clipboard.setString(message);
    const onEdit = () => setEditComment({
      id: item?.comment_ID,
      message
    });
    const onDelete = async() => {
      // TODO: add support for Activity type
      const commentId = item?.comment_ID;
      try {
        await deleteComment(commentId);
        mutate();
      } catch (error) {
        toast(error, true);
      };
    };
    const onLongPress = () => {
      // TODO: use an expandable (to fullscreen) Action Sheet: https://github.com/gorhom/react-native-bottom-sheet
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
          if (userIsAuthor && buttonIndex === 1) onEdit();
          if (userIsAuthor && buttonIndex === 2) onDelete();
        }
      );
    };
    return(
      <Pressable onLongPress={() => onLongPress()}>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={{ uri: (item?.gravatar && item?.gravator !== '') ? item?.gravatar : "https://www.gravatar.com/avatar/?d=mp" }}
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
                      {datetime}
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
                  style: { color: "#F0F" }, //Colors.primary },
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
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setComment(editComment.message);
  }, [editComment?.message]);

  const onSave = async(comment) => {
    setLoading(true);
    if (comment?.length > 0) {
      try {
        if (editComment?.id && editComment?.message?.length > 0) {
          const res = await updateComment(editComment.id, comment);
          if (res) {
            setEditComment({
              id: null,
              message: ''
            });
            mutate();
          };
          return;
        }
        const res = await createComment(comment);
        if (res) setComment('');
        return;
      } catch (error) {
        toast(error, true);
      } finally {
        setLoading(false);
      };
    };
    return;
  };
  return(
    <View style={styles.commentInput}>
      {/* comment?.length > 0 && (
        <Icon
          type="MaterialCommunityIcons"
          name="arrow-expand"
          style={styles.expandIcon}
          //onPress={() => toggleExpandedTextInput(false)}
        />
      )*/}
        <TextInput
          editable={!loading}
          multiline={true}
          value={comment}
          onChangeText={(text) => setComment(text)}
          // TODO: translate
          placeholder={"Comment"}
          placeholderTextColor={globalStyles.placeholder.color}
          //autoFocus={true}
          style={styles.commentText}
        />
        { !loading ? (
          <Icon
            type="MaterialCommunityIcons"
            name="send-circle"
            style={styles.sendIcon}
            onPress={() => onSave(comment)}
          />
        ) : (
          <ActivityIndicator
            size="small"
            color={globalStyles.activityIndicator.color}
            style={styles.activityIndicator}
          />
        )}
      </View>
  );
};

// TODO: RTL support
const ExpandableTextInput = () => {
  const insets = useSafeAreaInsets();
  return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <CustomKeyboardAvoidingView style={styles.commentView}>
          <CommentInput />
        </CustomKeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  };

  const renderItem = ({ item }) => <CommentsActivityItem item={item} loading={isLoading||isValidating||isError} />;

  return (
    <>
      <OfflineBar />
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
    </>
  );
};
export default CommentsActivityScreen;