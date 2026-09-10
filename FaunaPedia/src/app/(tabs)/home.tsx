import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🦎</Text>
      <Text style={styles.title}>FaunaPedia</Text>
      <Text style={styles.subtitle}>Jelajahi dunia fauna dari satu tempat.</Text>
      <Pressable style={styles.button} onPress={() => router.push('/(tabs)/catalog')}>
        <Text style={styles.buttonText}>Lihat Katalog Spesies</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 30, fontWeight: 'bold', color: Colors.text.primary },
  subtitle: { fontSize: 16, color: Colors.text.secondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  button: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: Colors.surface, fontWeight: '600' },
});
