import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import ExpoFileSystemStorage from "redux-persist-expo-filesystem";
import hardSet from "redux-persist/es/stateReconciler/hardSet";

import rootReducer from "./rootReducer";

const middleware = [];

// Redux-Persist config
const persistConfig = {
  key: "root",
  storage: ExpoFileSystemStorage,
  //blacklist: [
  //  "requestReducer"
  //],
  stateReconciler: hardSet,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

const persistor = persistStore(store);

export { store, persistor };
