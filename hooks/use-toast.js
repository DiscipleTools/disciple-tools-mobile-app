import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

import { primaryBrand } from "constants/colors";

const text1Style = {
  color: "#FFFFFF",
  textShadowColor: "rgba(0, 0, 0, 0.9)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

export const toastConfig = Object.freeze({
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: primaryBrand,
        backgroundColor: primaryBrand,
      }}
      text1Style={text1Style}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "tomato",
        backgroundColor: "tomato",
        borderWidth: 1,
        borderColor: "#FF0000",
      }}
      text1Style={text1Style}
    />
  ),
});

const useToast = () => {
  const toast = (message, error = false) => {
    // TODO
    //const text = error && !message?.includes(i18n.t("global.error.text")) ? `${i18n.t("global.error.text")} ${message}` : message;
    const duration = error ? 5000 : 3000;
    const type = error ? "error" : "success";
    const position = "bottom";
    const bottomOffset = 100;

    // NOTE: wait half second to allow for collapse of virtual keyboard before showing Toast
    const DEFAULT_WAIT = 500;

    setTimeout(() => {
      Toast.show({
        autoHide: true,
        text1: message,
        //text2: '',
        visibilityTime: duration,
        type,
        position,
        bottomOffset,
      });
    }, DEFAULT_WAIT);
  };
  return toast;
};
export default useToast;
