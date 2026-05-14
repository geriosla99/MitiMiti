/**
 * GroupDetailScreen
 *
 * Vista del grupo con:
 *  - Encabezado con total gastado, número de participantes y de gastos.
 *  - Chips visuales con los nombres de los participantes.
 *  - Lista de gastos (tap edita, long-press elimina).
 *  - Botones flotantes: "Agregar gasto" y "Ver resumen final".
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExpenseItem from '../components/ExpenseItem';
import Avatar from '../components/Avatar';
import {
  listParticipants,
  listExpenses,
  deleteExpense,
} from '../data/repository';
import { colors, spacing, radius, typography, shadow } from '../theme';
import { formatCOP } from '../utils/format';

export default function GroupDetailScreen({ route, navigation }) {
  const { groupId, groupName } = route.params;
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const load = useCallback(async () => {
    try {
      const [p, e] = await Promise.all([
        listParticipants(groupId),
        listExpenses(groupId),
      ]);
      setParticipants(p);
      setExpenses(e);
    } catch (err) {
      Alert.alert('Error', err.message ?? 'No se pudo cargar el grupo.');
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const perPerson = participants.length > 0 ? total / participants.length : 0;

  const confirmDeleteExpense = (expense) => {
    Alert.alert(
      'Eliminar gasto',
      'Eliminar el gasto de ' + formatCOP(expense.amount) + '?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expense.id);
              load();
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Total gastado</Text>
        <Text style={styles.headerAmount}>{formatCOP(total)}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{participants.length}</Text>
            <Text style={styles.statLabel}>
              {participants.length === 1 ? 'persona' : 'personas'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{expenses.length}</Text>
            <Text style={styles.statLabel}>
              {expenses.length === 1 ? 'gasto' : 'gastos'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{formatCOP(perPerson)}</Text>
            <Text style={styles.statLabel}>c/u</Text>
          </View>
        </View>
      </View>

      {participants.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {participants.map((p) => (
            <View key={p.id} style={styles.chip}>
              <Avatar name={p.name} size={24} />
              <Text style={styles.chipText} numberOfLines={1}>
                {p.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      <Text style={styles.sectionTitle}>Gastos</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onPress={() =>
              navigation.navigate('AddExpense', {
                groupId,
                participants,
                expense: item,
              })
            }
            onLongPress={() => confirmDeleteExpense(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💸</Text>
            <Text style={styles.emptyTitle}>Sin gastos todavía</Text>
            <Text style={styles.emptyText}>
              Toca "Agregar gasto" abajo para registrar el primer pago del viaje.
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.btnSecondary,
            expenses.length === 0 && styles.btnDisabled,
            pressed && expenses.length > 0 && { opacity: 0.85 },
          ]}
          onPress={() =>
            navigation.navigate('Summary', { groupId, groupName })
          }
          disabled={expenses.length === 0}
        >
          <Text
            style={[
              styles.btnText,
              { color: colors.primary },
              expenses.length === 0 && { color: colors.textMuted },
            ]}
          >
            📊 Resumen
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.btnPrimary,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() =>
            navigation.navigate('AddExpense', { groupId, participants })
          }
        >
          <Text style={[styles.btnText, { color: '#fff' }]}>+ Agregar gasto</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  headerLabel: {
    ...typography.micro,
    color: '#D1FAE5',
    textTransform: 'uppercase',
  },
  headerAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  statLabel: {
    color: '#D1FAE5',
    fontSize: 11,
    marginTop: 2,
    textTransform: 'lowercase',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: spacing.xs,
  },
  chipsRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginRight: spacing.xs,
    ...shadow.card,
  },
  chipText: {
    ...typography.bodyStrong,
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: -4,
    maxWidth: 100,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 110,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: { fontSize: 60, lineHeight: 76, marginBottom: spacing.md },
  emptyTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: colors.primary, ...shadow.floating, flex: 1.4 },
  btnSecondary: {
    backgroundColor: colors.primarySofter,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnDisabled: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  btnText: { ...typography.bodyStrong, fontSize: 14 },
});
