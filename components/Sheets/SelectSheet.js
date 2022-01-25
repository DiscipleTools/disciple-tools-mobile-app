import React, { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { Pressable, View, Text } from "react-native";
import { Icon } from "native-base";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFooter, BottomSheetScrollView, BottomSheetSectionList, useBottomSheet } from '@gorhom/bottom-sheet';

//import SearchBar from "components/FilterList/SearchBar";
import SheetHeader from "components/Sheets/SheetHeader";
import { SheetFooterCancel, SheetFooterDone } from "components/Sheets/SheetFooter";

import useStyles from "hooks/useStyles";

import { localStyles } from "./SelectSheet.styles";

const SelectSheet = forwardRef((props, ref) => {

  const { 
    multiple,
    required,
    snapPoints,
    onSnap,
    title,
    items,
    renderItem,
    sections,
    onDismiss,
    onChange,
    onDone,
  } = props;

  const { styles, globalStyles } = useStyles(localStyles);
  const [snapIndex, setSnapIndex] = useState(-1);

  const [_sections, _setSections] = useState(sections);
  const selectedCount = useRef(1);

  const delayedClose = () => {
    setTimeout(() => {
      if (onDismiss) {
        onDismiss();
      } else {
        ref.current.close();
      };
    }, 250);
  };

  const onPress = (key) => {
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

    const selectedKeys = [];
    updatedSections.forEach(section => {
      section.data.forEach(item => {
        if (item.selected) selectedKeys.push(item.key);
      })
    });
    _setSections(updatedSections);
    onChange(selectedKeys);
    if (!multiple) delayedClose();
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
      />
    ), []);

  const _renderItem = (item) => {
    const { key, label, icon, selected } = item?.item;
    return(
      <Pressable onPress={() => onPress(key)}>
        <View key={key} style={styles.itemContainer}>
            {icon && (
              <View style={globalStyles.rowIcon}>
                <Icon
                  type={icon?.type}
                  name={icon?.name}
                  style={globalStyles.icon}
                />
              </View>
            )}
          <View style={{
            marginEnd: "auto",
          }}>
            <Text>{label}</Text>
          </View>
          {selected && (
            <View style={globalStyles.rowIcon}>
              <Icon
                type="MaterialCommunityIcons"
                name="check"
                style={styles.selectedIcon}
              />
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  //const _renderSectionHeader = useCallback(
  //  ({ section }) => (
    const _renderSectionHeader = ({ section }) => (
      <View style={styles.sectionHeader}>
        <Text style={globalStyles.subtitle}>{section.title}</Text>
      </View>
    );
  //  []
  //);

  return(
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      onChange={setSnapIndex}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.container}
    >
      <SheetHeader
        expandable
        dismissable
        snapPoints={snapPoints}
        snapIndex={snapIndex}
        title={title}
        onDismiss={onDismiss}
      />
        <BottomSheetSectionList
          sections={_sections}
          keyExtractor={(i) => i}
          renderSectionHeader={_renderSectionHeader}
          renderItem={_renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      {/*
      <BottomSheetScrollView
        contentContainerStyle={styles.contentContainer}
      >
        {items?.map(item => 
          _renderItem(item)
        )}
      </BottomSheetScrollView>
        */}
      {multiple ? (
        <SheetFooterDone onDone={onDone} />
      ) : (
        <SheetFooterCancel onDismiss ={onDismiss} />
      )}
    </BottomSheet>
  );
});
{/*
<SelectSheetItem
  key={item?.key}
  item={item}
  onPress={() => ref.current.close()}
/>
*/}

export const SectionSelectSheet = forwardRef((props, ref) => <SelectSheet ref={ref} sections={props?.sections} />);

export default SelectSheet;
