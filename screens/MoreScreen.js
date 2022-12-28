import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ChevronIcon, PostIcon } from "components/Icon";
import { HeaderRight } from "components/Header/Header";
import OfflineBar from "components/OfflineBar";
import ListItem from "components/ListItem";
import Placeholder from "components/Placeholder";

import useCustomPostTypes from "hooks/use-custom-post-types";
import useSettings from "hooks/use-settings";
import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { ScreenConstants } from "constants";

//import { localStyles } from "./MoreScreen.styles";

const PostButton = ({ type }) => {
  const navigation = useNavigation();
  const { globalStyles } = useStyles();
  const { settings } = useSettings({ type });
  if (!settings?.post_types?.[type]?.label_plural) return null;
  const label = settings.post_types[type].label_plural;
  return (
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

const MoreScreen = ({ navigation }) => {
  const { customPostTypes } = useCustomPostTypes() || [];
  const { globalStyles } = useStyles();
  const { i18n } = useI18N();

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
      headerRight: (props) => <HeaderRight kebabItems={kebabItems} props />,
    });
  }, []);

  return (
    <View style={globalStyles.screenContainer}>
      <OfflineBar />
      {!customPostTypes?.length > 0 && <Placeholder />}
      {customPostTypes?.map((postType) => (
        <PostButton key={postType} type={postType} />
      ))}
    </View>
  );
};
export default MoreScreen;
