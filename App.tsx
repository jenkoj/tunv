import {persistor, store} from './redux/store';

import {PersistGate} from 'redux-persist/integration/react';
import{Provider} from 'react-redux';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';

//import useColorScheme from './hooks/useColorScheme';

import { AppearanceProvider,useColorScheme } from 'react-native-appearance';


import Navigation from './navigation';


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppearanceProvider>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </AppearanceProvider>
        </PersistGate>
      </Provider>
    );
  }
}
