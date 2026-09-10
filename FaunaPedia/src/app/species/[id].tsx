import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ConservationBadge from '../../components/ConservationBadge';
import { Colors } from '../../constants/Colors';
import { useFaunaPedia } from '../../contexts/FaunaPediaContext';
import FaunaService from '../../services/FaunaService';
import { Species } from '../../types/species';

export default function SpeciesDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { toggleFavorite, isFavorite } = useFaunaPedia();
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpeciesDetail = async () => {
      try {
        setLoading(true);
        if (id) setSpecies(await FaunaService.getSpeciesById(id));
      } catch (error) {
        console.error('Error loading species detail:', error);
        Alert.alert('Error', 'Gagal memuat detail spesies');
      } finally {
        setLoading(false);
      }
    };
    loadSpeciesDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🦎</Text>
        <Text style={styles.loadingText}>Memuat detail spesies...</Text>
      </View>
    );
  }

  if (!species) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😔</Text>
        <Text style={styles.errorTitle}>Spesies Tidak Ditemukan</Text>
        <Text style={styles.errorDescription}>Spesies yang Anda cari tidak dapat ditemukan</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />
      <View style={styles.imageContainer}>
        <Image source={species.image_link} style={styles.heroImage} placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4" />
        <Pressable style={styles.backButtonFloating} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.surface} />
        </Pressable>
        <Pressable style={styles.favoriteButtonFloating} onPress={() => toggleFavorite(species.id)}>
          <Ionicons
            name={isFavorite(species.id) ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite(species.id) ? Colors.status.error : Colors.surface}
          />
        </Pressable>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.commonName}>{species.name}</Text>
          <Text style={styles.scientificName}>{species.latin_name}</Text>
          <ConservationBadge status={species.conservation_status} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fakta Singkat</Text>
          <View style={styles.factGrid}>
            <FactCard icon="location-outline" label="Habitat" value={species.habitat} />
            <FactCard icon="time-outline" label="Umur" value={species.lifespan} />
            <FactCard icon="restaurant-outline" label="Diet" value={species.diet} />
            <FactCard icon="sunny-outline" label="Aktif" value={species.active_time} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Karakteristik</Text>
          <View style={styles.characteristicsContainer}>
            {species.characteristics.length && <Characteristic label="Panjang:" value={species.characteristics.length} />}
            {species.characteristics.weight && <Characteristic label="Berat:" value={species.characteristics.weight} />}
            {species.characteristics.top_speed && <Characteristic label="Kecepatan Max:" value={species.characteristics.top_speed} />}
            {species.characteristics.distinctive_feature && <Characteristic label="Ciri Khas:" value={species.characteristics.distinctive_feature} />}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sebaran Geografis</Text>
          <View style={styles.geoContainer}>
            <Ionicons name="earth-outline" size={24} color={Colors.primary} />
            <Text style={styles.geoText}>{species.geo_range}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Klasifikasi Ilmiah</Text>
          <View style={styles.taxonomyContainer}>
            {Object.entries(species.taxonomy).map(([key, value]) => (
              <View key={key} style={styles.taxonomyRow}>
                <Text style={styles.taxonomyLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                <Text style={styles.taxonomyValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const FactCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.factCard}>
    <Ionicons name={icon as any} size={24} color={Colors.primary} />
    <Text style={styles.factLabel}>{label}</Text>
    <Text style={styles.factValue}>{value}</Text>
  </View>
);

const Characteristic = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.characteristicItem}>
    <Text style={styles.characteristicLabel}>{label}</Text>
    <Text style={styles.characteristicValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingEmoji: { fontSize: 60, marginBottom: 20 },
  loadingText: { fontSize: 18, color: Colors.text.secondary, fontWeight: '500' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: Colors.background },
  errorEmoji: { fontSize: 60, marginBottom: 20 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 8, textAlign: 'center' },
  errorDescription: { fontSize: 16, color: Colors.text.secondary, textAlign: 'center', marginBottom: 30 },
  backButton: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  backButtonText: { color: Colors.surface, fontWeight: '600' },
  imageContainer: { height: 300, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  backButtonFloating: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  favoriteButtonFloating: { position: 'absolute', top: 50, right: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  contentContainer: { flex: 1, backgroundColor: Colors.background, marginTop: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20 },
  headerSection: { padding: 20, alignItems: 'center' },
  commonName: { fontSize: 28, fontWeight: 'bold', color: Colors.text.primary, textAlign: 'center', marginBottom: 8 },
  scientificName: { fontSize: 18, fontStyle: 'italic', color: Colors.text.secondary, marginBottom: 15 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 15 },
  factGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  factCard: { flex: 1, minWidth: '45%', backgroundColor: Colors.surface, padding: 15, borderRadius: 12, alignItems: 'center' },
  factLabel: { fontSize: 12, color: Colors.text.secondary, marginTop: 8, marginBottom: 4 },
  factValue: { fontSize: 14, fontWeight: '600', color: Colors.text.primary, textAlign: 'center' },
  characteristicsContainer: { backgroundColor: Colors.surface, borderRadius: 12, padding: 15 },
  characteristicItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.background },
  characteristicLabel: { fontSize: 16, color: Colors.text.secondary, flex: 1 },
  characteristicValue: { fontSize: 16, fontWeight: '600', color: Colors.text.primary, flex: 2, textAlign: 'right' },
  geoContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 15, borderRadius: 12 },
  geoText: { fontSize: 16, color: Colors.text.primary, marginLeft: 12, flex: 1 },
  taxonomyContainer: { backgroundColor: Colors.surface, borderRadius: 12, padding: 15 },
  taxonomyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  taxonomyLabel: { fontSize: 14, color: Colors.text.secondary, fontWeight: '600', flex: 1 },
  taxonomyValue: { fontSize: 14, color: Colors.text.primary, fontStyle: 'italic', flex: 1, textAlign: 'right' },
});
