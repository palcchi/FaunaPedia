import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function ProfileTab() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="person-outline" size={28} color={Colors.primary} />
        </View>
        <Text style={styles.eyebrow}>FAUNAPEDIA</Text>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.text}>
          Area profil dan pengaturan pengguna untuk pengembangan berikutnya.
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={18} color={Colors.text.secondary} />
          <Text style={styles.infoText}>Project Native Programming</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="phone-portrait-outline" size={18} color={Colors.text.secondary} />
          <Text style={styles.infoText}>React Native + Expo</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: Colors.primary,
    marginBottom: 4,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.text.secondary,
    marginTop: 8,
    marginBottom: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(26,26,26,0.06)',
  },
  infoText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
});
