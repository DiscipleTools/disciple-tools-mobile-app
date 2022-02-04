import React from "react";
import { Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import useStyles from "hooks/useStyles";

import { localStyles } from "./PostLink.styles";

const PostLink = ({ id, title, type }) => {

  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);

  // TODO: move inline styles to PostLink.styles
  return (
    <Pressable
      disabled={!id || type === "people_groups"}
      onPress={() => {
        // TODO: constant
        navigation.push("Details", {
          id,
          // TODO: rename prop to 'title' for consistency sake?
          name: title,
          type,
          //onGoBack: () => onRefresh(),
        });
      }}
    >
      <Text
        style={[
          globalStyles.rowContainer,
          globalStyles.link,
          styles.link
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};
export default PostLink;