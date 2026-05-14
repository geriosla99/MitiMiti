/**
 * database.js
 *
 * Encapsula la conexión SQLite y la definición del esquema.
 * Ningún otro módulo debe importar 'expo-sqlite' directamente; todo el
 * acceso pasa por aquí o por repository.js.
 *
 * Esquema:
 *   groups        (id, name, created_at)
 *   participants  (id, group_id, name)
 *   expenses      (id, group_id, payer_id, amount, description, created_at)
 *   app_settings  (key, value)            -- preferencias simples
 */
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'divisor_gastos.db';
let _db = null;

/**
 * Devuelve la instancia (singleton) de la base de datos.
 * Soporta tanto la API nueva (openDatabaseAsync, SDK 50+) como la
 * clásica (openDatabase) para mantener compatibilidad.
 */
export async function getDb() {
  if (_db) return _db;

  if (typeof SQLite.openDatabaseAsync === 'function') {
    _db = await SQLite.openDatabaseAsync(DB_NAME);
  } else {
    _db = SQLite.openDatabase(DB_NAME);
  }
  return _db;
}

/**
 * Helper unificado para correr una sentencia que NO devuelve filas
 * (CREATE, INSERT, UPDATE, DELETE).
 */
export async function execute(sql, params = []) {
  const db = await getDb();
  if (typeof db.runAsync === 'function') {
    return db.runAsync(sql, params);
  }
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (err) => reject(err)
    );
  });
}

/**
 * Helper unificado para SELECT que devuelve filas.
 */
export async function query(sql, params = []) {
  const db = await getDb();
  if (typeof db.getAllAsync === 'function') {
    return db.getAllAsync(sql, params);
  }
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          params,
          (_, { rows }) => resolve(rows._array ?? []),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (err) => reject(err)
    );
  });
}

/**
 * Crea las tablas si no existen. Idempotente — se puede llamar en cada arranque.
 */
export async function initDatabase() {
  await execute('PRAGMA foreign_keys = ON;');

  await execute(`
    CREATE TABLE IF NOT EXISTS groups (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS participants (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id  INTEGER NOT NULL,
      name      TEXT    NOT NULL,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS expenses (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id     INTEGER NOT NULL,
      payer_id     INTEGER NOT NULL,
      amount       REAL    NOT NULL CHECK (amount > 0),
      description  TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
      FOREIGN KEY (payer_id) REFERENCES participants(id) ON DELETE RESTRICT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key    TEXT PRIMARY KEY,
      value  TEXT
    );
  `);

  await execute(
    `CREATE INDEX IF NOT EXISTS idx_participants_group ON participants(group_id);`
  );
  await execute(
    `CREATE INDEX IF NOT EXISTS idx_expenses_group ON expenses(group_id);`
  );
}

/**
 * SOLO para desarrollo o tests: borra todas las tablas.
 */
export async function resetDatabase() {
  await execute('DROP TABLE IF EXISTS expenses;');
  await execute('DROP TABLE IF EXISTS participants;');
  await execute('DROP TABLE IF EXISTS groups;');
  await execute('DROP TABLE IF EXISTS app_settings;');
  await initDatabase();
}
