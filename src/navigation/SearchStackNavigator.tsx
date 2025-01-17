// src/navigation/SearchStackNavigator.tsx
import React from 'react';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import DetailsScreen from '../screens/DetailsScreen';
import { Show } from '../types';

export type SearchStackParamList = {
  SearchScreen: undefined;
  Details: { show: Show };
};

const Stack = createStackNavigator<SearchStackParamList>();

const screenOptions: StackNavigationOptions = {
  headerStyle: { backgroundColor: '#000' },
  headerTintColor: '#E50914',
  headerTitleStyle: { fontWeight: 'bold' },
};

const SearchStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: 'Search' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
};

export default SearchStackNavigator;
