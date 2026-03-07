# 2. Core User Experience

## 2.1 Defining Experience

**La Experiencia Definitoria: "Reportar Avería en 30 Segundos"**

La interacción core que define **gmao-hiansa** es **"Reportar avería en 30 segundos y recibir confirmación inmediata que mi voz fue escuchada"**.

Esta experiencia es el make-or-break del sistema:
- Si Carlos reporta rápido → Sistema tiene datos → KPIs funcionan → Departamento se profesionaliza
- Si Carlos NO reporta → Sistema sin datos → KPIs vacíos → Proyecto falla

**Analogías con productos famosos:**
- Tinder: "Swipe para matchear" → gmao-hiansa: "Reportar en 30s"
- Spotify: "Play música instantánea" → gmao-hiansa: "Confirmación instantánea"
- WhatsApp: "Check azul ✓" → gmao-hiansa: "Aviso #456 recibido"

**Por qué esta experiencia es definitoria:**
1. Es el punto de entrada de todos los datos del sistema
2. Es la interacción más frecuente (múltiples reportes por turno)
3. Determina si los usuarios adoptan o resisten el sistema
4. Genera el "momento ¡Aha!" que crea lealtad: "¡Me escucharon!"

## 2.2 User Mental Model

**Mental Model Actual (Proceso Manual):**

Carlos piensa: "Reportar avería = perdida de tiempo, nadie hace caso"

**Proceso actual:**
1. Detecta falla → Siente resistencia
2. Busca a Javier o manda WhatsApp
3. No recibe confirmación → "Igual que siempre"
4. No sabe qué pasó → "¿Valió la pena?"

**Creencias actuales:**
- "Nadie hace caso de todos modos"
- "Es más fácil decirle a Javier en persona"
- "WhatsApp es más rápido que cualquier sistema"

---

**Mental Model Deseado (gmao-hiansa):**

Carlos piensa: "Reportar avería = 30 segundos, rápido y fácil, mi voz importa"

**Proceso deseado:**
1. Detecta falla → Abre app
2. Búsqueda predictiva sugiere equipo en <200ms
3. Describe + envía en <30 segundos
4. Recibe confirmación <3s: "✓ Aviso #456 recibido"
5. 10 min después: "Tu aviso fue autorizado. OT asignada a María"
6. Piensa: "¡Me escucharon! Vale la pena reportar"

**Creencias deseadas:**
- "El sistema me escucha y me da feedback"
- "Es más rápido que WhatsApp"
- "Vale la pena reportar"
- "Mi voz importa"

**Cambio de comportamiento:**
- De: Resistencia → "¿Para qué reportar?"
- A: Entusiasmo → "¡Reporto en 30 segundos y me escuchan!"

## 2.3 Success Criteria

**Criterios de Éxito de la Experiencia Core:**

**1. Confirmación Visual Inmediata**

**Qué dicen los usuarios:** "¡Wow! Esto es rápido. Mejor que WhatsApp."

**Feedback de éxito:**
- <3 segundos recibe: "✓ Aviso #456 recibido. Gracias por tu reporte."
- Número de aviso personalizado → "¡Funcionó!"
- Sistema responde → "Confío en esto"

**Velocidad objetivo:** <3 segundos (instantáneo)

**Automático:**
- Sistema busca equipo predictivamente
- Sistema genera número de aviso único
- Sistema envía confirmación push

---

**2. Notificaciones Push de Progreso**

**Qué dicen los usuarios:** "¡Me escucharon! Mi voz importa."

**Feedback de éxito:**
- 10 min: "Tu aviso #456 fue autorizado. OT asignada a María"
- 30 min: "María inició tu OT"
- 2 horas: "OT completada. ¿Confirma que funciona?"

**Velocidad objetivo:** <30 segundos desde evento

**Automático:**
- Sistema detecta cambio de estado
- Sistema envía notificación push
- Sistema actualiza dashboard KPIs

---

**3. Búsqueda Predictiva con Contexto**

**Qué dicen los usuarios:** "Encontré el equipo en 5 segundos. Increíble."

**Feedback de éxito:**
- Escribe "pren" → "Prensa PH-500 (Panel Sandwich, Línea 2)"
- Highlighting: "**Pren**sa PH-500"
- Contexto: Ubicación, estado actual, última avería

**Velocidad objetivo:** <200ms respuestas

**Automático:**
- Sistema busca en jerarquía de 5 niveles
- Sistema cachea búsquedas frecuentes
- Sistema prioriza equipos recientes del usuario

## 2.4 Novel UX Patterns

**Análisis: Combinación de Patrones Establecidos + Innovación**

**gmao-hiansa combina patrones establecidos de forma innovadora:**

**Patrones Establecidos (que usuarios ya conocen):**

**1. Search Predictive (Google Maps, Amazon)**
- **Lo que conocen:** Autocomplete con suggestions
- **gmao-hiansa innova:** Añade contexto jerárquico (ubicación en planta, estado actual, historial)
- **Resultado:** Búsqueda <200ms con más contexto que Google Maps/Amazon

**2. Push Notifications (WhatsApp, Telegram)**
- **Lo que conocen:** Notificaciones con preview
- **gmao-hiansa innova:** Añade contexto de mantenimiento (número de OT, estado, técnicos)
- **Resultado:** Notificaciones más informativas que WhatsApp

**3. Confirmación Visual (Check Azul ✓ de WhatsApp)**
- **Lo que conocen:** Confirmación inmediata
- **gmao-hiansa innova:** Añade número de referencia + mensaje de gratitude
- **Resultado:** Confirmación más personal que WhatsApp

---

**Patrones Novedosos (que requieren educación mínima):**

**1. Modal ℹ️ con Timeline Visual**
- **Es diferente:** Modal con timeline vertical de toda la historia de la OT
- **Cómo enseñamos:** Tooltip "ℹ️ Ver detalles" + primer uso con walkthrough
- **Metáforas familiares:** Timeline de redes sociales (Twitter, Instagram)
- **Resultado:** Javier tiene toda la info en 1 clic (vs navegar 3-4 pantallas en ERPs)

**2. Kanban de 8 Columnas con Código de Colores**
- **Es diferente:** 8 columnas vs 3-5 en Trello/Asana
- **Cómo enseñamos:** Tutorial de 30 segundos + filtros para simplificar vista
- **Metáforas familiares:** Kanban de Trello + Código de colores de GitHub
- **Resultado:** Control visual de carga de equipo sin llamar técnicos

## 2.5 Experience Mechanics

**Flujo Paso a Paso: "Reportar Avería en 30 Segundos"**

**1. Iniciación (0-5 segundos)**

**Cómo empieza el usuario:**
- Carlos abre app → ve botón prominente "+ Nueva Avería" (bottom center, FAB style)
- **Alternativa:** Carlos arrastra hacia abajo (pull-to-refresh) → "Reportar avería"

**Triggers que inician:**
- Push notification: "Buenos días, Carlos. ¿Necesitas reportar alguna avería?"
- Time-based: "¿Funciona todo bien con tus equipos asignados?"
- Location-based: "Estás cerca de Perfiladora P-201. ¿Algún problema?"

**Design rationale:** Múltiples puntos de entrada para maximizar adopción

---

**2. Interacción (5-25 segundos)**

**Paso 1: Tocar "+ Nueva Avería" (5 segundos)**
- Botón FAB (Floating Action Button) bottom center
- Azul Hiansa (#2563eb) con icono ➕
- Touch target 48x48px (WCAG AA compliance)

**Paso 2: Seleccionar Equipo con Búsqueda Predictiva (10 segundos)**
- Input: "Buscar equipo (ej: prensa, perfiladora)"
- Escribe "pren" → sistema sugiere en <200ms:
  - **Prensa PH-500** (Panel Sandwich, Línea 2)
  - Prensa PH-600 (Panel Sandwich, Línea 3)
- Highlighting de término: "**Pren**sa PH-500"
- Toca suggestion → autocompleta campo

**Paso 3: Describir Falla (10 segundos, opcional)**
- Textarea: "Describe brevemente la falla (opcional)"
- Placeholder: "Ej: No arranca, hace ruido raro, sobretemperatura..."
- Opcional: Botón "Adjuntar foto" (1 toque)

**Paso 4: Enviar (5 segundos)**
- Botón primario "Enviar" (azul Hiansa, derecha)
- Botón secundario "Cancelar" (gris, izquierda)

---

**3. Feedback (<3 segundos)**

**Qué indica éxito:**
- Toast notification aparece: "✓ Aviso #456 recibido. Gracias por tu reporte."
- Toast desaparece después de 5 segundos
- Botón "+ Nueva Avería" → reemplazado por "¡Reportado! #456"

**Cómo saben que funciona:**
- Número de aviso único → "¡Funcionó!"
- Toast con icono ✓ verde
- Dashboard actualiza "Mis Avisos Recientes"

**Errores y recovery:**
- Sin equipo seleccionado → "Selecciona un equipo antes de enviar"
- Sin conexión → "Sin conexión. Reintentando..." + reintenta automáticamente
- Timeout >10s → "Error al enviar. Reintentar?" + botón "Reintentar"

---

**4. Completación (30+ segundos)**

**Cómo saben que terminaron:**
- Toast desaparece → Dashboard muestra nuevo aviso #456 en lista
- Opción: "¿Necesitas reportar otra avería?" (no intrusivo)

**Resultado exitoso:**
- Carlos piensa: "¡Listo! 30 segundos y mi reporte está en el sistema."
- Carlos siente: "Siento que mi voz importa."
- Carlos ve: Número de aviso #456 + Toast con confirmación

**Qué sigue:**
- **Default:** Volver al dashboard
- **Opción A:** Reportar otra avería (botón secundario)
- **Opción B:** Ver detalles del aviso (toca tarjeta en dashboard)
