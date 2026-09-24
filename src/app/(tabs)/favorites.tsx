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
      setFavoriteSpecies(
        allSpecies.filter((species) => state.favorites.includes(species.id))
      );
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
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => toggleFavorite(speciesId),
      },
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
          onPress: () =>
            state.favorites.forEach((id) =>
              dispatch({ type: 'REMOVE_FAVORITE', payload: id })
            ),
        },
      ]
    );
  };

  const handleShareFavorites = async () => {
    if (favoriteSpecies.length === 0) return;

    const shareText = `Spesies favorit saya di FaunaPedia:\n\n${favoriteSpecies
      .map((species, index) => `${index + 1}. ${species.name} (${species.latin_name})`)
      .join('\n')}\n\nJelajahi lebih banyak spesies di FaunaPedia.`;

    try {
      await Share.share({
        message: shareText,
        title: 'Spesies Favorit FaunaPedia',
      });
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
        return sorted.sort(
          (a, b) =>
            state.favorites.indexOf(b.id) - state.favorites.indexOf(a.id)
        );
    }
  }, [favoriteSpecies, sortBy, state.favorites]);

  const endangeredCount = favoriteSpecies.filter(
    (species) =>
      species.conservation_status === 'Endangered' ||
      species.conservation_status === 'Critically Endangered'
  ).length;

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
      <Text
        style={[
          styles.sortButtonText,
          sortBy === type && styles.sortButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="heart-outline" size={28} color={Colors.primary} />
      </View>
      <Text style={styles.emptyStateTitle}>Belum ada favorit</Text>
      <Text style={styles.emptyStateDescription}>
        Simpan spesies yang menarik agar mudah ditemukan kembali.
      </Text>
      <Pressable
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)/catalog')}
      >
        <Ionicons name="search-outline" size={18} color={Colors.surface} />
        <Text style={styles.exploreButtonText}>Jelajahi Katalog</Text>
      </Pressable>
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View>
            <Text style={styles.eyebrow}>KOLEKSI SAYA</Text>
            <Text style={styles.summaryTitle}>Spesies favorit</Text>
          </View>
          <View style={styles.summaryIcon}>
            <Ionicons name="heart-outline" size={20} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favoriteSpecies.length}</Text>
            <Text style={styles.statLabel}>Favorit</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {new Set(favoriteSpecies.map((s) => s.animal_type)).size}
            </Text>
            <Text style={styles.statLabel}>Tipe</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{endangeredCount}</Text>
            <Text style={styles.statLabel}>Terancam</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Pressable style={styles.actionButton} onPress={handleShareFavorites}>
            <Ionicons name="share-outline" size={18} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Bagikan</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleClearAllFavorites}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={Colors.status.error}
            />
            <Text style={[styles.actionButtonText, styles.dangerText]}>
              Hapus
            </Text>
          </Pressable>
        </View>
      </View>

      {endangeredCount > 0 && (
        <View style={styles.alertContainer}>
          <View style={styles.alertIcon}>
            <Ionicons
              name="warning-outline"
              size={19}
              color={Colors.status.warning}
            />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Perlu perhatian</Text>
            <Text style={styles.alertDescription}>
              {endangeredCount} spesies favorit memiliki status terancam.
            </Text>
          </View>
        </View>
      )}

      {favoriteSpecies.length > 1 && (
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Urutkan</Text>
          <View style={styles.sortButtons}>
            {renderSortButton('recent', 'Terbaru')}
            {renderSortButton('name', 'Nama')}
            {renderSortButton('type', 'Tipe')}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {favoriteSpecies.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={sortedFavorites}
          renderItem={renderSpeciesCard}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 28,
  },
  summaryCard: {
    margin: 16,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.primary,
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 14,
    backgroundColor: Colors.background,
    borderRadius: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(26,26,26,0.08)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    minHeight: 42,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(45,80,22,0.22)',
  },
  dangerButton: {
    borderColor: 'rgba(220,20,60,0.22)',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.status.error,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 13,
    backgroundColor: Colors.status.warning + '10',
    borderRadius: 14,
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.status.warning + '14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
    marginLeft: 10,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  alertDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  sortContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 4,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.06)',
  },
  sortButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  sortButtonTextActive: {
    color: Colors.surface,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  emptyStateDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 22,
    maxWidth: 290,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 13,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.surface,
  },
});
