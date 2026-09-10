import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function WelcomeScreen() {
  const features = [
    {
      icon: 'library-outline',
      title: 'Ensiklopedia Lengkap',
      description: 'Database ribuan spesies fauna dari seluruh dunia',
    },
    {
      icon: 'search-outline',
      title: 'Pencarian Advanced',
      description: 'Cari berdasarkan nama, habitat, atau klasifikasi',
    },
    {
      icon: 'images-outline',
      title: 'Galeri Media',
      description: 'Koleksi foto dan video berkualitas tinggi',
    },
    {
      icon: 'heart-outline',
      title: 'Favorit Personal',
      description: 'Simpan dan kelola spesies favorit Anda',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />

      <View style={styles.hero}>
        <Image
          source="https://images.unsplash.com/photo-1547036967-23d11aacaee0"
          style={styles.heroImage}
          placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
        />

        <View style={styles.heroOverlay}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🦎</Text>
            <Text style={styles.appName}>Aplikasi FaunaPedia</Text>
          </View>

          <Text style={styles.tagline}>Jendela Menuju Keajaiban Dunia Fauna</Text>

          <Pressable
            style={styles.ctaButton}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Text style={styles.ctaText}>Mulai Eksplorasi</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.surface} />
          </Pressable>
        </View>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Fitur FaunaPedia</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons
                  name={feature.icon as any}
                  size={30}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>10,000+</Text>
          <Text style={styles.statLabel}>Spesies</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>50,000+</Text>
          <Text style={styles.statLabel}>Foto & Video</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>195</Text>
          <Text style={styles.statLabel}>Negara</Text>
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
    height: 400,
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
    backgroundColor: 'rgba(45, 80, 22, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.surface,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.9,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
  },
  ctaText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresGrid: {
    gap: 15,
  },
  featureCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});
