import * as Haptics from "expo-haptics";

const useHaptics = () => {
  const vibrate = async() => {
    return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  return { 
    vibrate
  };
};
export default useHaptics;