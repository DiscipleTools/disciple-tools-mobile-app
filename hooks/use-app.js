import Constants from "expo-constants";

const useApp = () => {
  return {
    version: Constants.manifest.version
  };
};
export default useApp;