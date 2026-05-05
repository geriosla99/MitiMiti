/**
 * Pruebas básicas de la lógica de cálculo (Node, sin React Native).
 *
 * Cómo ejecutar:
 *   node tests/settlement.test.js
 *
 * Cubre:
 *  - Cálculo correcto de balances.
 *  - Caso "todos al día".
 *  - Algoritmo de simplificación de deudas.
 *  - Manejo de centavos al dividir cifras no divisibles.
 *  - Caso borde: grupo vacío.
 */

// Cargamos el módulo ES como CommonJS via require dinámico simple.
// Como el archivo usa "export", Node 20+ acepta --experimental-vm-modules,
// pero para no depender de eso re-exportamos manualmente con un loader simple.
//
// Truco: leemos el archivo, sustituimos `export ` por `module.exports.X = X`,
// y lo evaluamos. No es elegante pero permite probar sin dependencias.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadEsModule(relPath) {
  const src = fs.readFileSync(path.join(__dirname, '..', relPath), 'utf8');
  // Transformación mínima de ESM → CJS apta para esta lógica pura.
  let transformed = src
    .replace(/export\s+function\s+(\w+)/g, 'function $1; exports.$1 = $1; function $1')
    .replace(
      /export\s+const\s+(\w+)\s*=/g,
      'const $1 = exports.$1 ='
    );
  // Ajuste: el primer reemplazo deja "function name; exports.name = name; function name(...)"
  // que es válido pero feo. Lo reescribimos más limpio en una segunda pasada.
  transformed = src
    .replace(/export\s+function\s+(\w+)/g, 'exports.$1 = function $1')
    .replace(/export\s+const\s+(\w+)\s*=/g, 'exports.$1 =');
  const exports = {};
  const sandbox = { exports, module: { exports }, console };
  vm.createContext(sandbox);
  vm.runInContext(transformed, sandbox);
  return sandbox.exports;
}

const { computeSummary } = loadEsModule('src/logic/calculations.js');

// ───── micro framework ─────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assertEq(actual, expected, msg) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    passed += 1;
    console.log(`  ✓ ${msg}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${msg}`);
    console.error(`    expected: ${JSON.stringify(expected)}`);
    console.error(`    actual:   ${JSON.stringify(actual)}`);
  }
}

function assertClose(actual, expected, msg, eps = 0.01) {
  if (Math.abs(actual - expected) <= eps) {
    passed += 1;
    console.log(`  ✓ ${msg}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${msg}: esperado ${expected}, obtenido ${actual}`);
  }
}

function test(name, fn) {
  console.log(`\n• ${name}`);
  fn();
}

// ───── Casos de prueba ─────────────────────────────────────────────────────

test('caso simple de 3 personas — Ana paga la cena', () => {
  const participants = [
    { id: 1, name: 'Ana' },
    { id: 2, name: 'Beto' },
    { id: 3, name: 'Carlos' },
  ];
  const expenses = [{ id: 1, payer_id: 1, amount: 90 }];
  const r = computeSummary(participants, expenses);

  assertClose(r.total, 90, 'total = 90');
  assertClose(r.perPerson, 30, 'cuota por persona = 30');
  // Ana pagó 90, le tocaba 30 → balance +60
  assertClose(r.balances[0].balance, 60, 'Ana balance = +60');
  // Beto y Carlos pagaron 0, le tocaba 30 → balance -30 cada uno
  assertClose(r.balances[1].balance, -30, 'Beto balance = -30');
  assertClose(r.balances[2].balance, -30, 'Carlos balance = -30');

  // Settlements esperados: 2 transferencias hacia Ana
  assertEq(r.settlements.length, 2, 'hay 2 transferencias');
  const totals = r.settlements.reduce((acc, s) => acc + s.amount, 0);
  assertClose(totals, 60, 'suma de transferencias = 60');
});

test('todos al día (cada quien paga su cuota exacta)', () => {
  const participants = [
    { id: 1, name: 'Ana' },
    { id: 2, name: 'Beto' },
  ];
  const expenses = [
    { id: 1, payer_id: 1, amount: 50 },
    { id: 2, payer_id: 2, amount: 50 },
  ];
  const r = computeSummary(participants, expenses);
  assertClose(r.total, 100, 'total = 100');
  assertEq(r.settlements.length, 0, 'no hay transferencias');
});

test('división con resto (33.33 + 33.33 + 33.34)', () => {
  // 100 / 3 = 33,33 con resto. La suma de cuotas debe igualar el total.
  const participants = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
  ];
  const expenses = [{ id: 1, payer_id: 1, amount: 100 }];
  const r = computeSummary(participants, expenses);

  const sumOfShares = r.balances.reduce((acc, b) => acc + b.share, 0);
  assertClose(sumOfShares, 100, 'la suma de cuotas individuales = total');

  const sumOfBalances = r.balances.reduce((acc, b) => acc + b.balance, 0);
  assertClose(sumOfBalances, 0, 'la suma de balances = 0 (sistema cerrado)');
});

test('múltiples gastos y pagadores', () => {
  const participants = [
    { id: 1, name: 'Ana' },
    { id: 2, name: 'Beto' },
    { id: 3, name: 'Carlos' },
    { id: 4, name: 'Dani' },
  ];
  const expenses = [
    { id: 1, payer_id: 1, amount: 200 }, // Ana cena
    { id: 2, payer_id: 2, amount: 80 },  // Beto taxi
    { id: 3, payer_id: 3, amount: 120 }, // Carlos hotel
  ];
  const r = computeSummary(participants, expenses);
  assertClose(r.total, 400, 'total = 400');
  assertClose(r.perPerson, 100, 'cuota = 100');
  assertClose(r.balances[0].balance, 100, 'Ana +100');
  assertClose(r.balances[1].balance, -20, 'Beto -20');
  assertClose(r.balances[2].balance, 20, 'Carlos +20');
  assertClose(r.balances[3].balance, -100, 'Dani -100');

  // Sin importar la simplificación exacta, todas las transferencias deben
  // dejar a todos en cero.
  const finalBalances = new Map(r.balances.map((b) => [b.id, b.balance]));
  for (const s of r.settlements) {
    finalBalances.set(s.fromId, finalBalances.get(s.fromId) + s.amount);
    finalBalances.set(s.toId, finalBalances.get(s.toId) - s.amount);
  }
  for (const [, v] of finalBalances) {
    assertClose(v, 0, `participante queda en 0 tras settlements`);
  }
});

test('grupo vacío (sin participantes)', () => {
  const r = computeSummary([], []);
  assertEq(r, { total: 0, perPerson: 0, balances: [], settlements: [] }, 'resumen vacío');
});

test('sin gastos pero con participantes', () => {
  const r = computeSummary(
    [
      { id: 1, name: 'X' },
      { id: 2, name: 'Y' },
    ],
    []
  );
  assertClose(r.total, 0, 'total = 0');
  assertEq(r.settlements.length, 0, 'sin transferencias');
});

// ───── Resumen ─────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`Resultados: ${passed} OK · ${failed} ✗`);
if (failed > 0) {
  process.exit(1);
}
