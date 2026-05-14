/**
 * Sistema de diseño Mitimiti.
 *
 * Paleta dual inspirada en el logo:
 *  - Verde emerald (la mitad izquierda del logo) — color principal de acción.
 *  - Morado violet (la mitad derecha) — color secundario / acento.
 *  - Fondo crema cálido para evocar la sensación amistosa del logo.
 *  - Texto oscuro azul-noche para contraste suave.
 */

export const colors = {
  // Verde emerald — color principal (mitad izquierda del logo)
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#34D399',
  primaryDeep: '#047857',
  primarySoft: '#D1FAE5',
  primarySofter: '#ECFDF5',

  // Morado violet — color secundario (mitad derecha del logo)
  accent: '#7C3AED',
  accentDark: '#6D28D9',
  accentLight: '#A78BFA',
  accentSoft: '#EDE9FE',
  accentSofter: '#F5F3FF',

  // Estados semánticos
  success: '#10B981',
  successSoft: '#D1FAE5',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  info: '#3B82F6',
  infoSoft: '#DBEAFE',

  // Neutros: fondo crema cálido del logo
  background: '#FAF6EB',
  surface: '#FFFFFF',
  surfaceAlt: '#F5EFDD',
  border: '#E8E2D2',
  borderStrong: '#D6CFBE',
  textPrimary: '#0F1628',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',

  // Overlays
  overlay: 'rgba(15, 22, 40, 0.45)',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const typography = {
  hero: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3 },
  subtitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '400' },
  bodyStrong: { fontSize: 15, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  micro: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
};

export const shadow = {
  card: {
    shadowColor: '#0F1628',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLg: {
    shadowColor: '#0F1628',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  floating: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
  floatingAccent: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
};
