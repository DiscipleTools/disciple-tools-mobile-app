import React, { useLayoutEffect } from "react";
import { SafeAreaView, View } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';


import { HeaderRight } from "components/Header/Header";
import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import FAB from "components/FAB";
import { PostItem, PostItemSkeleton, PostItemHidden } from "components/Post/PostItem/index";

import useFilter from "hooks/use-filter";
import useI18N from "hooks/use-i18n";
import useList from "hooks/use-list";
import useType from "hooks/use-type";
import useStyles from "hooks/use-styles";

import { labelize } from "utils";

import { localStyles } from './ListScreen.styles';

const ListScreen = ({ navigation, route }) => {

  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();

  const tabBarHeight = useBottomTabBarHeight();
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { postType } = useType();
  const { defaultFilter, filter, onFilter, search, onSearch } = useFilter();
  
  const { data: items, error, isLoading, isValidating, mutate } = useList({ search, filter });
  // TODO: handler error case

  const getTitle = () => {
    if (postType) return labelize(postType);
    return '';
  };

  useLayoutEffect(() => {
    const title = getTitle();
    const kebabItems = [
      {
        label: i18n.t('global.viewOnMobileWeb'),
        urlPath: `/${postType}/`,
      },
      {
        label: i18n.t('settingsScreen.helpSupport'),
        url: `https://disciple.tools/user-docs/getting-started-info/${postType}/`
      }
    ];
    navigation.setOptions({
      title,
      headerRight: (props) => (
        <HeaderRight
          kebabItems={kebabItems}
          props
        />
      )
    });
  });

  const renderItem = ({ item }) => <PostItem item={item} loading={isLoading||isValidating} mutate={mutate} />;
  //const renderHiddenItem = ({ item }) => <PostItemHidden item={item} loading={isLoading||isValidating} />;

  // TODO: mock search bar, filter tags, FAB, etc..
  const ListSkeleton = () => Array(10).fill(null).map((_, ii) => <PostItemSkeleton key={ii} />);

  return (
    <>
      <View style={[
        globalStyles.container(tabBarHeight),
      ]}>
        <OfflineBar />
        {!items ? (
          <ListSkeleton />
        ) : (
          <>
            <FilterList
              display
              sortable
              items={items}
              renderItem={renderItem}
              //renderHiddenItem={renderHiddenItem}
              search={search}
              onSearch={onSearch}
              defaultFilter={defaultFilter}
              filter={filter}
              onFilter={onFilter}
              onRefresh={mutate}
              //leftOpenValue={Constants.SWIPE_BTN_WIDTH * Constants.NUM_SWIPE_BUTTONS_LEFT}
              //rightOpenValue={Constants.SWIPE_BTN_WIDTH * Constants.NUM_SWIPE_BUTTONS_RIGHT}
            />
          </>
        )}
      </View>
      <FAB />
    </>
  );
};
export default ListScreen;