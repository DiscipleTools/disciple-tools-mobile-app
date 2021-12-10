import { Toast } from 'native-base';

import useI18N from 'hooks/useI18N';

const useToast = () => {
  const { i18n } = useI18N();

  const toast = (message, error = false) => {
    const text = error ? `${i18n.t('global.error.text')} ${ message }` : message;
    const duration = error ? 5000 : 3000;
    const type = error ? 'danger' : null;

    // NOTE: wait half second to allow for collapse of virtual keyboard before showing Toast
    const DEFAULT_WAIT = 500;

    setTimeout(() => {
      Toast.show({
        text,
        duration,
        type,
        //textStyle: { textAlign: 'center' }
        position: 'bottom',
        style: { marginBottom: 75 }
      });
    }, DEFAULT_WAIT);
  };
  return toast;
};
export default useToast;