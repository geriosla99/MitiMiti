/**
 * GroupDetailScreen
 *
 * Vista del grupo con:
 *  - Encabezado con total gastado y número de participantes.
 *  - Lista de gastos (tap para editar, long-press para eliminar).
 *  - Botón "Agregar gasto" + botón "Ver resumen final".
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExpenseItem from '../components/ExpenseItem';
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

  const confirmDeleteExpense = (expense) => {
    Alert.alert(
      'Eliminar gasto',
      `¿Eliminar el gasto de ${formatCOP(expense.amount)}?`,
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
        <Text style={styles.headerSub}>
          {participants.length} participante{participants.length === 1 ? '' : 's'} ·{' '}
          {expenses.length} gasto{expenses.length === 1 ? '' : 's'}
        </Text>
      </View>

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
            <Text style={styles.emptyText}>
              Aún no hay gastos. Toca "Agregar gasto" para comenzar.
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.btnSecondary,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() =>
            navigation.navigate('Summary', {
              groupId,
              groupName,
            })
          }
          disabled={expenses.length === 0}
        >
          <Text style={[styles.btnText, { color: colors.primary }]}>
            Ver resumen
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.btnPrimary,
            pressed && { opacity: 0.85 },
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
  },
  headerLabel: {
    ...typography.caption,
    color: '#CCFBF1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginVertical: spacing.xs,
  },
  headerSub: {
    ...typography.caption,
    color: '#CCFBF1',
  },
  list: {
    padding: spacing.lg,
    flexGrow: 1,
    paddingBottom: 120,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    ...shadow.card,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnText: { ...typography.label, fontSize: 14 },
});
