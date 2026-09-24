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
      <View style={styles.stateContainer}>
        <View style={styles.stateIcon}>
          <Ionicons name="paw-outline" size={28} color={Colors.primary} />
        </View>
        <Text style={styles.stateTitle}>Memuat detail spesies</Text>
        <Text style={styles.stateText}>Sedang menyiapkan informasi fauna.</Text>
      </View>
    );
  }

  if (!species) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.stateIcon}>
          <Ionicons name="alert-circle-outline" size={28} color={Colors.status.warning} />
        </View>
        <Text style={styles.stateTitle}>Spesies tidak ditemukan</Text>
        <Text style={styles.stateText}>Data yang Anda cari tidak tersedia.</Text>
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
        <Image
          source={species.image_link}
          style={styles.heroImage}
          placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
          contentFit="cover"
          cachePolicy="memory-disk"
        />

        <Pressable style={styles.floatingButtonLeft} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.surface} />
        </Pressable>

        <Pressable
          style={styles.floatingButtonRight}
          onPress={() => toggleFavorite(species.id)}
        >
          <Ionicons
            name={isFavorite(species.id) ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite(species.id) ? Colors.status.error : Colors.surface}
          />
        </Pressable>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.eyebrow}>{species.animal_type.toUpperCase()}</Text>
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
          <View style={styles.infoCard}>
            {species.characteristics.length ? (
              <Characteristic label="Panjang" value={species.characteristics.length} />
            ) : null}
            {species.characteristics.weight ? (
              <Characteristic label="Berat" value={species.characteristics.weight} />
            ) : null}
            {species.characteristics.top_speed ? (
              <Characteristic label="Kecepatan Max" value={species.characteristics.top_speed} />
            ) : null}
            {species.characteristics.distinctive_feature ? (
              <Characteristic label="Ciri Khas" value={species.characteristics.distinctive_feature} />
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sebaran Geografis</Text>
          <View style={styles.geoContainer}>
            <View style={styles.inlineIcon}>
              <Ionicons name="earth-outline" size={19} color={Colors.primary} />
            </View>
            <Text style={styles.geoText}>{species.geo_range}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Klasifikasi Ilmiah</Text>
          <View style={styles.infoCard}>
            {Object.entries(species.taxonomy).map(([key, value]) => (
              <View key={key} style={styles.taxonomyRow}>
                <Text style={styles.taxonomyLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <Text style={styles.taxonomyValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function FactCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.factCard}>
      <View style={styles.inlineIcon}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

function Characteristic({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.characteristicItem}>
      <Text style={styles.characteristicLabel}>{label}</Text>
      <Text style={styles.characteristicValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 32,
  },
  stateIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  stateText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 6,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 20,
  },
  backButtonText: {
    color: Colors.surface,
    fontWeight: '700',
  },
  imageContainer: {
    height: 310,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingButtonLeft: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: 'rgba(15,18,15,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonRight: {
    position: 'absolute',
    top: 52,
    right: 16,
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: 'rgba(15,18,15,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: Colors.background,
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 6,
  },
  headerSection: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 10,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: Colors.primary,
    marginBottom: 5,
  },
  commonName: {
    fontSize: 29,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  scientificName: {
    fontSize: 15,
    fontStyle: 'italic',
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: 12,
  },
  section: {
    paddingHorizontal: 18,
    paddingTop: 22,
  },
  lastSection: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  factGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  factCard: {
    width: '48%',
    minHeight: 116,
    backgroundColor: Colors.surface,
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  inlineIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  factLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 10,
    marginBottom: 3,
  },
  factValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  characteristicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26,26,26,0.05)',
    gap: 16,
  },
  characteristicLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    flex: 1,
  },
  characteristicValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1.5,
    textAlign: 'right',
  },
  geoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  geoText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text.primary,
    marginLeft: 11,
    flex: 1,
  },
  taxonomyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26,26,26,0.05)',
    gap: 16,
  },
  taxonomyLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    flex: 1,
  },
  taxonomyValue: {
    fontSize: 13,
    color: Colors.text.primary,
    fontStyle: 'italic',
    flex: 1,
    textAlign: 'right',
  },
});
