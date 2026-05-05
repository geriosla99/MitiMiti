/**
 * ExpenseItem
 *
 * Fila de gasto dentro del detalle del grupo. Muestra quién pagó, monto y
 * descripción opcional. Soporta tap (editar) y long-press (eliminar).
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import { colors, spacing, radius, typography, shadow } from '../theme';
import { formatCOP, formatDate } from '../utils/format';

export default function ExpenseItem({ expense, onPress, onLongPress }) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
      android_ripple={{ color: colors.primarySoft }}
    >
      <Avatar name={expense.payer_name} size={40} />
      <View style={{ flex: 1 }}>
        <Text style={styles.payer} numberOfLines={1}>
          {expense.payer_name} pagó
        </Text>
        {expense.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {expense.description}
          </Text>
        ) : (
          <Text style={styles.descriptionMuted}>Sin descripción</Text>
        )}
        <Text style={styles.date}>{formatDate(expense.created_at)}</Text>
      </View>
      <Text style={styles.amount}>{formatCOP(expense.amount)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  payer: { ...typography.label, color: colors.textPrimary, fontSize: 14 },
  description: { ...typography.body, color: colors.textPrimary, marginTop: 2 },
  descriptionMuted: {
    ...typography.body,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  date: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  amount: {
    ...typography.subtitle,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
});
