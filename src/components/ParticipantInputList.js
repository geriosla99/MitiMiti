/**
 * ParticipantInputList
 *
 * Lista editable de participantes para el formulario de creación de grupo.
 * Cada fila tiene un input y un botón para eliminar la fila.
 *
 * Es un componente "controlado": recibe el array y lo notifica al padre con
 * onChange, así la pantalla decide si persistir o no.
 */
import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export default function ParticipantInputList({ participants, onChange }) {
  // Helpers de mutación inmutable.
  const updateAt = (index, value) => {
    const next = [...participants];
    next[index] = value;
    onChange(next);
  };
  const removeAt = (index) => {
    if (participants.length <= 1) return; // mantenemos al menos 1 fila visible
    const next = participants.filter((_, i) => i !== index);
    onChange(next);
  };
  const addRow = () => onChange([...participants, '']);

  return (
    <View>
      {participants.map((value, idx) => (
        <View key={idx} style={styles.row}>
          <TextInput
            value={value}
            onChangeText={(text) => updateAt(idx, text)}
            placeholder={`Participante ${idx + 1}`}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoCapitalize="words"
            returnKeyType="next"
          />
          <Pressable
            onPress={() => removeAt(idx)}
            style={({ pressed }) => [
              styles.removeBtn,
              pressed && { opacity: 0.6 },
              participants.length <= 1 && styles.removeDisabled,
            ]}
            disabled={participants.length <= 1}
          >
            <Text style={styles.removeBtnText}>×</Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        onPress={addRow}
        style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.addBtnText}>+ Agregar participante</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
  },
  removeBtn: {
    marginLeft: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerSoft,
  },
  removeDisabled: { opacity: 0.3 },
  removeBtnText: {
    color: colors.danger,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  addBtn: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addBtnText: { ...typography.label, color: colors.primary },
});
