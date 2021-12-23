import { Toast } from "native-base";

import useI18N from "hooks/useI18N";

const useToast = () => {
  const { i18n } = useI18N();

  const toast = (message, error = false) => {
    // TODO
    //const text = error && !message?.includes(i18n.t("global.error.text")) ? `${i18n.t("global.error.text")} ${message}` : message;
    const text = message;
    const duration = error ? 5000 : 3000;
    const type = error ? "danger" : null;

    // NOTE: wait half second to allow for collapse of virtual keyboard before showing Toast
    const DEFAULT_WAIT = 500;

    setTimeout(() => {
      Toast.show({
        text,
        duration,
        type,
        //textStyle: { textAlign: 'center' }
        position: "bottom",
        style: { marginBottom: 75 },
      });
    }, DEFAULT_WAIT);
  };
  return toast;
};
export default useToast;
