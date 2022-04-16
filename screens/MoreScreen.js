import React, { useCallback } from "react";
import { SafeAreaView } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { ChevronIcon, PostIcon } from "components/Icon";
import OfflineBar from "components/OfflineBar";
//import TitleBar from "components/TitleBar";
import ListItem from "components/ListItem";

import useCustomPostTypes from "hooks/use-custom-post-types";
import useStyles from "hooks/use-styles";

import { ScreenConstants } from "constants";

import { labelize } from "utils";

import { localStyles } from "./MoreScreen.styles";

const MoreScreen = ({ navigation, route }) => {

  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();

  const { activeCustomPostTypes } = useCustomPostTypes();
  const { styles, globalStyles } = useStyles(localStyles);

  const PostButton = ({ key, label, type }) => (
    <ListItem
      key={key}
      startComponent={<PostIcon />}
      label={label}
      endComponent={<ChevronIcon style={globalStyles.icon} />}
      onPress={() => {
        navigation.push(ScreenConstants.LIST, {
          type,
          filter: null,
        });
      }}
    />
  );

  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <OfflineBar />
      { activeCustomPostTypes.map(type => (
        <PostButton key={type} label={labelize(type)} type={type} />
      ))}
    </SafeAreaView>
  );
};
export default MoreScreen;
