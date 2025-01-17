// src/context/FavoritesContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Show } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesContextProps {
  favorites: Show[];
  addToFavorites: (show: Show) => void;
  removeFromFavorites: (showId: number) => void;
  isFavorite: (showId: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextProps>({
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
});

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Show[]>([]);

  useEffect(() => {
    // Load favorites from AsyncStorage on mount
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('@favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    // Save favorites to AsyncStorage whenever it changes
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    };

    saveFavorites();
  }, [favorites]);

  const addToFavorites = (show: Show) => {
    setFavorites((prevFavorites) => [...prevFavorites, show]);
  };

  const removeFromFavorites = (showId: number) => {
    setFavorites((prevFavorites) => prevFavorites.filter((show) => show.id !== showId));
  };

  const isFavorite = (showId: number) => {
    return favorites.some((show) => show.id === showId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
