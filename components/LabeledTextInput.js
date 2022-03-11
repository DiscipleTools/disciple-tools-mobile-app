import React from "react";
import { View, Text, TextInput } from "react-native";
import { Icon } from "native-base";

import useI18N from "hooks/use-i18n";

import { styles } from "./LabeledTextInput.styles";

const LabeledTextInput = (props) => {
  const {
    containerStyle,
    labelStyle,
    labelTextStyle,
    iconStyle,
    textInputStyle,
    iconName,
    label,
    value,
    editing,
    onChangeText,
  } = props;

  const { isRTL } = useI18N();

  const icon = iconName ? (
    <Icon
      type={"Ionicons"}
      name={iconName}
      style={[
        styles.inputRowIcon,
        iconStyle,
        !isRTL ? { textAlign: "right" } : { textAlign: "left" },
      ]}
    />
  ) : null;

  //const TextFieldEdit = () => (
  const renderTextFieldEdit = () => (
    <View style={[styles.inputContainer, containerStyle]}>
      <View style={[styles.inputLabel, labelStyle]}>
        <Text style={[styles.inputLabelText, labelTextStyle]}>
          {label}
        </Text>
      </View>
      <View style={styles.inputRow}>
        {icon}
        <TextInput
          style={[styles.inputRowTextInput, textInputStyle]}
          {...props}
        />
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
