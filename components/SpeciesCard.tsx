import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Species } from '../types/species';
import ConservationBadge from './ConservationBadge';

interface SpeciesCardProps {
  species: Species;
  onPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
}

export default function SpeciesCard({
  species,
  onPress,
  onFavoritePress,
  isFavorite,
}: SpeciesCardProps) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.imageWrap}>
        <Image
          source={species.image_link}
          style={styles.image}
          placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
          transition={180}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </Pressable>

      <Pressable
        onPress={onFavoritePress}
        style={styles.favoriteButton}
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={20}
          color={isFavorite ? Colors.status.error : Colors.text.primary}
        />
      </Pressable>

      <Pressable onPress={onPress} style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleSection}>
            <Text style={styles.commonName} numberOfLines={1}>
              {species.name}
            </Text>
            <Text style={styles.scientificName} numberOfLines={1}>
              {species.latin_name}
            </Text>
          </View>
          <ConservationBadge status={species.conservation_status} />
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="paw-outline" size={15} color={Colors.text.secondary} />
            <Text style={styles.metaText}>{species.animal_type}</Text>
          </View>

          <View style={styles.metaItemWide}>
            <Ionicons name="location-outline" size={15} color={Colors.text.secondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {species.habitat}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  imageWrap: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 176,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  content: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  titleSection: {
    flex: 1,
  },
  commonName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 3,
  },
  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.text.secondary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItemWide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.text.secondary,
    flexShrink: 1,
  },
});
