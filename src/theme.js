/**
 * Sistema de diseño centralizado: colores, espaciados, tipografía y radios.
 * Tener un solo "theme.js" facilita mantener consistencia visual y cambiar
 * la marca de la app sin tocar cada pantalla.
 */

export const colors = {
  // Paleta principal: verde azulado (sensación de calma + finanzas).
  primary: '#0F766E',
  primaryDark: '#115E59',
  primaryLight: '#14B8A6',

  // Estados semánticos.
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#F59E0B',

  // Neutros.
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',

  // Para tarjetas con tinte de color.
  primarySoft: '#CCFBF1',
  successSoft: '#DCFCE7',
  dangerSoft: '#FEE2E2',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
};

export const shadow = {
  // Sombras suaves multiplataforma.
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
};
