import React, { useState } from "react";
import {
  Text,
  View,
  Image,
} from "react-native";

import { Container, Icon } from "native-base";
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

// TODO: refactor out
import Colors from "constants/Colors";
import utils from "utils";

import { styles } from "./CommentsActivityScreen.styles";

const CommentsActivityScreen = ({ navigation, route }) => {

  const isConnected = useNetworkStatus();
  const { i18n, isRTL } = useI18N();
  const { userData } = useMyUser();

  const [excludeComments, setExcludeComments] = useState(false);
  const [excludeActivity, setExcludeActivity] = useState(false);

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
    </Container>
  );
};
export default CommentsActivityScreen;