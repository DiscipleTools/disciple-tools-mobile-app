import React, { useState, useReducer } from "react";
import { Platform, Pressable, Text, View, } from "react-native";
import PropTypes from "prop-types";

import { Accordion, Item } from "native-base";
// NOTE: this is used to pass a custom component/icon as checkbox to preserve a standard look-and-feel across platform (which is not currently supported by native base)
// TODO: replace with existing depenedency
import { CheckBox } from "react-native-elements";

import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";
import useFilters from "hooks/useFilters";
import useToast from "hooks/useToast";

// TODO: migrate to StyleSheet
import Colors from "constants/Colors";

import { styles } from "./FilterOptionsPanel.styles";

const FilterOptionsPanel = ({ onFilter }) => {
  //const isConnected = useNetworkStatus();
  const { i18n, isRTL } = useI18N();
  //const toast = useToast();

  const [selectedFilterID, setSelectedFilterID] = useState(null); 

  const { data: filters, error } = useFilters();
  if (!filters) return null;

  if (error) toast(error?.message, true);

  const _onFilter = (filter) => {
    // TODO
    // showFilterOptionsPanel(false) ??
    // active X (clear) on SearchBar (to clear filter) ??
    setSelectedFilterID(filter?.ID);
    onFilter(filter);
  };

  const renderHeader = (item, expanded) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          backgroundColor: expanded ? Colors.primary : "#FFFFFF",
          height: 50,
          paddingLeft: 15,
          paddingRight: 15,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: Colors.grayLight,
          width: "100%",
        }}
      >
        <Text
          style={{
            color: expanded ? "#FFFFFF" : Colors.primary,
            marginTop: "auto",
            marginBottom: "auto",
            fontWeight: "bold",
          }}
        >
          {item?.title}
        </Text>
        <Text
          style={{
            color: expanded ? "#FFFFFF" : Colors.primary,
            marginTop: "auto",
            marginBottom: "auto",
            marginRight: "auto",
          }}
        >
          {item?.count ? (
            <Text
              style={{
                color: expanded ? "#FFFFFF" : Colors.primary,
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              {` (${item.count})`}
            </Text>
          ) : null}
        </Text>
        <Text
          style={{
            color: expanded ? "#FFFFFF" : Colors.primary,
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: "auto",
          }}
        >
          {expanded ? "-" : "+"}
        </Text>
      </View>
    );
  };

  const renderContent = (item, expanded) => {
    const content = item?.content;
    return (
      <View
        key={0}
        style={{
          //borderWidth: 1,
          //borderColor: Colors.grayLight,
          paddingTop: 10,
          paddingBottom: 10,
          paddingRight: 10,
        }}
      >
        {content.length > 0 ? (
          content.map((filter) => {
            const subfilter = filter?.subfilter ?? 0;
            let indent = 0;
            if (typeof subfilter !== "boolean") {
              indent = 20 * subfilter; // 1, 2, ...
            }
            return (
              <Pressable
                key={filter?.ID}
                onPress={() =>
                  _onFilter({
                    ID: filter?.ID,
                    name: filter?.name,
                    query: filter?.query
                  })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    height: 50,
                    paddingLeft: indent,
                  }}
                >
                  <CheckBox
                    checked={filter?.ID === selectedFilterID}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    onPress={() =>
                      _onFilter({
                        ID: filter?.ID,
                        name: filter?.name,
                        query: filter?.query
                      })
                    }
                    containerStyle={{ padding: 0, margin: 0 }}
                  />
                  <Text
                    style={{
                      paddingTop: Platform.OS === "ios" ? 4 : 0,
                    }}
                  >
                    {filter?.name}
                  </Text>
                  <Text
                    style={{
                      marginLeft: "auto",
                      paddingTop: Platform.OS === "ios" ? 4 : 0,
                    }}
                  >
                    {filter?.count}
                  </Text>
                </View>
              </Pressable>
            );
          })
        ) : (
          <Text>{i18n.t("global.noFilters")}</Text>
        )}
      </View>
    );
  };

  return (
    <Item>
      <Accordion
        dataArray={filters}
        animation={true}
        //expanded={true}
        renderHeader={renderHeader}
        renderContent={renderContent}
        //activeSections={null}
        //sections={null}
      />
    </Item>
  );
};
FilterOptionsPanel.propTypes = {};
//FilterOptionsPanel.whyDidYouRender = true;
export default FilterOptionsPanel;
