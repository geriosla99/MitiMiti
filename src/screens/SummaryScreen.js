/**
 * SummaryScreen
 *
 * Resumen final del grupo:
 *  1. Tarjeta hero con el total y la cuota por persona.
 *  2. Tabla de balances (con pill de estado: "Le deben" / "Debe" / "Al día").
 *  3. Gráfico simple de barras (cuánto pagó cada persona).
 *  4. Lista de transferencias mínimas: "Ana le debe $20.000 a Juan".
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
      {/* ── Hero card ───────────────────────────────────────── */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Total del viaje</Text>
        <Text style={styles.heroAmount}>{formatCOP(summary.total)}</Text>
        <View style={styles.heroDivider} />
        <View style={styles.heroRow}>
          <View style={styles.heroStatBox}>
            <Text style={styles.heroStatLabel}>Cuota por persona</Text>
            <Text style={styles.heroStatValue}>
              {formatCOP(summary.perPerson)}
            </Text>
          </View>
          <View style={styles.heroVerticalDivider} />
          <View style={styles.heroStatBox}>
            <Text style={styles.heroStatLabel}>Personas</Text>
            <Text style={styles.heroStatValue}>{summary.balances.length}</Text>
          </View>
        </View>
      </View>

      {/* ── Balance individual ─────────────────────────────── */}
      <Text style={styles.sectionTitle}>Balance por persona</Text>
      <View style={styles.card}>
        {summary.balances.map((b, idx) => {
          const isLast = idx === summary.balances.length - 1;
          let pillText, pillBg, pillColor, pillIcon;
          if (Math.abs(b.balance) < 0.01) {
            pillText = 'Al día';
            pillBg = colors.surfaceAlt;
            pillColor = colors.textSecondary;
            pillIcon = '✓';
          } else if (b.balance > 0) {
            pillText = `+${formatCOP(b.balance)}`;
            pillBg = colors.successSoft;
            pillColor = colors.success;
            pillIcon = '↑';
          } else {
            pillText = `−${formatCOP(-b.balance)}`;
            pillBg = colors.dangerSoft;
            pillColor = colors.danger;
            pillIcon = '↓';
          }

          return (
            <View
              key={b.id}
              style={[styles.balanceRow, isLast && { borderBottomWidth: 0 }]}
            >
              <Avatar name={b.name} size={40} />
              <View style={{ flex: 1 }}>
                <Text style={styles.balanceName}>{b.name}</Text>
                <Text style={styles.balanceMeta}>
                  Pagó {formatCOP(b.paid)} · Le tocaba {formatCOP(b.share)}
                </Text>
              </View>
              <View style={[styles.pill, { backgroundColor: pillBg }]}>
                <Text style={[styles.pillIcon, { color: pillColor }]}>
                  {pillIcon}
                </Text>
                <Text style={[styles.pillText, { color: pillColor }]}>
                  {pillText}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionHint}>
        ↑ verde = le deben dinero · ↓ rojo = debe pagar
      </Text>

      {/* ── Gráfico ────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Distribución de pagos</Text>
      <BalanceBarChart data={summary.balances} valueKey="paid" label="Pagado" />

      {/* ── Deudas a saldar ────────────────────────────────── */}
      <Text style={styles.sectionTitle}>¿Quién le paga a quién?</Text>
      {summary.settlements.length === 0 ? (
        <View style={[styles.card, styles.allClearCard]}>
          <Text style={styles.allClearEmoji}>🎉</Text>
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
                idx === summary.settlements.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
            >
              <View style={styles.settlementParties}>
                <View style={styles.settlementSide}>
                  <Avatar name={s.fromName} size={32} />
                  <Text style={styles.settlementName} numberOfLines={1}>
                    {s.fromName}
                  </Text>
                </View>
                <View style={styles.settlementMiddle}>
                  <Text style={styles.settlementArrow}>→</Text>
                  <Text style={styles.settlementAmount}>
                    {formatCOP(s.amount)}
                  </Text>
                </View>
                <View style={styles.settlementSide}>
                  <Avatar name={s.toName} size={32} />
                  <Text style={styles.settlementName} numberOfLines={1}>
                    {s.toName}
                  </Text>
                </View>
              </View>
              <Text style={styles.settlementText}>
                <Text style={styles.settlementBold}>{s.fromName}</Text> le debe a{' '}
                <Text style={styles.settlementBold}>{s.toName}</Text>
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: spacing.xxl }} />
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

  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadow.cardLg,
  },
  heroLabel: {
    ...typography.micro,
    color: '#D1FAE5',
    textTransform: 'uppercase',
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    marginVertical: spacing.xs,
    letterSpacing: -1,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: spacing.md,
  },
  heroRow: { flexDirection: 'row' },
  heroStatBox: { flex: 1 },
  heroStatLabel: { ...typography.caption, color: '#D1FAE5' },
  heroStatValue: {
    ...typography.subtitle,
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroVerticalDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: spacing.md,
  },

  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    ...shadow.card,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  balanceName: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    fontSize: 15,
  },
  balanceMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginLeft: spacing.sm,
  },
  pillIcon: { fontSize: 12, fontWeight: '800', marginRight: 3 },
  pillText: { ...typography.label, fontSize: 12 },

  allClearCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  allClearEmoji: {
    fontSize: 56,
    lineHeight: 72,
    marginBottom: spacing.sm,
  },
  allClearTitle: {
    ...typography.subtitle,
    color: colors.success,
    fontSize: 20,
  },
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
  settlementParties: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  settlementSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settlementName: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    fontSize: 14,
    marginLeft: -4,
    flexShrink: 1,
  },
  settlementMiddle: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  settlementArrow: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  settlementAmount: {
    ...typography.label,
    color: colors.primary,
    fontSize: 13,
    marginTop: 2,
  },
  settlementText: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.sm,
  },
  settlementBold: {
    ...typography.bodyStrong,
    fontSize: 13,
    color: colors.textPrimary,
  },
});
