import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import SpeciesCard from '../../components/SpeciesCard';
import { Colors } from '../../constants/Colors';
import { useFaunaPedia } from '../../contexts/FaunaPediaContext';
import FaunaService from '../../services/FaunaService';
import { Species } from '../../types/species';

export default function FavoritesTab() {
  const { favorites, toggleFavorite, isFavorite } = useFaunaPedia();
  const [species, setSpecies] = useState<Species[]>([]);

  useEffect(() => {
    FaunaService.getSpecies().then((data) => setSpecies(data.filter((item) => favorites.includes(item.id))));
  }, [favorites]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Favorit</Text>
      {species.length === 0 ? (
        <Text style={styles.empty}>Belum ada spesies favorit.</Text>
      ) : (
        species.map((item) => (
          <SpeciesCard
            key={item.id}
            species={item}
            isFavorite={isFavorite(item.id)}
            onFavoritePress={() => toggleFavorite(item.id)}
            onPress={() => {}}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingTop: 20, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text.primary, paddingHorizontal: 16, marginBottom: 12 },
  empty: { color: Colors.text.secondary, paddingHorizontal: 16 },
});
