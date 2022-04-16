import React from "react";
import { Pressable, Text, View } from "react-native";
import { useIsFocused } from '@react-navigation/native';

import OfflineBar from "components/OfflineBar";
import FilterList from "components/FilterList";
import { PostItem, PostItemSkeleton, PostItemHidden } from "components/Post/PostItem/index";

import useImportContacts from 'hooks/use-import-contacts';
import useFilter from "hooks/use-filter";
import useStyles from "hooks/use-styles";

import { truncate } from "utils";

import { localStyles } from "./ImportContactsScreen.styles";

const SUBTITLE_THRESHOLD = 60;

const ImportContactsScreen = ({ navigation }) => {

  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();

  const { styles, globalStyles } = useStyles(localStyles);
  const { search, onSearch } = useFilter();
  
  const { data: items, error, isLoading, isValidating, mutate } = useImportContacts({ search });
  // TODO: handler error case

  const renderItem = ({ item }) => {
    const PostTitle = () => (
        <Text style={[
          globalStyles.text,
          styles.title
        ]}>
          { item?.name ? item.name : item?.title}
        </Text>
    );
    const PostSubtitle = ({ values }) => {
      values = values?.map(value => value?.value);
      const joined = values?.join(" • ");
      const truncated = truncate(joined, { maxLength: SUBTITLE_THRESHOLD });
      return (
        <Text style={globalStyles.caption}>
          {truncated}
        </Text>
      );
    };
    const PostDetails = () => (
      <View style={[
        globalStyles.columnContainer,
        styles.postDetails,
      ]}>
        <PostTitle />
        { item?.contact_phone && (
          <PostSubtitle values={item.contact_phone} />
        )}
        { item?.contact_email && (
          <PostSubtitle values={item.contact_email} />
        )}
      </View>
    );
    return (
      <Pressable
        key={item?.ID}
        onPress={() => console.log(JSON.stringify(item)) }
      >
        <View style={[
          globalStyles.rowContainer,
          styles.postItem
        ]}>
          <PostDetails />
        </View>
      </Pressable>
    );
  };

  const ListSkeleton = () => Array(10).fill(null).map((_, ii) => <PostItemSkeleton key={ii} />);

  return (
    <>
      <OfflineBar />
      {!items ? (
        <ListSkeleton />
      ) : (
        <FilterList
          items={items}
          renderItem={renderItem}
          search={search}
          onSearch={onSearch}
          onRefresh={mutate}
        />
      )}
    </>
  );
};
export default ImportContactsScreen;