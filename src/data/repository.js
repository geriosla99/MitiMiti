/**
 * repository.js
 *
 * Capa de "repositorio": la única que conoce SQL.
 * Las pantallas y la lógica importan SOLO funciones de aquí, nunca SQL crudo.
 * Esto mantiene la regla de arquitectura limpia: UI -> Lógica -> Datos.
 */
import { execute, query } from './database';

// ───── Grupos ─────────────────────────────────────────────────────────────

export async function createGroup(name, participantNames) {
  const cleanName = (name ?? '').trim();
  if (!cleanName) throw new Error('El nombre del grupo es obligatorio.');
  const cleanParticipants = (participantNames ?? [])
    .map((p) => (p ?? '').trim())
    .filter(Boolean);
  if (cleanParticipants.length < 2) {
    throw new Error('Se necesitan al menos 2 participantes.');
  }

  const result = await execute(
    'INSERT INTO groups (name) VALUES (?);',
    [cleanName]
  );
  const groupId = result?.lastInsertRowId ?? result?.insertId;
  if (!groupId) throw new Error('No se pudo crear el grupo.');

  for (const pname of cleanParticipants) {
    await execute(
      'INSERT INTO participants (group_id, name) VALUES (?, ?);',
      [groupId, pname]
    );
  }
  return groupId;
}

export async function listGroups() {
  return query(`
    SELECT
      g.id,
      g.name,
      g.created_at,
      (SELECT COUNT(*) FROM participants p WHERE p.group_id = g.id)        AS participant_count,
      COALESCE((SELECT SUM(e.amount) FROM expenses e WHERE e.group_id = g.id), 0) AS total_spent
    FROM groups g
    ORDER BY g.created_at DESC;
  `);
}

export async function getGroup(groupId) {
  const rows = await query('SELECT * FROM groups WHERE id = ?;', [groupId]);
  return rows[0] ?? null;
}

export async function deleteGroup(groupId) {
  await execute('DELETE FROM groups WHERE id = ?;', [groupId]);
}

// ───── Participantes ──────────────────────────────────────────────────────

export async function listParticipants(groupId) {
  return query(
    'SELECT id, group_id, name FROM participants WHERE group_id = ? ORDER BY id ASC;',
    [groupId]
  );
}

// ───── Gastos ─────────────────────────────────────────────────────────────

export async function addExpense({ groupId, payerId, amount, description }) {
  if (!groupId) throw new Error('Falta el grupo.');
  if (!payerId) throw new Error('Selecciona quién pagó.');
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    throw new Error('El monto debe ser un número mayor a cero.');
  }

  const result = await execute(
    `INSERT INTO expenses (group_id, payer_id, amount, description)
     VALUES (?, ?, ?, ?);`,
    [groupId, payerId, amt, (description ?? '').trim() || null]
  );
  return result?.lastInsertRowId ?? result?.insertId;
}

export async function updateExpense({ id, payerId, amount, description }) {
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    throw new Error('El monto debe ser un número mayor a cero.');
  }
  await execute(
    `UPDATE expenses
        SET payer_id = ?, amount = ?, description = ?
      WHERE id = ?;`,
    [payerId, amt, (description ?? '').trim() || null, id]
  );
}

export async function deleteExpense(id) {
  await execute('DELETE FROM expenses WHERE id = ?;', [id]);
}

export async function listExpenses(groupId) {
  return query(
    `SELECT
        e.id,
        e.group_id,
        e.payer_id,
        e.amount,
        e.description,
        e.created_at,
        p.name AS payer_name
      FROM expenses e
      JOIN participants p ON p.id = e.payer_id
     WHERE e.group_id = ?
     ORDER BY e.created_at DESC, e.id DESC;`,
    [groupId]
  );
}

// ───── Preferencias clave/valor ───────────────────────────────────────────

export async function getSetting(key) {
  const rows = await query('SELECT value FROM app_settings WHERE key = ?;', [key]);
  return rows[0]?.value ?? null;
}

export async function setSetting(key, value) {
  await execute(
    `INSERT INTO app_settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    [key, String(value)]
  );
}
