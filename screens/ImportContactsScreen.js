import React from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Container } from "native-base";

import FilterList from "components/FilterList";
import OfflineBar from "components/OfflineBar";
import Subtitles from "components/Subtitles";
import PostItemSkeleton from "components/PostItem/PostItemSkeleton";

import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";
import useImportContacts from 'hooks/useImportContacts';

import { styles } from "./ImportContactsScreen.styles";

import Constants from "constants";
import Colors from "constants/Colors";

const ImportContactsScreen = ({ navigation }) => {

  const isConnected = useNetworkStatus();
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
    return (
      <Pressable
        onPress={() => {
          //goToDetailsScreen(item);
          console.log("*** IMPORT CONTACT SCREEN ***");
          console.log(JSON.stringify(item));
        }}
        style={styles.rowFront}
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
    <Container>
      {!isConnected && <OfflineBar />}
      <FilterList
        items={(items?.length > 0) ? items : []}
        renderItem={renderItem}
        // TODO: add term and translate
        placeholder={"IMPORT CONTACT PLACEHOLDER TEXT"}
      />
    </Container>
  );
};
export default ImportContactsScreen;