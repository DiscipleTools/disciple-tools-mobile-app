// Imports: Dependencies
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';

// Imports: Redux
import rootReducer from './reducer';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

// Middleware
const middleware = [sagaMiddleware];

// Transform (reset loading property from states to false)
/*const transformState = createTransform(
  state => ({ ...state }),
  (state) => {
    if (state.loading) {
      return {
        ...state,
        loading: false,
      };
    }
    return {
      ...state,
    };
  },
);*/

// Middleware: Redux Persist Config
const persistConfig = {
  // Root?
  key: 'root',
  // Storage Method (React Native)
  storage: ExpoFileSystemStorage,
  // Whitelist (Save Specific Reducers)
  /* whitelist: [
    'authReducer',
  ], */
  // Blacklist (Don't Save Specific Reducers)
  /* blacklist: [
    'counterReducer',
  ], */
  stateReconciler: hardSet,
  //transforms: [
  //  transformState,
  //],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux: Store
const store = createStore(persistedReducer, applyMiddleware(...middleware));

sagaMiddleware.run(rootSaga);

// Middleware: Redux Persist Persister
const persistor = persistStore(store);

// Exports
export { store, persistor };
