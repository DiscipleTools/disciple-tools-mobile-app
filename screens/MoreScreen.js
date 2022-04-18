import React from "react";
import { SafeAreaView } from "react-native";

import { ChevronIcon, PostIcon } from "components/Icon";
import OfflineBar from "components/OfflineBar";
import ListItem from "components/ListItem";

import useCustomPostTypes from "hooks/use-custom-post-types";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";

import { ScreenConstants } from "constants";

import { localStyles } from "./MoreScreen.styles";

const MoreScreen = ({ navigation }) => {

  const { customPostTypes } = useCustomPostTypes() || {};
  const { styles, globalStyles } = useStyles(localStyles);

  const PostButton = ({ type }) => {
    const { settings } = useSettings({ type });
    if (!settings?.label) return null;
    const label = settings.label;
    return(
      <ListItem
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
  };

  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <OfflineBar />
      { customPostTypes?.map(postType => (
        <PostButton key={postType} type={postType} />
      ))}
    </SafeAreaView>
  );
};
export default MoreScreen;
