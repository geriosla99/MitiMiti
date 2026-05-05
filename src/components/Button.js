/**
 * Button
 *
 * Botón consistente con estilos primario/secundario/peligro.
 * Encapsula el patrón Pressable + estilos para no repetir en cada pantalla.
 */
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
  loading = false,
  disabled = false,
  style,
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && { opacity: 0.85 },
        style,
      ]}
    >
      <View style={styles.row}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'secondary' ? colors.primary : '#fff'}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { ...typography.label, fontSize: 15 },

  primary: { backgroundColor: colors.primary },
  primaryText: { color: '#FFFFFF' },

  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryText: { color: colors.primary },

  danger: { backgroundColor: colors.danger },
  dangerText: { color: '#FFFFFF' },

  disabled: { opacity: 0.5 },
});
