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
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={species.image_link}
        style={styles.image}
        placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
        transition={200}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.commonName} numberOfLines={1}>
              {species.name}
            </Text>
            <Text style={styles.scientificName} numberOfLines={1}>
              {species.latin_name}
            </Text>
          </View>

          <Pressable onPress={onFavoritePress} style={styles.favoriteButton}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? Colors.status.error : Colors.text.secondary}
            />
          </Pressable>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="paw-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{species.animal_type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {species.habitat}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.detailText}>Umur: {species.lifespan}</Text>
          </View>
        </View>

        <ConservationBadge status={species.conservation_status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    marginRight: 8,
  },
  commonName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.text.secondary,
  },
  favoriteButton: {
    padding: 4,
  },
  details: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
});
