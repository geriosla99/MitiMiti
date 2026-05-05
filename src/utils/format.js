/**
 * Utilidades de formato — separadas para que sean fáciles de testear
 * y de cambiar (por ejemplo, si más adelante se quiere soportar otras monedas).
 */

/**
 * Formatea un número como peso colombiano: "$ 50.000" o "$ 12.500,75".
 * - Usa punto como separador de miles.
 * - Coma como separador decimal.
 * - Solo muestra decimales si el valor los tiene.
 */
export function formatCOP(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '$ 0';
  const num = Number(value);
  const hasDecimals = Math.round(num * 100) % 100 !== 0;
  const formatted = num.toLocaleString('es-CO', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `$ ${formatted}`;
}

/**
 * Convierte un string del usuario (ej. "12.500,75" o "12500.75") a número.
 * Acepta ambos formatos para que el formulario sea tolerante.
 */
export function parseAmount(input) {
  if (typeof input !== 'string') return Number(input) || 0;
  const cleaned = input
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^\d.,-]/g, '');
  if (!cleaned) return 0;

  // Si tiene tanto "." como ",", asumimos formato es-CO ("." miles, "," decimal).
  // Si solo tiene uno, asumimos que es decimal.
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  let normalized = cleaned;
  if (hasComma && hasDot) {
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    normalized = cleaned.replace(',', '.');
  }
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Formatea una fecha ISO o timestamp como "5 may 2026, 14:32".
 */
export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Devuelve las iniciales (1 o 2 letras) de un nombre, en mayúsculas.
 * Útil para los avatares de los participantes.
 */
export function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
