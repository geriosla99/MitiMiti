/**
 * Avatar
 *
 * Círculo con las iniciales del participante. Es puramente presentacional.
 * El color se calcula a partir del nombre para que cada persona tenga el suyo
 * (estable entre renders).
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { initials } from '../utils/format';
import { spacing, typography } from '../theme';

const PALETTE = [
  '#0F766E', '#2563EB', '#9333EA', '#DC2626',
  '#EA580C', '#CA8A04', '#16A34A', '#0891B2',
];

function colorForName(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

export default function Avatar({ name, size = 36 }) {
  const bg = colorForName(name);
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  text: {
    color: '#FFFFFF',
    ...typography.label,
  },
});
