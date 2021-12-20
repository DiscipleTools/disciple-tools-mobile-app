import React from "react";
import { View, Pressable, Text } from "react-native";

import { Container } from "native-base";

import FilterList from "components/FilterList";
import OfflineBar from "components/OfflineBar";
import Subtitles from "components/Subtitles";

import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";
import useImportContacts from 'hooks/useImportContacts';

import { styles } from "./ImportContactsScreen.styles";

import Constants from "constants";

const ImportContactsScreen = ({ navigation }) => {

  const isConnected = useNetworkStatus();
  const { i18n, isRTL } = useI18N();

  const { data: importContacts, error, isLoading } = useImportContacts();

  const renderRow = (record) => {
    return(
      <Pressable
        onPress={() => {
          //goToDetailsScreen(record);
          console.log("*** IMPORT CONTACT SCREEN ***");
          // navigate to Add New Screen
        }}
        //style={styles.rowFront}
        //key={record.ID}
        key={record?.id}
      >
        <Text>
          {record.title}
        </Text>
      </Pressable>
    );
    const statusValue = null;
    return (
      <Pressable
        onPress={() => {
          //goToDetailsScreen(record);
          console.log("*** IMPORT CONTACT SCREEN ***");
        }}
        //style={styles.rowFront}
        //key={record.ID}
        key={record?.id}
      >
        <View style={{ flexDirection: "row", height: "100%" }}>
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
                {Object.prototype.hasOwnProperty.call(record, "name")
                  ? record.name
                  : record.title}
              </Text>
            </View>
            <Subtitles record={record} settings={null} />
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
                backgroundColor: 'green', //getSelectorColor(statusValue),
                marginTop: "auto",
                marginBottom: "auto",
              }}
            ></View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <Container style={styles.container}>
      {!isConnected && <OfflineBar />}
      <FilterList
        posts={ (importContacts?.length > 0) ? importContacts : [] }
        loading={isLoading}
        renderRow={renderRow}
        //footer={list.length >= DEFAULT_LIMIT ? renderFooter : null}
        //style={{ backgroundColor: Colors.mainBackgroundColor }}
        // TODO: add term and translate
        placeholder={"IMPORT CONTACT PLACEHOLDER TEXT"}
      />
    </Container>
  );
};
export default ImportContactsScreen;