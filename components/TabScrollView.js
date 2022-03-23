import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import useStyles from "hooks/use-styles";

import { localStyles } from "./TabScrollView.styles";

const TabScrollView = ({ initialIndex, scenes, renderTab, onIndexChange, style }) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!scenes) return;
    if (!initialIndex) initialIndex = 0;
    setActive(scenes[initialIndex]);
  }, [initialIndex, scenes]);

  const Tab = ({ idx, label, active }) => (
    <View style={styles.tabContainer(active)}>
      <Text style={styles.tabLabel}>{label}</Text>
    </View>
  );

  if (scenes?.length < 1) return null;
  return (
    <View style={[
      styles.container,
      style
    ]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.scrollViewContent}
      >
        {scenes?.map((scene, idx) => (
          <Pressable
            key={idx}
            onPress={() => {
              setActive(scene);
              if (onIndexChange) onIndexChange(idx);
            }}
            style={{}}
          >
            { renderTab ? renderTab({ scene, idx }) : (
              <Tab
                idx={idx}
                label={scene?.label}
                active={active === scene}
              />
            )}
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.sceneContent}>
        {active?.component}
      </View>
    </View>
  );
};
export default TabScrollView;