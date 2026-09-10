import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SpeciesCard from '../../components/SpeciesCard';
import { Colors } from '../../constants/Colors';
import { useFaunaPedia } from '../../contexts/FaunaPediaContext';
import FaunaService from '../../services/FaunaService';
import { Species } from '../../types/species';

export default function CatalogTab() {
  const [species, setSpecies] = useState<Species[]>([]);
  const { toggleFavorite, isFavorite } = useFaunaPedia();

  useEffect(() => {
    FaunaService.getSpecies().then(setSpecies);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Katalog Spesies</Text>
      <Text style={styles.subtitle}>Pilih spesies untuk melihat informasi lengkap.</Text>
      <View style={styles.list}>
        {species.map((item) => (
          <SpeciesCard
            key={item.id}
            species={item}
            isFavorite={isFavorite(item.id)}
            onFavoritePress={() => toggleFavorite(item.id)}
            onPress={() => router.push(`/species/${item.id}`)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingTop: 20, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text.primary, paddingHorizontal: 16 },
  subtitle: { fontSize: 14, color: Colors.text.secondary, paddingHorizontal: 16, marginTop: 6, marginBottom: 12 },
  list: { paddingBottom: 12 },
});
