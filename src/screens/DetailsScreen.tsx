// src/screens/DetailsScreen.tsx
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { SearchStackParamList } from '../navigation/SearchStackNavigator';
import { Show } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type DetailsScreenRouteProp =
  | RouteProp<HomeStackParamList, 'Details'>
  | RouteProp<SearchStackParamList, 'Details'>;

interface Props {
  route: DetailsScreenRouteProp;
  navigation: any; // Adjust as per your navigation setup
}

const DetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { show } = route.params as { show: Show };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Icon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#E50914" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{ width: 28 }} /> {/* Placeholder for alignment */}
      </View>

      {/* Movie Image */}
      <Image
        source={{
          uri: show.image ? show.image.original : 'https://via.placeholder.com/500x700?text=No+Image',
        }}
        style={styles.image}
      />

      {/* Movie Details */}
      <View style={styles.content}>
        <Text style={styles.title}>{show.name}</Text>
        <Text style={styles.genres}>
          {show.genres && show.genres.length > 0 ? show.genres.join(', ') : 'N/A'}
        </Text>
        <Text style={styles.summary}>
          {show.summary ? show.summary.replace(/<[^>]+>/g, '') : 'No Summary Available'}
        </Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Premiered: </Text>
            {show.premiered || 'N/A'}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Rating: </Text>
            {show.rating && show.rating.average ? show.rating.average : 'N/A'}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Language: </Text>
            {show.language || 'N/A'}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Runtime: </Text>
            {show.runtime ? `${show.runtime} mins` : 'N/A'}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status: </Text>
            {show.status || 'N/A'}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Network: </Text>
            {show.network && show.network.name ? show.network.name : 'N/A'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;

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
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 15,
  },
  title: {
    color: '#E50914', // Netflix Red
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genres: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  summary: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  detailLabel: {
    color: '#E50914',
    fontWeight: 'bold',
  },
});
