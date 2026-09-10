import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function SpeciesSearch() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pencarian Spesies</Text>
      <Text style={styles.text}>Fitur pencarian lanjutan akan digunakan pada pertemuan berikutnya.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text.primary },
  text: { fontSize: 15, color: Colors.text.secondary, textAlign: 'center', marginTop: 8 },
});
