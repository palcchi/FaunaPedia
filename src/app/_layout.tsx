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
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="species" />
      </Stack>
    </FaunaPediaProvider>
  );
}
