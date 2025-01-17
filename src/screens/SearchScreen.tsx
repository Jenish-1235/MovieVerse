// src/screens/SearchScreen.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '../navigation/SearchStackNavigator';
import { Show, SearchResult } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FavoritesContext } from '../context/FavoritesContext';

type SearchScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [movies, setMovies] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(FavoritesContext);

  // Function to handle search
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      Alert.alert('Input Required', 'Please enter a search term.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<SearchResult[]>(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
      console.log('Search results:', response.data); // Debugging log
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching shows:', error);
      Alert.alert('Error', 'Failed to search movies. Please try again.');
      setLoading(false);
    }
  };

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
            console.log('Navigating to Details with show:', show);
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

  return (
    <View style={styles.container}>
      {/* Header with Back Icon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#E50914" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Movies</Text>
        <View style={{ width: 28 }} /> {/* Placeholder for alignment */}
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a movie..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch}>
          <Icon name="search" size={28} color="#E50914" />
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 20 }} />
      )}

      {/* Grid of Search Results */}
      {movies.length > 0 ? (
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.show.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      ) : (
        !loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Results Found</Text>
          </View>
        )
      )}
    </View>
  );
};

export default SearchScreen;

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    height: 40,
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
