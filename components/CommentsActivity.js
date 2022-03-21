import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, View, Keyboard, KeyboardAvoidingView, TextInput, Text, Platform, TouchableWithoutFeedback, Button, StatusBar, Pressable } from 'react-native';

import * as Clipboard from 'expo-clipboard';

// TODO: remove
import { ActionSheet, Icon } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";

import ParsedText from "react-native-parsed-text";
//import MentionsTextInput from "react-native-mentions";

import { ExpandIcon, SendIcon } from "components/Icon";
import FilterList from "components/FilterList";
import PostItemSkeleton from "components/Post/PostItem/PostItemSkeleton";
import SheetHeader from "components/Sheet/SheetHeader";

import useFilter from "hooks/use-filter";
import useI18N from "hooks/use-i18n";
import useCommentsActivities from "hooks/use-comments-activity";
import useMyUser from "hooks/use-my-user";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";
import useAPI from "hooks/use-api";

import { localStyles } from "./CommentsActivity.styles";

const MENTION_PATTERN = /@\[.+?\]\((.*)\)/g;

const CommentsActivity = ({ headerHeight, insets }) => {

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

  const { defaultFilter, filter, onFilter, search, onSearch } = useFilter();

  const { data: items, error, isLoading, isValidating, mutate } = useCommentsActivities({ search, filter });
  if (!items) return null;

  const onClear = () => {
    //setComment('');
    Keyboard.dismiss();
    mutate();
  };

  // TODO: implement this skeleton 
  const CommentsActivityItemLoadingSkeleton = () => <PostItemSkeleton />;

  const CommentsActivityItem = ({ item, loading }) => {
    if (!item || loading) return <CommentsActivityItemLoadingSkeleton />;
    const message = item?.comment_content || item?.object_note;
    const datetime = item?.comment_date || new Date(Number('1611715906')*1000).toString();
    const author = item?.comment_author || item?.name;
    const authorId = Number(item?.user_id);
    const userIsAuthor = authorId === userData?.ID;
    const isActivity = item?.object_note?.length > 0;
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

    const renderMention = (matchingString, matches) => {
      let mentionText = matchingString.substring(
        matchingString.lastIndexOf("[") + 1,
        matchingString.lastIndexOf("]")
      );
      return `@${mentionText}`;
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
              style={styles.commentText(isActivity)}
              parse={[
                {
                  pattern: MENTION_PATTERN,
                  style: styles.parseText,
                  renderText: renderMention,
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
  /*
  //const headerHeight = useHeaderHeight();
  const headerHeight = 0;
  //const insets = useSafeAreaInsets();
  const insets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  */
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
        // TODO: auto-refresh
        //mutate();
        setLoading(false);
      };
    };
    return;
  };
  return(
    <View style={styles.commentInputView}>
      {/*comment?.length > 0 && (
        <ExpandIcon onPress={() => toggleExpandedTextInput()} />
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
          style={styles.commentInputText}
        />
        { !loading ? (
          <SendIcon
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
const ExpandableTextInput = () => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <CustomKeyboardAvoidingView style={styles.commentView}>
      <CommentInput />
    </CustomKeyboardAvoidingView>
  </TouchableWithoutFeedback>
);

  const renderItem = ({ item }) => <CommentsActivityItem item={item} loading={isLoading||isValidating||error} />;

  const title = i18n.t("global.commentsActivity");

  return (
    <>
      <SheetHeader
        expandable
        dismissable
        title={title}
      />
      <FilterList
        //display
        //sortable
        items={items}
        renderItem={renderItem}
        search={search}
        onSearch={onSearch}
        //defaultFilter={defaultFilter}
        //filter={filter}
        //onFilter={onFilter}
        onRefresh={mutate}
      />
      <ExpandableTextInput />
    </>
  );
};
export default CommentsActivity;