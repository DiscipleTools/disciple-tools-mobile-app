import React from "react";

//Components
import { View, Text, TextInput } from "react-native";

//Hooks
import useI18N from "hooks/use-i18n";

//Styles
import useStyles from "hooks/use-styles";
import { localStyles } from "./LabeledTextInput.styles";

  
export const LabeledTextInput = (props) => {
  const { startIcon, endIcon, error, i18nKey } = props;
  
  const { styles, globalStyles } = useStyles(localStyles);
  const { isRTL, i18n } = useI18N();

  const text = React.useMemo(() => i18n.t(i18nKey), [i18nKey])

  return (
    <View>
      <Text style={[styles.inputLabelText]}>{text}</Text>
      <View style={globalStyles.rowContainer}>
        {startIcon}
        <TextInput
          style={[styles.inputRowTextInput]}
          accessibilityLabel={text}
          textAlign={isRTL ? 'right' : 'left'}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType='next'
          {...props}
        />
        {endIcon}
      </View>
      {error && 
        <Text style={styles.validationErrorMessage}>
          {i18n.t("global.error.isRequired", { item: text })}
        </Text>
      }
    </View>
  )
};

