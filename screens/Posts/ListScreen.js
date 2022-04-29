import React, { useEffect, useLayoutEffect } from "react";
import { View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { HeaderRight } from "components/Header/Header";
import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import FAB from "components/FAB";
import {
  PostItem,
  PostItemSkeleton,
  PostItemHidden,
} from "components/Post/PostItem/index";

import useFilter from "hooks/use-filter";
import useI18N from "hooks/use-i18n";
import useList from "hooks/use-list";
import useType from "hooks/use-type";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";

import { localStyles } from "./ListScreen.styles";

const ListScreen = ({ navigation, route }) => {

  const tabBarHeight = useBottomTabBarHeight();
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { postType } = useType();
  const { settings } = useSettings({ type: postType });
  const { defaultFilter, filter, onFilter, search, onSearch } = useFilter();

  const {
    data: items,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useList({ search, filter });
  // TODO: handler error case

  useLayoutEffect(() => {
    if (!settings?.label) return;
    const title = settings?.label ? settings.label : '';
    const kebabItems = [
      {
        label: i18n.t("global.viewOnWeb"),
        urlPath: `${postType}`,
      },
      {
        label: i18n.t("global.documentation"),
        url: `https://disciple.tools/user-docs/disciple-tools-mobile-app/how-to-use/list-screens/#${postType}-screen`,
      },
    ];
    navigation.setOptions({
      title,
      headerRight: (props) => <HeaderRight kebabItems={kebabItems} props />,
    });
  }, [settings?.label]);

  const renderItem = ({ item }) => (
    <PostItem item={item} loading={isLoading} mutate={mutate} />
  );
  //const renderHiddenItem = ({ item }) => <PostItemHidden item={item} loading={isLoading||isValidating} />;

  // TODO: mock search bar, filter tags, FAB, etc..
  const ListSkeleton = () =>
    Array(10)
      .fill(null)
      .map((_, ii) => <PostItemSkeleton key={ii} />);

  if (!items) return <ListSkeleton />;
  return (
    <>
      <View style={[globalStyles.container(tabBarHeight)]}>
        <OfflineBar />
        <FilterList
          display
          sortable
          items={items}
          renderItem={renderItem}
          //renderHiddenItem={renderHiddenItem}
          keyExtractor={(item) => item?.ID?.toString()}
          search={search}
          onSearch={onSearch}
          defaultFilter={defaultFilter}
          filter={filter}
          onFilter={onFilter}
          onRefresh={mutate}
          //leftOpenValue={Constants.SWIPE_BTN_WIDTH * Constants.NUM_SWIPE_BUTTONS_LEFT}
          //rightOpenValue={Constants.SWIPE_BTN_WIDTH * Constants.NUM_SWIPE_BUTTONS_RIGHT}
        />
      </View>
      <FAB />
    </>
  );
};
export default ListScreen;
