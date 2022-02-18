import React from "react";
import { View} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Chip from "components/Chip";
import { ClearIcon } from "components/Icon";

import useStyles from "hooks/useStyles";

import { localStyles } from "./PostLink.styles";

const PostLink = ({ id, title, type, onRemove }) => {

  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  return(
    <Chip
      // TODO: handle this better
      isLink
      selected
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
      label={title}
      endIcon={
        <View style={styles.clearIconContainer}>
          <ClearIcon
            onPress={() => onRemove(id)}
            style={styles.clearIcon}
          />
        </View>
      }
      style={styles.container}
    />
  );
  /*
  return (
    <Pressable>
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
  */
};
export default PostLink;