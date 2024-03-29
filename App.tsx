
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'expo-splash-screen'

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
     
          <AppearanceProvider>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </AppearanceProvider>
       
    );
  }
}
