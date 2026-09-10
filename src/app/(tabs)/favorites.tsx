import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SpeciesCard from '../../components/SpeciesCard';
import { Colors } from '../../constants/Colors';
import { useFaunaPedia } from '../../contexts/FaunaPediaContext';
import FaunaService from '../../services/FaunaService';
import { Species } from '../../types/species';

export default function FavoritesScreen() {
  const { state, dispatch, toggleFavorite } = useFaunaPedia();
  const [favoriteSpecies, setFavoriteSpecies] = useState<Species[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'recent'>('recent');

  useEffect(() => {
    loadFavoriteSpecies();
  }, [state.favorites]);

  const loadFavoriteSpecies = async () => {
    try {
      const allSpecies = await FaunaService.getAllSpecies();
      const favorites = allSpecies.filter((species) => state.favorites.includes(species.id));
      setFavoriteSpecies(favorites);
    } catch (error) {
      console.error('Error loading favorite species:', error);
      Alert.alert('Error', 'Gagal memuat spesies favorit');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavoriteSpecies();
    setRefreshing(false);
  };

  const handleRemoveFavorite = (speciesId: string, speciesName: string) => {
    Alert.alert('Hapus Favorit', `Hapus ${speciesName} dari daftar favorit?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => toggleFavorite(speciesId) },
    ]);
  };

  const handleClearAllFavorites = () => {
    if (favoriteSpecies.length === 0) return;
    Alert.alert(
      'Hapus Semua Favorit',
      'Apakah Anda yakin ingin menghapus semua spesies dari daftar favorit?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: () => state.favorites.forEach((id) => dispatch({ type: 'REMOVE_FAVORITE', payload: id })),
        },
      ]
    );
  };

  const handleShareFavorites = async () => {
    if (favoriteSpecies.length === 0) return;
    const shareText = `Spesies favorit saya di FaunaPedia 🦎:\n\n${favoriteSpecies
      .map((species, index) => `${index + 1}. ${species.name} (${species.latin_name})`)
      .join('\n')}\n\nUnduh FaunaPedia untuk mengeksplorasi dunia fauna!`;
    try {
      await Share.share({ message: shareText, title: 'Spesies Favorit FaunaPedia' });
    } catch (error) {
      console.error('Error sharing favorites:', error);
    }
  };

  const sortedFavorites = useMemo(() => {
    const sorted = [...favoriteSpecies];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'type':
        return sorted.sort((a, b) => {
          const typeCompare = a.animal_type.localeCompare(b.animal_type);
          return typeCompare !== 0 ? typeCompare : a.name.localeCompare(b.name);
        });
      case 'recent':
      default:
        return sorted.sort((a, b) => state.favorites.indexOf(b.id) - state.favorites.indexOf(a.id));
    }
  }, [favoriteSpecies, sortBy, state.favorites]);

  const renderSpeciesCard = ({ item }: { item: Species }) => (
    <SpeciesCard
      species={item}
      onPress={() => router.push(`/species/${item.id}`)}
      onFavoritePress={() => handleRemoveFavorite(item.id, item.name)}
      isFavorite
    />
  );

  const renderSortButton = (type: typeof sortBy, label: string) => (
    <Pressable
      key={type}
      style={[styles.sortButton, sortBy === type && styles.sortButtonActive]}
      onPress={() => setSortBy(type)}
    >
      <Text style={[styles.sortButtonText, sortBy === type && styles.sortButtonTextActive]}>{label}</Text>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>💛</Text>
      <Text style={styles.emptyStateTitle}>Belum Ada Spesies Favorit</Text>
      <Text style={styles.emptyStateDescription}>
        Mulai menjelajahi katalog spesies dan tambahkan yang menarik ke daftar favorit Anda
      </Text>
      <Pressable style={styles.exploreButton} onPress={() => router.push('/(tabs)/catalog')}>
        <Ionicons name="search-outline" size={20} color={Colors.surface} />
        <Text style={styles.exploreButtonText}>Jelajahi Spesies</Text>
      </Pressable>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{favoriteSpecies.length}</Text>
          <Text style={styles.statLabel}>Spesies Favorit</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{new Set(favoriteSpecies.map((s) => s.animal_type)).size}</Text>
          <Text style={styles.statLabel}>Tipe Hewan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {favoriteSpecies.filter(
              (s) => s.conservation_status === 'Endangered' || s.conservation_status === 'Critically Endangered'
            ).length}
          </Text>
          <Text style={styles.statLabel}>Terancam</Text>
        </View>
      </View>

      {favoriteSpecies.length > 0 && (
        <View style={styles.actionButtons}>
          <Pressable style={styles.actionButton} onPress={handleShareFavorites}>
            <Ionicons name="share-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Bagikan</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.dangerButton]} onPress={handleClearAllFavorites}>
            <Ionicons name="trash-outline" size={20} color={Colors.status.error} />
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Hapus Semua</Text>
          </Pressable>
        </View>
      )}

      {favoriteSpecies.length > 1 && (
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Urutkan:</Text>
          <View style={styles.sortButtons}>
            {renderSortButton('recent', 'Terbaru')}
            {renderSortButton('name', 'Nama')}
            {renderSortButton('type', 'Tipe')}
          </View>
        </View>
      )}
    </View>
  );

  const renderConservationAlert = () => {
    const endangeredSpecies = favoriteSpecies.filter(
      (s) => s.conservation_status === 'Endangered' || s.conservation_status === 'Critically Endangered'
    );
    if (endangeredSpecies.length === 0) return null;
    return (
      <View style={styles.alertContainer}>
        <Ionicons name="warning" size={24} color={Colors.status.warning} />
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>Spesies Terancam</Text>
          <Text style={styles.alertDescription}>
            {endangeredSpecies.length} dari spesies favorit Anda dalam status terancam punah
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {favoriteSpecies.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={sortedFavorites}
          renderItem={renderSpeciesCard}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<View>{renderHeader()}{renderConservationAlert()}</View>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerContainer: { backgroundColor: Colors.surface, margin: 16, borderRadius: 16, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  statLabel: { fontSize: 12, color: Colors.text.secondary, marginTop: 4, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.background, marginHorizontal: 10 },
  actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: Colors.primary, gap: 8 },
  dangerButton: { borderColor: Colors.status.error },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  dangerButtonText: { color: Colors.status.error },
  sortContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sortLabel: { fontSize: 14, fontWeight: '600', color: Colors.text.primary },
  sortButtons: { flexDirection: 'row', gap: 8, flex: 1 },
  sortButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: Colors.text.secondary },
  sortButtonActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sortButtonText: { fontSize: 12, fontWeight: '500', color: Colors.text.secondary },
  sortButtonTextActive: { color: Colors.surface },
  alertContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.status.warning + '15', margin: 16, padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: Colors.status.warning },
  alertContent: { flex: 1, marginLeft: 12 },
  alertTitle: { fontSize: 14, fontWeight: '600', color: Colors.text.primary, marginBottom: 2 },
  alertDescription: { fontSize: 12, color: Colors.text.secondary, lineHeight: 18 },
  listContent: { paddingBottom: 20 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyStateIcon: { fontSize: 80, marginBottom: 24 },
  emptyStateTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.text.primary, textAlign: 'center', marginBottom: 12 },
  emptyStateDescription: { fontSize: 16, color: Colors.text.secondary, textAlign: 'center', lineHeight: 24, marginBottom: 32, maxWidth: 280 },
  exploreButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, gap: 8 },
  exploreButtonText: { fontSize: 16, fontWeight: '600', color: Colors.surface },
});
