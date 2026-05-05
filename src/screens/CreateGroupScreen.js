/**
 * CreateGroupScreen
 *
 * Formulario para crear un grupo nuevo.
 * Validaciones:
 *  - Nombre del grupo no vacío.
 *  - Mínimo 2 participantes con nombre.
 *  - Sin nombres de participantes duplicados (case-insensitive).
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Button from '../components/Button';
import ParticipantInputList from '../components/ParticipantInputList';
import { createGroup } from '../data/repository';
import { colors, spacing, radius, typography } from '../theme';

export default function CreateGroupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState(['', '']);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedName = name.trim();
    const cleanedParticipants = participants.map((p) => p.trim()).filter(Boolean);

    if (!trimmedName) {
      Alert.alert('Falta información', 'Ingresa el nombre del viaje.');
      return;
    }
    if (cleanedParticipants.length < 2) {
      Alert.alert('Falta información', 'Agrega al menos 2 participantes.');
      return;
    }
    // Detectamos duplicados ignorando mayúsculas/acentos básicos.
    const lower = cleanedParticipants.map((p) => p.toLowerCase());
    const hasDuplicates = new Set(lower).size !== lower.length;
    if (hasDuplicates) {
      Alert.alert('Nombres repetidos', 'Cada participante debe tener un nombre único.');
      return;
    }

    try {
      setSaving(true);
      await createGroup(trimmedName, cleanedParticipants);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message ?? 'No se pudo guardar el grupo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Nombre del viaje</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ej: Fin de semana en Cartagena"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="sentences"
        />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Participantes</Text>
        <Text style={styles.help}>
          Agrega a todas las personas que comparten los gastos.
        </Text>
        <ParticipantInputList
          participants={participants}
          onChange={setParticipants}
        />

        <Button
          title="Crear viaje"
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  help: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
  },
});
