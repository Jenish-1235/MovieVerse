// src/screens/SearchScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '../navigation/SearchStackNavigator';
import { Show, SearchResult } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type SearchScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'SearchScreen'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [movies, setMovies] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to handle search
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      // Optionally, show a message to enter a search term
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<SearchResult[]>(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching shows:', error);
      setLoading(false);
    }
  };

  // Render each movie item
  const renderItem = ({ item }: { item: SearchResult }) => {
    const { show } = item;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('Details', { show })}
      >
        <Image
          source={{
            uri: show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image',
          }}
          style={styles.thumbnail}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{show.name}</Text>
          <Text numberOfLines={3} style={styles.summary}>
            {show.summary ? show.summary.replace(/<[^>]+>/g, '') : 'No Summary Available'}
          </Text>
        </View>
      </TouchableOpacity>
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

      {/* List of Search Results */}
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.show.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Results Found</Text>
          </View>
        )}
      />
    </View>
  );
};

export default SearchScreen;

const { width } = Dimensions.get('window');

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
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#1c1c1c', // Slightly lighter black for items
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 100,
    height: 150,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    padding: 5,
    justifyContent: 'center',
  },
  title: {
    color: '#E50914', // Netflix Red
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summary: {
    color: '#fff',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
