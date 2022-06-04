import React, { useState, useEffect } from "react";
import { Text, View, Switch } from "react-native";
import ReactNativeSlider from "@react-native-community/slider";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Slider.styles";

const Slider = ({ value, onValueChange }) => {
  const [showSlider, setShowSlider] = useState(value ? true : false);
  const [sliderDisplayValue, setSliderDisplayValue] = useState(
    value ? value : 50
  );
  const [switchToggled, setSwitchToggled] = useState(false);

  const { styles, globalStyles } = useStyles(localStyles);

  const toggleSwitch = () => {
    setSwitchToggled(true);
    setShowSlider((prev) => !prev);
  };

  useEffect(() => {
    if (showSlider === false) {
      onValueChange("");
    } else if (switchToggled === true && showSlider === true) {
      setSliderDisplayValue(50);
    }
    return;
  }, [showSlider, switchToggled]);

  return (
    <View style={styles.container}>
      <View style={{ ...globalStyles.rowContainer, alignItems: "center" }}>
        <Switch
          trackColor={{ true: styles.switch.color }}
          thumbColor={styles.switch}
          value={showSlider}
          onChange={toggleSwitch}
        />
        {showSlider && (
          <View style={{ marginLeft: 10 }}>
            <Text>{sliderDisplayValue}</Text>
          </View>
        )}
      </View>

      {showSlider && (
        <>
          <ReactNativeSlider
            style={styles.slider}
            value={sliderDisplayValue}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor={
              sliderDisplayValue == 100 ? "green" : styles.sliderMinColor
            }
            maximumTrackTintColor={
              sliderDisplayValue == 0 ? "#660000" : styles.sliderMaxColor
            }
            thumbTintColor={styles.sliderThumbColor}
            onValueChange={(value) => {
              setSliderDisplayValue(Math.floor(value));
            }}
            onSlidingComplete={(completedValue) => {
              completedValue = Math.floor(completedValue);
              if (completedValue === 100) {
                // TODO: translate
                alert("COMPLETE INFLUENCE");
              }
              if (completedValue === 0) {
                // TODO: translate
                alert("NO INFLUENCE");
              }
              onValueChange(String(completedValue));
            }}
          />
        </>
      )}
    </View>
  );
};
export default Slider;
