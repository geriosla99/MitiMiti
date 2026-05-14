/**
 * AddExpenseScreen
 *
 * Formulario para CREAR o EDITAR un gasto.
 * Si recibe `expense` en route.params, está en modo edición.
 *
 * Campos:
 *  - Monto (obligatorio, > 0) — input grande estilo "calculadora"
 *  - Pagador (obligatorio, chips seleccionables con avatar)
 *  - Descripción (opcional)
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { addExpense, updateExpense } from '../data/repository';
import { colors, spacing, radius, typography, shadow } from '../theme';
import { parseAmount } from '../utils/format';

export default function AddExpenseScreen({ route, navigation }) {
  const { groupId, participants, expense } = route.params;
  const isEditing = !!expense;

  const [amount, setAmount] = useState(
    isEditing ? String(expense.amount) : ''
  );
  const [description, setDescription] = useState(
    isEditing ? expense.description ?? '' : ''
  );
  const [payerId, setPayerId] = useState(
    isEditing ? expense.payer_id : participants?.[0]?.id ?? null
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const parsed = parseAmount(amount);
    if (!parsed || parsed <= 0) {
      Alert.alert('Monto inválido', 'Ingresa un valor mayor a 0.');
      return;
    }
    if (!payerId) {
      Alert.alert('Pagador', 'Selecciona quién pagó este gasto.');
      return;
    }
    try {
      setSaving(true);
      if (isEditing) {
        await updateExpense({
          id: expense.id,
          payerId,
          amount: parsed,
          description,
        });
      } else {
        await addExpense({
          groupId,
          payerId,
          amount: parsed,
          description,
        });
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message ?? 'No se pudo guardar el gasto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Monto</Text>
        <View style={styles.amountCard}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            style={styles.amountInput}
            autoFocus={!isEditing}
          />
        </View>

        <Text style={[styles.label, { marginTop: spacing.lg }]}>¿Quién pagó?</Text>
        <View style={styles.payerList}>
          {participants.map((p) => {
            const selected = p.id === payerId;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPayerId(p.id)}
                style={({ pressed }) => [
                  styles.payerChip,
                  selected && styles.payerChipSelected,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Avatar name={p.name} size={28} />
                <Text
                  style={[
                    styles.payerName,
                    selected && { color: '#fff', fontWeight: '700' },
                  ]}
                  numberOfLines={1}
                >
                  {p.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Descripción</Text>
        <Text style={styles.help}>Opcional — ej: "Cena", "Gasolina", "Hotel"</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción del gasto"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="sentences"
        />

        <View style={styles.note}>
          <Text style={styles.noteEmoji}>ℹ️</Text>
          <Text style={styles.noteText}>
            Este gasto se dividirá equitativamente entre los{' '}
            <Text style={{ fontWeight: '700' }}>{participants.length} participantes</Text>{' '}
            del grupo.
          </Text>
        </View>

        <Button
          title={isEditing ? 'Guardar cambios' : 'Guardar gasto'}
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  help: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  amountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadow.card,
  },
  currencySymbol: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '800',
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
    letterSpacing: -0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  payerList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  payerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    ...shadow.card,
  },
  payerChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  payerName: {
    ...typography.body,
    color: colors.textPrimary,
    marginLeft: 4,
    maxWidth: 120,
  },
  note: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    backgroundColor: colors.primarySofter,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  noteEmoji: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  noteText: {
    ...typography.caption,
    color: colors.primaryDark,
    flex: 1,
    lineHeight: 18,
  },
});
