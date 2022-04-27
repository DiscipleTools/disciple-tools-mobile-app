import React from "react";
import { View} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ClearIcon } from "components/Icon";
import Chip from "components/Chip";

import useHaptics from "hooks/use-haptics";
import useStyles from "hooks/use-styles";

import { ScreenConstants } from "constants";

import { localStyles } from "./PostChip.styles";

const PostChip = ({ id, icon, title, type, onRemove, onGoBack }) => {

  const navigation = useNavigation();
  const { vibrate } = useHaptics();
  const { styles, globalStyles } = useStyles(localStyles);
  const selected = type ? true : null;
  return(
    <Chip
      // TODO: handle this better
      isLink={type ? true : null}
      selected={selected}
      disabled={!id || !type}
      onPress={() => {
        navigation.push(ScreenConstants.DETAILS, {
          id,
          name: title,
          type,
          onGoBack: () => navigation.goBack()
        });
      }}
      label={title}
      startIcon={icon ?? null}
      endIcon={onRemove ? (
        <View style={styles.clearIconContainer(selected)}>
          <ClearIcon
            onPress={() => {
              vibrate();
              onRemove(id)
            }}
            style={styles.clearIcon}
          />
        </View>
      ) : null }
      style={styles.container}
    />
  );
};
export default PostChip;