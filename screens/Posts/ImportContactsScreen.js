import React from "react";
import { Pressable, Text, View } from "react-native";

import FilterList from "components/FilterList";
import OfflineBar from "components/OfflineBar";
import Subtitles from "components/Subtitles";
import PostItemSkeleton from "components/Post/PostItem/PostItemSkeleton";

import useI18N from "hooks/useI18N";
import useImportContacts from 'hooks/useImportContacts';

import Constants from "constants";
import Colors from "constants/Colors";

const ImportContactsScreen = ({ navigation }) => {

  const { i18n, isRTL } = useI18N();

  const { data: items, error, isLoading } = useImportContacts();

  let isError = false;
  if (error) {
    isError = true;
    // TODO
    //toast(error, true);
    console.error(error);
  };

  const ImportContactItem = ({ item, loading }) => {
    if (!item || loading) return <PostItemSkeleton />;
    // TODO: compare imported contacts with existing contacts (to determine if new)
    // TODO: constant
    const listItemHeight = 80;
    return (
      <Pressable
        onPress={() => {
          //goToDetailsScreen(item);
          console.log("*** IMPORT CONTACT SCREEN ***");
          console.log(JSON.stringify(item));
        }}
        style={{
          padding: 15,
          backgroundColor: Colors.grayLight,
          height: listItemHeight,
        }}
        key={item?.id}
      >
        <View style={{ flexDirection: "row", height: 75 }}>
          <View style={{ flexDirection: "column", flexGrow: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  textAlign: "left",
                  flex: 1,
                  flexWrap: "wrap",
                  fontWeight: "bold",
                }}
              >
                { item?.name ? item.name : item?.title}
              </Text>
            </View>
            <Subtitles item={item} />
          </View>
          <View
            style={[
              {
                flexDirection: "column",
                width: Constants.STATUS_CIRCLE_SIZE,
                paddingTop: 0,
                marginTop: "auto",
                marginBottom: "auto",
              },
              isRTL ? { marginRight: 5 } : { marginLeft: 5 },
            ]}
          >
            <View
              style={{
                width: Constants.STATUS_CIRCLE_SIZE,
                height: Constants.STATUS_CIRCLE_SIZE,
                borderRadius: Constants.STATUS_CIRCLE_SIZE / 2,
                //backgroundColor: getSelectorColor(item?.),
                backgroundColor: Colors.gray,
                marginTop: "auto",
                marginBottom: "auto",
              }}
            ></View>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderItem = ({ item }) => <ImportContactItem item={item} loading={isLoading||isError} />;

  return (
    <>
      <OfflineBar />
      <FilterList
        items={(items?.length > 0) ? items : []}
        renderItem={renderItem}
        // TODO: add term and translate
        placeholder={"IMPORT CONTACT PLACEHOLDER TEXT"}
      />
    </>
  );
};
export default ImportContactsScreen;