/**
 * GroupCard
 *
 * Tarjeta usada en la pantalla principal para listar grupos.
 * Muestra nombre, número de participantes y total gastado.
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, radius, shadow, typography } from '../theme';
import { formatCOP } from '../utils/format';

export default function GroupCard({ group, onPress, onLongPress }) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      android_ripple={{ color: colors.primarySoft }}
    >
      <View style={styles.row}>
        <View style={styles.dot} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>{group.name}</Text>
          <Text style={styles.meta}>
            {group.participant_count} participante
            {group.participant_count === 1 ? '' : 's'}
          </Text>
        </View>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatCOP(group.total_spent)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  pressed: { opacity: 0.85 },
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  name: { ...typography.subtitle, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  totalBox: { alignItems: 'flex-end' },
  totalLabel: { ...typography.caption, color: colors.textMuted },
  totalAmount: {
    ...typography.label,
    fontSize: 15,
    color: colors.primary,
    marginTop: 2,
  },
});
