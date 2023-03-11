import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const getState = () => navigationRef.getState();

export const getRoute = () => navigationRef.getCurrentRoute();

export const getId = () => {
  const route = getRoute();
  return route?.params?.id;
};

export const resetFilter = () => {
  const route = getRoute();
  if (route?.params?.filter) route.params.filter = null;
  return;
};
