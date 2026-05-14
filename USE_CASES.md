# 📚 Mitimiti — Casos de uso y pruebas de usabilidad

Documento complementario al `TESTING.md` (que es para verificar bugs técnicos). Aquí están las historias reales de uso y el protocolo para probar la app con usuarios sin guion.

---

## Parte 1: Casos de uso (user stories)

Cada caso responde tres preguntas:
- **¿Quién?** El tipo de usuario.
- **¿Cuándo y por qué?** El contexto donde la app aparece en su vida.
- **¿Qué espera lograr?** El resultado que busca.

Sirven como referencia para marketing, contenido en redes y validación con usuarios reales.

---

### Caso de uso 1 — Viaje grupal a la costa

**Quién:** Andrés, 27 años, vive en Bogotá, trabaja en marketing.

**Contexto:** Andrés organiza un viaje a Santa Marta con 5 amigos del trabajo. Cada uno va a aportar para hotel, transporte, comidas y plan de día. El plan es 4 noches.

**Por qué abre Mitimiti:** porque en el último viaje a Cartagena terminaron peleados porque "Carlos no había pagado la cena pero juraba que sí" y nadie supo cuánto debía exactamente al final. Esta vez quiere prevenir eso.

**Flujo esperado:**
1. Crea el grupo "Santa Marta con los del trabajo" con los 6 nombres.
2. Cada vez que alguien paga algo (Uber al aeropuerto, hotel, almuerzos), abre Mitimiti y registra el gasto.
3. Al final del viaje toca "Resumen" y le manda la captura por WhatsApp al grupo.

**Resultado esperado:** todos saben exactamente cuánto deben transferir y a quién. Nadie discute.

---

### Caso de uso 2 — Salida de rumba entre amigas

**Quién:** Valentina, 24 años, estudiante de derecho.

**Contexto:** sale con 3 amigas un sábado en la noche. Empiezan en un bar, luego van a un club, después a comer hamburguesas a las 3am. A veces una paga "el round" con su tarjeta y las demás le pasan después.

**Por qué abre Mitimiti:** porque siempre termina con notas en el celular tipo "Sofía 25, Luisa 18, Mariana 30" que después no entiende cuando se levanta con resaca.

**Flujo esperado:**
1. Crea grupo "Rumba 28 de junio" en el primer bar.
2. Va registrando cada cuenta a medida que pagan.
3. Al final, en el taxi de vuelta, ve el resumen y manda screenshots al grupo de WhatsApp.

**Resultado esperado:** al día siguiente sabe que Sofía le debe $43.000 y Luisa $35.000, y se los reclama por Nequi.

---

### Caso de uso 3 — Casa compartida (Airbnb)

**Quién:** Camila, 30 años, trabaja en una multinacional.

**Contexto:** 8 amigos alquilan una casa en Anapoima por 3 días. Cada uno va a aportar para el alquiler, la comida del mercado, gasolina si llevaron carro, y plan extra (piscina, club).

**Por qué abre Mitimiti:** porque dividir entre 8 personas con diferentes aportes es un infierno mental.

**Flujo esperado:**
1. Crea grupo "Casa Anapoima Octubre" con las 8 personas.
2. La persona que alquiló la casa registra el monto total.
3. Los que fueron al mercado registran sus compras.
4. Al final, varios deben a varios. Mitimiti calcula las transferencias mínimas.

**Resultado esperado:** en vez de 28 transferencias posibles (8 personas), solo necesitan hacer 3-4 transferencias entre ellas. El algoritmo de simplificación brilla aquí.

---

### Caso de uso 4 — Pareja que vive junta

**Quién:** Daniel y Laura, pareja de 29 y 27 años, viven juntos hace 6 meses.

**Contexto:** comparten gastos del apartamento — mercado, servicios, salidas. No tienen presupuesto formal pero quieren llevar un registro.

**Por qué abre Mitimiti:** para no convertir la "rolling balance" mental en peleas. Cada mes hacen "corte de cuenta".

**Flujo esperado:**
1. Crean un grupo "Apartamento - Octubre" con sus 2 nombres.
2. Cada vez que uno paga algo del apartamento, lo registra (mercado, gas, internet).
3. Al final del mes, ven el resumen: uno le debe al otro la diferencia, le transfiere por Nequi y empiezan octubre.

**Resultado esperado:** cuentas claras sin que se vuelva un tema emocional.

---

### Caso de uso 5 — Cena de cumpleaños del jefe

**Quién:** Andrea, 32 años, jefe de oficina.

**Contexto:** organiza una cena para el cumpleaños de su jefe con 12 colegas. La cena cuesta $1.500.000 entre todos pero no todos quieren aportar igual: los junior pagan menos, los senior más.

**Por qué abre Mitimiti hoy NO le funciona del todo:** porque la app divide equitativamente. Pero en la versión 2.0 (premium) con división por porcentajes sí.

**Estado actual:** Andrea sigue usando la calculadora del celular. Es un caso de uso que la versión Pro destrabaría.

**Aprendizaje:** este caso de uso valida que la división desigual es la feature #1 del premium futuro.

---

### Caso de uso 6 — Viaje familiar

**Quién:** Sandra, 45 años, mamá de 2 adolescentes.

**Contexto:** viaja con su esposo, los 2 hijos, sus papás y un hermano (7 personas total) a una finca por puente festivo.

**Por qué abre Mitimiti:** porque su mamá insiste en aportar a todo y al final del viaje nadie sabe cuánto pagó cada quien.

**Flujo esperado:** ella se vuelve la "tesorera" del viaje. Registra todo, y al final hace transferencias por Nequi a cada uno.

**Resultado esperado:** evita la conversación incómoda de "cuánto te debo, ma" y mantiene la armonía familiar.

---

### Caso de uso 7 — Salida de un día (caso de uso "ligero")

**Quién:** Luis, 22 años, estudiante.

**Contexto:** sale al parque de diversiones un domingo con 3 amigos. Compran tickets, almuerzan, juegan.

**Por qué abre Mitimiti:** porque uno de los amigos pagó las 4 boletas con su tarjeta y los otros 3 le tienen que pasar.

**Flujo esperado:**
1. Crea grupo rápido "Salitre Domingo".
2. Registra solo 2-3 gastos.
3. Ve el resumen, le toma 30 segundos.

**Resultado esperado:** caso de uso de "fast use" — entrar, hacer rápido, salir. Mitimiti tiene que servir tanto para viajes de 4 días como para salidas de 4 horas.

---

### Caso de uso 8 — Compartir un Uber largo

**Quién:** Mateo, 26 años, freelancer.

**Contexto:** él y 2 colegas comparten Uber al aeropuerto temprano. Costo: $80.000. Uno paga, los otros le deben.

**Por qué abre Mitimiti:** caso súper simple — un gasto, división entre 3, resultado obvio. Es el caso de uso de "entrada a la app". Le gusta tanto la experiencia que después la usa para algo más grande.

**Aprendizaje para marketing:** este es el caso de entrada perfecto. La app tiene que sentirse rápida para casos chiquitos para que la gente la conserve para los grandes.

---

## Parte 2: Pruebas de usabilidad

Esto es diferente de las pruebas de bugs. Aquí **observas a un usuario real usar la app SIN instrucciones**. Es la mejor forma de descubrir lo que no funciona en términos de UX.

### Cómo correr una sesión de usabilidad (45-60 min)

**Antes de la sesión:**

1. **Recluta 5-7 personas** del segmento objetivo (jóvenes 20-40 que viajan en grupo o salen con amigos). 5 personas detectan ~80% de los problemas de usabilidad, según Jakob Nielsen.
2. **Pídeles 1 hora** de su tiempo. Ofrece algo a cambio: un café, una comida, US$10 en una transferencia.
3. **Prepara tu celular** con la app instalada, en estado limpio (sin grupos creados).
4. **Prepara una hoja** para tomar notas o un Loom/Zoom abierto si es remoto.

**Durante la sesión:**

1. **Empieza con un calentamiento (5 min).** Pregúntale: "¿Has viajado con amigos últimamente? ¿Cómo dividen los gastos?" Esto te da contexto y a la persona la relaja.

2. **Pídele que piense en voz alta.** Frase exacta: "Voy a darte mi celular con una app. No te voy a guiar. Quiero que la uses como si la acabaras de bajar. **Todo lo que pienses, dilo en voz alta** — aunque sea 'esto me parece raro' o 'no sé qué hace este botón'. Yo no me voy a sentir mal, así me ayudas más."

3. **Pásale el celular** y dale UNA tarea, no más:
   - **Tarea 1**: "Imagina que vienes de un viaje a Cartagena con 3 amigos. Tú pagaste la cena que costó $90.000. Quiero que registres ese gasto en la app y me digas cuánto le debe cada amigo."

4. **No le ayudes.** Si pregunta "¿qué hago aquí?", devuélvele la pregunta: "¿Qué crees que deberías hacer?". Si se traba más de 30 segundos sin pista, di "¿Qué intentabas hacer?" — y ahí descubres dónde está rota la UX.

5. **Toma notas de:**
   - Dónde **dudó** (significa que la UI no es obvia).
   - Dónde **se equivocó** (botón mal etiquetado, acción inesperada).
   - Qué **palabras** usó vs. las que usa la app ("paseo" vs "viaje", "cuenta" vs "gasto", etc.).
   - Sus **expresiones faciales** (sonrisa = sorpresa positiva, ceño fruncido = confusión).
   - Lo que **dijo en voz alta**.

6. **Después de cada tarea, pregunta:**
   - "¿Qué te pareció eso?"
   - "¿Hubo algún momento donde no entendiste qué hacer?"
   - "¿Qué le cambiarías?"

7. **Tareas adicionales** si tienes tiempo:
   - **Tarea 2**: "Ahora agrega 2 gastos más, uno tuyo y uno de otra persona, y ve el resumen final."
   - **Tarea 3**: "Eliminaste por accidente el gasto correcto. ¿Cómo lo arreglarías?" (esto puede revelar que falta función de "deshacer").
   - **Tarea 4**: "Quieres mandar el resumen a tus amigos. ¿Cómo lo harías?" (revela que falta función de compartir).

**Después de la sesión:**

1. **Pregunta cerrada** (sirve para comparar entre testers):
   - "Del 1 al 10, ¿qué tan fácil te pareció usarla?"
   - "Del 1 al 10, ¿la recomendarías a un amigo?"
   - "¿Qué le pondrías para que fuera 10/10?"

2. **Documenta los hallazgos** en una hoja por tester con:
   - Nombre + edad + contexto (cómo viaja, con quién)
   - Tiempo total para completar tarea 1
   - Errores cometidos (lista numerada)
   - Confusiones (lista)
   - Palabras propias vs. las de la app
   - Sugerencias espontáneas
   - Score 1-10

3. **Después de 5 sesiones, busca patrones.** Si 3+ personas se traban en el mismo punto, ESO es lo que tienes que arreglar primero. Una sola persona puede estar teniendo un mal día.

### Métricas concretas a medir

| Métrica | Cómo medirla | Meta |
|---|---|---|
| **Time to first expense** | Cronómetro desde apertura hasta primer gasto guardado | < 90 segundos |
| **Task completion rate** | % de testers que terminan la tarea 1 sin ayuda | > 80% |
| **Error rate** | Número de toques "equivocados" promedio | < 3 por tarea |
| **SUS score** | Cuestionario estándar de 10 preguntas (System Usability Scale) | > 75 (sobre 100) |
| **Net Promoter Score** | "¿Recomendarías esto del 1 al 10?" | > 7 promedio |

### Errores típicos que vas a encontrar (predicciones)

Apuesto a que en tus primeras 5 sesiones encontrarás al menos 3 de estos:

1. **"¿Dónde se ven los gastos que ya agregué?"** — gente que no asocia "entrar al grupo" con ver la lista.
2. **"Pensé que el botón verde de abajo era para agregar gasto"** — confusión entre "Nuevo viaje" y "Agregar gasto" en distintos contextos.
3. **"¿Y cómo se borra esto?"** — long-press es invisible. La gente quiere un botón explícito.
4. **"¿El monto es por persona o el total?"** — duda al agregar gasto.
5. **"Y ahora, ¿cómo se lo mando a mis amigos?"** — falta función nativa de compartir.

Cualquiera de estos es accionable y mejora la retención significativamente. **Implementa los fixes y vuelve a probar con 3 personas nuevas** para verificar que ya no se traban.

---

## Parte 3: Cuestionario SUS (System Usability Scale)

Estándar de la industria. Pásaselo al tester después de la sesión. 10 preguntas en escala 1-5 (1 = muy en desacuerdo, 5 = muy de acuerdo):

1. Me gustaría usar Mitimiti frecuentemente.
2. Mitimiti me pareció innecesariamente complicada.
3. Mitimiti es fácil de usar.
4. Creo que necesitaría apoyo técnico para usar Mitimiti.
5. Las funciones de Mitimiti están bien integradas.
6. Encontré demasiadas inconsistencias en Mitimiti.
7. Imagino que la mayoría aprendería a usar Mitimiti rápidamente.
8. Mitimiti me pareció difícil de usar.
9. Me sentí confiado usando Mitimiti.
10. Necesité aprender muchas cosas antes de poder usar Mitimiti.

**Cómo calcular el score:**
- Preguntas impares (1, 3, 5, 7, 9): valor del tester − 1
- Preguntas pares (2, 4, 6, 8, 10): 5 − valor del tester
- Suma todos los valores y multiplica por 2.5
- Resultado: 0-100. Más es mejor.

Score interpretación:
- **> 80**: excelente, mejor que el 90% de los productos
- **68-80**: bueno, encima del promedio
- **50-68**: aceptable, necesita mejoras
- **< 50**: mala usabilidad, replantear UX

---

*Recuerda: 5 sesiones bien hechas valen más que 100 reseñas del Play Store. Los testers te dicen QUÉ está mal, pero un usuario real frente a la app te muestra POR QUÉ.*
