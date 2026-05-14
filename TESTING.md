# 🧪 Mitimiti — Guía para testers

¡Hola! Gracias por probar **Mitimiti**, la app que divide gastos en grupo "miti y miti".

Esta guía tiene 12 escenarios cortos. Te tomarán entre 15 y 30 minutos en total. Después hay un formulario corto al final para que nos cuentes cómo te fue.

**Cómo enviar feedback:**
- Toma capturas de pantalla si encuentras algo raro.
- Anota el número del caso donde falló.
- Mándanos todo a **soporte.mitimiti@gmail.com** o por WhatsApp al teléfono que te compartimos.

---

## 🟢 Casos básicos (lo que tiene que funcionar siempre)

### Caso 1 — Tutorial de bienvenida (solo primera vez)

1. Abre la app por primera vez.
2. Debe aparecer la pantalla de bienvenida con el logo "mitimiti" y la frase "Divide gastos, suma momentos."
3. Desliza hacia la izquierda 3 veces para ver los 4 pasos.
4. Toca **¡Empezar!** en el último paso.

**Lo que debe pasar:** llegas a la pantalla principal "Mis viajes" que está vacía.

---

### Caso 2 — Crear tu primer viaje

1. En la pantalla principal toca el botón verde **+ Nuevo viaje** abajo.
2. Pon como nombre: `Fin de semana en Cartagena`.
3. Agrega 3 participantes: `Ana`, `Beto`, `Carlos`.
4. Toca **Crear viaje**.

**Lo que debe pasar:** regresas a la lista y aparece el grupo "Fin de semana en Cartagena" con "3 participantes" y total "$ 0".

---

### Caso 3 — Registrar un gasto

1. Toca el grupo "Fin de semana en Cartagena" para entrar.
2. Toca **+ Agregar gasto** abajo.
3. Ingresa monto: `90000` (que sería $ 90.000).
4. Selecciona como pagador: **Ana** (el chip verde).
5. Descripción: `Cena del viernes`.
6. Toca **Guardar gasto**.

**Lo que debe pasar:** vuelves al detalle del grupo y ves el gasto con foto de Ana, monto $ 90.000, descripción "Cena del viernes". El total arriba dice $ 90.000.

---

### Caso 4 — Ver el resumen final

1. Desde el grupo, toca **📊 Resumen** abajo a la izquierda.

**Lo que debe pasar:** ves esta información:

- **Total del viaje:** $ 90.000
- **Cuota por persona:** $ 30.000
- **Balance por persona:**
  - Ana: pill verde "+$ 30.000" (porque pagó de más)... espera, en realidad debería decir **+$ 60.000** (pagó 90, le tocaba 30, le sobra 60).
  - Beto: pill rojo "−$ 30.000"
  - Carlos: pill rojo "−$ 30.000"
- **Quién le paga a quién:**
  - Beto le debe $ 30.000 a Ana
  - Carlos le debe $ 30.000 a Ana

**🔍 Cosa importante para verificar:** los balances tienen que sumar 0 (verde + rojos = cero). Si no suman cero, eso es un bug.

---

### Caso 5 — Múltiples gastos con múltiples pagadores

1. Vuelve atrás al grupo "Cartagena" (botón ← arriba).
2. Agrega 2 gastos más:
   - **Beto** paga `80000` ("Taxi al aeropuerto")
   - **Carlos** paga `120000` ("Hotel")
3. Ve al **Resumen**.

**Lo que debe pasar:**

- Total: $ 290.000
- Cuota: $ 96.667 (aproximadamente)
- Ana: pill verde positivo (pagó 90k, le tocaba 96.7k → debería estar casi en cero o ligeramente negativa).
- Verifica que la lista "Quién le paga a quién" sea coherente. Idealmente solo 2-3 transferencias máximo (no 6).

---

## 🟡 Casos avanzados (editar, eliminar, casos borde)

### Caso 6 — Editar un gasto

1. En el grupo "Cartagena", toca **el primer gasto** (Cena del viernes).
2. Cambia el monto a `120000`.
3. Toca **Guardar cambios**.

**Lo que debe pasar:** el gasto en la lista ahora muestra $ 120.000 y el total arriba del grupo se actualiza.

---

### Caso 7 — Eliminar un gasto

1. **Mantén presionado** el gasto del taxi (de Beto).
2. Aparece un diálogo "Eliminar gasto", toca **Eliminar**.

**Lo que debe pasar:** el gasto desaparece de la lista, el total se actualiza, el resumen se recalcula.

---

### Caso 8 — Crear un segundo grupo

1. Vuelve a "Mis viajes" (botón ← varias veces).
2. Crea otro viaje: nombre `Asado del domingo`, con 4 personas (`Tú`, `Mamá`, `Papá`, `Hermano`).
3. Agrega un gasto: tú pagas `50000` ("Carne").
4. Otro gasto: Papá paga `30000` ("Cerveza").
5. Ve al resumen.

**Lo que debe pasar:** Mitimiti maneja 2 grupos independientes sin mezclar datos. La lista principal muestra "2 viajes guardados".

---

### Caso 9 — Eliminar un grupo entero

1. En "Mis viajes", **mantén presionado** el grupo "Asado del domingo".
2. Confirma **Eliminar**.

**Lo que debe pasar:** el grupo y todos sus gastos se borran. Quedas con solo "Fin de semana en Cartagena".

---

### Caso 10 — Validaciones del formulario

Prueba estos 4 casos rápidos en "Nuevo viaje":

1. **Sin nombre:** deja el nombre vacío, intenta crear. Debe salir mensaje "Ingresa el nombre del viaje".
2. **1 solo participante:** pon nombre y solo 1 persona. Debe salir "Agrega al menos 2 participantes".
3. **Nombres repetidos:** agrega "Juan" y "juan". Debe salir "Cada participante debe tener un nombre único".
4. **Monto inválido:** en "Agregar gasto" pon monto 0 o vacío. Debe salir "Monto inválido".

**Lo que debe pasar:** la app no debería dejar guardar nada en estos casos y los mensajes deben ser claros.

---

## 🔴 Casos extremos (rompe la app si puedes)

### Caso 11 — Grupo grande con muchos gastos

1. Crea un viaje "Convención Familiar" con 8 participantes.
2. Agrega 15 gastos de distintos pagadores y montos variados.
3. Ve al resumen.

**Lo que debe pasar:** todo sigue fluido. La lista de gastos se debe poder desplazar (scroll) sin trabarse. El gráfico de barras debe mostrar las 8 personas. La lista de transferencias no debería ser desproporcionadamente larga (algoritmo de simplificación).

---

### Caso 12 — Permanencia de datos

1. Después de crear varios viajes y gastos, **cierra la app completamente** (no solo minimizarla — saca de las apps recientes).
2. Vuelve a abrirla.

**Lo que debe pasar:** todos tus viajes y gastos siguen ahí, exactamente como los dejaste. **El tutorial NO debería aparecer otra vez.**

---

### Caso 13 (bonus) — Reabrir el tutorial

1. En "Mis viajes", toca el botón **?** del header arriba a la derecha.

**Lo que debe pasar:** vuelve a aparecer el tutorial de 4 pantallas. Puedes saltarlo o verlo completo.

---

## 📊 Qué nos interesa especialmente

Por favor presta atención a estos 7 puntos mientras pruebas:

1. **¿Algo se ve raro visualmente?** Colores que no encajan, texto cortado, botones que no se ven bien.
2. **¿La app se siente lenta?** Si una pantalla tarda más de 1 segundo en cargar, dinos.
3. **¿Hay textos confusos?** Si tuviste que leer 2 veces para entender algo, eso es un problema.
4. **¿Algún cálculo te pareció raro?** Si los balances no cuadran con tu intuición, mándanos los números.
5. **¿La app se cerró sola en algún momento?** Esto es bug crítico — dinos qué hacías cuando pasó.
6. **¿Te perdiste en algún momento?** Si no supiste qué hacer en una pantalla, ese es un problema de UX.
7. **¿Le faltó algo importante?** Después de usarla, ¿qué función te gustaría que tuviera?

---

## 📝 Formulario de feedback (copia y llena)

Manda esto a **soporte.mitimiti@gmail.com** o por WhatsApp:

```
NOMBRE: 
CELULAR (marca y modelo): 
VERSIÓN ANDROID/iOS: 
TIEMPO TOTAL QUE USASTE LA APP: 

⭐ DE 1 A 10:
- Facilidad de uso: 
- Diseño visual: 
- Velocidad: 
- Utilidad real: 
- ¿La recomendarías a un amigo?: 

🐛 BUGS QUE ENCONTRÉ:
1. 
2. 

🤔 COSAS QUE NO ENTENDÍ O ME CONFUNDIERON:
1. 
2. 

✨ COSAS QUE ME GUSTARON:
1. 
2. 

💡 LO QUE LE FALTA / LO QUE AGREGARÍA:
1. 
2. 

😡 LO QUE QUITARÍA:
1. 

📍 ¿LA USARÍAS EN UN VIAJE REAL? ¿CUÁL?:

```

---

¡Gracias por ayudarnos a hacer Mitimiti mejor! 🤝

*Mitimiti — Divide gastos, suma momentos.*
