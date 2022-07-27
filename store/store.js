import { createStore, applyMiddleware, compose } from "redux";
import { createMigrate, persistReducer, persistStore } from "redux-persist";
import ExpoFileSystemStorage from "redux-persist-expo-filesystem";
import hardSet from "redux-persist/es/stateReconciler/hardSet";

import * as actions from "./rootActions";
import rootReducer from "./rootReducer";

const middleware = [];

const migrations = {
  11012: (state) => rootReducer(undefined, actions.REINITIALIZE_REDUX),
};

// Redux-Persist config
const persistConfig = {
  key: "root",
  storage: ExpoFileSystemStorage,
  //blacklist: [
  //  "requestReducer"
  //],
  migrate: createMigrate(migrations, { debug: false }),
  // SemVer-ish format:
  // 1-digit (major), 2-digit (minor), 1-digit (patch), 1-digit (version)
  // 11011 -> v1.10.1.1 or 205 -> v2.5
  version: 11012,
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
