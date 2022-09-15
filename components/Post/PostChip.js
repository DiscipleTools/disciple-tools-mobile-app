import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ClearIcon } from "components/Icon";
import Chip from "components/Chip";

import useHaptics from "hooks/use-haptics";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import { ScreenConstants } from "constants";

import { titleize } from "utils";

import { localStyles } from "./PostChip.styles";

const PostChip = ({ id, icon, title, type, color, onRemove, onGoBack }) => {
  const navigation = useNavigation();
  const { vibrate } = useHaptics();
  const { styles, globalStyles } = useStyles(localStyles);
  const { postType, getTabScreenFromType } = useType();
  const selected = type ? true : null;
  return (
    <Chip
      // TODO: handle this better
      isLink={type ? true : null}
      selected={selected}
      disabled={!id || !type}
      onPress={() => {
        if (type !== postType) {
          const tabScreen = getTabScreenFromType(type);
          navigation.jumpTo(tabScreen, {
            screen: ScreenConstants.DETAILS,
            id,
            name: title,
            type,
          });
          return;
        }
        navigation.push(ScreenConstants.DETAILS, {
          id,
          name: title,
          type,
          onGoBack: () => navigation.goBack(),
        });
        return;
      }}
      label={titleize(title)}
      startIcon={icon ?? null}
      endIcon={
        onRemove ? (
          <View style={styles.clearIconContainer(selected)}>
            <ClearIcon
              onPress={() => {
                vibrate();
                onRemove(id);
              }}
              style={styles.clearIcon}
            />
          </View>
        ) : null
      }
      style={styles.container}
      color={color}
    />
  );
};
export default PostChip;
