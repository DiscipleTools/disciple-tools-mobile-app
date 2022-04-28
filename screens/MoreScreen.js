import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native";

import { ChevronIcon, PostIcon } from "components/Icon";
import { HeaderRight } from "components/Header/Header";
import OfflineBar from "components/OfflineBar";
import ListItem from "components/ListItem";

import useCustomPostTypes from "hooks/use-custom-post-types";
import useSettings from "hooks/use-settings";
import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { ScreenConstants } from "constants";

import { localStyles } from "./MoreScreen.styles";

const MoreScreen = ({ navigation }) => {

  const { customPostTypes } = useCustomPostTypes() || {};
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n, isRTL } = useI18N();

  useLayoutEffect(() => {
    const kebabItems = [
      {
        label: i18n.t("global.viewOnWeb"),
        urlPath: "#",
      },
      {
        label: i18n.t("global.documentation"),
        url: `https://disciple.tools/user-docs/disciple-tools-mobile-app/how-to-use/more-screen/`,
      },
    ];
    navigation.setOptions({
      title: i18n.t("global.more"),
      headerRight: (props) => (
        <HeaderRight
          kebabItems={kebabItems}
          props
        />
      ),
    });
  }, []);

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
