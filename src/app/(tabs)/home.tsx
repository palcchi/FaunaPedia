import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SpeciesCard from '../../components/SpeciesCard';
import { Colors } from '../../constants/Colors';
import { useFaunaPedia } from '../../contexts/FaunaPediaContext';
import FaunaService from '../../services/FaunaService';
import { Species } from '../../types/species';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { state, dispatch, toggleFavorite, isFavorite } = useFaunaPedia();
  const [featuredSpecies, setFeaturedSpecies] = useState<Species[]>([]);
  const [randomSpecies, setRandomSpecies] = useState<Species[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      if (state.species.length === 0) {
        const allSpecies = await FaunaService.getAllSpecies();
        dispatch({ type: 'SET_SPECIES', payload: allSpecies });
      }
      const featured = await FaunaService.getRandomSpecies(5);
      setFeaturedSpecies(featured);
      const random = await FaunaService.getRandomSpecies(8);
      setRandomSpecies(random);
    } catch (error) {
      console.error('Error loading home data:', error);
      Alert.alert('Error', 'Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const handleExploreCategory = (animalType: string) => {
    console.log('🔍 Setting category filter:', animalType);
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_FILTERS', payload: { animalType } });
    router.push('/(tabs)/catalog');
  };

  const handleSearchPress = () => router.push('/(tabs)/catalog');

  const categories = [
    { type: 'Mammal', icon: '🦁', name: 'Mamalia', color: Colors.primary },
    { type: 'Bird', icon: '🦅', name: 'Burung', color: Colors.accent },
    { type: 'Reptile', icon: '🦎', name: 'Reptil', color: Colors.status.success },
    { type: 'Fish', icon: '🐟', name: 'Ikan', color: Colors.status.info },
  ];

  const quickStats = [
    { label: 'Total Spesies', value: state.species.length.toString(), icon: 'library-outline' },
    { label: 'Favorit Saya', value: state.favorites.length.toString(), icon: 'heart-outline' },
    { label: 'Kategori', value: '4', icon: 'grid-outline' },
  ];

  if (loading && state.species.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🦎</Text>
        <Text style={styles.loadingText}>Memuat FaunaPedia...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Selamat datang di</Text>
            <Text style={styles.appTitle}>🦎 FaunaPedia</Text>
            <Text style={styles.subtitle}>Jelajahi keajaiban dunia fauna</Text>
          </View>
          <Pressable style={styles.searchButton} onPress={handleSearchPress}>
            <Ionicons name="search-outline" size={24} color={Colors.surface} />
          </Pressable>
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statsContainer}>
          {quickStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={28} color={Colors.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Jelajahi Kategori</Text>
          <Pressable onPress={() => router.push('/(tabs)/catalog')}>
            <Text style={styles.seeAllText}>Lihat Semua</Text>
          </Pressable>
        </View>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <Pressable
              key={index}
              style={[styles.categoryCard, { backgroundColor: category.color + '15' }]}
              onPress={() => handleExploreCategory(category.type)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                <Ionicons name="arrow-forward" size={16} color={Colors.surface} />
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {featuredSpecies.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spesies Pilihan</Text>
            <Pressable onPress={() => router.push('/(tabs)/catalog')}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {featuredSpecies.map((species) => (
              <View key={species.id} style={styles.featuredCard}>
                <Pressable style={styles.featuredImageContainer} onPress={() => router.push(`/species/${species.id}`)}>
                  <Image source={species.image_link} style={styles.featuredImage} placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4" transition={200} />
                  <View style={styles.featuredOverlay}>
                    <Pressable style={styles.featuredFavorite} onPress={() => toggleFavorite(species.id)}>
                      <Ionicons
                        name={isFavorite(species.id) ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isFavorite(species.id) ? Colors.status.error : Colors.surface}
                      />
                    </Pressable>
                  </View>
                </Pressable>
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredName} numberOfLines={1}>{species.name}</Text>
                  <Text style={styles.featuredScientific} numberOfLines={1}>{species.latin_name}</Text>
                  <View style={styles.featuredDetails}>
                    <Ionicons name="location-outline" size={12} color={Colors.text.secondary} />
                    <Text style={styles.featuredHabitat} numberOfLines={1}>{species.habitat}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {randomSpecies.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Temukan Spesies Baru</Text>
            <Pressable onPress={loadHomeData}>
              <Ionicons name="refresh-outline" size={24} color={Colors.primary} />
            </Pressable>
          </View>
          {randomSpecies.slice(0, 3).map((species) => (
            <SpeciesCard
              key={species.id}
              species={species}
              onPress={() => router.push(`/species/${species.id}`)}
              onFavoritePress={() => toggleFavorite(species.id)}
              isFavorite={isFavorite(species.id)}
            />
          ))}
        </View>
      )}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingEmoji: { fontSize: 60, marginBottom: 20 },
  loadingText: { fontSize: 18, color: Colors.text.secondary, fontWeight: '500' },
  header: { backgroundColor: Colors.primary, paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeSection: { flex: 1 },
  welcomeText: { fontSize: 16, color: Colors.surface, opacity: 0.9 },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.surface, marginVertical: 4 },
  subtitle: { fontSize: 14, color: Colors.surface, opacity: 0.8 },
  searchButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  statsSection: { backgroundColor: Colors.surface, marginTop: -15, marginHorizontal: 20, borderRadius: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  statsContainer: { flexDirection: 'row', paddingVertical: 20 },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: Colors.text.primary, marginTop: 8 },
  statLabel: { fontSize: 12, color: Colors.text.secondary, marginTop: 4, textAlign: 'center' },
  section: { paddingHorizontal: 20, paddingVertical: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text.primary },
  seeAllText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: (SCREEN_WIDTH - 60) / 2, padding: 20, borderRadius: 16, alignItems: 'center', position: 'relative' },
  categoryIcon: { fontSize: 40, marginBottom: 12 },
  categoryName: { fontSize: 16, fontWeight: '600', color: Colors.text.primary, marginBottom: 8 },
  categoryBadge: { position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  horizontalScroll: { paddingRight: 20 },
  featuredCard: { width: 200, marginRight: 16, backgroundColor: Colors.surface, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  featuredImageContainer: { position: 'relative' },
  featuredImage: { width: '100%', height: 150, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  featuredOverlay: { position: 'absolute', top: 12, right: 12 },
  featuredFavorite: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  featuredContent: { padding: 16 },
  featuredName: { fontSize: 16, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 4 },
  featuredScientific: { fontSize: 12, fontStyle: 'italic', color: Colors.text.secondary, marginBottom: 8 },
  featuredDetails: { flexDirection: 'row', alignItems: 'center' },
  featuredHabitat: { fontSize: 12, color: Colors.text.secondary, marginLeft: 4, flex: 1 },
  bottomSpacer: { height: 40 },
});
