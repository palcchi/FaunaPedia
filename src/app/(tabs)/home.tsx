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

type Category = {
  type: string;
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  color: string;
};

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

      setFeaturedSpecies(await FaunaService.getRandomSpecies(5));
      setRandomSpecies(await FaunaService.getRandomSpecies(8));
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
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_FILTERS', payload: { animalType } });
    router.push('/(tabs)/catalog');
  };

  const categories: Category[] = [
    { type: 'Mammal', icon: 'paw-outline', name: 'Mamalia', color: Colors.primary },
    { type: 'Bird', icon: 'paper-plane-outline', name: 'Burung', color: Colors.accent },
    { type: 'Reptile', icon: 'leaf-outline', name: 'Reptil', color: Colors.status.success },
    { type: 'Fish', icon: 'fish-outline', name: 'Ikan', color: Colors.status.info },
  ];

  const quickStats = [
    { label: 'Spesies', value: state.species.length.toString(), icon: 'library-outline' as const },
    { label: 'Favorit', value: state.favorites.length.toString(), icon: 'heart-outline' as const },
    { label: 'Kategori', value: '4', icon: 'grid-outline' as const },
  ];

  if (loading && state.species.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <Ionicons name="paw-outline" size={28} color={Colors.primary} />
        </View>
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
          <View style={styles.brandBlock}>
            <View style={styles.brandIcon}>
              <Ionicons name="paw-outline" size={20} color={Colors.surface} />
            </View>
            <View style={styles.welcomeSection}>
              <Text style={styles.eyebrow}>FAUNAPEDIA</Text>
              <Text style={styles.appTitle}>Eksplorasi dunia fauna</Text>
              <Text style={styles.subtitle}>Temukan spesies, habitat, dan status konservasi.</Text>
            </View>
          </View>

          <Pressable
            style={styles.searchButton}
            onPress={() => router.push('/(tabs)/catalog')}
            accessibilityRole="button"
            accessibilityLabel="Cari spesies"
          >
            <Ionicons name="search-outline" size={22} color={Colors.surface} />
          </Pressable>
        </View>
      </View>

      <View style={styles.statsSection}>
        {quickStats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Ionicons name={stat.icon} size={19} color={Colors.primary} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>KATEGORI</Text>
            <Text style={styles.sectionTitle}>Jelajahi berdasarkan tipe</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/catalog')}>
            <Text style={styles.seeAllText}>Lihat semua</Text>
          </Pressable>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <Pressable
              key={category.type}
              style={styles.categoryCard}
              onPress={() => handleExploreCategory(category.type)}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: category.color + '14' }]}>
                <Ionicons name={category.icon} size={24} color={category.color} />
              </View>
              <View style={styles.categoryTextBlock}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryHint}>Lihat koleksi</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.text.secondary} />
            </Pressable>
          ))}
        </View>
      </View>

      {featuredSpecies.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>PILIHAN</Text>
              <Text style={styles.sectionTitle}>Spesies untuk kamu lihat</Text>
            </View>
            <Pressable onPress={() => router.push('/(tabs)/catalog')}>
              <Text style={styles.seeAllText}>Lihat semua</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {featuredSpecies.map((species) => (
              <View key={species.id} style={styles.featuredCard}>
                <Pressable
                  style={styles.featuredImageContainer}
                  onPress={() => router.push(`/species/${species.id}`)}
                >
                  <Image
                    source={species.image_link}
                    style={styles.featuredImage}
                    placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
                    transition={180}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                </Pressable>

                <Pressable
                  style={styles.featuredFavorite}
                  onPress={() => toggleFavorite(species.id)}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={isFavorite(species.id) ? 'heart' : 'heart-outline'}
                    size={18}
                    color={isFavorite(species.id) ? Colors.status.error : Colors.text.primary}
                  />
                </Pressable>

                <Pressable
                  style={styles.featuredContent}
                  onPress={() => router.push(`/species/${species.id}`)}
                >
                  <Text style={styles.featuredName} numberOfLines={1}>
                    {species.name}
                  </Text>
                  <Text style={styles.featuredScientific} numberOfLines={1}>
                    {species.latin_name}
                  </Text>
                  <View style={styles.featuredDetails}>
                    <Ionicons name="location-outline" size={13} color={Colors.text.secondary} />
                    <Text style={styles.featuredHabitat} numberOfLines={1}>
                      {species.habitat}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {randomSpecies.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>DISCOVER</Text>
              <Text style={styles.sectionTitle}>Temukan spesies baru</Text>
            </View>
            <Pressable style={styles.iconButton} onPress={loadHomeData}>
              <Ionicons name="refresh-outline" size={20} color={Colors.primary} />
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  loadingText: {
    fontSize: 15,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 58,
    paddingBottom: 34,
    paddingHorizontal: 18,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },
  brandBlock: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.surface,
    opacity: 0.72,
    marginBottom: 5,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.surface,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.surface,
    opacity: 0.78,
    marginTop: 6,
    maxWidth: 270,
  },
  searchButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginTop: -16,
    marginHorizontal: 16,
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  section: {
    paddingTop: 26,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: Colors.primary,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  categoriesGrid: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryCard: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '650',
    color: Colors.text.primary,
  },
  categoryHint: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 6,
  },
  featuredCard: {
    width: Math.min(220, SCREEN_WIDTH * 0.58),
    marginRight: 12,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  featuredImageContainer: {
    height: 150,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredFavorite: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.94)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContent: {
    padding: 13,
  },
  featuredName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 3,
  },
  featuredScientific: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.text.secondary,
    marginBottom: 9,
  },
  featuredDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredHabitat: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginLeft: 4,
    flex: 1,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.06)',
  },
  bottomSpacer: {
    height: 28,
  },
});
