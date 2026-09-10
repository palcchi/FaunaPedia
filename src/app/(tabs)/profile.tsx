import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function ProfileTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>👤</Text>
      <Text style={styles.title}>Profil FaunaPedia</Text>
      <Text style={styles.text}>Halaman profil dan pengaturan pengguna.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text.primary },
  text: { fontSize: 15, color: Colors.text.secondary, textAlign: 'center', marginTop: 8 },
});
