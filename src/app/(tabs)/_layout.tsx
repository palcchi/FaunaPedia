import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '../../constants/Colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.text.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarStyle: {
          height: 66,
          paddingTop: 7,
          paddingBottom: 8,
          backgroundColor: Colors.surface,
          borderTopColor: 'rgba(26,26,26,0.06)',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Beranda',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Katalog',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'paw' : 'paw-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorit',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
