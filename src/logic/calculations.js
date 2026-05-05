/**
 * calculations.js
 *
 * Lógica de negocio PURA: dado un grupo (participantes + gastos) calcula
 * los balances y la lista mínima de transferencias para saldar las cuentas.
 *
 * No depende de SQLite, ni de React, ni del DOM. Eso lo hace fácil de testear
 * desde Node (ver tests/settlement.test.js).
 *
 * Convenciones:
 *  - Todos los importes están en una misma moneda (en esta app, COP).
 *  - El gasto se reparte EQUITATIVAMENTE entre TODOS los participantes del grupo.
 *  - Trabajamos internamente en centavos (enteros) para evitar errores de
 *    coma flotante (típicos al sumar cifras como 33.33 + 33.33 + 33.34).
 */

// ───── Helpers de centavos ──────────────────────────────────────────────────

/** Convierte un valor en pesos a centavos enteros (redondeando). */
function toCents(value) {
  return Math.round(Number(value) * 100);
}

/** Convierte centavos enteros de vuelta a pesos con 2 decimales. */
function fromCents(cents) {
  return Math.round(cents) / 100;
}

// ───── Cálculo principal ────────────────────────────────────────────────────

/**
 * Calcula el resumen completo del grupo.
 *
 * @param {{id:number, name:string}[]} participants
 * @param {{id:number, payer_id:number, amount:number, description?:string}[]} expenses
 * @returns {{
 *   total: number,                                           // total gastado
 *   perPerson: number,                                       // cuánto debía pagar cada uno
 *   balances: {id:number, name:string, paid:number, share:number, balance:number}[],
 *   settlements: {fromId:number, fromName:string, toId:number, toName:string, amount:number}[]
 * }}
 *
 *  - balance > 0 → la persona pagó de más, debe RECIBIR.
 *  - balance < 0 → la persona pagó de menos, DEBE pagar.
 *  - balance ≈ 0 → está al día.
 */
export function computeSummary(participants, expenses) {
  const safeParticipants = Array.isArray(participants) ? participants : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const N = safeParticipants.length;

  // Caso borde: grupo vacío.
  if (N === 0) {
    return { total: 0, perPerson: 0, balances: [], settlements: [] };
  }

  // 1) Total gastado, en centavos.
  const totalCents = safeExpenses.reduce(
    (acc, e) => acc + toCents(e.amount),
    0
  );

  // 2) Cuota equitativa por persona, en centavos.
  //    Repartimos los centavos sobrantes entre las primeras personas
  //    para que la suma cuadre exactamente con el total (evita "1 peso perdido").
  const baseShare = Math.floor(totalCents / N);
  const remainder = totalCents - baseShare * N;
  const sharesCents = safeParticipants.map((_, i) =>
    i < remainder ? baseShare + 1 : baseShare
  );

  // 3) Cuánto pagó CADA persona (sumando todos los gastos donde fue payer).
  const paidByCents = new Map();
  for (const p of safeParticipants) paidByCents.set(p.id, 0);
  for (const e of safeExpenses) {
    if (paidByCents.has(e.payer_id)) {
      paidByCents.set(e.payer_id, paidByCents.get(e.payer_id) + toCents(e.amount));
    }
  }

  // 4) Balance individual = pagado − cuota.
  const balances = safeParticipants.map((p, i) => {
    const paidCents = paidByCents.get(p.id) ?? 0;
    const shareCents = sharesCents[i];
    return {
      id: p.id,
      name: p.name,
      paid: fromCents(paidCents),
      share: fromCents(shareCents),
      balance: fromCents(paidCents - shareCents),
      _balanceCents: paidCents - shareCents, // uso interno para settlements
    };
  });

  // 5) Lista mínima de transferencias para saldar (algoritmo de saldos).
  const settlements = settleDebts(balances);

  // Devolvemos sin el campo interno _balanceCents.
  const cleanBalances = balances.map(({ _balanceCents, ...rest }) => rest);

  return {
    total: fromCents(totalCents),
    perPerson: fromCents(baseShare), // cuota nominal "ideal" antes de repartir centavos
    balances: cleanBalances,
    settlements,
  };
}

// ───── Algoritmo de simplificación de deudas ────────────────────────────────

/**
 * Dada la lista de balances (en centavos enteros), produce el mínimo
 * razonable de transferencias para que todo el mundo quede en cero.
 *
 * Estrategia greedy clásica:
 *   1. Separamos acreedores (balance > 0) y deudores (balance < 0).
 *   2. Mientras quede alguien en deuda:
 *        - Tomamos al deudor con mayor deuda y al acreedor con mayor crédito.
 *        - Transferimos el mínimo entre ambos.
 *        - Reducimos sus balances; si llegan a 0 los descartamos.
 *
 * Esto NO siempre devuelve el óptimo absoluto (problema NP en el caso general),
 * pero da un resultado muy compacto y suficiente para esta app.
 */
function settleDebts(balances) {
  // Tolerancia: por debajo de 1 centavo lo consideramos saldado.
  const EPS = 1;

  const creditors = [];
  const debtors = [];
  for (const b of balances) {
    if (b._balanceCents > EPS) creditors.push({ ...b });
    else if (b._balanceCents < -EPS) debtors.push({ ...b });
  }

  // Orden descendente por magnitud (el mayor primero).
  creditors.sort((a, b) => b._balanceCents - a._balanceCents);
  debtors.sort((a, b) => a._balanceCents - b._balanceCents);

  const settlements = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i];
    const c = creditors[j];
    const transferCents = Math.min(-d._balanceCents, c._balanceCents);

    settlements.push({
      fromId: d.id,
      fromName: d.name,
      toId: c.id,
      toName: c.name,
      amount: fromCents(transferCents),
    });

    d._balanceCents += transferCents;
    c._balanceCents -= transferCents;

    if (Math.abs(d._balanceCents) <= EPS) i += 1;
    if (Math.abs(c._balanceCents) <= EPS) j += 1;
  }

  return settlements;
}

// Exportamos los helpers solo para tests.
export const __test__ = { toCents, fromCents, settleDebts };
