import React, { useState, useReducer } from "react";
import { Platform, Pressable, Text, View, } from "react-native";
//import PropTypes from "prop-types";

import { Accordion, Item } from "native-base";
// NOTE: this is used to pass a custom component/icon as checkbox to preserve a standard look-and-feel across platform (which is not currently supported by native base)
import { CheckBox } from "react-native-elements";

import useI18N from "hooks/useI18N";
import useFilters from "hooks/useFilters";
//import useToast from "hooks/useToast";

import Colors from "constants/Colors";

import { styles } from "./FilterOptionsPanel.styles";

const FilterOptionsPanel = ({ filter, onFilter }) => {
  const { i18n, isRTL } = useI18N();
  //const toast = useToast();

  const [_filter, _setFilter] = useState(filter); 

  const { data: filters, error } = useFilters();
  if (!filters) return null;

  //if (error) toast(error?.message, true);

  const _onFilter = (filter) => {
    _setFilter(filter);
    onFilter(filter);
  };

  const renderContent = (item) => {
    const content = item?.content;
    return (
      <View
        key={0}
        style={{
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
                    height: 35,
                    paddingLeft: indent,
                  }}
                >
                  <CheckBox
                    checked={filter?.ID === _filter?.ID}
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
                    { filter?.count > 0 ? filter.count : null }
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
        icon={"add"}
        expandedIcon={"remove"}
        headerStyle={styles.accordionHeader}
        renderContent={renderContent}
      />
    </Item>
  );
};
//FilterOptionsPanel.propTypes = {};
//FilterOptionsPanel.whyDidYouRender = true;
export default FilterOptionsPanel;
