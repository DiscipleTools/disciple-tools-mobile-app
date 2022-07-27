import React from "react";
import { Pressable, View } from "react-native";

import { ExpandIcon } from "components/Icon";
import TitleBar from "components/TitleBar";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Card.styles";

const Card = ({ border, center, title, body, onPress }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  return (
    <Pressable onPress={onPress ?? null} style={globalStyles.columnContainer}>
      <View style={[globalStyles.box, styles.container]}>
        <TitleBar
          border={border}
          center={center}
          title={title}
          endIcon={onPress ? <ExpandIcon onPress={onPress} /> : null}
        />
        {body}
      </View>
    </Pressable>
  );
};
export default Card;
