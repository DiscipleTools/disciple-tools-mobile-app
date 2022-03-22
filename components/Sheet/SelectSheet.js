import React, { useRef, useState } from "react";
import { Image, Pressable, View, Text } from "react-native";
import { BottomSheetSectionList } from '@gorhom/bottom-sheet';

import { CheckIcon } from "components/Icon";

import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";

import { localStyles } from "./SelectSheet.styles";

const SelectSheet = ({
    required,
    multiple,
    sections,
    renderSectionHeader,
    renderItem,
    onDismiss,
    onChange,
}) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { collapse, delayedClose } = useBottomSheet();

  const [_sections, _setSections] = useState(sections);

  // TODO: used for...
  const selectedCount = useRef(1);

  const _onDismiss = () => {
    if (onDismiss) {
      onDismiss(_sections);
      return;
    };
    collapse();
  };

  const _onDone = () => {
    onChange(_sections);
    delayedClose();
  };

  // TODO: prettier implementation
  const _onChange = (selectedItem) => {
    if (!multiple) {
      onChange(selectedItem);
      collapse();
      return;
    };
    const key = selectedItem.key;
    const updatedSections = _sections.map(section => {
      return {
        title: section.title,
        data: section.data.map(item => {
          if (item?.key === key) {
            let selected = !item.selected;
            if (required) {
              selectedCount.current = item.selected ? selectedCount.current - 1 : selectedCount.current + 1;
              if (selectedCount.current < 1) {
                selected = true;
                selectedCount.current = selectedCount.current + 1;
              };
            };
            return {
              ...item,
              selected: multiple ? selected : true,
            };
          };
          if (!multiple) return {
            ...item,
            selected: false,
          }
          return item;
        })
      };
    });
    _setSections(updatedSections);
    onChange(updatedSections);
  };

  const _renderItem = ({ item }) => {
    if (renderItem) return renderItem(item);
    const { key, label, icon, avatar, selected } = item;
    return(
      <Pressable onPress={() => _onChange(item)}>
        <View key={key} style={[
          globalStyles.rowContainer,
          styles.itemContainer
        ]}>
            {avatar && (
              <Image style={styles.avatar} source={{ uri: avatar }} />
            )}
            {icon && (
              <View style={globalStyles.rowIcon}>
                {icon}
              </View>
            )}
          <View style={{
            marginEnd: "auto",
          }}>
            <Text>{label}</Text>
          </View>
          {selected && (
            <View style={globalStyles.rowIcon}>
              <CheckIcon style={globalStyles.selectedIcon} />
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  //const _renderSectionHeader = useCallback(({ section }) => (
  const _renderSectionHeader = ({ section }) => {
    if (renderSectionHeader) return renderSectionHeader({ section });
    if (!section?.title) return null;
    return(
      <View style={styles.sectionHeader}>
        <Text style={globalStyles.subtitle}>{section.title}</Text>
      </View>
    );
  };

  return(
    <BottomSheetSectionList
      sections={_sections}
      // TODO
      //keyExtractor={(key) => key}
      renderSectionHeader={_renderSectionHeader}
      renderItem={_renderItem}
      contentContainerStyle={styles.contentContainer}
    />
  );
};
export default SelectSheet;
