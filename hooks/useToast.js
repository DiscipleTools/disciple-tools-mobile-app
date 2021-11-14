import { Toast } from 'native-base';

const useToast = () => {
  // NOTE: wait half second to allow for collapse of virtual keyboard before showing Toast
  const DEFAULT_WAIT = 500;
  const showToast = (message, error=false) => {
    if (error) {
      setTimeout(() => {
        Toast.show({
          text: message,
          duration: 5000,
          type: 'danger',
        });
      }, DEFAULT_WAIT);
    } else {
      setTimeout(() => {
        Toast.show({
          text: message,
          duration: 3000,
        });
      }, DEFAULT_WAIT);
    }
  };
  return {
    showToast
  };
};
export default useToast;