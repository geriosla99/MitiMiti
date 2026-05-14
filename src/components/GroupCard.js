/**
 * GroupCard
 *
 * Tarjeta de grupo en la pantalla principal.
 * Muestra nombre, número de participantes, número de gastos y total.
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
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      android_ripple={{ color: colors.primarySoft }}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>🧳</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>
          {group.name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            👥 {group.participant_count}
          </Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>Mantén presionado para borrar</Text>
        </View>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>TOTAL</Text>
        <Text style={styles.totalAmount}>{formatCOP(group.total_spent)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: { fontSize: 24, lineHeight: 28 },
  name: { ...typography.subtitle, color: colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  metaText: { ...typography.caption, color: colors.textSecondary },
  metaDot: { color: colors.textMuted, marginHorizontal: 4 },
  totalBox: { alignItems: 'flex-end', marginLeft: spacing.sm },
  totalLabel: {
    ...typography.micro,
    color: colors.textMuted,
  },
  totalAmount: {
    ...typography.label,
    fontSize: 16,
    color: colors.primary,
    marginTop: 2,
  },
});
