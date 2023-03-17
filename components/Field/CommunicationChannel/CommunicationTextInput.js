import { useState } from "react";
import { Keyboard, TextInput, View } from "react-native";

import { CancelIcon, RemoveIcon, SaveIcon } from "components/Icon";

import useStyles from "hooks/use-styles";

import { localStyles } from "./CommunicationChannelField.styles";

// ref: https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#communication_channel
const CommunicationTextInput = ({
  idx,
  controls,
  defaultValue,
  onChange,
  onRemove,
  keyboardType,
  editable,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const [_text, _setText] = useState(null);
  if (controls === undefined) controls = true; // default to manual save/cancel
  const [showSave, setShowSave] = useState(false);
  return (
    <View style={globalStyles.rowContainer}>
      <View style={[globalStyles.rowContainer, styles.container]}>
        <TextInput
          editable={editable}
          defaultValue={defaultValue}
          onChangeText={(text) => {
            _setText(text);
            if (text !== defaultValue) {
              if (controls) {
                setShowSave(true);
                return;
              }
              onChange({ idx, value: text });
            }
          }}
          onEndEditing={() => Keyboard.dismiss()}
          style={styles.input(controls && showSave)}
          keyboardType={keyboardType}
        />
        {controls && showSave && (
          <View style={[globalStyles.rowContainer, styles.controlIcons]}>
            <CancelIcon
              onPress={() => onChange({ idx, value: defaultValue })}
            />
            <SaveIcon onPress={() => onChange({ idx, value: _text })} />
          </View>
        )}
      </View>
      <View style={styles.actionIcons}>
        <RemoveIcon
          onPress={() => onRemove({ idx })}
          style={{ color: "red" }}
        />
      </View>
    </View>
  );
};
export default CommunicationTextInput;
