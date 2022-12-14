import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, View, Text, Pressable, SegmentedControlIOSComponent } from "react-native";

import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import ParsedText from "react-native-parsed-text";
//import MentionsTextInput from "react-native-mentions";

import { CopyIcon, DeleteIcon, EditIcon, SendIcon } from "components/Icon";
import { HeaderRight } from "components/Header/Header";
import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import PostItemSkeleton from "components/Post/PostItem/PostItemSkeleton";
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import SelectSheet from "components/Sheet/SelectSheet";

import useApp from "hooks/use-app";
import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useCommentsActivities from "hooks/use-comments-activity";
import useFilter from "hooks/use-filter";
import useI18N from "hooks/use-i18n";
import useMyUser from "hooks/use-my-user";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";
import useType from "hooks/use-type";

import { generateTmpId } from "helpers";
import { getCommentURL } from "helpers/urls";

import { parseDateSafe, decodeHTMLEntities } from "utils";

import { ScreenConstants } from "constants";

import { localStyles } from "./CommentsActivityScreen.styles";

//const MENTION_PATTERN = /@\[.+?\]\((.*)\)/g;
const MENTION_PATTERN = /@\[\w* \w* \(\w*\)\]\(\.?\w*\)*/g
const BAPTISM_DATE_PATTERN = /\{(\d+)\}+/;

const CommentsActivityConstants = Object.freeze({
  COPY: "copy",
  DELETE: "delete",
  EDIT: "edit",
});

const generateNewComment = ({ comment, userData }) => {
  const timestamp = new Date().toISOString();
  const tmpId = generateTmpId();
  return {
    tmpId,
    comment_author: userData?.display_name,
    comment_date_gmt: timestamp.replace('T', ' ').substring(0, timestamp.length-5),
    comment_content: comment,
    user_id: userData?.ID,
  };
};

const parseDate = (item) => {
  if (item?.comment_date) return parseDateSafe(item.comment_date);
  if (item?.hist_time) return parseDateSafe(item.hist_time);
  return "";
};

const createCommentComponent = ({ items, setItems, newComment }) => {
  items?.unshift(newComment);
  setItems(items);
};

const updateCommentComponent = ({ items, setItems, comment, commentId }) => {
  const existingCommentIdx = items?.findIndex((item) => item?.ID === commentId || item?.tmpId === commentId);
  if (!items?.[existingCommentIdx]?.comment_content) return;
  items[existingCommentIdx].comment_content = comment;
  setItems(items);
};

const deleteCommentComponent = ({ items, setItems, commentId }) => setItems(items.filter(item => item?.comment_ID !== commentId && item?.tmpId !== commentId));

const createCommentCache = ({ cache, cacheKey, newComment }) => {
  const cachedData = cache.get(cacheKey);
  cachedData?.comments?.unshift(newComment);
  cache.set(cacheKey, cachedData);
};

const updateCommentCache = ({ cache, cacheKey, commentId, comment }) => {
  const cachedData = cache.get(cacheKey);
  if (!cachedData?.comments) return;
  const existingCommentIdx = cachedData.comments?.findIndex((item) => item?.comment_ID === commentId || item?.tmpId === commentId);
  if (!cachedData.comments?.[existingCommentIdx]?.comment_content) return;
  cachedData.comments[existingCommentIdx].comment_content = comment;
  cache.set(cacheKey, cachedData);
};

const deleteCommentCache = ({ cache, cacheKey, commentId }) => {
  const cachedData = cache.get(cacheKey);
  if (!cachedData?.comments) return;
  cachedData.comments = cachedData.comments.filter(item => item?.comment_ID !== commentId && item?.tmpId !== commentId); 
  cache.set(cacheKey, cachedData);
};

const CommentInput = forwardRef(({
  cache,
  cacheKey,
  editComment,
  setEditComment,
  items,
  setItems,
  userData,
  mutate
}, ref) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();

  const { createComment, updateComment } = useAPI();

  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setComment(editComment.message);
    return;
  }, [editComment?.message]);

  const onSave = async (comment) => {
    if (ref?.current) ref.current?.dismiss();
    if (comment?.length < 1) return;
    try {
      if ((editComment?.id || editComment?.tmpId) && editComment?.message?.length > 0) {
        const commentId = editComment?.id || editComment?.tmpId;
        updateCommentComponent({ items, setItems, commentId, comment });
        updateCommentCache({ cache, cacheKey, commentId, comment });
        await updateComment({ commentId: editComment.id, comment });
        return;
      };
      const newComment = generateNewComment({ comment, userData });
      createCommentComponent({ items, setItems, newComment });
      createCommentCache({ cache, cacheKey, newComment });
      await createComment({ comment });
    } catch (error) {
      toast(error, true);
    } finally {
      mutate();
      setLoading(false);
      setComment("");
      setEditComment({
        id: null,
        message: "",
      });
      mutate();
    };
  };

  const isDisabled = comment?.length < 1;
  return (
    <View style={styles.commentInputContainer}>
      <BottomSheetTextInput
        autoFocus={editComment?.message?.length > 0 ? true : false}
        editable={!loading}
        multiline={true}
        value={comment}
        onChangeText={(text) => setComment(text)}
        placeholder={i18n.t("global.comments")}
        placeholderTextColor={globalStyles.placeholder.color}
        style={styles.commentInputText}
      />
      <View style={{ flex: 1, paddingEnd: 10 }}>
        {!loading ? (
          <SendIcon
            disabled
            onPress={() => {
              setLoading(true);
              setTimeout(() => onSave(comment), 1000);
            }}
            style={styles.sendIcon({ isDisabled })}
          />
        ) : (
          <ActivityIndicator
            size="small"
            color={globalStyles.activityIndicator.color}
            style={[styles.activityIndicator]}
          />
        )}
      </View>
    </View>
  );
});

// TODO: implement this skeleton
const CommentsActivityItemLoadingSkeleton = () => <PostItemSkeleton />;

const renderMention = (matchingString, matches) => {
  let mentionText = matchingString?.substring(
    matchingString?.lastIndexOf("[") + 1,
    matchingString?.lastIndexOf("]")
  );
  return `@${mentionText}`;
};

const timestampToDate = (moment) => (match, timestamp) => {
  match = match?.replace('{','');
  match = match?.replace('}','');
  if ( isNaN(match*1000) ){
    return false;
  }
  return moment(match*1000).format('MMM D, YYYY');
};

const CommentsActivityItem = ({
  loading,
  cache,
  cacheKey,
  item,
  items,
  setItems,
  userData,
  setClipboard,
  setEditComment,
  deleteComment,
  mutate
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { getTabScreenFromType } = useType();
  const { i18n, isRTL, moment } = useI18N();
  const toast = useToast();
  const modalRefOptions = useRef(null);
  const modalNameOptions = "options_modal";
  const defaultIndexOptions =  1; //getDefaultIndex();
  if (!item || loading) return <CommentsActivityItemLoadingSkeleton />;
  let message = item?.comment_content || item?.object_note;
  const datetime = moment(parseDate(item)).format("d MMMM YYYY,H:m");
  const author = item?.comment_author || item?.name;
  const authorId = Number(item?.user_id);
  const userIsAuthor = authorId === userData?.ID;
  const isActivity = item?.object_note?.length > 0;

  // GETTING URLs IN AN ARRAY.
  let hasUrl =
    message?.match(/\bhttps?::\/\/\S+/gi) ||
    message?.match(/\bhttps?:\/\/\S+/gi);

  let names = [];
  let strArr;
  let tempMsg = message;
  let startIndex = 0;
  let counter = 0;
  let messageArr = [];

  if (hasUrl) {
    for (let i = 0; i < hasUrl.length; i++) {
      // REMOVING URLs.
      tempMsg = tempMsg.replace(`(${hasUrl[i]}`, "");
    }

    for (let i = 0; i < hasUrl.length; i++) {
      // EXTRACTING NAMES AND STORING IN AN ARRAY.
      let nameStart = tempMsg.indexOf("[", startIndex);
      let nameEnd = tempMsg.indexOf("]", nameStart);
      names.push(tempMsg.slice(nameStart + 1, nameEnd));
      startIndex = nameEnd;
    }

    for (let i = 0; i < names.length; i++) {
      // REPLACING NAMES WITH A RANDOM VALUE.
      tempMsg = tempMsg.replace(names[i], "random_value");
    }

    strArr = tempMsg.split(" ");

    for (let i = 0; i < strArr.length; i++) {
      if (strArr[i] === "[random_value]") {
        // MAPPING NAMES TO CORRESPONDING URLs AND REPLACING random_value WITH A Text COMPONENT.
        let urlArr = hasUrl[counter].split("/");

        let textComp = (
          <>
            <Text
              onPress={() => {
                const type = urlArr[urlArr.length - 3];
                const tabScreen = getTabScreenFromType(type);
                navigation.jumpTo(tabScreen, {
                  screen: ScreenConstants.DETAILS,
                  id: urlArr[urlArr.length - 2],
                  type,
                });
              }}
              style={styles.activityLink}
            >
              {names[counter]}
            </Text>
            <Text> </Text>
          </>
        );
        counter++;
        messageArr.push(textComp);
      } else {
        messageArr.push(strArr[i] + " ");
      }
    };
  };

  const onCopy = () => setClipboard(message);

  const onEdit = () => setEditComment({ id: item?.comment_ID || item?.tmpId, message });

  const onDelete = async() => {
    // TODO: add support for Activity type?
    if (item?.comment_ID || item?.tmpId) {
      const commentId = item.comment_ID || item.tmpId;
      try {
        deleteCommentComponent({ items, setItems, commentId });
        deleteCommentCache({ cache, cacheKey, commentId });
        await deleteComment({ commentId });
        //mutate();
      } catch (error) {
        console.error(error);
        toast(error, true);
      }
    }
  };

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
      icon: <DeleteIcon />,
    });
  };

  const onChange = (value) => {
    const key = value?.key;
    if (key === CommentsActivityConstants.COPY) onCopy();
    if (key === CommentsActivityConstants.EDIT) onEdit();
    if (key === CommentsActivityConstants.DELETE) onDelete();
  };

  const onLongPress = () => modalRefOptions?.current?.present();

  return (
    <>
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
          <View style={styles.content(userIsAuthor)}>
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
                {
                  pattern: BAPTISM_DATE_PATTERN,
                  style: styles.time,
                  renderText: timestampToDate(moment),
                }
              ]}
            >
              {hasUrl ? messageArr : decodeHTMLEntities(message)}
            </ParsedText>
          </View>
        </View>
      </Pressable>
      <ModalSheet
        ref={modalRefOptions}
        title={i18n.t("global.options")}
        name={modalNameOptions}
        defaultIndex={defaultIndexOptions}
      >
        <SelectSheet
          sections={sections}
          onChange={onChange}
        />
      </ModalSheet>
    </>
  );
};

const CommentsActivityScreen = ({ navigation, route }) => {

  const { styles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { deleteComment } = useAPI();
  const { setClipboard } = useApp();
  const { cache } = useCache();
  const { data: userData } = useMyUser();

  const [editComment, setEditComment] = useState({
    id: null,
    message: "",
  });
  //const [expanded, setExpanded] = useState(false);

  const {
    defaultFilter,
    filter,
    onFilter,
    search,
    onSearch
  } = useFilter();

  const {
    cacheKey,
    data: items,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useCommentsActivities({ search, filter });
  //if (!items) return null;

  const [_items, _setItems] = useState(items);

  const modalRefComments = useRef(null);
  const modalNameComments = "comments_modal";
  const defaultIndexComments =  3; //getDefaultIndex();

  useLayoutEffect(() => {
    const postType = route?.params?.type;

    const postId = route?.params?.id;
    const kebabItems = [
      {
        label: i18n.t("global.viewOnWeb"),
        urlPath: `${postType}/${postId}/#comment-activity-section`,
      },
      {
        label: i18n.t("global.documentation"),
        url: `https://disciple.tools/user-docs/disciple-tools-mobile-app/how-to-use/record-screens/#${postType}-screen`,
      },
    ];
    navigation.setOptions({
      title: route?.params?.name ?? '',
      headerRight: (props) => <HeaderRight kebabItems={kebabItems} props />,
    });
    return;
  }, [route?.params?.id]);

  const onEdit = ({ id, message }) => {
    setEditComment({ id, message });
    modalRefComments?.current?.present();
  };

  const renderItem = ({ item }) => (
    <CommentsActivityItem
      loading={isLoading || isValidating || error}
      cache={cache}
      cacheKey={cacheKey}
      item={item}
      items={_items}
      setItems={_setItems}
      userData={userData}
      setClipboard={setClipboard}
      setEditComment={onEdit}
      deleteComment={deleteComment}
      mutate={mutate}
    />
  );

  const isEditing = editComment?.message?.length > 0;
  return (
    <>
      <OfflineBar />
      <FilterList
        display
        //sortable
        items={_items}
        renderItem={renderItem}
        search={search}
        onSearch={onSearch}
        defaultFilter={defaultFilter}
        filter={filter}
        onFilter={onFilter}
        onRefresh={mutate}
        footer={(
          <Pressable
            onPress={() => modalRefComments?.current?.present()}
            style={styles.footerContainer}
          >
            <View>
              <Text style={styles.footerText}>{isEditing ? editComment.message : i18n.t("global.comments")}</Text>
            </View>
            <View style={styles.footerIcon}>
              <SendIcon
                style={styles.sendIcon({ isDisabled: isEditing ? false : true })}
              />
            </View>
          </Pressable>
        )}
      />
      <ModalSheet
        ref={modalRefComments}
        title={route?.params?.name ?? null}
        name={modalNameComments}
        defaultIndex={defaultIndexComments}
      >
        <CommentInput
          cache={cache}
          cacheKey={cacheKey}
          ref={modalRefComments}
          editComment={editComment}
          setEditComment={setEditComment}
          items={_items}
          setItems={_setItems}
          userData={userData}
          mutate={mutate}
        />
      </ModalSheet>
    </>
  );
};
export default CommentsActivityScreen;