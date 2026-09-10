import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface ConservationBadgeProps {
  status: string;
}

export default function ConservationBadge({ status }: ConservationBadgeProps) {
  const getStatusColor = (status: string) => {
    return (
      Colors.conservation[status as keyof typeof Colors.conservation] ||
      Colors.text.secondary
    );
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor(status) }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
