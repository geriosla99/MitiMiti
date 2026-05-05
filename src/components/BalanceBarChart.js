/**
 * BalanceBarChart
 *
 * Gráfico simple de barras horizontales: muestra cuánto pagó cada persona.
 * Implementado con Views nativas (sin librerías externas) — barras de ancho
 * proporcional al máximo, con etiqueta y valor.
 *
 * Se usa en SummaryScreen como visualización rápida.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { formatCOP } from '../utils/format';

export default function BalanceBarChart({ data, valueKey = 'paid', label = 'Pagado' }) {
  if (!data || data.length === 0) return null;

  const max = data.reduce((m, d) => Math.max(m, d[valueKey] || 0), 0);
  // Si nadie ha pagado nada todavía, evitamos divisiones por cero.
  const safeMax = max > 0 ? max : 1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label} por persona</Text>
      {data.map((d) => {
        const pct = ((d[valueKey] || 0) / safeMax) * 100;
        return (
          <View key={d.id} style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>{d.name}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.value}>{formatCOP(d[valueKey])}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    width: 80,
    ...typography.body,
    color: colors.textPrimary,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  value: {
    width: 90,
    textAlign: 'right',
    ...typography.caption,
    color: colors.textPrimary,
  },
});
