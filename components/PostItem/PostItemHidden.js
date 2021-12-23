import React from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "native-base";

import { useNavigation } from "@react-navigation/native";

import useI18N from "hooks/useI18N";
import useType from "hooks/useType";

import Constants from "constants";

import { styles } from "./PostItemHidden.styles";

const PostItemHidden = ({ item, loading }) => {

  const navigation = useNavigation();
  const { isRTL } = useI18N();
  const { postType } = useType();

  // TODO: clean up
  const btn1Style = isRTL
    ? { left: Constants.SWIPE_BTN_WIDTH * 2 }
    : { left: 0 };
  const btn2Style = isRTL
    ? { left: Constants.SWIPE_BTN_WIDTH }
    : { left: 0 };
  const btn3Style = isRTL
    ? { left: 0 }
    : { left: Constants.SWIPE_BTN_WIDTH };

  if (!item || loading) return null;
  return (
    <View style={styles.rowBack}>
      <Pressable
        style={[
          styles.backBtn,
          styles.backBtn2,
          btn2Style,
          { width: Constants.SWIPE_BTN_WIDTH },
        ]}
        onPress={() => {
          console.log("*** BUTTON 2 CLICKED ***");
        }}
      >
        <Icon
          type="MaterialCommunityIcons"
          name="calendar-check"
          style={styles.backBtnIcon}
        />
        {/*TODO: translate */}
        <Text style={styles.backBtnText}>Meeting Complete</Text>
      </Pressable>
      <Pressable
        style={[
          styles.backBtn,
          styles.backBtn3,
          btn3Style,
          { width: Constants.SWIPE_BTN_WIDTH },
        ]}
        onPress={() => {
          //console.log("*** BUTTON 3 CLICKED ***");
          console.log(`item: ${JSON.stringify(item)}`);
          // TODO: constants
          navigation.navigate('CommentsActivity', {
            id: item?.ID,
            type: postType,
            subtype: "comments_activity"
          });
        }}
      >
        <Icon
          type="MaterialCommunityIcons"
          name="pencil"
          style={styles.backBtnIcon}
        />
        <Text style={styles.backBtnText}>Comment</Text>
      </Pressable>
    </View>
  );
};
export default PostItemHidden;