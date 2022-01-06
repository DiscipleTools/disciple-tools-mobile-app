import React from "react";
import { Pressable, Text, View } from "react-native";
import { Icon, Row } from "native-base";

import { useNavigation } from "@react-navigation/native";

import KeySelectField from "components/Field/KeySelect/KeySelectField";

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
    <>
      <Row>
        <Text>Overall Status</Text>
      </Row>
      <Row>
        <KeySelectField
          field={{ name: "overall_status" }}
          value={"paused"}
          //editing={state.editing}
          //onChange={onChange}
        />
      </Row>
    </>
  );
};
export default PostItemHidden;