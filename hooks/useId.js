import { useRoute } from "@react-navigation/native";

const useId = () => {
  const route = useRoute();
  const id = route?.params?.id;
  return id;
};
export default useId;
