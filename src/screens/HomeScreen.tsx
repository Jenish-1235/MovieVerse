// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { Show, SearchResult } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FavoritesContext } from '../context/FavoritesContext';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [movies, setMovies] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(FavoritesContext);

  // Fetch all shows on component mount
  const fetchAllShows = async () => {
    try {
      const response = await axios.get<SearchResult[]>('https://api.tvmaze.com/search/shows?q=all');
//       console.log('Fetched shows:', response.data); // Debugging log
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shows:', error);
      Alert.alert('Error', 'Failed to load movies. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllShows();
  }, []);

  // Render each movie item
  const renderItem = ({ item }: { item: SearchResult }) => {
    const { show } = item;

    const toggleFavorite = () => {
      if (isFavorite(show.id)) {
        removeFromFavorites(show.id);
      } else {
        addToFavorites(show);
      }
    };

    return (
      <View style={styles.gridItem}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
//             console.log('Navigating to Details with show:', show);
            navigation.navigate('Details', { show });
          }}
        >
          <Image
            source={{
              uri: show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image',
            }}
            style={styles.thumbnail}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{show.name}</Text>
            <Text numberOfLines={2} style={styles.summary}>
              {show.summary ? show.summary.replace(/<[^>]+>/g, '') : 'No Summary Available'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartIcon} onPress={toggleFavorite}>
          <Icon name={isFavorite(show.id) ? 'favorite' : 'favorite-border'} size={24} color="#E50914" />
        </TouchableOpacity>
      </View>
    );
  };

  // Render loading indicator
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Search Icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MovieMania</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Icon name="search" size={28} color="#E50914" />
        </TouchableOpacity>
      </View>

      {/* Grid of Movies */}
      {movies.length > 0 ? (
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.show.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Movies Found</Text>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 30) / 2; // Adjusted for padding and margins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#E50914', // Netflix Red
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    position: 'relative',
  },
  itemContainer: {
    backgroundColor: '#1c1c1c', // Slightly lighter black for items
    borderRadius: 8,
    overflow: 'hidden',
    width: ITEM_WIDTH,
  },
  thumbnail: {
    width: '100%',
    height: 150,
  },
  textContainer: {
    padding: 5,
  },
  title: {
    color: '#E50914', // Netflix Red
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summary: {
    color: '#fff',
    fontSize: 12,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
