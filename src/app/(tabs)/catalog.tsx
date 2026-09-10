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
  console.log('🦎 CatalogScreen rendered');
  const { state, dispatch, toggleFavorite, isFavorite, getFilteredSpecies, clearFilters } = useFaunaPedia();
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
      console.log('🔍 Filter set from context:', state.filters.animalType);
    }
  }, [state.filters.animalType]);

  useEffect(() => {
    setLocalSearchQuery(state.searchQuery);
  }, [state.searchQuery]);

  const loadSpecies = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('🦎 Loading all species...');
      const species = await FaunaService.getAllSpecies();
      console.log('🦎 Species loaded:', species.length);
      dispatch({ type: 'SET_SPECIES', payload: species });
    } catch (error) {
      console.error('🚨 Error loading species:', error);
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
  };

  const handleFilterChange = (type: string) => {
    console.log('🔍 Filter changed to:', type);
    setSelectedFilter(type);
    if (type === 'all') {
      dispatch({ type: 'SET_FILTERS', payload: { animalType: undefined } });
    } else {
      dispatch({ type: 'SET_FILTERS', payload: { animalType: type } });
    }
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
      setPage((prev) => prev + 1);
      setLoadingMore(false);
    }, 1000);
  };

  const filteredAndPaginatedSpecies = useMemo(() => {
    const filtered = getFilteredSpecies();
    return filtered.slice(0, page * ITEMS_PER_PAGE);
  }, [state.species, state.searchQuery, state.filters, page, getFilteredSpecies]);

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

  const renderFilterChip = (type: string) => (
    <Pressable
      key={type}
      style={[styles.filterChip, selectedFilter === type && styles.filterChipSelected]}
      onPress={() => handleFilterChange(type)}
    >
      <Text style={[styles.filterChipText, selectedFilter === type && styles.filterChipTextSelected]}>
        {type === 'all' ? 'Semua' : type}
      </Text>
    </Pressable>
  );

  const renderFooter = () =>
    loadingMore ? (
      <View style={styles.loadingMore}>
        <ActivityIndicator color={Colors.primary} />
        <Text style={styles.loadingMoreText}>Memuat lebih banyak spesies...</Text>
      </View>
    ) : null;

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔍</Text>
      <Text style={styles.emptyStateTitle}>Tidak Ada Spesies Ditemukan</Text>
      <Text style={styles.emptyStateDescription}>Coba ubah kata kunci pencarian atau filter yang dipilih</Text>
      <Pressable style={styles.clearButton} onPress={handleClearFilters}>
        <Text style={styles.clearButtonText}>Hapus Filter</Text>
      </Pressable>
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari spesies, nama latin, atau habitat..."
            value={localSearchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {localSearchQuery.length > 0 && (
            <Pressable onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersLabel}>Filter berdasarkan tipe:</Text>
        <FlatList
          data={animalTypes}
          renderItem={({ item }) => renderFilterChip(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        />
      </View>
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>{totalFilteredCount} spesies ditemukan</Text>
        {(state.searchQuery || selectedFilter !== 'all') && (
          <Pressable onPress={handleClearFilters}>
            <Text style={styles.clearFiltersText}>Hapus Filter</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  if (state.loading && state.species.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat katalog spesies...</Text>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={totalFilteredCount > filteredAndPaginatedSpecies.length ? loadMoreSpecies : null}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={state.species.length > 0 ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          filteredAndPaginatedSpecies.length === 0 && state.species.length > 0 && styles.emptyListContent,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: { padding: 16, backgroundColor: Colors.surface },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: 25, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: Colors.text.secondary + '30' },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: Colors.text.primary },
  filtersContainer: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingBottom: 16 },
  filtersLabel: { fontSize: 14, color: Colors.text.secondary, marginBottom: 8, fontWeight: '500' },
  filtersContent: { gap: 8 },
  filterChip: { backgroundColor: Colors.background, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.text.secondary + '30' },
  filterChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 14, color: Colors.text.secondary, fontWeight: '500' },
  filterChipTextSelected: { color: Colors.surface, fontWeight: '600' },
  resultsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.background },
  resultsText: { fontSize: 14, color: Colors.text.secondary, fontWeight: '500' },
  clearFiltersText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  listContent: { paddingBottom: 20 },
  emptyListContent: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { marginTop: 16, fontSize: 16, color: Colors.text.secondary },
  loadingMore: { padding: 20, alignItems: 'center' },
  loadingMoreText: { marginTop: 8, fontSize: 14, color: Colors.text.secondary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, minHeight: 300 },
  emptyStateIcon: { fontSize: 60, marginBottom: 16 },
  emptyStateTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 8, textAlign: 'center' },
  emptyStateDescription: { fontSize: 16, color: Colors.text.secondary, textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  clearButton: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  clearButtonText: { color: Colors.surface, fontWeight: '600' },
});
