import {persistReducer, persistStore} from 'redux-persist';

import AsyncStorage from '@react-native-community/async-storage';
import {createStore} from 'redux';
import rootReducer from './reducers/rootReducer';

// Imports: Redux

// Middleware: Redux Persist Config
const persistConfig = {
    // Root
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    // Whitelist (Save Specific Reducers)
    whitelist: ['marker'],
    // Blacklist (Don't Save Specific Reducers)
    blacklist: [''],
  };
  // Middleware: Redux Persist Persisted Reducer
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  // Redux: Store
  const store = createStore(persistedReducer);
  // Middleware: Redux Persist Persister
  let persistor = persistStore(store);
  // Exports
  export {store, persistor};
