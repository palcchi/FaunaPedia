import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { WelcomeHeroImage } from '../constants/SpeciesImages';

export default function WelcomeScreen() {
  const features = [
    {
      icon: 'library-outline' as const,
      title: 'Ensiklopedia Lengkap',
      description: 'Informasi spesies, habitat, dan klasifikasi dalam satu tempat.',
    },
    {
      icon: 'search-outline' as const,
      title: 'Pencarian Cepat',
      description: 'Cari berdasarkan nama, habitat, atau tipe hewan.',
    },
    {
      icon: 'leaf-outline' as const,
      title: 'Status Konservasi',
      description: 'Lihat status konservasi setiap spesies dengan lebih jelas.',
    },
    {
      icon: 'heart-outline' as const,
      title: 'Favorit Personal',
      description: 'Simpan spesies yang ingin kamu pelajari lagi.',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />

      <View style={styles.hero}>
        <Image
          source={WelcomeHeroImage}
          style={styles.heroImage}
          placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
          contentFit="cover"
          cachePolicy="memory-disk"
        />

        <View style={styles.heroOverlay}>
          <View style={styles.brandBadge}>
            <Ionicons name="paw-outline" size={18} color={Colors.surface} />
            <Text style={styles.brandBadgeText}>FAUNAPEDIA</Text>
          </View>

          <Text style={styles.appName}>Kenali fauna dengan cara yang lebih sederhana.</Text>
          <Text style={styles.tagline}>
            Jelajahi koleksi spesies, habitat, karakteristik, dan status konservasinya.
          </Text>

          <Pressable
            style={styles.ctaButton}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Text style={styles.ctaText}>Mulai Eksplorasi</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.surface} />
          </Pressable>
        </View>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionEyebrow}>FITUR UTAMA</Text>
        <Text style={styles.sectionTitle}>Belajar fauna tanpa tampilan yang ramai</Text>

        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons
                  name={feature.icon}
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Spesies Demo</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Kategori</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Aplikasi</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    height: 470,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(24, 45, 24, 0.62)',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 38,
  },
  brandBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginBottom: 16,
  },
  brandBadgeText: {
    color: Colors.surface,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  appName: {
    maxWidth: 340,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '700',
    color: Colors.surface,
  },
  tagline: {
    maxWidth: 340,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.surface,
    opacity: 0.84,
    marginTop: 10,
    marginBottom: 24,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
  },
  ctaText: {
    color: Colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  featuresSection: {
    paddingHorizontal: 16,
    paddingTop: 28,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: Colors.primary,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
    maxWidth: 320,
  },
  featuresGrid: {
    gap: 10,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  featureIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.text.secondary,
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 28,
    paddingVertical: 18,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 34,
    backgroundColor: 'rgba(26,26,26,0.08)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 3,
  },
});
