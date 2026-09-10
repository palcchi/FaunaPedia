import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Colors } from '../constants/Colors';
import { FaunaPediaProvider } from '../contexts/FaunaPediaContext';

export default function RootLayout() {
  return (
    <FaunaPediaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.surface,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="species" options={{ headerShown: false }} />
      </Stack>
    </FaunaPediaProvider>
  );
}
