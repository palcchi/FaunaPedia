import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import SpeciesCard from '../../components/SpeciesCard';
import { Colors } from '../../constants/Colors';
import { useFaunaPedia } from '../../contexts/FaunaPediaContext';
import FaunaService from '../../services/FaunaService';
import { Species } from '../../types/species';

const ITEMS_PER_PAGE = 20;

export default function CatalogScreen() {
  const {
    state,
    dispatch,
    toggleFavorite,
    isFavorite,
    getFilteredSpecies,
    clearFilters,
  } = useFaunaPedia();

  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [localSearchQuery, setLocalSearchQuery] = useState(state.searchQuery);

  const animalTypes = ['all', 'Mammal', 'Bird', 'Reptile', 'Fish'];

  useEffect(() => {
    loadSpecies();
  }, []);

  useEffect(() => {
    if (state.filters.animalType) {
      setSelectedFilter(state.filters.animalType);
    } else {
      setSelectedFilter('all');
    }
  }, [state.filters.animalType]);

  useEffect(() => {
    setLocalSearchQuery(state.searchQuery);
  }, [state.searchQuery]);

  const loadSpecies = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const species = await FaunaService.getAllSpecies();
      dispatch({ type: 'SET_SPECIES', payload: species });
    } catch (error) {
      console.error('Error loading species:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load species data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadSpecies();
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setLocalSearchQuery(text);
    dispatch({ type: 'SET_SEARCH_QUERY', payload: text });
    setPage(1);
  };

  const handleFilterChange = (type: string) => {
    setSelectedFilter(type);

    dispatch({
      type: 'SET_FILTERS',
      payload: { animalType: type === 'all' ? undefined : type },
    });

    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedFilter('all');
    setLocalSearchQuery('');
    clearFilters();
    setPage(1);
  };

  const loadMoreSpecies = () => {
    if (loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      setPage((previous) => previous + 1);
      setLoadingMore(false);
    }, 500);
  };

  const filteredAndPaginatedSpecies = useMemo(() => {
    const filtered = getFilteredSpecies();
    return filtered.slice(0, page * ITEMS_PER_PAGE);
  }, [
    state.species,
    state.searchQuery,
    state.filters,
    page,
    getFilteredSpecies,
  ]);

  const totalFilteredCount = useMemo(
    () => getFilteredSpecies().length,
    [state.species, state.searchQuery, state.filters, getFilteredSpecies]
  );

  const renderSpeciesCard = ({ item }: { item: Species }) => (
    <SpeciesCard
      species={item}
      onPress={() => router.push(`/species/${item.id}`)}
      onFavoritePress={() => toggleFavorite(item.id)}
      isFavorite={isFavorite(item.id)}
    />
  );

  const renderFilterChip = (type: string) => {
    const labelMap: Record<string, string> = {
      all: 'Semua',
      Mammal: 'Mamalia',
      Bird: 'Burung',
      Reptile: 'Reptil',
      Fish: 'Ikan',
    };

    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      all: 'apps-outline',
      Mammal: 'paw-outline',
      Bird: 'paper-plane-outline',
      Reptile: 'leaf-outline',
      Fish: 'fish-outline',
    };

    const isSelected = selectedFilter === type;

    return (
      <Pressable
        key={type}
        style={[styles.filterChip, isSelected && styles.filterChipSelected]}
        onPress={() => handleFilterChange(type)}
      >
        <Ionicons
          name={iconMap[type]}
          size={15}
          color={isSelected ? Colors.surface : Colors.text.secondary}
        />
        <Text
          style={[
            styles.filterChipText,
            isSelected && styles.filterChipTextSelected,
          ]}
        >
          {labelMap[type]}
        </Text>
      </Pressable>
    );
  };

  const renderFooter = () =>
    loadingMore ? (
      <View style={styles.loadingMore}>
        <ActivityIndicator color={Colors.primary} />
        <Text style={styles.loadingMoreText}>Memuat lebih banyak...</Text>
      </View>
    ) : null;

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="search-outline" size={28} color={Colors.primary} />
      </View>
      <Text style={styles.emptyStateTitle}>Spesies tidak ditemukan</Text>
      <Text style={styles.emptyStateDescription}>
        Coba ubah kata kunci atau pilih kategori lain.
      </Text>
      <Pressable style={styles.clearButton} onPress={handleClearFilters}>
        <Text style={styles.clearButtonText}>Hapus Filter</Text>
      </Pressable>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={Colors.text.secondary}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama, nama latin, atau habitat"
          placeholderTextColor={Colors.text.secondary}
          value={localSearchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {localSearchQuery.length > 0 && (
          <Pressable
            onPress={() => handleSearch('')}
            style={styles.clearSearchButton}
          >
            <Ionicons
              name="close"
              size={18}
              color={Colors.text.secondary}
            />
          </Pressable>
        )}
      </View>

      <FlatList
        data={animalTypes}
        renderItem={({ item }) => renderFilterChip(item)}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      />

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {totalFilteredCount} spesies
        </Text>
        {(state.searchQuery || selectedFilter !== 'all') && (
          <Pressable onPress={handleClearFilters}>
            <Text style={styles.clearFiltersText}>Reset</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  if (state.loading && state.species.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <ActivityIndicator color={Colors.primary} />
        </View>
        <Text style={styles.loadingText}>Memuat katalog...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAndPaginatedSpecies}
        renderItem={renderSpeciesCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={
          totalFilteredCount > filteredAndPaginatedSpecies.length
            ? loadMoreSpecies
            : undefined
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          state.species.length > 0 ? renderEmptyState : undefined
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          filteredAndPaginatedSpecies.length === 0 &&
            state.species.length > 0 &&
            styles.emptyListContent,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContent: {
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchContainer: {
    marginHorizontal: 16,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 15,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.06)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: 14,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  clearSearchButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.06)',
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  filterChipTextSelected: {
    color: Colors.surface,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  resultsText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  clearFiltersText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 28,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 7,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  emptyState: {
    flex: 1,
    minHeight: 340,
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
    fontSize: 21,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  clearButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  clearButtonText: {
    color: Colors.surface,
    fontWeight: '700',
    fontSize: 13,
  },
});
