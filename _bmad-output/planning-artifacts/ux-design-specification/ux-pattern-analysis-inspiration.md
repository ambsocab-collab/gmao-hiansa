# UX Pattern Analysis & Inspiration

## Inspiring Products Analysis

**Análisis de Productos Inspiradores para gmao-hiansa**

Basado en el contexto de una aplicación industrial de mantenimiento (GMAO), he identificado productos que los usuarios objetivo ya conocen y aman, cuyos patrones UX podemos adaptar.

---

## 1. WhatsApp / Telegram (Comunicación y Notificaciones)

**Lo que hacen bien:**
- **Confirmación visual inmediata:** Check azul ✓ aparece al enviar mensaje
- **Notificaciones push no intrusivas:** Preview del mensaje sin abrir la app
- **Timestamps claros:** "Hace 5 min", "12:30", "Ayer"
- **Estados de mensaje:** Enviado → Entregado → Leído (dos checks azules)
- **Search predictivo:** Encuentra conversaciones <200ms
- **Feedback de estado:** "Escribiendo...", "En línea", "Visto por última vez..."

**Aplicación a gmao-hiansa:**
- Confirmación <3s tras reportar avería (como check azul ✓)
- Notificaciones push: "Tu aviso #456 fue autorizado. OT asignada a María"
- Estados de OT: Recibido → Autorizado → En Progreso → Completado
- Búsqueda predictiva de equipos <200ms

---

## 2. Trello / Asana (Gestión de Tareas y Kanban)

**Lo que hacen bien:**
- **Kanban visual:** Drag-and-drop entre columnas
- **Código de colores:** Labels y etiquetas visuales
- **Modal ℹ️ con toda la info:** Click en tarjeta → modal con detalles
- **Asignación visual:** Dropdown con avatares de usuarios
- **Filtros rápidos:** Por etiqueta, usuario, fecha
- **Timeline de actividad:** Historial de cambios en la tarjeta

**Aplicación a gmao-hiansa:**
- Kanban de 8 columnas con drag-and-drop
- 7 tipos de OT con código de colores
- Modal ℹ️ con timeline visual de la OT
- Asignación con avatares de técnicos (1-3 técnicos o proveedor)
- Filtros por estado, técnico, fecha, tipo, equipo

---

## 3. Amazon (Búsqueda y Catálogo)

**Lo que hacen bien:**
- **Búsqueda predictiva con suggestions:** "pren" → "Prensa hidráulica industrial..."
- **Autocomplete con contexto:** Muestra categoría, precio, rating
- **Historial de búsqueda:** "Buscasto recientemente: rodamiento SKF"
- **Filtros laterales:** Categoría, precio, marca, rating
- **Reviews y ratings:** Estrellas + número de reseñas
- **Stock visible:** "Quedan 3 unidades" + "Envío gratis"

**Aplicación a gmao-hiansa:**
- Búsqueda predictiva: "pren" → "Prensa PH-500 (Panel Sandwich, Línea 2)"
- Suggestions con: ubicación en planta, estado actual, última avería
- Filtros por planta, línea, tipo de equipo
- Stock visible: "Rodamiento SKF-6208 (Stock: 12, 📍 Estante A3, Cajón 3)"
- Historial del equipo: "Última avería: hace 3 días"

---

## 4. Google Maps (Search y Ubicación)

**Lo que hacen bien:**
- **Búsqueda predictiva <200ms:** Empieza a escribir → suggestions inmediatas
- **Autocomplete con ubicación:** "Prensa" → "Prensa industrial [Dirección]"
- **Historial reciente:** "Buscasto recientemente: Plaza de Mayo"
- **Modos de transporte:** Auto 🚗, Caminar 🚶, Transporte 🚌
- **Info en modal ℹ️:** Click en lugar → dirección, teléfono, horarios
- **Reviews con fotos:** "4.5 ⭐ (123 reseñas)"

**Aplicación a gmao-hiansa:**
- Búsqueda predictiva <200ms con autocomplete jerárquico
- Suggestions con: ubicación en planta, estado actual, historial
- Modal ℹ️ con: ubicación, teléfono del proveedor, historial de OTs
- Stock con ubicación física: "📍 Estante A3, Cajón 3"

---

## 5. Google Analytics / Strava (Dashboards y KPIs)

**Lo que hacen bien:**
- **Dashboard con trending icons:** MTTR ↓15% (icono flecha verde), MTBF ↑8% (flecha arriba)
- **Drill-down:** Click en métrica → Planta → Línea → Equipo
- **Comparación temporal:** "vs mes anterior", "vs año pasado"
- **Gráficos interactivos:** Hover para ver valores exactos
- **Exportar datos:** Botón "Exportar a Excel/CSV"
- **Alertas:** "MTFR aumentó 20% esta semana"

**Aplicación a gmao-hiansa:**
- Dashboard KPIs: MTTR 4.2h (↓15% vs mes anterior), MTBF 127h (↑8%)
- Drill-down: Global → Planta Panel → Línea 2 → Prensa PH-500
- Gráficos de OTs por semana, tiempos de reparación
- Exportar a Excel: .xlsx con hojas separadas por KPI
- Alertas accionables: Stock mínimo, MTFR alto, rutinas no completadas

## Transferable UX Patterns

**Patrones de Navegación**

**1. Bottom Navigation (Mobile) - De WhatsApp/Telegram**

**Patrón:** Navegación inferior con 4-5 iconos (Chats, Estados, Llamadas, Configuración)

**Aplicación a gmao-hiansa:**
- Móvil <768px → Bottom nav con 5 items: Home, OTs, Activos, Repuestos, KPIs
- Touch targets 44x44px (WCAG AA compliance)
- Icon con label + badge de notificaciones (ej: OTs (5))

**Por qué funciona:** Carlos puede navegar con una mano, touch targets accesibles

---

**2. Lateral Navigation (Desktop) - De Trello/Asana**

**Patrón:** Sidebar izquierdo con navegación principal

**Aplicación a gmao-hiansa:**
- Desktop >1200px → Nav lateral con 7 items: Dashboard, Kanban, Mis OTs, Activos, Stock, KPIs, Usuarios
- Colapsable a iconos solo
- Highlight de módulo activo

**Por qué funciona:** Elena y Javier tienen acceso rápido a todos los módulos

---

**3. Tab Bar with Badges - De Gmail/Slack**

**Patrón:** Pestañas con número de notificaciones (ej: "Chats (3)")

**Aplicación a gmao-hiansa:**
- "Mis OTs" → badge con número de OTs asignadas (ej: "Mis OTs (5)")
- "Kanban" → badge con OTs pendientes de triage (ej: "Kanban (12)")
- "Stock" → badge con ítems críticos (ej: "Stock (3)")

**Por qué funciona:** María ve rápidamente cuántas OTs tiene asignadas

---

**Patrones de Interacción**

**1. Drag-and-Drop con Visual Feedback - De Trello**

**Patrón:** Arrastrar tarjeta → sombra + opacidad → drop zone highlight → soltar

**Aplicación a gmao-hiansa:**
- Javier arrastra OT "Pendiente" → tarjeta se vuelve semitransparente
- Columna "Asignada" se highlight (border + fondo sutil)
- Soltar → dropdown "Asignar a:" aparece
- Undo automático (5 segundos) por si acaso

**Por qué funciona:** Asignación visual en 5 segundos vs formulario de 2-3 minutos

---

**2. Search Predictive con Autocomplete - De Google Maps/Amazon**

**Patrón:** Escribir 3 caracteres → suggestions inmediatas con contexto

**Aplicación a gmao-hiansa:**
- Carlos escribe "pren" (3 caracteres)
- Sistema muestra: "Prensa PH-500 (Panel Sandwich, Línea 2, Última avería: hace 3 días)"
- Highlighting de término buscado: "**Pren**sa PH-500"
- Flechas arriba/abajo + Enter para selección rápida

**Por qué funciona:** Reporte de avería en 30 segundos vs 2-5 minutos actuales

---

**3. Modal ℹ️ con Info Completa - De Trello/Google Maps**

**Patrón:** Click en tarjeta → modal con toda la información en 1 lugar

**Aplicación a gmao-hiansa:**
- Javier ve tarjeta OT en Kanban → toca icono ℹ️
- Modal scrollable con timeline vertical:
  - 09:03 - Carlos reportó avería
  - 09:10 - Javier autorizó OT
  - 09:12 - Asignado a María + Juan
  - 09:15 - María inició OT
  - En progreso - Repuestos usados: Rodamiento SKF-6208 (Stock: 11)
  - ETA: 12:00 - Completado

**Por qué funciona:** Javier responde "¿Qué pasa con la Prensa?" en 10 segundos

---

**4. Push Notifications con Acción - De WhatsApp/Telegram**

**Patrón:** Notificación con preview + acción (responder, marcar como leído)

**Aplicación a gmao-hiansa:**
- Notificación: "Tu aviso #456 fue autorizado. OT asignada a María"
- Carlos toca notificación → App abre directamente en OT #456
- Botones de acción rápida: "Confirmar que funciona" (Sí/No)

**Por qué funciona:** Carlos siente "mi voz importa" sin abrir la app

---

**5. Swipe Gestures - De Gmail/Mailbox**

**Patrón:** Swipe right = archivar, swipe left = borrar

**Aplicación a gmao-hiansa:**
- Móvil <768px: Swipe horizontal para cambiar columnas Kanban
- Swipe right → Siguiente columna (Pendiente → En Progreso)
- Swipe left → Columna anterior (En Progreso → Pendiente)
- Indicador visual: "1/3" (columna 1 de 3)

**Por qué funciona:** Carlos puede navegar Kanban con una mano

---

**Patrones Visuales**

**1. Código de Colores con Labels - De Trello/Asana**

**Patrón:** Colores semánticos + texto redundante (ej: 🔴 Urgente + texto)

**Aplicación a gmao-hiansa:**
- 7 tipos de OT con icon + color + texto:
  - 🌸 Rosa (Avería Triage) + "Avería"
  - ⚪ Blanco (Reparación Triage) + "Reparación"
  - 🟢 Verde (Preventivo) + "Preventivo"
  - 🔴 Rojizo (Correctivo propio) + "Correctivo"
  - 🔴📏 Rojo con línea (Correctivo externo viene) + "Externo"
  - 🟠 Naranja (Taller propio) + "Taller propio"
  - 🔵 Azul (Enviado a proveedor) + "Externo"

**Por qué funciona:** WCAG AA compliance, daltónicos pueden distinguir

---

**2. Avatar Stacks - De Slack/Asana**

**Patrón:** Avatares superpuestos (ej: "👤👤👤+2") para múltiples asignados

**Aplicación a gmao-hiansa:**
- OT con 3 técnicos → avatares superpuestos: [Avatar1][Avatar2][Avatar3]
- Si >3 técnicos → [Avatar1][Avatar2][Avatar3]+2
- Click en avatar stack → dropdown con todos los asignados

**Por qué funciona:** Javier ve rápidamente cuántos técnicos en cada OT

---

**3. Progress Indicators - De Uber/Strava**

**Patrón:** Barra de progreso + porcentaje (ej: "65% completado")

**Aplicación a gmao-hiansa:**
- OT en progreso → barra de progreso basada en tiempo estimado
- "Tiempo transcurrido: 45 min | Tiempo estimado: 2h | 37% completado"
- Color de progreso: Verde (en tiempo), Naranja (atrasado), Rojo (crítico)

**Por qué funciona:** María ve cuánto falta para completar OT

---

**4. Trending Icons - De Google Analytics**

**Patrón:** ⬆️ verde (mejora), ⬇️ rojo (empeor)

**Aplicación a gmao-hiansa:**
- MTTR 4.2h ⬇️ 15% (flecha hacia abajo verde - mejora)
- MTBF 127h ⬆️ 8% (flecha hacia arriba verde - mejora)
- OTs abiertas 23 ⬇️ 5 (flecha hacia abajo verde - mejora)

**Por qué funciona:** Elena ve rápidamente si KPIs mejoran o empeoran

## Anti-Patterns to Avoid

**Basado en el análisis de apps exitosas y el contexto de gmao-hiansa, identifico estos anti-patrones a evitar:**

**1. Formularios Largos con Múltiples Pantallas**

**Anti-patrón:** "Regístrate en 7 pasos" con datos innecesarios

**Por qué evitar:** Carlos abandonará si el reporte de avería toma >2 minutos

**Solución:** Formulario de 1 campo (equipo) + descripción + foto opcional → <30 segundos

**Apps que lo hacen bien:** WhatsApp (registro solo con número), Telegram (nombre opcional)

---

**2. Sin Confirmación Visual de Acciones**

**Anti-patrón:** Usuario toca "Guardar" → no pasa nada visible → "¿Se guardó?"

**Por qué evitar:** Genera escepticismo y duda en el sistema

**Solución:** Confirmación <3s: "✓ Aviso #456 recibido" + número de referencia

**Apps que lo hacen bien:** WhatsApp (check azul ✓), Gmail (Mensaje enviado)

---

**3. Información Fragmentada en Múltiples Pantallas**

**Anti-patrón:** Para ver detalles de OT, navegar 3-4 pantallas diferentes

**Por qué evitar:** Javier pierde tiempo respondiendo "¿Qué pasa con la Prensa?"

**Solución:** Modal ℹ️ con toda la información en 1 clic

**Apps que lo hacen bien:** Trello (modal con toda la info de la tarjeta), Google Maps (modal con lugar)

---

**4. Búsqueda Lenta sin Suggestions**

**Anti-patrón:** Usuario escribe nombre completo + Enter → spinner de carga >1 segundo

**Por qué evitar:** Carlos no reportará si tarda >2 minutos en buscar equipo

**Solución:** Búsqueda predictiva <200ms con autocomplete

**Apps que lo hacen bien:** Google Maps (suggestions inmediatos), Amazon (autocomplete con contexto)

---

**5. Código de Colores sin Texto Redundante**

**Anti-patrón:** Solo colores para diferenciar OTs (rojo, verde, naranja)

**Por qué evitar:** Daltónicos no pueden distinguir + ilegible en luz de fábrica

**Solución:** Icon + color + texto (🔴 Correctivo + "Correctivo")

**Apps que lo hacen bien:** Trello (labels con icon + color + texto), GitHub (labels con texto)

---

**6. Notificaciones Spam**

**Anti-patrón:** Notificación por cada acción de otros usuarios

**Por qué evitar:** Pedro ignorará todas las notificaciones si recibe spam por cada uso de repuesto

**Solución:** Notificaciones silenciosas (stock actualizado) + alertas solo stock mínimo

**Apps que lo hacen bien:** Slack (puedes silenciar canales), Gmail (notificaciones agrupadas)

---

**7. Sin Undo en Acciones Críticas**

**Anti-patrón:** Usuario arrastra OT a columna equivocada → no puede deshacer

**Por qué evitar:** Genera ansiedad y resistencia al uso de drag-and-drop

**Solución:** Undo automático (5 segundos) + botón "Deshacer"

**Apps que lo hacen bien:** Gmail (Undo 5 segundos después de enviar), Trello (undo de acciones)

## Design Inspiration Strategy

**Qué Adoptar:**

**1. Confirmación Visual Inmediata (WhatsApp/Telegram)**
- **Por qué:** Soporta objetivo emocional "Mi voz importa" (Validación)
- **Implementación:** Confirmación <3s con número de aviso tras reportar avería
- **Métrica de éxito:** Tasa de "first-time success" >95%

**2. Kanban Visual con Drag-and-Drop (Trello/Asana)**
- **Por qué:** Soporta objetivo emocional "Tengo el control" (Confianza)
- **Implementación:** 8 columnas con código de colores, asignación en 5 segundos
- **Métrica de éxito:** Tiempo de asignación <5 segundos

**3. Búsqueda Predictiva <200ms (Google Maps/Amazon)**
- **Por qué:** Soporta objetivo emocional "Eficiencia" (Productividad)
- **Implementación:** Autocomplete con contexto (ubicación, estado, historial)
- **Métrica de éxito:** Tiempo de búsqueda <200ms

**4. Modal ℹ️ con Toda la Info (Trello/Google Maps)**
- **Por qué:** Soporta principio "Menos clics = más productividad"
- **Implementación:** Timeline, técnicos, repuestos, proveedor en 1 clic
- **Métrica de éxito:** Tiempo de respuesta a consultas <30 segundos

**5. Código de Colores con Labels (Trello/Asana)**
- **Por qué:** WCAG AA compliance + ambiente industrial
- **Implementación:** Icon + color + texto para cada tipo de OT
- **Métrica de éxito:** Asignación correcta de técnicos >95%

---

**Qué Adaptar:**

**1. Bottom Navigation (WhatsApp) → Simplificar para Gmao**
- **Adaptación:** Solo 5 items (vs 4-5 en WhatsApp)
- **Por qué:** Carlos necesita acceso rápido: Home, OTs, Activos, Repuestos, KPIs
- **Implementación:** Bottom nav con icon + label + badges de notificaciones

**2. Push Notifications (WhatsApp) → Añadir Contexto de Mantenimiento**
- **Adaptación:** No solo "Mensaje recibido" sino "Tu aviso #456 fue autorizado. OT asignada a María."
- **Por qué:** Carlos necesita saber el progreso de su avería, no solo que fue recibida
- **Implementación:** Notificaciones con número de OT + estado + técnicos asignados

**3. Dashboards (Google Analytics) → Simplificar KPIs para Fábrica**
- **Adaptación:** Solo 4 KPIs core (MTTR, MTBF, OTs abiertas, Stock crítico) vs 20+ en Analytics
- **Por qué:** Elena necesita claridad, no sobrecarga de información
- **Implementación:** Dashboard público sin datos sensibles, drill-down para análisis avanzado

---

**Qué Evitar:**

**1. Onboarding Largo (Apps de Banca)**
- **Por qué:** Carlos abandonará si el tutorial toma >30 segundos
- **Solución:** Tutorial de 30 segundos + "Empecemos"
- **Alternativa:** Onboarding contextual (tooltips en primer uso)

**2. Múltiples Pantallas para Ver Detalles (ERPs Legados)**
- **Por qué:** Javier pierde tiempo buscando información
- **Solución:** Modal ℹ️ con toda la info en 1 clic
- **Alternativa:** Vista detallada opcional para casos raros

**3. Notificaciones Spam (Algunas Apps de Social)**
- **Por qué:** Pedro ignorará alertas importantes
- **Solución:** Notificaciones silenciosas + alertas solo stock mínimo
- **Alternativa:** Preferencias configurables por tipo de notificación
