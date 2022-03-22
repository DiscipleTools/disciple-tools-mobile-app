import React from "react";
import { View} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ClearIcon } from "components/Icon";
import Chip from "components/Chip";

import useStyles from "hooks/use-styles";

import { ScreenConstants } from "constants";

import { localStyles } from "./PostLink.styles";

// TODO: rename to PostChip?
const PostLink = ({ id, icon, title, type, onRemove }) => {

  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const selected = type ? true : null;
  return(
    <Chip
      // TODO: handle this better
      isLink={type ? true : null}
      selected={selected}
      disabled={!id || !type}
      onPress={() => {
        //if (!type) return;
        navigation.push(ScreenConstants.DETAILS, {
          id,
          // TODO: rename prop to 'title' for consistency sake?
          name: title,
          type,
          // TODO: this callback is never triggered and the refresh is not taking place
          //onGoBack: () => onRefresh(),
        });
      }}
      label={title}
      startIcon={icon ?? null}
      endIcon={onRemove ? (
        <View style={styles.clearIconContainer(selected)}>
          <ClearIcon
            onPress={() => onRemove(id)}
            style={styles.clearIcon}
          />
        </View>
      ) : null }
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