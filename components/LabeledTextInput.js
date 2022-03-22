import React from "react";
import { View, Text, TextInput } from "react-native";

import useStyles from "hooks/use-styles";

import { localStyles } from "./LabeledTextInput.styles";

const LabeledTextInput = (props) => {
  const {
    containerStyle,
    labelStyle,
    labelTextStyle,
    textInputStyle,
    startIcon,
    endIcon,
    label,
    value,
    editing,
    onChangeText,
  } = props;

  const { styles, globalStyles } = useStyles(localStyles);

  //const TextFieldEdit = () => (
  const renderTextFieldEdit = () => (
    <View style={[styles.inputContainer, containerStyle]}>
      <View style={[styles.inputLabel, labelStyle]}>
        <Text style={[styles.inputLabelText, labelTextStyle]}>
          {label}
        </Text>
      </View>
      <View style={globalStyles.rowContainer}>
        {startIcon}
        <TextInput
          style={[styles.inputRowTextInput, textInputStyle]}
          {...props}
        />
        {endIcon}
      </View>
    </View>
  );

  //const TextFieldView = () => (
  const renderTextFieldView = () => (
    <View style={[styles.inputContainer, containerStyle]}>
      <View style={[styles.inputLabel, labelStyle]}>
        <Text style={[styles.inputLabelText, labelTextStyle]}>
          {label}
        </Text>
      </View>
      <View style={styles.inputRow}>
        {icon}
        <Text style={[
          styles.inputRowTextInput,
          textInputStyle,
          isRTL ? { textAlign: "left", flex: 1 } : {}
        ]}>
          {value}
        </Text>
      </View>
    </View>
  );

  /*
   * NOTE: returning a component  will cause loss of focus and Keyboard dismissal
   * (instead 'trick' React by invoking lowercase render method)
   */
  //return <>{editing ? <TextFieldEdit /> : <TextFieldView />}</>;
  return <>{editing ? renderTextFieldEdit() : renderTextFieldView() }</>;
};
export default LabeledTextInput;
