// App.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import AppNavigator from './src/navigation/AppNavigator';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { NavigationContainer } from '@react-navigation/native';

const App: React.FC = () => {
  useEffect(() => {
    // Hide the splash screen once the app is ready
    RNBootSplash.hide({ fade: true }); // options: fade, duration
  }, []);

   return (
      <FavoritesProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </FavoritesProvider>
    );
};

export default App;
