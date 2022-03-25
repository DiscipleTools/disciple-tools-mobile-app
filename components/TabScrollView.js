import React from "react";
import { Pressable, Text, View } from "react-native";
import {
  ScrollView,
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';

import useStyles from "hooks/use-styles";

import { localStyles } from "./TabScrollView.styles";

const TabScrollView = ({ index, onIndexChange, renderTab, scenes, style }) => {

  const { styles, globalStyles } = useStyles(localStyles);

  if (!index) index = 0;

  const Tab = ({ label, selected}) => (
    <View style={styles.tabContainer(selected)}>
      <Text style={styles.tabLabel}>{label}</Text>
    </View>
  );

  if (!scenes || scenes?.length < 1) return null;
  return(
    <View
      style={[
        styles.container,
        style
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.scrollViewContent}
      >
        {scenes?.map((scene, idx) => (
          <Pressable
            key={idx}
            onPress={() => { onIndexChange ? onIndexChange(idx) : null }}
            style={{}}
          >
            { renderTab ? renderTab({ scene, idx }) : (
              <Tab
                idx={idx}
                label={scene?.label}
                selected={scene?.label === scenes[index]?.label}
              />
            )}
          </Pressable>
        ))}
      </ScrollView>
      <FlingGestureHandler
        direction={Directions.LEFT}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            if (onIndexChange) {
              if (index < scenes?.length-1) {
                onIndexChange(index + 1);
              } else {
                onIndexChange(0);
              };
            };
          };
        }}
      >
        <FlingGestureHandler
          direction={Directions.RIGHT}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              if (onIndexChange) {
                if (index === 0) {
                  onIndexChange(scenes?.length-1);
                } else {
                  onIndexChange(index-1);
                };
              };
            };
          }}
        >
          <View style={styles.sceneContent}>
            {scenes[index]?.component}
          </View>
        </FlingGestureHandler>
      </FlingGestureHandler>
    </View>
  );
};
export default TabScrollView;