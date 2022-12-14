import React, { useState, useEffect } from "react";
import { Text, View, Switch } from "react-native";
import ReactNativeSlider from "@react-native-community/slider";

import useStyles from "hooks/use-styles";

import { localStyles } from "./Slider.styles";

const Slider = ({ value, onValueChange }) => {
  let tempShowSlider = false;
  let tempSliderDisplayValue = 50;
  if (
    value?.influence_slider === false ||
    value?.influence === null ||
    (value?.influence_slider === null && value?.influence === 0)
  ) {
    tempShowSlider = false;
  } else {
    tempShowSlider = true;
    tempSliderDisplayValue = value?.influence;
  }

  const [showSlider, setShowSlider] = useState(tempShowSlider);
  const [sliderDisplayValue, setSliderDisplayValue] = useState(
    tempSliderDisplayValue
  );
  const [switchToggled, setSwitchToggled] = useState(false);

  const { styles, globalStyles } = useStyles(localStyles);

  const toggleSwitch = () => {
    setSwitchToggled(true);
    setShowSlider((prev) => !prev);
  };

  useEffect(() => {
    if (showSlider === false && switchToggled === true) {
      onValueChange({ influence: null, influence_slider: false });
    } else if (showSlider === true && switchToggled === true) {
      setSliderDisplayValue(50);
    }
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
            value={parseInt(sliderDisplayValue)}
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
              onValueChange({
                influence: completedValue,
                influence_slider: true,
              });
            }}
          />
        </>
      )}
    </View>
  );
};
export default Slider;
