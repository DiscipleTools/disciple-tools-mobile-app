import React, { createRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  View,
  Text,
  Pressable,
} from "react-native";

import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import ParsedText from "react-native-parsed-text";
//import MentionsTextInput from "react-native-mentions";

import {
  CopyIcon,
  DeleteIcon,
  EditIcon,
  ExpandIcon,
  SendIcon
} from "components/Icon";
import CustomBottomSheet from "components/Sheet/CustomBottomSheet";
import FilterList from "components/FilterList";
import PostItemSkeleton from "components/Post/PostItem/PostItemSkeleton";
import SelectSheet from "components/Sheet/SelectSheet";
import SheetHeader from "components/Sheet/SheetHeader";

import useApp from "hooks/use-app";
import useAPI from "hooks/use-api";
import useBottomSheet from "hooks/use-bottom-sheet";
import useCommentsActivities from "hooks/use-comments-activity";
import useFilter from "hooks/use-filter";
import useI18N from "hooks/use-i18n";
import useMyUser from "hooks/use-my-user";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";

import { localStyles } from "./CommentsActivityScreen.styles";

const MENTION_PATTERN = /@\[.+?\]\((.*)\)/g;

const CommentsActivityConstants = Object.freeze({
  COPY: "copy",
  DELETE: "delete",
  EDIT: "edit",
});

const CommentsActivityScreen = ({ navigation, headerHeight, insets }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n, isRTL } = useI18N();
  const { setClipboard } = useApp();
  const toast = useToast();

  const { expand } = useBottomSheet();
  const sheetRef = createRef();
  const inputRef = createRef();

  const { data: userData } = useMyUser();

  const [editComment, setEditComment] = useState({
    id: null,
    message: "",
  });
  const [expanded, toggleExpanded] = useState(false);

  const { createComment, updateComment, deleteComment } = useAPI();

  const { defaultFilter, filter, onFilter, search, onSearch } = useFilter();

  const {
    data: items,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useCommentsActivities({ search, filter });
  if (!items) return null;

  useEffect(() => {
    if (sheetRef?.current) {
      if (expanded) {
        sheetRef.current?.snapToPosition("100%");
      } else {
        sheetRef.current?.snapToIndex(0);
      };
    };
  }, [expanded]);

  //const onClear = () => setComment('');

  // TODO: implement this skeleton
  const CommentsActivityItemLoadingSkeleton = () => <PostItemSkeleton />;

  const CommentsActivityItem = ({ item, loading }) => {
    if (!item || loading) return <CommentsActivityItemLoadingSkeleton />;
    const message = item?.comment_content || item?.object_note;
    // TODO: try/catch handler
    const datetime = item?.hist_time ? new Date(Number(item.hist_time)*1000).toString() : "";
    const author = item?.comment_author || item?.name;
    const authorId = Number(item?.user_id);
    const userIsAuthor = authorId === userData?.ID;
    const isActivity = item?.object_note?.length > 0;

    const onCopy = () => setClipboard(message);

    const onEdit = () =>
      setEditComment({
        id: item?.comment_ID,
        message,
      });

    const onDelete = async () => {
      // TODO: add support for Activity type?
      if (item?.comment_ID) {
        const commentId = item.comment_ID;
        try {
          await deleteComment(commentId);
          mutate();
        } catch (error) {
          toast(error, true);
        }
      };
    };

    const generateOptions = () => {
      const sections = [
        {
          data: [
            {
              key: CommentsActivityConstants.COPY,
              label: i18n.t("global.copy"),
              icon: <CopyIcon />,
            },
          ],
        },
      ];
      if (userIsAuthor) {
        sections[0].data.push({
          key: CommentsActivityConstants.EDIT,
          label: i18n.t("global.edit"),
          icon: <EditIcon />,
        });
        sections[0].data.push({
          key: CommentsActivityConstants.DELETE,
          label: i18n.t("global.delete"),
          icon: <DeleteIcon style={{ color: "red" }} />,
        });
      };
      return sections;
    };

    const onChange = (value) => {
      const key = value?.key;
      if (key === CommentsActivityConstants.COPY) onCopy();
      if (key === CommentsActivityConstants.EDIT) onEdit();
      if (key === CommentsActivityConstants.DELETE) onDelete();
    };

    const onLongPress = () => {
      const title = i18n.t("global.options");
      const sections = generateOptions();
      expand({
        // TODO: constants?
        snapPoints: userIsAuthor ? [325,"95%"] : [225,"95%"],
        defaultIndex: 0,
        renderHeader: () => (
          <SheetHeader
            expandable
            dismissable
            title={title}
          />
        ),
        renderContent: () => (
          <SelectSheet
            sections={sections}
            onChange={onChange}
          />
        )
      });
    };

    const renderMention = (matchingString, matches) => {
      let mentionText = matchingString.substring(
        matchingString.lastIndexOf("[") + 1,
        matchingString.lastIndexOf("]")
      );
      return `@${mentionText}`;
    };

    return (
      <Pressable onLongPress={() => onLongPress()}>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={{
              uri:
                item?.gravatar && item?.gravator !== ""
                  ? item?.gravatar
                  : "https://www.gravatar.com/avatar/?d=mp",
            }}
          />
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <View
                style={[
                  globalStyles.rowContainer,
                  { justifyContent: "space-between" },
                ]}
              >
                <View style={globalStyles.columnContainer}>
                  <Text
                    style={[
                      styles.name,
                      isRTL ? { textAlign: "left", flex: 1 } : {},
                    ]}
                  >
                    {author}
                  </Text>
                </View>
                <View style={[globalStyles.columnContainer, { width: 110 }]}>
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
                </View>
              </View>
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
              {message}
            </ParsedText>
          </View>
        </View>
      </Pressable>
    );
  };

  const CommentInput = () => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState("");

    // TODO: preserve active comment on expand/collapse

    useEffect(() => {
      setComment(editComment.message);
    }, [editComment?.message]);

    const onSave = async (comment) => {
      setLoading(true);
      if (comment?.length > 0) {
        try {
          if (editComment?.id && editComment?.message?.length > 0) {
            const res = await updateComment(editComment.id, comment);
            if (res) {
              setEditComment({
                id: null,
                message: "",
              });
              mutate();
            }
            return;
          }
          const res = await createComment(comment);
          if (res) setComment("");
          return;
        } catch (error) {
          toast(error, true);
        } finally {
          mutate();
          setLoading(false);
        }
      }
      return;
    };

    return (
      <View style={[
        globalStyles.rowContainer,
        styles.commentInputView
      ]}>
        <View style={{ flex: 4 }}>
          <BottomSheetTextInput
            autoFocus={editComment?.message?.length > 0 ? true : false}
            ref={inputRef}
            editable={!loading}
            multiline={true}
            value={comment}
            onChangeText={(text) => setComment(text)}
            placeholder={i18n.t("global.comments")}
            placeholderTextColor={globalStyles.placeholder.color}
            style={styles.commentInputText}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ExpandIcon
            style={[
              globalStyles.icon,
              { marginTop: 15 }
            ]}
            onPress={() => toggleExpanded(!expanded)}
          />
        </View>
        <View style={{ flex: 1 }}>
          {!loading ? (
            <SendIcon style={styles.sendIcon} onPress={() => onSave(comment)} />
          ) : (
            <ActivityIndicator
              size="small"
              color={globalStyles.activityIndicator.color}
              style={[
                styles.activityIndicator,
                { marginTop: 15 }
              ]}
            />
          )}
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <CommentsActivityItem
      item={item}
      loading={isLoading || isValidating || error}
    />
  );

  return(
    <>
      <FilterList
        display
        //sortable
        items={items}
        renderItem={renderItem}
        search={search}
        onSearch={onSearch}
        defaultFilter={defaultFilter}
        filter={filter}
        onFilter={onFilter}
        onRefresh={mutate}
      />
      <CustomBottomSheet
        ref={sheetRef}
        modal={false}
        dismissable={false}
        // TODO: dynamic based on Keyboard height?
        snapPoints={[expanded ? "100%" : 100]}
        defaultIndex={0}
      >
        <CommentInput />
      </CustomBottomSheet>
    </>
  );
};
export default CommentsActivityScreen;