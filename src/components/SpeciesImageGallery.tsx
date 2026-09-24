import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SpeciesImageGalleryProps {
  images: string[];
  speciesName: string;
}

type GalleryImage = {
  uri: string;
  sourceIndex: number;
};

export default function SpeciesImageGallery({
  images,
  speciesName,
}: SpeciesImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const validImages = useMemo<GalleryImage[]>(
    () =>
      images
        .map((uri, sourceIndex) => ({ uri, sourceIndex }))
        .filter(({ uri, sourceIndex }) => Boolean(uri) && !imageErrors.has(sourceIndex)),
    [images, imageErrors]
  );

  const handleImageError = (sourceIndex: number) => {
    setImageErrors((previous) => {
      const next = new Set(previous);
      next.add(sourceIndex);
      return next;
    });
  };

  const openImage = (sourceIndex: number) => {
    const galleryIndex = validImages.findIndex(
      (image) => image.sourceIndex === sourceIndex
    );
    if (galleryIndex >= 0) setSelectedIndex(galleryIndex);
  };

  const renderThumbnail = ({ item }: { item: GalleryImage }) => (
    <Pressable
      style={styles.thumbnailContainer}
      onPress={() => openImage(item.sourceIndex)}
      accessibilityRole="button"
      accessibilityLabel={`Buka foto ${speciesName}`}
    >
      <Image
        source={item.uri}
        style={styles.thumbnail}
        placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
        transition={200}
        onError={() => handleImageError(item.sourceIndex)}
        cachePolicy="memory-disk"
        contentFit="cover"
      />
    </Pressable>
  );

  const renderFullImage = ({ item }: { item: GalleryImage }) => (
    <View style={styles.fullImageContainer}>
      <Image
        source={item.uri}
        style={styles.fullImage}
        contentFit="contain"
        placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
        onError={() => handleImageError(item.sourceIndex)}
        cachePolicy="memory-disk"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.galleryTitle}>Galeri Foto {speciesName}</Text>

      {validImages.length === 0 ? (
        <View style={styles.noImagesContainer}>
          <Ionicons
            name="images-outline"
            size={60}
            color={Colors.text.secondary}
          />
          <Text style={styles.noImagesText}>Tidak ada foto tersedia</Text>
        </View>
      ) : (
        <FlatList
          data={validImages}
          renderItem={renderThumbnail}
          keyExtractor={(item) => `thumb_${item.sourceIndex}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailsContainer}
        />
      )}

      <Modal
        visible={selectedIndex !== null && validImages.length > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedIndex(null)}
        statusBarTranslucent
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedIndex(null)}
              accessibilityRole="button"
              accessibilityLabel="Tutup galeri"
            >
              <Ionicons name="close" size={30} color={Colors.surface} />
            </Pressable>

            <Text style={styles.modalTitle}>
              {selectedIndex !== null
                ? `${selectedIndex + 1} dari ${validImages.length}`
                : ''}
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {validImages.length > 0 && (
            <FlatList
              key={`gallery-${selectedIndex ?? 0}-${validImages.length}`}
              data={validImages}
              renderItem={renderFullImage}
              keyExtractor={(item) => `full_${item.sourceIndex}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={Math.min(
                selectedIndex ?? 0,
                Math.max(validImages.length - 1, 0)
              )}
              getItemLayout={(_, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                setSelectedIndex(newIndex);
              }}
            />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  thumbnailsContainer: {
    paddingHorizontal: 16,
  },
  thumbnailContainer: {
    marginRight: 12,
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  noImagesContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.text.secondary,
    borderStyle: 'dashed',
  },
  noImagesText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    color: Colors.surface,
    fontWeight: '500',
  },
  headerSpacer: {
    width: 44,
  },
  fullImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.7,
  },
});
