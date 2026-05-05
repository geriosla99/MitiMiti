/**
 * SummaryScreen
 *
 * Resumen final del grupo:
 *  1. Tarjeta con el total y la cuota por persona.
 *  2. Tabla de balances (cuánto pagó cada uno y cuánto debía pagar).
 *  3. Gráfico simple de barras (cuánto pagó cada persona).
 *  4. Lista de transferencias mínimas: "Ana le debe $20 a Juan".
 *
 * La lógica vive en src/logic/calculations.js — esta pantalla solo orquesta.
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Avatar from '../components/Avatar';
import BalanceBarChart from '../components/BalanceBarChart';
import { listParticipants, listExpenses } from '../data/repository';
import { computeSummary } from '../logic/calculations';
import { colors, spacing, radius, typography, shadow } from '../theme';
import { formatCOP } from '../utils/format';

export default function SummaryScreen({ route }) {
  const { groupId } = route.params;
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [participants, expenses] = await Promise.all([
        listParticipants(groupId),
        listExpenses(groupId),
      ]);
      setSummary(computeSummary(participants, expenses));
    } catch (e) {
      Alert.alert('Error', e.message ?? 'No se pudo calcular el resumen.');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading || !summary) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ── Resumen general ─────────────────────────────────── */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total del viaje</Text>
        <Text style={styles.totalAmount}>{formatCOP(summary.total)}</Text>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalRowLabel}>Cuota por persona</Text>
          <Text style={styles.totalRowValue}>{formatCOP(summary.perPerson)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalRowLabel}>Participantes</Text>
          <Text style={styles.totalRowValue}>{summary.balances.length}</Text>
        </View>
      </View>

      {/* ── Balance individual ─────────────────────────────── */}
      <Text style={styles.sectionTitle}>Balance por persona</Text>
      <View style={styles.card}>
        {summary.balances.map((b, idx) => {
          const isLast = idx === summary.balances.length - 1;
          // > 0 → debe recibir; < 0 → debe pagar; ≈ 0 → al día
          let statusText;
          let statusColor;
          if (Math.abs(b.balance) < 0.01) {
            statusText = 'Al día';
            statusColor = colors.textMuted;
          } else if (b.balance > 0) {
            statusText = `Le deben ${formatCOP(b.balance)}`;
            statusColor = colors.success;
          } else {
            statusText = `Debe ${formatCOP(-b.balance)}`;
            statusColor = colors.danger;
          }

          return (
            <View
              key={b.id}
              style={[styles.balanceRow, isLast && { borderBottomWidth: 0 }]}
            >
              <Avatar name={b.name} size={36} />
              <View style={{ flex: 1 }}>
                <Text style={styles.balanceName}>{b.name}</Text>
                <Text style={styles.balanceMeta}>
                  Pagó {formatCOP(b.paid)} · Le tocaba {formatCOP(b.share)}
                </Text>
              </View>
              <Text style={[styles.balanceStatus, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
          );
        })}
      </View>

      {/* ── Gráfico ────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Distribución de pagos</Text>
      <BalanceBarChart data={summary.balances} valueKey="paid" label="Pagado" />

      {/* ── Deudas a saldar ────────────────────────────────── */}
      <Text style={styles.sectionTitle}>¿Quién le paga a quién?</Text>
      {summary.settlements.length === 0 ? (
        <View style={[styles.card, styles.allClearCard]}>
          <Text style={styles.allClearTitle}>¡Todos al día!</Text>
          <Text style={styles.allClearText}>
            Nadie le debe dinero a nadie en este grupo.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          {summary.settlements.map((s, idx) => (
            <View
              key={`${s.fromId}-${s.toId}-${idx}`}
              style={[
                styles.settlementRow,
                idx === summary.settlements.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.settlementText}>
                <Text style={styles.settlementName}>{s.fromName}</Text>
                <Text style={styles.settlementAction}>
                  {' '}le debe{' '}
                </Text>
                <Text style={styles.settlementAmount}>{formatCOP(s.amount)}</Text>
                <Text style={styles.settlementAction}> a </Text>
                <Text style={styles.settlementName}>{s.toName}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  container: { padding: spacing.lg },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  totalLabel: {
    ...typography.caption,
    color: '#CCFBF1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalRowLabel: { ...typography.body, color: '#CCFBF1' },
  totalRowValue: { ...typography.label, color: '#FFFFFF' },

  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  balanceName: { ...typography.label, color: colors.textPrimary, fontSize: 14 },
  balanceMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  balanceStatus: { ...typography.label, fontSize: 13, marginLeft: spacing.sm },

  allClearCard: { padding: spacing.lg, alignItems: 'center' },
  allClearTitle: { ...typography.subtitle, color: colors.success },
  allClearText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  settlementRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settlementText: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  settlementName: { ...typography.label, color: colors.textPrimary, fontSize: 15 },
  settlementAction: { ...typography.body, color: colors.textSecondary },
  settlementAmount: { ...typography.label, color: colors.primary, fontSize: 15 },
});
