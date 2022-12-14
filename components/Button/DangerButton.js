import Button from "components/Button";

import useStyles from "hooks/use-styles";

import { localStyles } from "./DangerButton.styles";

const DangerButton = ({
  label,
  loading,
  onPress,
  startIcon,
  endIcon
}) => {
  const { styles } = useStyles(localStyles);
  return(
    <Button
      loading={loading ?? null}
      onPress={onPress}
      title={label ?? ''}
      startIcon={startIcon ?? null}
      endIcon={endIcon ?? null}
      containerStyle={[styles.dangerButtonContainer, styles.buttonContainer]}
      style={styles.buttonText}
    />
  );
};
export default DangerButton;