// src/screens/FavoritesScreen.tsx
import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '../navigation/SearchStackNavigator'; // Adjust if using a different stack
import { Show } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FavoritesContext } from '../context/FavoritesContext';
import Toast from 'react-native-toast-message';

type FavoritesScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'Details'>;

interface Props {
  navigation: FavoritesScreenNavigationProp;
}

const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  const { favorites, removeFromFavorites } = useContext(FavoritesContext);

  const renderItem = ({ item }: { item: Show }) => {
    const toggleFavorite = () => {
      removeFromFavorites(item.id);
      Toast.show({
        type: 'success',
        text1: `${item.name} removed from favorites`,
      });
    };

    return (
      <View style={styles.gridItem}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            console.log('Navigating to Details with show:', item);
            navigation.navigate('Details', { show: item });
          }}
        >
          <Image
            source={{
              uri: item.image
                ? item.image.medium
                : 'https://via.placeholder.com/210x295?text=No+Image',
            }}
            style={styles.thumbnail}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text numberOfLines={2} style={styles.summary}>
              {item.summary ? item.summary.replace(/<[^>]+>/g, '') : 'No Summary Available'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartIcon} onPress={toggleFavorite}>
          <Icon name="favorite" size={24} color="#E50914" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={favorites.length === 1 ? styles.singleColumn : undefined}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Favorites Yet</Text>
        </View>
      )}
    </View>
  );
};

export default FavoritesScreen;

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 40) / 2; // Adjusted for padding and margins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the title
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
  singleColumn: {
    justifyContent: 'center', // Center the single item
  },
  gridItem: {
    flex: 1,
    margin: 5,
    position: 'relative',
    width: ITEM_WIDTH,
  },
  itemContainer: {
    backgroundColor: '#1c1c1c', // Slightly lighter black for items
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Optional: Add a background for better visibility
    borderRadius: 12,
    padding: 2,
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
