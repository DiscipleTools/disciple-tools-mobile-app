import Button from "components/Button";

import useStyles from "hooks/use-styles";

import { localStyles } from "./ActionButton.styles";

const ActionButton = ({
  label,
  loading,
  onPress,
  startIcon,
  endIcon,
  containerStyle,
  style,
}) => {
  const { styles } = useStyles(localStyles);
  return (
    <Button
      loading={loading ?? null}
      onPress={onPress}
      title={label ?? ""}
      startIcon={startIcon ?? null}
      endIcon={endIcon ?? null}
      containerStyle={[
        styles.actionButtonContainer,
        styles.buttonContainer,
        containerStyle ?? {},
      ]}
      style={[styles.buttonText, style ?? {}]}
    />
  );
};
export default ActionButton;
