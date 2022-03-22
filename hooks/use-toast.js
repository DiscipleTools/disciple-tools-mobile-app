import Toast from 'react-native-toast-message';

const useToast = () => {
  const toast = (message, error = false) => {
    // TODO
    //const text = error && !message?.includes(i18n.t("global.error.text")) ? `${i18n.t("global.error.text")} ${message}` : message;
    const duration = error ? 5000 : 3000;
    const type = error ? "error" : "success";
    const position = "bottom";
    const bottomOffset = 75;

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