// src/navigation/HomeStackNavigator.tsx
import React from 'react';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import { Show } from '../types';

export type HomeStackParamList = {
  HomeScreen: undefined;
  Details: { show: Show };
};

const Stack = createStackNavigator<HomeStackParamList>();

const screenOptions: StackNavigationOptions = {
  headerStyle: { backgroundColor: '#000' },
  headerTintColor: '#E50914',
  headerTitleStyle: { fontWeight: 'bold' },
};

const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
