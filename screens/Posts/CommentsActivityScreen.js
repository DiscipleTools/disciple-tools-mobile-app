import React, { createRef, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Image, View, Text, Pressable } from "react-native";

import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import ParsedText from "react-native-parsed-text";
//import MentionsTextInput from "react-native-mentions";

import { CopyIcon, DeleteIcon, EditIcon, SendIcon } from "components/Icon";
import { HeaderRight } from "components/Header/Header";
import CustomBottomSheet from "components/Sheet/CustomBottomSheet";
import FilterList from "components/FilterList";
import PostItemSkeleton from "components/Post/PostItem/PostItemSkeleton";
import SelectSheet from "components/Sheet/SelectSheet";
import SheetHeader from "components/Sheet/SheetHeader";
import FAB from "components/FAB";

import useApp from "hooks/use-app";
import useAPI from "hooks/use-api";
import useBottomSheet from "hooks/use-bottom-sheet";
import useCommentsActivities from "hooks/use-comments-activity";
import useFilter from "hooks/use-filter";
import useI18N from "hooks/use-i18n";
import useMyUser from "hooks/use-my-user";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";
import useType from "hooks/use-type";

import { ScreenConstants } from "constants";

import { parseDateSafe } from "utils";

import { localStyles } from "./CommentsActivityScreen.styles";

const MENTION_PATTERN = /@\[.+?\]\((.*)\)/g;

const OFFSET_Y = 125;

const CommentsActivityConstants = Object.freeze({
  COPY: "copy",
  DELETE: "delete",
  EDIT: "edit",
});

const CommentsActivityScreen = ({
  navigation,
  route,
  headerHeight,
  insets,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { getTabScreenFromType } = useType();
  const { i18n, isRTL, moment } = useI18N();
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
  //const [expanded, setExpanded] = useState(false);

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
      title: route?.params?.name,
      headerRight: (props) => <HeaderRight kebabItems={kebabItems} props />,
    });
    return;
  });

  //const onClear = () => setComment('');

  // TODO: implement this skeleton
  const CommentsActivityItemLoadingSkeleton = () => <PostItemSkeleton />;

  const parseDate = (item) => {
    if (item?.comment_date) return parseDateSafe(item.comment_date);
    if (item?.hist_time) return parseDateSafe(item.hist_time);
    return "";
  };

  const CommentsActivityItem = ({ item, loading }) => {
    if (!item || loading) return <CommentsActivityItemLoadingSkeleton />;
    let message = item?.comment_content || item?.object_note;
    const datetime = moment(parseDate(item)).format("LLLL");
    const author = item?.comment_author || item?.name;
    const authorId = Number(item?.user_id);
    const userIsAuthor = authorId === userData?.ID;
    const isActivity = item?.object_note?.length > 0;

    // GETTING URLs IN AN ARRAY.
    let hasUrl =
      message.match(/\bhttps?::\/\/\S+/gi) ||
      message.match(/\bhttps?:\/\/\S+/gi);

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
              {names[counter] + " "}
            </Text>
          );
          counter++;
          messageArr.push(textComp);
        } else {
          messageArr.push(strArr[i] + " ");
        }
      }
    }

    const onCopy = () => setClipboard(message);

    const onEdit = () => setEditComment({ id: item?.comment_ID, message });

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
      }
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
          icon: <DeleteIcon />,
        });
      }
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
        snapPoints: userIsAuthor
          ? [OFFSET_Y + 200, "95%"]
          : [OFFSET_Y + 100, "95%"],
        defaultIndex: 0,
        renderHeader: () => (
          <SheetHeader expandable dismissable title={title} />
        ),
        renderContent: () => (
          <SelectSheet sections={sections} onChange={onChange} />
        ),
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
              ]}
            >
              {hasUrl ? messageArr : message}
            </ParsedText>
          </View>
        </View>
      </Pressable>
    );
  };

  const CommentInput = () => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState("");

    useEffect(() => {
      setComment(editComment.message);
    }, [editComment?.message]);

    const onSave = async (comment) => {
      if (sheetRef?.current) sheetRef.current.snapToIndex(0);
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
          if (res) {
            setComment("");
          }
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
      <>
        <View style={{ marginStart: "auto" }}>
          {!loading ? (
            <SendIcon
              onPress={() => {
                setLoading(true);
                setTimeout(() => onSave(comment), 1000);
              }}
              style={styles.sendIcon}
            />
          ) : (
            <ActivityIndicator
              size="small"
              color={globalStyles.activityIndicator.color}
              style={[styles.activityIndicator]}
            />
          )}
        </View>
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
      </>
    );
  };

  const renderItem = ({ item }) => (
    <CommentsActivityItem
      item={item}
      loading={isLoading || isValidating || error}
    />
  );

  return (
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
      <FAB offsetY={OFFSET_Y + 25} />
      <CustomBottomSheet
        ref={sheetRef}
        modal={false}
        dismissable={false}
        // TODO: dynamic based on Keyboard height?
        snapPoints={[OFFSET_Y, "100%"]}
        defaultIndex={0}
      >
        <CommentInput />
      </CustomBottomSheet>
    </>
  );
};
export default CommentsActivityScreen;
