---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
inputDocuments: [
  'product-brief-gmao-hiansa-2026-02-26.md',
  'prd.md',
  'edge-cases-scenarios.md'
]
date: 2026-02-27
author: Bernardo
project_name: gmao-hiansa
workflowType: 'ux-design'
---

# UX Design Specification gmao-hiansa

**Author:** Bernardo
**Date:** 2026-02-27
**Last Updated:** 2026-03-07 (Actualización a 15 capacidades PBAC desde PRD 2026-03-07)

---

## ⚠️ IMPORTANTE - Actualización Sprint Change Proposal (2026-03-01, corregido 2026-03-07)

**Este documento ha sido ACTUALIZADO** para reflejar la transición de **RBAC a PBAC** (Permission-Based Access Control) con **15 capacidades** según PRD actualizado (2026-03-07).

**Cambios Principales en UX:**

1. **Dashboard Único para Todos:**
   - ❌ **Eliminados:** 4 dashboards específicos por rol (Operario, Técnico, Supervisor, Admin)
   - ✅ **Nuevo:** Dashboard común para todos los usuarios con KPIs de la planta
   - ✅ **Nuevo:** Botones de acceso rápido filtrados por capabilities del usuario

2. **Formulario de Registro de Usuario:**
   - ✅ **Nuevo:** Dropdown de rol (etiqueta) + 15 checkboxes individuales de capabilities
   - ✅ **Nuevo:** `can_create_failure_report` siempre marcada por defecto (todos los usuarios)
   - ✅ **Nuevo:** Permite selección flexible de las 15 capacidades del sistema

3. **Perfil de Usuario:**
   - ✅ **Nuevo:** Muestra rol como etiqueta + lista de 15 capabilities con nombres descriptivos
   - ✅ **Nuevo:** Nombres legibles para cada capability (ej: "✅ Reportar averías", "Ver OTs asignadas", "Gestionar stock", "Ver KPIs avanzados", "Gestionar usuarios y roles")

4. **Navegación Lateral:**
   - ✅ **Actualizado:** Filtrado por capabilities individuales (NO por roles)

**Referencia:** Ver `sprint-change-proposal-2026-03-01.md` para detalles completos de wireframes y especificaciones.

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

**gmao-hiansa** es un GMAO (Gestión de Mantenimiento Asistido por Ordenador) **single-tenant optimizado** diseñado específicamente para una empresa del sector metal con dos plantas especializadas (acero perfilado y panel sandwich). La solución transforma un departamento de mantenimiento puramente reactivo que opera con herramientas dispersas (Excel, WhatsApp, pizarra Kanban física) en una organización profesional, controlada y basada en datos mediante una PWA (Progressive Web App).

**Diferenciadores Fundamentales:**

- **Single-tenant optimizado** (no SaaS multi-tenant genérico) → permite personalización profunda imposible en soluciones genéricas
- **Arquitectura progresiva** → MVP con 12 funcionalidades base, crecimiento orgánico según necesidad real del departamento
- **Diseñado desde la experiencia real** → creado por quien experimentó el problema (Excel + WhatsApp + pizarra)
- **Transformación cultural** → no solo tecnología, sino crear cultura de datos y profesionalización del departamento

**Visión de Éxito:**

Departamento transformado de "caótico" a "profesional" con cultura de datos establecida. Operarios sienten "mi voz importa" al reportar y recibir feedback inmediato. Técnicos preguntan "¿cómo hacíamos antes sin esto?". Dashboard público genera transparencia total. Decisión de mantenimiento fundamentada en MTTR/MTBF, no intuición.

### Target Users

**Usuarios Primarios:**

#### 1. Carlos - Operario de Línea (25 años)
- **Perfil:** Trabajador joven en planta, conocimientos tech básicos (usa WhatsApp, redes sociales)
- **Dispositivos:** Móvil personal con PWA instalada
- **Rol:** Reporta averías cuando algo falla en su puesto de trabajo
- **Problema actual:** Reporta por WhatsApp, nunca sabe si alguien leyó el mensaje, siente que "nadie hace caso"
- **Outcome deseado:** Sentirse escuchado y ver que sus averías se atienden
- **Necesidades UX:** Interfaz muy simple, rapidez (<30 segundos para reportar), feedback inmediato, visibilidad de estado

#### 2. María - Técnica de Mantenimiento (28 años)
- **Perfil:** Técnica con experiencia, conocimientos tech medios
- **Dispositivos:** Móvil en campo, tablet para detalles de OT, desktop por la mañana para planificar
- **Rol:** Ejecuta órdenes de trabajo (OTs), actualiza estados en tiempo real, registra repuestos usados
- **Problema actual:** Llega sin saber claro qué tiene que hacer, a veces duplica trabajo con otros técnicos
- **Outcome deseado:** Trabajo organizado con clara visibilidad de tareas
- **Necesidades UX:** Vista clara de trabajo asignado, detalles completos de OTs, historial de equipos, actualización rápida desde móvil

#### 3. Javier - Supervisor de Mantenimiento (32 años)
- **Perfil:** Supervisor de turno, conocimientos tech buenos
- **Dispositivos:** Desktop principalmente, móvil para urgencias
- **Rol:** Recibe avisos, evalúa prioridad (triage), asigna OTs a técnicos, controla progreso
- **Problema actual:** Recibe WhatsApps de 10 personas con info desordenada, no sabe quién está libre/ocupado
- **Outcome deseado:** Control de carga de trabajo del equipo
- **Necesidades UX:** Visibilidad total de carga de trabajo, triage rápido, asignación visual (drag-and-drop), alertas de desbalance

#### 4. Elena - Administrador/Jefa de Mantenimiento (38 años)
- **Perfil:** Jefa del departamento, conocimientos tech buenos, no experta en datos
- **Dispositivos:** Desktop en su oficina
- **Rol:** Gestión total del sistema, configura permisos, ve KPIs para toma de decisiones, reporta a dirección
- **Problema actual:** No tiene indicadores reales, busca en 3 Excels diferentes, no puede fundamentar decisiones
- **Outcome deseado:** Datos para toma de decisiones y reporte a dirección
- **Necesidades UX:** Dashboard ejecutivo con KPIs clave, comparativas y tendencias, alertas automáticas, control de permisos

#### 5. Pedro - Gestor de Stock (35 años)
- **Perfil:** Administrativo responsable de almacén de repuestos
- **Dispositivos:** Desktop y tablet para inventario
- **Rol:** Gestiona inventario, actualiza stock, recibe alertas de stock mínimo, genera pedidos
- **Problema actual:** Recibe 10+ llamadas/día preguntando stock y ubicación
- **Outcome deseado:** Control total del inventario sin interrupciones constantes
- **Necesidades UX:** Stock en tiempo real, alertas solo cuando necesario (sin spam), gestión de pedidos simple

**Usuario Secundario:**

#### Público General (Toda la Fábrica)
- **Rol:** Consume información de dashboard público en área común
- **Impacto:** Transparencia → profesionalización → confianza → cultura de datos

### Key Design Challenges

**Desafíos Críticos de UX:**

#### 1. Búsqueda Predictiva Ultra-Rápida (<200ms)
- **Contexto:** Operarios como Carlos necesitan reportar avería en <30 segundos
- **Complejidad:** 10,000+ activos en jerarquía de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto)
- **Desafío técnico:** Autocompletado en tiempo real mientras escribe, usabilidad en móviles
- **Impacto UX:** Si es lento → frustración → abandono del sistema → vuelta a WhatsApp

#### 2. Sincronización Multi-Dispositivo en Tiempo Real (<1s)
- **Contexto:** Mismo tablero Kanban visible en desktop (Javier), tablet (María), móvil (Carlos), TV (pública)
- **Complejidad:** 8 estados de ciclo de vida de OTs, actualizaciones simultáneas desde múltiples dispositivos
- **Desafío técnico:** WebSockets vs polling para performance sin sobrecargar servidor
- **Impacto UX:** Si no es instantáneo → desincronización → conflictos → pérdida de confianza

#### 3. Código de Colores Visual Complejo
- **Contexto:** Tablero Kanban con 8 columnas y múltiples significados de color
- **Códigos:**
  - 🌸 Rosa (avería triage), ⚪ Blanco (reparación triage)
  - 🔴 Rojizo (correctivo propio), 🔴📏 Rojo con línea (correctivo externo viene)
  - 🟡 Amarillento (taller propio), 🔵 Azul (enviado a proveedor)
  - Prioridades: 🔴 Urgente, 🟡 Media, 🟢 Baja
- **Desafío UX:** Diferenciación clara sin confundir usuarios
- **Impacto UX:** Si es confuso → errores de asignación → pérdida de tiempo

#### 4. Feedback de Transparencia al Operario
- **Contexto:** Carlos necesita ver que "su aviso fue atendido" en cada paso
- **Flujo de notificaciones:** Recibido → Autorizado → En Progreso → Completado → Confirmación
- **Desafío UX:** Balance entre informar sin spam (demasiadas notificaciones)
- **Impacto UX:** Si no recibe feedback → "¿para qué reporto?" → abandono del sistema

#### 5. KPIs Ejecutivos Accesibles para No-Expertos
- **Contexto:** Elena no es experta en datos, necesita entender MTTR/MTBF rápidamente
- **Complejidad:** Drill-down (Global → Planta → Línea → Equipo), tendencias vs mes anterior
- **Desafío UX:** Visualización clara de métricas técnicas sin abrumar
- **Impacto UX:** Si es confuso → no usa dashboard → pierde valor de datos → decisiones por intuición

### Design Opportunities

**Oportunidades para Ventaja Competitiva:**

#### 1. Momento "¡Aha!" del Operario
- **Oportunidad:** Notificación push inmediata: "Tu aviso #AV-234 fue autorizado - OT #OT-567 asignada a María"
- **Transformación:** Cambio de percepción de "¿para qué reporto?" a "¡Wow! Esto funciona. Me escucharon."
- **Diferenciador:** GMAOs genéricos no enfatizan feedback al operario (enfocan en técnicos/supervisores)
- **Impacto cultural:** Operario siente que su voz importa → reporta más → mejores datos → mejor mantenimiento

#### 2. Kanban Digital con Modal ℹ️ de Trazabilidad Completa
- **Oportunidad:** Un clic en tarjeta = toda la historia (fechas, origen, técnico, repuestos usados, proveedor, teléfono)
- **Transformación:** Javier: "Un clic y tengo toda la historia. No busco en múltiples sistemas."
- **Diferenciador:** Integración de toda la información relevante en un solo modal vs navegar múltiples pantallas
- **Impacto productividad:** Supervisor ahorra tiempo preguntando → gestiona más eficientemente

#### 3. Dashboard Público de Transparencia
- **Oportunidad:** Toda la fábrica ve mismos KPIs en TV (MTTR, MTBF, técnicos activos, OTs abiertas/completadas)
- **Transformación:** Transparencia → profesionalización → confianza en departamento de mantenimiento
- **Diferenciador:** GMAOs enterprise típicamente son cerrados (solo gerencia ve datos)
- **Impacto cultural:** Métricas visibles generan consciencia de mejora continua en toda la organización

#### 4. Alertas Sin Spam (Stock Mínimo Únicamente)
- **Oportunidad:** Pedro recibe solo alertas accionables (stock mínimo), NO por cada uso de repuesto
- **Transformación:** De 10+ llamadas/día a 1 llamada en toda la mañana
- **Diferenciador:** Sistemas típicos notifican todo o nada → either spam or opacity
- **Impacto productividad:** Gestor de stock ahorra 2+ horas diarias, control total sin interrupciones

#### 5. Asignación Visual Drag-and-Drop con Balanceo de Carga
- **Oportunidad:** Arrastrar tarjeta a técnico → sistema alerta si desbalance ("Técnico Pedro tiene 8 OTs, Laura solo 2")
- **Transformación:** Supervisor distribuye trabajo eficientemente sin calcular mentalmente
- **Diferenciador:** GMAOs genéricos requieren listados y cálculos manuales
- **Impacto productividad:** Equipo balanceado → técnicos no sobrecargados → mayor moral → mejor desempeño

#### 6. Confirmación de "¿Funciona?" al Operario
- **Oportunidad:** Al completar OT, Carlos recibe: "OT completada - ¿Confirma que su perfiladora funciona bien?"
- **Transformación:** Operario participa en cierre del ciclo → siente que su opinión importa
- **Diferenciador:** La mayoría de GMAOs no incluyen validación del operario
- **Impacto calidad:** Feedback loop → detectar reparaciones incompletas → mejora MTBF

## Core User Experience

### Core User Action

**La Acción Más Frecuente y Crítica:**

Para **gmao-hiansa**, la acción core más frecuente y crítica es **reportar avería y recibir feedback transparencia**. Este es el flujo fundamental que define el valor del producto:

1. **Carlos (Operario)** reporta avería en <30 segundos
2. Recibe confirmación inmediata: "✓ Aviso recibido - Evaluando"
3. Recibe notificaciones push en cada transición: "Autorizado - OT asignada a María"
4. Recibe: "En progreso - María está trabajando"
5. Recibe: "Completada - ¿Confirma que funciona bien?"
6. Carlos toca "Sí, funciona bien" → "Gracias por tu reporte"

**¿Por qué es esta acción core?**

- **Si es rápida y con feedback:** Carlos siente "mi voz importa" → usa app sistemáticamente → departamento tiene datos → mejora continua
- **Si es lenta o sin feedback:** Carlos vuelve a WhatsApp → sistema falla → transformación cultural no ocurre

**Acciones Core Secundarias por Rol:**

- **Javier (Supervisor):** Asignar OT a técnico vía drag-and-drop en Kanban
- **María (Técnica):** Ver lista de OTs del día al llegar por la mañana
- **Elena (Admin):** Revisar MTTR/MTBF en dashboard para toma de decisiones
- **Pedro (Stock):** Ver stock al seleccionar repuesto (sin llamar a nadie)

### Platform Strategy

**Plataforma: PWA Responsiva de Múltiples Dispositivos**

**Arquitectura técnica:**
- **Una sola base de código** (Next.js/React) para desktop, tablet, móvil y TV
- **PWA instalable** en cualquier dispositivo (add to home screen)
- **Chrome y Edge solamente** (motores Chromium) → optimización para renderizado consistente

**Responsive Breakpoints:**

| Dispositivo | Tamaño | Layout Principal | Casos de Uso |
|-------------|--------|------------------|--------------|
| **Desktop** | >1200px | Kanban 8 columnas expandido, dashboard completo | Supervisor (Javier), Admin (Elena) |
| **Tablet** | 768-1200px | Kanban 2 columnas, detalles de OT, modal ℹ️ | Técnica (María) en campo |
| **Móvil** | <768px | Reporte averías, lista OTs, notificaciones | Operario (Carlos) |
| **TV** | 4K | Dashboard público modo "reunión" | Toda la fábrica |

**Input Methods:**

- **Touch-first para móvil/tablet:**
  - Touch targets mínimos 44x44px (WCAG AA)
  - Gestos táctiles (swipe, tap, long-press)
  - Drag-and-drop táctil para tablets

- **Mouse/keyboard para desktop:**
  - Drag-and-drop con mouse
  - Keyboard shortcuts (Tab, Enter, Esc)
  - Hover states para información adicional

**Requisitos de Conectividad:**

- **WiFi estable requerido** (producción en planta industrial)
- **Sincronización en tiempo real via WebSockets** (<1 segundo)
- **Offline parcial:** Datos se guardan localmente si se pierde conexión, sincronizan al reconectar
- **Heartbeat:** 30 segundos para detectar reconexión

**Estrategia PWA:**

- **Instalable:** "Add to Home Screen" en móviles
- **Notificaciones push:** Transparencia de estados, alertas accionables
- **Service Worker:** Cache estratégico para carga rápida
- **Manifest.json:** Iconos, splash screen, tema

### Effortless Interactions

**1. Búsqueda Predictiva Ultra-Rápida (<200ms)**

**Interacción effortless:**
- Carlos escribe "perfi" → sistema sugiere "Perfiladora P-201" instantáneamente
- Muestra stock: "Stock: 12, 📍 Estante A3, Cajón 3"
- Un toque para seleccionar

**Por qué se siente mágica:**
- Autocompletado mientras escribe (debouncing 300ms)
- Filtra por jerarquía (Planta → Línea → Equipo)
- Muestra contexto relevante (ubicación, stock)
- No requiere navegación por menús

**Contraste con estado actual:**
- Carlos pregunta por WhatsApp → espera respuesta → busca en Excel desactualizado

---

**2. Asignación Visual Drag-and-Drop (2 segundos)**

**Interacción effortless:**
- Javier arrastra tarjeta OT sobre "María" → assigned
- Confirmación visual: tarjeta aparece en columna de María
- Sistema alerta si desbalance: "María tiene 8 OTs, Laura solo 2"

**Por qué se siente mágica:**
- Un movimiento = tarea completada
- Feedback visual inmediato
- Balanceo de carga visible
- No requiere abrir formularios

**Contraste con estado actual:**
- Javier llama a cada técnico → pregunta disponibilidad → asigna verbalmente

---

**3. Modal ℹ️ de Trazabilidad Completa (1 clic)**

**Interacción effortless:**
- Javier toca tarjeta OT → modal ℹ️ se abre
- Toda la historia en un solo lugar: fechas, origen, técnico, repuestos, proveedor, teléfono
- Un clic para llamar al técnico o proveedor

**Por qué se siente mágica:**
- Toda la información relevante en un solo lugar
- No navegar múltiples pantallas
- Click-to-call directamente desde modal
- Historial completo de intervenciones previas

**Contraste con estado actual:**
- Javier busca en WhatsApp + Excel + pizarra física + llamar a técnicos

---

**4. Notificaciones Push de Transiciones Automáticas**

**Interacción effortless:**
- Carlos recibe: "Tu aviso #AV-234 fue autorizado - OT #OT-567 asignada a María"
- Transparencia automática sin preguntar
- Un toque para ver detalles de la OT

**Por qué se siente mágica:**
- Información fluye automáticamente al usuario
- No requiere que Carlos pregunte "¿qué pasó con mi reporte?"
- Participación en cada paso del proceso
- Sentido de "mi voz importa"

**Contraste con estado actual:**
- Carlos reporta por WhatsApp → nunca sabe si alguien leyó el mensaje

---

**5. Stock Visible al Seleccionar Repuesto**

**Interacción effortless:**
- María toca "Agregar Repuesto" → escribe "skf"
- Dropdown muestra: "Rodamiento SKF-6208 (Stock: 12, 📍 Estante A3, Cajón 3)"
- Un toque para agregar

**Por qué se siente mágica:**
- Información contextual sin navegación adicional
- No necesita llamar a Pedro
- Ubicación exacta del repuesto
- Stock se actualiza automáticamente al usar

**Contraste con estado actual:**
- María llama a Pedro 10+ veces al día preguntando stock y ubicación

---

**6. Confirmación de "¿Funciona?" al Operario**

**Interacción effortless:**
- Al completar OT, Carlos recibe notificación: "OT completada - ¿Confirma que su perfiladora funciona bien?"
- Carlos toca "Sí, funciona bien" → app: "Gracias por tu reporte"
- Un toque para cerrar el ciclo

**Por qué se siente mágica:**
- Operario participa en validación de calidad
- Feedback loop completo
- Sentido de contribución al proceso
- Detección de reparaciones incompletas

**Contraste con estado actual:**
- Técnico completa OT y nadie confirma con operario si realmente funciona

### Critical Success Moments

**1. Primer Reporte de Avería de Carlos (Momento de Verdad)**

**Escenario:**
- 09:00 - Perfiladora falla
- 09:01 - Carlos saca móvil, abre app
- 09:02 - Búsqueda "perfi" → "Perfiladora P-201"
- 09:03 - Describe problema, toca "Enviar"
- 09:03 - **Confirmación inmediata:** "✓ Aviso #AV-234 recibido - Evaluando"

**Éxito:**
- Carlos piensa: "¡Qué rápido! 2 minutos y ya está reportado"
- Confianza inicial establecida

**Fallo (si tarda >2 minutos o no recibe confirmación):**
- Carlos piensa: "Qué app más lenta, mejor usar WhatsApp"
- Abandono del sistema

---

**2. Primera Notificación Push de Carlos (Momento "¡Aha!")**

**Escenario:**
- 10:15 - Carlos recibe notificación: "Tu aviso #AV-234 fue autorizado - OT #OT-567 asignada a María"
- Carlos piensa: "¡Wow! Esto funciona de verdad. Me escucharon. No es como WhatsApp que nadie contesta."

**Éxito:**
- Transformación de percepción: "¿para qué reporto?" → "mi voz importa"
- Carlos se vuelve evangelizador del sistema entre compañeros

**Fallo (si no recibe notificación):**
- Carlos piensa: "Igual que WhatsApp, nadie hace caso"
- Abandono del sistema

---

**3. Lista de OTs de la Mañana de María (Productividad)**

**Escenario:**
- 07:45 - María llega 15 min antes, abre app en desktop
- Ve su lista del día: 5 OTs priorizadas, 2 rutinas
- Cada OT muestra: equipo, ubicación, problema, repuestos necesarios, tiempo estimado
- María piensa: "Sé exactamente qué tengo que hacer hoy. No corro preguntando."

**Éxito:**
- María se siente profesional y organizada
- No pierde tiempo preguntando a Javier
- Empieza primera OT a las 08:00

**Fallo (si lista es confusa o incompleta):**
- María piensa: "Voy a preguntar a Javier como siempre"
- Vuelta a métodos antiguos

---

**4. Asignación sin Llamadas de Javier (Control Total)**

**Escenario:**
- 07:00 - Javier abre tablero Kanban
- Toca tarjeta rosa (aviso Carlos) → modal ℹ️: origen, fechas, equipo P-201
- "Convertir en OT" → tarjeta rojiza 🔴
- Arrastra tarjeta a técnica Ana → assigned
- Todo en 10 segundos sin llamar a nadie

**Éxito:**
- Javier piensa: "Tengo control total. Distribuyo trabajo eficientemente."
- Técnicos no son interrumpidos
- Equipo balanceado

**Fallo (si requiere 5+ clicks o formularios):**
- Javier piensa: "Voy a llamarle, es más rápido"
- Sistema subutilizado

---

**5. Dashboard de KPIs de Elena (Toma de Decisiones)**

**Escenario:**
- 08:00 - Elena abre dashboard
- Ve MTTR 4.2h (↓15%), MTBF 127h (↑8%), OTs abiertas: 23, técnicos activos: 5
- Toca MTTR → drill-down: Planta Panel → Línea 2 → Prensa PH-500 (MTTR 12h, 3 fallos)
- Elena piensa: "Por primera vez tengo datos para fundamentar decisiones"

**Éxito:**
- Elena puede reportar a dirección con números concretos
- Toma decisiones basadas en datos, no intuición
- Identifica equipos problemáticos (Prensa PH-500)

**Fallo (si dashboard es confuso o requiere análisis complejo):**
- Elena piensa: "Voy a buscar en los Excels como siempre"
- Sistema no genera valor

---

**6. Stock sin Spam de Pedro (Control + Paz)**

**Escenario:**
- 07:30 - Pedro abre app: ve SKF-6208: 3 unidades 🔴 (mínimo: 5)
- 08:00 - Notificación: "Pedido recibido" → confirma 10 rodamientos
- SKF-6208: 3 → 13 unidades 🔴 → 🟢
- 10:45 - María usa repuesto → Pedro NO recibe notificación (sin spam)
- Pedro piensa: "Qué paz. Solo me avisan cuando necesito actuar."

**Éxito:**
- Pedro ahorra 2+ horas diarias
- Control total sin interrupciones constantes
- Una llamada en toda la mañana

**Fallo (si recibe notificación por cada uso):**
- Pedro piensa: "Demasiado spam, mejor ignorar notificaciones"
- Pérdida de control

### Experience Principles

**Principios Rectores para Todas las Decisiones de UX:**

#### 1. Rapidez de Feedback (Speed Matters)

**Principio:** Todo lo que el usuario hace debe tener confirmación visual inmediata.

**Aplicación:**
- Búsqueda <200ms (autocompletado instantáneo)
- Asignación <2 segundos (drag-and-drop)
- Actualizaciones <1 segundo (WebSockets real-time)
- Confirmación inmediata al enviar (envío de aviso, completar OT)

**Por qué importa:**
- Si no es rápido → frustración → abandono del sistema
- Usuarios acostumbrados a WhatsApp (instantáneo)

**Trade-off:**
- Performance vs funcionalidad → priorizar velocidad

---

#### 2. Transparencia Total (Radical Transparency)

**Principio:** El usuario siempre debe saber qué está pasando sin preguntar.

**Aplicación:**
- Carlos ve cada transición de estado de su aviso (notificaciones push)
- Modal ℹ️ muestra toda la historia (fechas, origen, técnico, repuestos, proveedor)
- Toda la fábrica ve mismos KPIs (dashboard público)
- Stock visible al seleccionar repuesto (no en página separada)

**Por qué importa:**
- Genera confianza → profesionalización → cultura de datos
- Usuarios pasan de "¿qué pasa?" a "tengo control"

**Trade-off:**
- Demasiadas notificaciones = spam → balance entre informar y abrumar

---

#### 3. Acción Mínima, Máximo Valor (Minimal Action, Maximum Value)

**Principio:** Un clic o un movimiento debería completar la tarea más frecuente.

**Aplicación:**
- Drag-and-drop vs formularios de 10 campos
- Autocompletado vs escribir texto completo
- Un clic en modal ℹ️ vs navegar múltiples pantallas
- Un toque para confirmar vs múltiples clicks

**Por qué importa:**
- Reduce fricción → usuarios adoptan sistema
- Ahorra tiempo → productividad

**Trade-off:**
- Simplicidad vs flexibilidad → MVP enfocado en casos core

---

#### 4. Contexto sobre Navegación (Context over Navigation)

**Principio:** La información relevante debe aparecer donde se necesita, no en páginas separadas.

**Aplicación:**
- Stock visible al seleccionar repuesto (no en módulo separado)
- Historial de equipo en modal ℹ️ (no en otra pestaña)
- Ubicación de repuesto en dropdown de búsqueda (no en detalle de producto)
- Notificaciones en contexto (push notification, no dentro de app)

**Por qué importa:**
- Usuario no pierde contexto de tarea actual
- Reduce necesidad de multitarea

**Trade-off:**
- UI más densa vs claridad visual → usar diseño limpio con tooltips

---

#### 5. Visual First (Visual sobre Textual)

**Principio:** Usar código de colores y elementos visuales antes que texto cuando sea posible.

**Aplicación:**
- Código de colores de tarjetas Kanban (🌸 rosa, ⚪ blanco, 🔴 rojizo, 🔴📏 rojo línea, 🟡 amarillento, 🔵 azul)
- KPIs con flechas ↑↓ vs comparar números manualmente
- Badges visuales (🔴 stock crítico, 🟢 stock OK)
- Iconos de estados (✓ completado, ▶️ en progreso, ⏱️ pendiente)

**Por qué importa:**
- Procesamiento visual más rápido que lectura de texto
- Ambiente industrial con luz variable → alto contraste ayuda

**Trade-off:**
- Accesibilidad (color blindness) → siempre combinar color con iconos/texto

## Desired Emotional Response

### Primary Emotional Goals

**Emoción Primaria: "Mi voz importa y tengo control"**

Para **gmao-hiansa**, la respuesta emocional primaria es que los usuarios sientan que **su voz importa** y que **tienen control** sobre su trabajo, transitando de la frustración y el caos actual a la profesionalización y la confianza.

**Transformación Emocional por Usuario:**

| Usuario | Estado Actual (Emoción Negativa) | Estado Deseado (Emoción Positiva) |
|---------|----------------------------------|-----------------------------------|
| **Carlos** (Operario) | "¿Para qué reporto si nadie hace caso?" - Frustración, impotencia, aislamiento | "¡Me escuchan! Mi voz importa." - Asombro, validación, pertenencia |
| **María** (Técnica) | "Voy corriendo de un lado a otro sin plan" - Estrés, desorganización | "Trabajo de forma profesional y organizada" - Confianza, profesionalismo |
| **Javier** (Supervisor) | "Voy apagando fuegos todo el día" - Abrumamiento, frustración, impotencia | "Tengo control total de mi equipo" - Control, eficiencia, dominio |
| **Elena** (Admin) | "No tengo datos para responder a dirección" - Inseguridad, ansiedad | "Por fin tengo datos" - Confianza, seguridad, alivio |
| **Pedro** (Stock) | "10+ llamadas/día preguntando lo mismo" - Frustración, interrupción constante | "Solo una llamada en toda la mañana" - Paz, control, satisfacción |

**La Emoción que los Haría Contarle a un Amigo:**

> "¡Es increíble! Reporto una avería y en 5 minutos me notifican que ya están trabajando en ella. Nunca había pasado eso. Antes reportaba por WhatsApp y nunca sabía si alguien había leído el mensaje. Ahora siento que realmente me escuchan."

**Sentimiento Diferenciador vs Competidores:**

- **Transparencia total** vs sistemas opacos donde nunca sabes qué pasa
- **Feedback inmediato** vs sistemas donde envías algo al vacío
- **Control visual** vs sistemas abstractos con listados interminables

---

### Emotional Journey Mapping

**1. Carlos - Operario de Línea:**

| Etapa | Estado Actual | Emoción Deseada | Trigger UX |
|-------|---------------|-----------------|------------|
| **Descubrimiento** | Escepticismo: "Otra app más que nadie va a usar" | Curiosidad | Demo de 30 segundos, tutorial simple |
| **Primer Reporte** | Sorpresa: "¡Qué rápido! 2 minutos y ya está reportado" | Esperanza | Confirmación inmediata "✓ Aviso recibido" |
| **Primera Notificación** | **Momento "¡Aha!"** "¡Me escucharon!" | **Validación, asombro** | Push: "Tu aviso fue autorizado - OT asignada a María" |
| **Uso Continuado** | "Reportar es natural y rápido" | Hábito, pertenencia | Feedback consistente en cada transición |
| **Post-Validación** | "Participé en cerrar el ciclo" | Satisfacción | "Gracias por tu reporte" al confirmar OT |

**Palabras Clave del Viaje de Carlos:**
- Escepticismo → Sorpresa → **Asombro** → Validación → Pertenencia

---

**2. María - Técnica de Mantenimiento:**

| Etapa | Estado Actual | Emoción Deseada | Trigger UX |
|-------|---------------|-----------------|------------|
| **Descubrimiento** | Esperanza: "Quizás esto me ayude a organizarme" | Anticipación | Demo de lista de OTs |
| **Lista Matutina** | "Sé exactamente qué tengo que hacer hoy" | Claridad, confianza | Lista priorizada con toda la info |
| **Durante OT** | "Tengo todo lo que necesito sin preguntar" | Eficiencia, profesionalismo | Modal ℹ️ con historial, stock visible |
| **Completar OT** | "Una tarea más completada con éxito" | Satisfacción, logro | Botón "Completar" con confirmación |
| **Uso Continuado** | "¿Cómo hacíamos antes sin esto?" | Indispensable, orgullo | Métricas de productividad visibles |

**Palabras Clave del Viaje de María:**
- Esperanza → Claridad → **Confianza** → Profesionalismo → Orgullo

---

**3. Javier - Supervisor de Mantenimiento:**

| Etapa | Estado Actual | Emoción Deseada | Trigger UX |
|-------|---------------|-----------------|------------|
| **Descubrimiento** | Escepticismo: "Otro sistema que aprender" | Curiosidad reservada | Demo de Kanban visual |
| **Primer Triage** | "Veo todos los avisos en un solo lugar" | Control inicial | Columna "Pendientes Triage" |
| **Asignación** | "Asigno en 2 segundos sin llamar a nadie" | Eficiencia, poder | Drag-and-drop visual |
| **Balanceo** | "Veo desbalance y actúo proactivamente" | Dominio, equidad | Alerta: "María tiene 8 OTs, Laura solo 2" |
| **Modal ℹ️** | "Un clic y tengo toda la historia" | Satisfacción profunda | Modal con fechas, origen, técnico, teléfono |

**Palabras Clave del Viaje de Javier:**
- Escepticismo → **Control** → Eficiencia → Dominio → Satisfacción

---

**4. Elena - Administrador/Jefa de Mantenimiento:**

| Etapa | Estado Actual | Emoción Deseada | Trigger UX |
|-------|---------------|-----------------|------------|
| **Dashboard** | "Por primera vez tengo datos" | **Alivio, confianza** | KPIs grandes: MTTR ↓15%, MTBF ↑8% |
| **Drill-down** | "Puedo profundizar al equipo problemático" | Seguridad, claridad | Un toque: Global → Planta → Línea → Equipo |
| **Reporte a Dirección** | "Muestro dashboard con datos concretos" | Orgullo, validez | Dashboard proyectado, director aprueba |
| **Alertas** | "Sé qué necesita atención" | Control, previsibilidad | Alertas accionables (stock mínimo, MTFR alto) |
| **Exportar** | "Tengo reporte listo para dirección" | Eficiencia, profesionalismo | Un botón para Excel |

**Palabras Clave del Viaje de Elena:**
- Ansiedad → **Alivio** → Confianza → Seguridad → Orgullo

---

**5. Pedro - Gestor de Stock:**

| Etapa | Estado Actual | Emoción Deseada | Trigger UX |
|-------|---------------|-----------------|------------|
| **Stock Visible** | "Veo stock en tiempo real sin llamadas" | Control inicial | Stock contextual al seleccionar |
| **Alerta Stock Mínimo** | "Solo me avisan cuando necesito actuar" | **Paz, alivio** | Notificación: "Filtro alcanzó mínimo (6 unidades)" |
| **Confirmar Pedido** | "Un toque y pedido confirmado" | Eficiencia | Botón "Confirmar pedido" |
| **María usa Repuesto** | "NO recibo notificación (sin spam)" | **Satisfacción profunda** | Silencio = sistema funciona |
| **Final del Día** | "Solo una llamada en toda la mañana" | Paz, logro | Comparación vs 10+ llamadas antes |

**Palabras Clave del Viaje de Pedro:**
- Frustración → **Paz** → Control → Satisfacción → Alivio

---

### Micro-Emotions

**Micro-Emociones Críticas para el Éxito del Producto:**

#### 1. Confianza vs. Confusión

**Confianza (✅ Queremos):**
- Sistema confirma cada acción inmediatamente
- Código de colores claro con tooltips explicativos
- Usuario siempre sabe qué hacer a continuación

**Confusión (❌ Evitar):**
- Botones sin etiquetas claras
- Estados ambiguos ("¿Qué significa este color?")
- Navegación sin breadcrumb o indicador de ubicación

**UX Approach:**
- Tooltips en código de colores de Kanban (modal ℹ️ con leyenda)
- Confirmaciones visuales en cada acción
- Indicadores de progreso en procesos largos

---

#### 2. Trust vs. Escepticismo

**Trust (✅ Queremos):**
- Notificaciones push en tiempo real = transparencia
- Historial completo en modal ℹ️
- Dashboard público = todos ven mismos datos

**Escepticismo (❌ Evitar):**
- Primer uso fallado o lento
- Sin feedback después de enviar
- Información oculta o difícil de encontrar

**UX Approach:**
- Primer uso debe ser exitoso (rapidez + feedback)
- Notificaciones en cada transición de estado
- Radical transparency (todos ven misma información)

---

#### 3. Excitement vs. Ansiedad

**Excitement (✅ Queremos):**
- Momento "¡Aha!" primera notificación push
- Búsqueda predictiva instantánea ("¡Magia!")
- Drag-and-drop fluido

**Ansiedad (❌ Evitar):**
- "¿Se envió mi aviso?" (sin confirmación)
- "¿Qué pasó con mi OT?" (sin notificaciones)
- "¿Está bien lo que hice?" (sin feedback)

**UX Approach:**
- Confirmación inmediata en cada acción
- Notificaciones push proactivas
- Estados visibles y claros

---

#### 4. Accomplishment vs. Frustración

**Accomplishment (✅ Queremos):**
- Drag-and-drop = tarea completada
- Un clic = toda la información (modal ℹ️)
- Lista de OTs = "Sé qué hacer hoy"

**Frustración (❌ Evitar):**
- Búsqueda lenta (>1 segundo)
- Formularios de 10 campos
- Navegar por múltiples pantallas

**UX Approach:**
- Búsqueda <200ms
- Un clic vs múltiples clicks
- Información contextual sin navegar

---

#### 5. Delight vs. Satisfacción

**Delight (✅ Queremos):**
- Momento "¡Aha!" cuando Carlos recibe primera notificación
- Búsqueda predictiva que "adivina" lo que quiere
- Alerta de balanceo que ayuda a Javier

**Satisfacción (baseline):**
- Usuario logra objetivo sin fricción
- Sistema funciona como esperado

**UX Approach:**
- Momentos de "magia" (búsqueda instantánea, notificaciones proactivas)
- Pequeños detalles que generan delight (animaciones suaves, mensajes amigables)

---

#### 6. Belonging vs. Aislamiento

**Belonging (✅ Queremos):**
- Carlos siente "mi voz importa" con notificaciones
- Dashboard público = transparencia para toda la fábrica
- "Gracias por tu reporte" al confirmar OT

**Aislamiento (❌ Evitar):**
- Enviar al vacío (sin respuesta)
- Información silo (solo gerencia ve datos)
- Sentir que "no me escuchan"

**UX Approach:**
- Feedback loop completo (operario participa en validación)
- Transparencia radical (todos mismos datos)
- Mensajes que generan pertenencia

---

### Design Implications

**Conexión Emoción → Decisión de Diseño:**

#### Emoción: "Mi voz importa" (Carlos)

**UX Design Approach:**
- **Notificaciones push** en cada transición de estado
  - "Tu aviso fue autorizado - OT asignada a María"
  - "OT en progreso - María está trabajando"
  - "OT completada - ¿Confirma que funciona bien?"
- **Confirmación final:** "Gracias por tu reporte" al validar
- **Cierre de ciclo:** Pregunta "¿Funciona?" al operario

**Por qué genera esta emoción:**
- Carlos ve que el sistema responde a sus acciones
- Participación en cada paso del proceso
- Validación de su contribución

---

#### Emoción: "Soy profesional" (María)

**UX Design Approach:**
- **Lista clara de OTs** priorizadas al abrir app
- **Cada OT tiene contexto:** equipo, ubicación, repuestos necesarios
- **Botón ▶️ "Iniciar"** con feedback visual inmediato
- **Historial disponible** en modal ℹ️

**Por qué genera esta emoción:**
- María siente que tiene información completa
- No necesita preguntar constantemente
- Se ve a sí misma como profesional organizada

---

#### Emoción: "Tengo control" (Javier)

**UX Design Approach:**
- **Kanban visual** con código de colores
- **Drag-and-drop:** Asignación en 2 segundos
- **Modal ℹ️:** Un clic = toda la historia
- **Alertas de balanceo:** "María tiene 8 OTs, Laura solo 2"

**Por qué genera esta emoción:**
- Javier ve carga de trabajo completa del equipo
- Distribuye trabajo sin llamar a nadie
- Toma decisiones informadas visualmente

---

#### Emoción: "Tengo datos" (Elena)

**UX Design Approach:**
- **Dashboard con KPIs grandes:** MTTR, MTBF, OTs abiertas, técnicos activos
- **Drill-down simple:** Un toque para profundizar
- **Flechas de tendencia:** ↑↓ vs mes anterior
- **Un botón para Excel** exportar

**Por qué genera esta emoción:**
- Elena ve números concretos inmediatamente
- Puede fundamentar decisiones con datos
- Reporta a dirección con dashboard visual

---

#### Emoción: "Paz sin spam" (Pedro)

**UX Design Approach:**
- **Alertas solo stock mínimo** (NO por cada uso)
- **Stock visible contextual** al seleccionar repuesto
- **Confirmación un toque:** "Pedido recibido"
- **Silencio = éxito:** María usa repuesto → Pedro NO recibe notificación

**Por qué genera esta emoción:**
- Pedro solo es interrumpido cuando necesita actuar
- Control total sin spam constante
- Ahorra 2+ horas diarias

---

### Emotional Design Principles

**Principios Rectores para Diseño Emocional:**

#### 1. Feedback Inmediato = Confianza

**Principio:** Cada acción del usuario debe tener confirmación visual inmediata.

**Aplicación:**
- Carlos toca "Enviar" → "✓ Aviso #AV-234 recibido - Evaluando"
- María toca "▶️ Iniciar" → tarjeta cambia a "En Progreso"
- Javier arrastra tarjeta → confirmación visual de asignación
- Elena exporta → "Tu exportación está lista. Click para descargar."

**Por qué genera confianza:**
- Usuario sabe que su acción fue recibida
- No hay duda "¿funcionó o no?"
- Refuerza comportamiento positivo

---

#### 2. Transparencia = Pertenencia

**Principio:** El usuario siempre debe ver qué está pasando sin preguntar.

**Aplicación:**
- Carlos ve cada transición de estado de su aviso
- Modal ℹ️ muestra toda la historia (fechas, origen, técnico, repuestos)
- Dashboard público = todos ven mismos datos
- Stock visible al seleccionar (no en página separada)

**Por qué genera pertenencia:**
- Usuario siente que es parte del proceso
- No hay información oculta o exclusiva
- Genera cultura de transparencia

---

#### 3. Rapidez = Satisfacción

**Principio:** El usuario debe lograr su objetivo sin esperar.

**Aplicación:**
- <30 segundos para reportar avería
- <200ms para búsqueda predictiva
- <2 segundos para asignar OT
- <1 segundo para actualizaciones en tiempo real

**Por qué genera satisfacción:**
- Usuario siente que el sistema respeta su tiempo
- Comparación favorable con métodos lentos actuales
- "¡Qué rápido!" momento de delight

---

#### 4. Control = Profesionalismo

**Principio:** El usuario debe sentir que tiene dominio sobre su trabajo.

**Aplicación:**
- Drag-and-drop visual (Javier asigna sin llamar)
- Lista clara de OTs (María sabe qué hacer)
- Dashboard KPIs (Elena tiene datos)
- Stock visible (Pedro controla inventario)

**Por qué genera profesionalismo:**
- Usuario se siente competente y organizado
- No depende de preguntar a otros
- Se ve a sí mismo como profesional

---

#### 5. Contexto = Eficiencia

**Principio:** La información relevante debe aparecer donde se necesita.

**Aplicación:**
- Stock al seleccionar repuesto (María no llama a Pedro)
- Historial en modal ℹ️ (Javier no navega múltiples pantallas)
- Ubicación en dropdown (Carlos ve dónde está repuesto)
- Notificaciones push (Carlos no abre app para ver estado)

**Por qué genera eficiencia:**
- Usuario no pierde contexto de tarea
- Reduce multitarea y cambio de contexto
- "Todo lo que necesito en un solo lugar"

---

## Emotional Validation

**Emoción Primaria:** **"Mi voz importa y tengo control"**

**Sentimientos Secundarios:**
- Profesionalismo ("Trabajo de forma organizada")
- Confianza ("El sistema funciona")
- Pertenencia ("Soy parte del proceso")
- Eficiencia ("Logro más en menos tiempo")
- Transparencia ("Sé qué está pasando")

**Emociones a Evitar:**
- Frustración ("Es lento", "No entiendo cómo funciona")
- Impotencia ("¿Para qué reporto?", "Nadie hace caso")
- Confusión ("¿Qué significa este color?", "¿Cómo hago X?")
- Ansiedad ("¿Se envió?", "¿Qué pasó con mi aviso?")
- Aislamiento ("Nadie me escucha", "No sé qué está pasando")
- Spam ("Demasiadas notificaciones", "Interrupciones constantes")

**Validación de Alineación con Visión del Producto:**

✅ **Transformación Cultural:** De "caótico" a "profesional"
✅ **Feedback Loop:** Operario participa en validación
✅ **Transparencia Radical:** Dashboard público
✅ **Control Visual:** Kanban, KPIs, alertas
✅ **Rapidez:** <30s reportar, <200ms buscar

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

Basándome en los usuarios de **gmao-hiansa** (Carlos, María, Javier, Elena, Pedro), he identificado productos que ya usan y aman, y de los cuales podemos aprender patrones UX probados:

---

#### 1. WhatsApp - Transparencia de Estado

**Qué hace bien desde UX:**
- **Transparencia inmediata:** ✓ azul de "visto", doble check ✓✓ de "entregado"
- **Notificaciones push:** Sabes cuando recibes mensaje sin abrir app
- **Simplicidad:** Un input de texto, un botón de enviar
- **Velocidad:** Mensajes se envían instantáneamente
- **Multi-dispositivo:** Funciona en móvil, desktop, web

**Core Problem Solucionado:**
- Incertidumbre de "¿me recibieron?" → Confirmación visual inmediata

**Momento "¡Aha!" de Carlos:**
- Envia mensaje → recibe notificación "visto" → sabe que el otro lo leyó
- Transparencia total sin preguntar "¿me recibiste?"

**Patrón UX exitoso:**
- **Feedback visual inmediato** en cada acción
- **Notificaciones push** proactivas (usuario no necesita preguntar)
- **Simplicidad extrema** (un input, un botón)

---

#### 2. Trello - Kanban Visual con Drag-and-Drop

**Qué hace bien desde UX:**
- **Visual first:** Tarjetas con código de colores, drag-and-drop intuitivo
- **Drag-and-drop fluido:** Un movimiento = tarea completada
- **Etiquetas visibles:** Colores, etiquetas, fechas límite visibles de un vistazo
- **Modal de detalle:** Un clic en tarjeta = toda la información

**Core Problem Solucionado:**
- Gestión visual de tareas vs listados abstractos interminables

**Momento "¡Aha!" de Javier:**
- Ve columnas visuales, arrastra tarjeta de "To Do" a "Doing"
- Asignación visual sin formularios ni menús complejos

**Patrón UX exitoso:**
- **Código de colores** para identificación instantánea
- **Drag-and-drop** para acciones frecuentes
- **Modal ℹ️** con toda la información relevante

---

#### 3. Spotify - Búsqueda Predictiva Instantánea

**Qué hace bien desde UX:**
- **Búsqueda predictiva ultra-rápida:** Escribe "Beat" → sugiere "The Beatles" en milisegundos
- **Autocompletado mientras escribes:** No necesitas escribir el nombre completo
- **Contexto en resultados:** Muestra artista, álbum, canción en el dropdown
- **Un toque para reproducir:** No navegar por menús

**Core Problem Solucionado:**
- Encontrar contenido entre millones de opciones sin fricción

**Momento "¡Aha!" de Carlos:**
- Escribe "perfi" → "Perfiladora P-201" aparece instantáneamente
- Stock y ubicación visibles en el dropdown

**Patrón UX exitoso:**
- **Autocompletado en tiempo real** (<200ms)
- **Resultados contextuales** con información relevante
- **Un toque/selección** para acción principal

---

#### 4. Slack - Sincronización Multi-Dispositivo en Tiempo Real

**Qué hace bien desde UX:**
- **Sincronización instantánea:** Mensaje en desktop → aparece en móvil inmediatamente
- **Canales/temas:** Organización por contexto, no solo por persona
- **Notificaciones inteligentes:** Te avisa de mentions, no de todo
- **Search potente:** Encuentra mensajes, archivos, personas en <1 segundo

**Core Problem Solucionado:**
- Coordinación de equipo sin llamadas constantes

**Momento "¡Aha!" de María:**
- Actualiza OT en desktop → Javier ve cambio en su desktop inmediatamente
- Sincronización sin "refresh" manual

**Patrón UX exitoso:**
- **WebSockets para actualizaciones <1s**
- **Notificaciones push inteligentes** (solo lo importante)
- **Búsqueda universal** en un solo lugar

---

#### 5. Notion - Contexto sobre Navegación

**Qué hace bien desde UX:**
- **Información contextual aparece donde se necesita:** Slash commands, inline editing
- **Drill-down sin perder lugar:** Página dentro de página
- **Búsqueda instantánea:** "/" + comando → acción en milisegundos

**Core Problem Solucionado:**
- Acceder a información profunda sin navegar múltiples páginas

**Momento "¡Aha!" de Elena:**
- Toca MTTR → drill-down: Global → Planta → Línea → Equipo
- Un toque para profundizar sin perder contexto

**Patrón UX exitoso:**
- **Información contextual** donde se necesita
- **Drill-down simple** sin navegación profunda
- **Un comando/acción** para tareas frecuentes

---

### Transferable UX Patterns

**Patrones de Navegación:**

#### 1. Kanban Visual con Drag-and-Drop (Trello)

**Patrón:**
- Columnas horizontales con tarjetas
- Drag-and-drop para mover tarjetas entre columnas
- Código de colores para categorización visual
- Modal ℹ️ con detalles al hacer clic en tarjeta

**Aplicación a gmao-hiansa:**
- **Funciona para:** Asignación de OTs, gestión de carga de trabajo de técnicos
- **Resuelve:** Asignación rápida sin llamar a técnicos
- **Implementación:** 8 columnas (Pendientes Triage → Asignaciones → En Progreso → Pendiente Repuesto → Pendiente Parada → Reparación Externa → Completadas → Descartadas)
- **Código de colores:** 🌸 Rosa (avería triage), ⚪ Blanco (reparación triage), 🔴 Rojizo (correctivo propio), 🔴📏 Rojo línea (correctivo externo viene), 🟡 Amarillento (taller propio), 🔵 Azul (enviado a proveedor)

---

#### 2. Búsqueda Predictiva Universal (Spotify)

**Patrón:**
- Input de texto con autocompletado en tiempo real
- Resultados contextuales con información relevante
- Un toque/selección para acción principal
- Debouncing (300ms) para optimizar performance

**Aplicación a gmao-hiansa:**
- **Funciona para:** Encontrar equipos, repuestos, OTs
- **Resuelve:** Rapidez en reporte de averías (<30 segundos)
- **Implementación:**
  - Carlos escribe "perfi" → "Perfiladora P-201" aparece instantáneamente
  - Muestra stock, ubicación (Estante A3, Cajón 3)
  - Un toque para seleccionar
- **Performance objetivo:** <200ms para resultados

---

**Patrones de Interacción:**

#### 3. Transparencia de Estado (WhatsApp)

**Patrón:**
- Confirmación visual inmediata en cada acción
- Notificaciones push proactivas
- Estados visibles (enviado ✓, entregado ✓✓, visto ✓✓✓)

**Aplicación a gmao-hiansa:**
- **Funciona para:** Feedback loop del operario
- **Resuelve:** "¿Para qué reporto si nadie hace caso?"
- **Implementación:**
  - Carlos toca "Enviar" → "✓ Aviso #AV-234 recibido - Evaluando"
  - Notificación push: "Tu aviso fue autorizado - OT asignada a María"
  - Notificación push: "OT en progreso - María está trabajando"
  - Notificación push: "OT completada - ¿Confirma que funciona bien?"

---

#### 4. Modal ℹ️ de Detalle Completo (Trello)

**Patrón:**
- Un clic en elemento → modal se abre con toda la información
- Información organizada en secciones
- Acciones disponibles dentro del modal
- Cierre con ESC o click fuera

**Aplicación a gmao-hiansa:**
- **Funciona para:** Trazabilidad completa de OT
- **Resuelve:** "Un clic y tengo toda la historia"
- **Implementación:**
  - Javier toca tarjeta OT → modal ℹ️ se abre
  - Muestra: fechas, origen (Carlos), técnico asignado (María), repuestos usados, proveedor, teléfono
  - Click-to-call desde modal (llamar a técnico o proveedor)
  - Historial completo de intervenciones previas en ese equipo

---

#### 5. Notificaciones Push Inteligentes (Slack)

**Patrón:**
- Notificaciones solo para eventos importantes
- Usuario no necesita "preguntar" qué pasó
- Un toque para ver detalles
- Silencio = no hay novedades (no spam)

**Aplicación a gmao-hiansa:**
- **Funciona para:** Transiciones de estado, alertas accionables
- **Resuelve:** Usuario siempre sabe qué pasa sin abrir app
- **Implementación:**
  - Carlos: Notificaciones push en cada transición de su aviso
  - Pedro: Alertas solo stock mínimo (NO por cada uso de repuesto)
  - Elena: Alertas accionables (stock mínimo, MTFR alto, rutinas no completadas)
  - Silencio = sistema funciona, no hay problemas

---

**Patrones Visuales:**

#### 6. Código de Colores Visual (Trello)

**Patrón:**
- Colores semánticos para categorías
- Identificación instantánea sin leer texto
- Leyenda/tooltips para claridad
- Iconos + color (no solo color por accesibilidad)

**Aplicación a gmao-hiansa:**
- **Funciona para:** Diferenciación rápida de tipos de OT, estados, prioridades
- **Resuelve:** Identificación instantánea en Kanban
- **Implementación:**
  - Tipos de OT: 🌸 Rosa (avería triage), ⚪ Blanco (reparación triage), 🔴 Rojizo (correctivo propio), 🔴📏 Rojo línea (correctivo externo), 🟡 Amarillento (taller propio), 🔵 Azul (enviado a proveedor)
  - Prioridades: 🔴 Urgente, 🟡 Media, 🟢 Baja
  - Estados: 🟢 Completada, 🟡 En Progreso, 🔴 Pendiente
  - Tooltips en modal ℹ️ con leyenda completa

---

#### 7. KPIs con Flechas de Tendencia (Apps de Finanzas)

**Patrón:**
- Números grandes con flechas ↑↓
- Comparación vs período anterior
- Colores semánticos (verde = mejora, rojo = empeoramiento)
- Un toque para drill-down

**Aplicación a gmao-hiansa:**
- **Funciona para:** MTTR/MTBF con tendencias
- **Resuelve:** Elena entiende métricas sin ser experta en datos
- **Implementación:**
  - Dashboard: MTTR 4.2h (↓15% vs mes anterior) - verde
  - Dashboard: MTBF 127h (↑8% vs mes anterior) - verde
  - Un toque en MTTR → drill-down: Global → Planta → Línea → Equipo

---

### Anti-Patterns to Avoid

Basándome en el análisis de GMAOs existentes (IBM Maximo, SAP PM, Infraspeak, Fracttal) y patrones enterprise que frustran a usuarios:

#### 1. Bloatware Funcional (500+ Características)

**Anti-Patrón:**
- Sistemas con 500+ características que nunca se usarán
- Curva de aprendizaje alta (semanas de formación)
- Pantallas llenas de opciones que confunden

**Por qué usuarios lo odian:**
- Abandono del sistema por sobrecarga
- Resistencia al cambio ("es muy complicado")
- 80% de features nunca se usan

**Cómo evitarlo en gmao-hiansa:**
- MVP con 12 funcionalidades core
- No agregar "nice-to-haves" hasta validar necesidad real
- Principio: "Acción mínima, máximo valor"

---

#### 2. Formularios Largos de 10+ Campos

**Anti-Patrón:**
- Crear OT requiere llenar formulario con 10+ campos
- Campos obligatorios no relevantes para usuario
- Validaciones complejas que frustran

**Por qué usuarios lo odian:**
- "Es muy lento, mejor uso WhatsApp"
- Abandono a mitad de formulario
- Llamadas de soporte constantes

**Cómo evitarlo en gmao-hiansa:**
- Drag-and-drop vs formularios
- Autocompletado vs escribir texto completo
- Un clic vs múltiples clicks
- Principio: Minimal Action, Maximum Value

---

#### 3. Navegación Profunda (5+ Niveles de Menús)

**Anti-Patrón:**
- Usuario debe navegar 5+ niveles para encontrar función
- Breadcrumb confuso o inexistente
- No sabe dónde está en el sistema

**Por qué usuarios lo odian:**
- "No encuentro nada"
- Se pierden, frustración
- Llamadas de soporte

**Cómo evitarlo en gmao-hiansa:**
- Contexto sobre navegación
- Modal ℹ️ con drill-down simple
- Información relevante donde se necesita
- Principio: Context over Navigation

---

#### 4. Listados Interminables sin Filtros

**Anti-Patrón:**
- Usuario busca manualmente entre 10,000 items
- Sin búsqueda predictiva
- Sin filtros relevantes

**Por qué usuarios lo odian:**
- Búsqueda toma >5 minutos
- Frustración extrema
- Abandono del sistema

**Cómo evitarlo en gmao-hiansa:**
- Búsqueda predictiva <200ms
- Filtros visuales por estado, técnico, fecha, tipo
- Resultados ordenados por relevancia
- Principio: Rapidez de Feedback

---

#### 5. Notificaciones Spam (Cada Cambio, Cada Actualización)

**Anti-Patrón:**
- Usuario recibe notificación por cada cambio menor
- 50+ notificaciones/día
- Usuario las ignora o desactiva

**Por qué usuarios lo odian:**
- "Demasiado spam, mejor ignorar todo"
- Pierde valor de alertas reales
- Desactivan notificaciones completamente

**Cómo evitarlo en gmao-hiansa:**
- Solo alertas accionables (stock mínimo)
- Notificaciones push solo transiciones de estado
- Silencio = sistema funciona
- Principio: Transparencia sin spam

---

#### 6. Sistemas Opacos (Sin Visibilidad de Estado)

**Anti-Patrón:**
- Usuario envía algo y nunca sabe qué pasó
- Sin notificaciones de progreso
- Estados ocultos o confusos

**Por qué usuarios lo odian:**
- "¿Para qué reporto?", abandono
- "¿Se envió o no?", ansiedad
- "Nadie hace caso", impotencia

**Cómo evitarlo en gmao-hiansa:**
- Transparencia radical (notificaciones push en cada transición)
- Dashboard público (todos mismos datos)
- Estados visibles y claros
- Principio: Radical Transparency

---

#### 7. Interfaces Abstractas sin Contexto Visual

**Anti-Patrón:**
- Listados de texto interminables
- Sin código de colores
- Sin elementos visuales

**Por qué usuarios lo odian:**
- "No entiendo qué estoy viendo"
- Curva de aprendizaje alta
- How-to guides de 50 páginas

**Cómo evitarlo en gmao-hiansa:**
- Visual first (código de colores)
- Kanban visual vs listados
- Drag-and-drop intuitivo
- Principio: Visual First

---

### Design Inspiration Strategy

**Qué Adoptar (Tal Cual):**

1. **Transparencia de Estado de WhatsApp** → Notificaciones push en cada transición
   - **Por qué:** Soporta objetivo emocional "mi voz importa"
   - **Alinea con:** Feedback inmediato, transparencia radical
   - **Implementación:**
     - Carlos: "✓ Aviso recibido" → "Tu aviso fue autorizado" → "OT en progreso" → "OT completada - ¿Confirma?"
     - Confirmación visual en cada acción

2. **Kanban Visual de Trello** → Drag-and-drop para asignación de OTs
   - **Por qué:** Soporta objetivo emocional "tengo control"
   - **Alinea con:** Acción mínima, máximo valor, visual first
   - **Implementación:**
     - 8 columnas con código de colores
     - Arrastrar tarjeta a técnico = assigned
     - Modal ℹ️ con trazabilidad completa

3. **Búsqueda Predictiva de Spotify** → Autocompletado instantáneo de equipos
   - **Por qué:** Soporta objetivo "rapidez (<30 segundos para reportar)"
   - **Alinea con:** Rapidez de feedback, búsqueda <200ms
   - **Implementación:**
     - Autocompletado mientras escribe (debouncing 300ms)
     - Resultados contextuales (stock, ubicación)
     - Un toque para seleccionar

---

**Qué Adaptar (Modificar para Requisitos Únicos):**

1. **Modal ℹ️ de Trello** → Adaptar con trazabilidad completa + click-to-call
   - **Modificación:** Añadir teléfono de técnico/proveedor para llamar directamente
   - **Por qué:** Javier necesita contactar técnicos/proveedores rápidamente en ambiente industrial
   - **Implementación:**
     - Modal muestra: fechas, origen, técnico, repuestos, proveedor
     - Click-to-call: Teléfono del técnico en campo, teléfono del proveedor
     - Historial completo de intervenciones previas en ese equipo

2. **Canales de Slack** → Adaptar a columnas de Kanban por estado
   - **Modificación:** 8 columnas específicas de ciclo de vida de OT
   - **Por qué:** Workflow de mantenimiento industrial tiene estados específicos
   - **Implementación:**
     - Pendientes Triage → Asignaciones (dividida) → En Progreso → Pendiente Repuesto → Pendiente Parada → Reparación Externa → Completadas → Descartadas
     - Código de colores por tipo de OT y estado

3. **KPIs de Apps de Finanzas** → Adaptar a MTTR/MTBF con drill-down jerárquico
   - **Modificación:** Drill-down específico para estructura de empresa metalúrgica
   - **Por qué:** Empresa tiene dos plantas con líneas y equipos específicos
   - **Implementación:**
     - Un toque en MTTR → drill-down: Global → Planta (Acero/Panel) → Línea → Equipo
     - Flechas ↑↓ vs mes anterior
     - Colores semánticos (verde = mejora, rojo = empeoramiento)

---

**Qué Evitar (Anti-Patrones):**

1. **Bloatware de Maximo/SAP** → 500+ características que nunca se usarán
   - **Por qué:** Entra en conflicto con objetivo "rapidez y simplicidad"
   - **No encaja con:** Usuarios con conocimientos tech básicos/medios (Carlos, María)
   - **Estrategia:** MVP con 12 funcionalidades core, crecimiento progresivo según necesidad real

2. **Formularios Largos de Enterprise Apps** → 10+ campos para crear OT
   - **Por qué:** Crea fricción, usuarios abandonan sistema
   - **No encaja con:** Principio "acción mínima, máximo valor"
   - **Estrategia:** Drag-and-drop, autocompletado, un clic vs múltiples clicks

3. **Navegación Profunda de ERPs** → 5+ niveles de menús
   - **Por qué:** Crea confusión, usuario se pierde
   - **No encaja con:** Plataforma PWA where contexto es clave
   - **Estrategia:** Contexto sobre navegación, modal ℹ️, drill-down simple

## Design System Foundation

### Design System Choice

**Sistema de Diseño Seleccionado:** **Tailwind CSS + Shadcn/ui (Radix UI)**

Para **gmao-hiansa**, he seleccionado **Tailwind CSS + Shadcn/ui** como fundación del sistema de diseño. Esta combinación proporciona el balance óptimo entre velocidad de desarrollo (crítico para MVP 3-4 meses) y diferenciación visual profesional industrial (necesario para distinguirse de GMAOs genéricos como IBM Maximo, SAP PM, Infraspeak, Fracttal).

**Por qué Tailwind CSS + Shadcn/ui:**

1. **Velocidad + Unicidad Visual:**
   - Componentes copiables de Shadcn/ui ("copy and paste" - own the code)
   - Flexibilidad completa de Tailwind para identidad visual única
   - No parecemos "otra app de Google" (MUI) ni "otro enterprise genérico" (Ant)

2. **Kanban Profesional Industrial:**
   - Drag-and-drop fluido con `dnd-kit` + Radix Primitives
   - Código de colores custom específico para OTs (🌸 Rosa, ⚪ Blanco, 🔴 Rojizo, 🔴📏 Rojo línea, 🟡 Amarillento, 🔵 Azul)
   - Más flexible que sistemas rígidos para Kanban específico de mantenimiento

3. **Búsqueda Predictiva Ultra-Rápida (<200ms):**
   - Shadcn `Command` component (Cmd+K style)
   - Debouncing optimizado
   - UX similar a VS Code / Spotify (búsqueda instantánea)

4. **Team Size 1 Developer:**
   - Componentes simples, documentación clara
   - "Copy and paste" = owner del código (no dependency hell)
   - Mantenible a largo plazo por 1 persona

5. **Identity Industrial Professional Única:**
   - Tailwind utility-first CSS permite branding sin restricciones
   - No hereda visual genérico de otras empresas
   - Diferenciación clara de competidores enterprise

---

### Rationale for Selection

**Comparación con Opciones Alternativas:**

| Sistema | Ventaja | Desventaja | Por qué NO |
|--------|----------|------------|------------|
| **MUI (Material UI)** | Desarrollo rápido, componentes enterprise completos | Visual "Google-like", poca diferenciación | Parecemos "otra app más", no identidad única industrial |
| **Ant Design** | Excelente para enterprise, componentes ricos | Visual "corporate genérico", API compleja | Parecemos IBM Maximo/SAP, no diferenciación |
| **Chakra UI** | Componentes themeables, API simple | Comunidad más pequeña, menos componentes | Menor ecosistema, más desarrollo custom necesario |
| **Tailwind + Shadcn/ui** ✅ | Máxima flexibilidad, componentes modernos | Curva aprendizaje moderada | **Balance óptimo: velocidad + unicidad** |

**Decision Factors:**

1. **Velocidad de Desarrollo MVP (3-4 meses):**
   - ✅ Shadcn/ui: Componentes copiables, desarrollo rápido
   - ✅ Tailwind: Utility-first, no escribir CSS desde cero
   - ⚠️ Trade-off: Curva de aprendizaje inicial vs velocidad a largo plazo

2. **Unicidad Visual vs. Velocidad:**
   - Prioridad: **Balance** (velocidad importante pero identidad profesional crítica)
   - Tailwind permite branding único sin sacrificar demasiado tiempo
   - Shadcn/ui proporciona foundation sólida sin dictar visual

3. **Team Expertise (1 Developer Full-Stack):**
   - ✅ Tailwind: Documentación clara, comunidad grande
   - ✅ Shadcn/ui: "You own the code" - fácil mantenimiento
   - ✅ React/Next.js: Stack alineado con expertise (single developer)

4. **Long-term Maintenance:**
   - ✅ Ecosistema activo (Tailwind: 3M+ weekly downloads, Shadcn creciente)
   - ✅ No vendor lock-in (código es tuyo)
   - ✅ Actualizaciones regulares sin breaking changes drásticos

5. **Integration Requirements:**
   - ✅ Greenfield project (no integración con sistemas existentes)
   - ✅ No restricciones de compatibilidad visual
   - ✅ PWA-friendly (Tailwind purga CSS no usado, performance optimizado)

---

### Implementation Approach

**Fase 1: Setup Foundation (Semana 1)**

**Instalación y Configuración:**

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card badge dialog command
npx shadcn-ui@latest add table tabs toast dropdown-menu
```

**Configuración Tailwind (`tailwind.config.js`):**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Azul para acciones principales
        primary: {
          DEFAULT: "#0066CC",      // #0066CC (Main Blue)
          dark: "#004C99",         // #004C99 (Secondary Blue)
          foreground: "#FFFFFF",
        },
        // Status: Semáforo (WCAG AA compliance)
        success: {
          DEFAULT: "#28A745",      // Green (OT completada, stock OK)
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#FFC107",      // Yellow (OT en progreso, stock bajo)
          foreground: "#000000",
        },
        danger: {
          DEFAULT: "#DC3545",      // Red (OT vencida, stock crítico, avería)
          foreground: "#FFFFFF",
        },
        info: {
          DEFAULT: "#17A2B8",       // Blue (información general)
          foreground: "#FFFFFF",
        },

        // Neutral: Textos y fondos
        border: "#DEE2E6",         // Borders, separators
        input: "#DEE2E6",          // Input borders
        ring: "#DEE2E6",           // Focus ring
        background: "#F8F9FA",     // Backgrounds, cards
        foreground: {
          DEFAULT: "#212529",      // Text Primary
          muted: "#6C757D",        // Text Secondary, labels
        },

        // OT Type Colors (código de colores Kanban)
        "ot-averia-triage": "#EC4899",       // 🌸 Rosa (Avería Triage)
        "ot-reparacion-triage": "#F3F4F6",    // ⚪ Blanco (Reparación Triage)
        "ot-correctivo-propio": "#EF4444",    // 🔴 Rojizo (Correctivo Propio)
        "ot-correctivo-externo": "#DC2626",   // 🔴📏 Rojo con Línea (Correctivo Externo)
        "ot-taller-propio": "#F59E0B",        // 🟡 Amarillento (Taller Propio)
        "ot-enviado-proveedor": "#3B82F6",     // 🔵 Azul (Enviado Proveedor)

        // Priorities
        "urgencia-critica": "#DC3545",
        "urgencia-alta": "#FFC107",
        "urgencia-media": "#F59E0B",
        "urgencia-baja": "#28A745",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        // System UI fonts (San Francisco, Segoe UI, Roboto)
      },
      spacing: {
        "44": "44px",  // Touch target mínimo WCAG AA
      },
      borderRadius: {
        "4px": "4px",  // Radio estándar para botones, cards
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.1)",  // Sombra sutil cards
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**Configuración Shadcn/ui (`components.json`):**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

**Fase 2: Core Components (Semana 2-3)**

**Componentes Shadcn/ui a Instalar:**

```bash
# Core UI Components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog       # Para modal ℹ️
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast        # Para notificaciones in-app
npx shadcn-ui@latest add tabs         # Para rutinas, navegación
npx shadcn-ui@latest add table        # Para listados de OTs
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add label
```

**Componentes Custom a Construir:**

1. **SearchAutocomplete** (Búsqueda Predictiva)
   - Basado en Shadcn `Command`
   - Autocompletado <200ms
   - Debouncing 300ms
   - Muestra: equipo, stock, ubicación

2. **OTCard** (Tarjeta de OT para Kanban)
   - Componente custom con código de colores
   - Drag-and-drop ready
   - Touch target 44x44px

3. **KPICard** (Tarjeta de KPI para Dashboard)
   - Basado en Shadcn `Card`
   - Números grandes + flechas ↑↓
   - Click-to-drill-down

---

**Fase 3: Specialized Components (Semana 4-8)**

**1. Kanban Board con Drag-and-Drop**

**Librerías:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Componente `KanbanBoard`:**
- 8 columnas: Pendientes Triage → Asignaciones → En Progreso → Pendiente Repuesto → Pendiente Parada → Reparación Externa → Completadas → Descartadas
- Drag-and-drop fluido con `@dnd-kit/core`
- Código de colores por tipo de OT
- Modal ℹ️ con trazabilidad completa

**2. KPIs Dashboard con Gráficos**

**Librerías:**
```bash
npm install recharts
```

**Componentes:**
- `KPICard`: Tarjeta con número grande, flecha ↑↓, click-to-drill-down
- `MTTRChart`: Gráfico de línea para MTTR por período
- `MTBFChart`: Gráfico de barras para MTBF por equipo
- `OTsPieChart`: Pie chart para OTs por estado

**3. Formularios Simples**

**Componentes:**
- `ReportarAveriaForm`: Formulario de 3 pasos (Datos básicos → Detalles → Confirmación)
- Validación en tiempo real
- Touch targets 44x44px
- Autocomplete para equipos

---

**Fase 4: PWA Components (Semana 9-12)**

**Service Worker Setup:**
```bash
npm install next-pwa
```

**Configuración PWA (`next.config.js`):**
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // ... other config
});
```

**Manifest (`public/manifest.json`):**
```json
{
  "name": "gmao-hiansa",
  "short_name": "GMAO",
  "description": "Gestión de Mantenimiento Asistido por Ordenador",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0066CC",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### Customization Strategy

**Design Tokens (Variables CSS):**

Definir en `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Spacing */
    --radius: 0.5rem;

    /* Card */
    --card-background: 0 0 0 1px rgba(0, 0, 0, 0.02), 0 1px 3px 0 rgba(0, 0, 0, 0.1);

    /* Typography */
    --font-sans: 'Inter', system-ui, sans-serif;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

**Component Patterns:**

1. **Buttons:**
   - Primary: `bg-primary text-primary-foreground h-11 px-8 py-2`
   - Secondary: `border border-input bg-background hover:bg-accent`
   - Danger: `bg-danger text-white h-11 px-8 py-2`

2. **Cards:**
   - `rounded-lg border bg-card text-card-foreground shadow-sm`
   - Padding: `p-6` (desktop), `p-4` (móvil)

3. **Inputs:**
   - `flex h-11 w-full rounded-md border border-input bg-background px-3 py-2`
   - Touch target: 44px altura (WCAG AA)

4. **OT Cards (Kanban):**
   - Background por tipo de OT (usando `bg-ot-correctivo-propio`, etc.)
   - Badge de urgencia (rojo, amarillo, verde)
   - Content mínimo: 120px altura

---

**Responsive Breakpoints:**

```javascript
// Tailwind breakpoints (ya incluidos)
sm:   '640px',   // Móvil grande
md:   '768px',   // Tablet
lg:   '1024px',  // Desktop
xl:   '1280px',  // Desktop grande
'2xl': '1536px', // TV 4K
```

**Layout Strategy:**

- **Desktop (>1200px):** Kanban 8 columnas, dashboard completo
- **Tablet (768-1200px):** Kanban 2 columnas, dashboard adaptado
- **Móvil (<768px):** 1 columna, navegación hamburguesa

---

**Accessibility (WCAG AA):**

1. **Contraste:** Todos los colores cumplen 4.5:1 mínimo
2. **Text Resize:** Layout soporta 200% zoom
3. **Touch Targets:** 44x44px mínimo
4. **Keyboard Navigation:** Tab order lógico, focus indicators visibles
5. **Screen Reader:** ARIA labels en elementos interactivos

---

**Performance Optimization:**

1. **Tree-shaking:** Tailwind purge CSS no usado
2. **Code Splitting:** Next.js automatic code splitting
3. **Image Optimization:** Next.js Image component
4. **Font Optimization:** `next/font` para Inter
5. **Bundle Size:** <200KB initial bundle (goal)

---

**Next Steps:**

1. **Setup Foundation:** Instalar Tailwind + Shadcn/ui (Semana 1)
2. **Build Core Components:** Button, Input, Card, Modal (Semana 2-3)
3. **Build Specialized Components:** Kanban Board, KPIs Dashboard (Semana 4-8)
4. **PWA + Responsive:** Service worker, manifest, breakpoints (Semana 9-12)

---

## Core User Experience

### Defining Experience

**La Experiencia Defining de gmao-hiansa:**

> **"Reportar avería en 30 segundos y recibir notificaciones push en cada paso"**

Esta es la interacción core que, si la hacemos perfecta, todo lo demás sigue.

**Analogía con Productos Exitosos:**

- **Tinder:** "Swipe para hacer match con personas"
- **Snapchat:** "Comparte fotos que desaparecen"
- **gmao-hiansa:** "Reportar avería y recibir feedback transparencia en cada paso"

**¿Por qué es esta la experiencia defining?**

1. **Es la acción que los usuarios describirán a sus amigos:**
   - > "¡Es increíble! Reporto una avería y en 5 minutos me notifican que ya están trabajando en ella."

2. **Es la interacción que hace que los usuarios se sientan exitosos:**
   - Carlos piensa: "¡Qué rápido! 2 minutos y ya está reportado"
   - María piensa: "Sé exactamente qué tengo que hacer hoy"
   - Javier piensa: "Tengo control total de mi equipo"

3. **Si acertamos en UNA cosa, esta debería ser:**
   - **Feedback loop de transparencia:** Reportar → Recibir confirmación → Recibir notificaciones en cada transición → Validar solución

**Impacto de acertar vs fallar:**

| Si acertamos ✅ | Si fallamos ❌ |
|-----------------|---------------|
| Carlos usa app sistemáticamente | Carlos vuelve a WhatsApp |
| Departamento tiene datos | Departamento sigue a ciegas |
| Transformación cultural ocurre | Transformación cultural no ocurre |
| Técnicos preguntan "¿cómo hacíamos antes sin esto?" | Sistema subutilizado, abandono |

---

### User Mental Model

**Mental Model que traen los usuarios (basado en su experiencia actual):**

#### Carlos (Operario)

**Estado Actual - Método Actual:**
- Reporta por WhatsApp: "La perfiladora P-201 falló"
- Nunca sabe si alguien leyó el mensaje
- Pregunta 2 horas después: "¿Alguien vino a ver la perfiladora?"
- Javier responde: "Sí, ya la asigné a María"
- Carlos piensa: "Podrías haberme dicho..."

**Mental Model:**
- **Espera:** Respuesta inmediata (como WhatsApp)
- **Frustración:** "¿Para qué reporto si nadie hace caso?"
- **Necesita:** Feedback inmediato y visibilidad de estado

**Qué esperan sobre cómo debería funcionar:**
- **Confirmación inmediata:** Como WhatsApp "✓ Visto" o "✓✓ Entregado"
- **Notificaciones push:** Saber cuando hay actualización sin preguntar
- **Simplicidad:** Un input, un botón de enviar

**Dónde se confunden o frustren:**
- Si reporta y no recibe confirmación → "¿Se envió o no?"
- Si no recibe notificaciones → "Igual que WhatsApp, nadie hace caso"

---

#### María (Técnica)

**Estado Actual - Método Actual:**
- Javier le llama: "María, ve a la perfiladora P-201, falló"
- Busca en Excel: "¿Qué repuestos necesita?"
- Llama a Pedro: "¿Tenemos el rodamiento SKF-6208?"
- Pedro: "Sí, está en el estante A3"
- Completa OT: "Listo"
- Nadie confirma con Carlos si funciona

**Mental Model:**
- **Espera:** Lista clara de trabajo (como su agenda personal)
- **Frustración:** "No sé qué tengo que hacer hoy"
- **Necesita:** Organización y contexto completo

**Dónde se confunden o frustran:**
- Si lista de OTs es confusa → "Voy a preguntar a Javier como siempre"
- Si falta información → "Necesito llamar a Pedro para stock"

---

#### Javier (Supervisor)

**Estado Actual - Método Actual:**
- Recibe 10+ WhatsApps con info desordenada
- Llama a cada técnico para asignar: "¿Estás libre?"
- Busca en pizarra Kanban física (puede estar desactualizada)
- No sabe carga de trabajo real de cada técnico

**Mental Model:**
- **Espera:** Control visual de carga de trabajo (como Kanban físico)
- **Frustración:** "Voy apagando fuegos todo el día"
- **Necesita:** Visibilidad total y asignación rápida

**Dónde se confunden o frustran:**
- Si asignación requiere 5+ clicks → "Voy a llamarle, es más rápido"
- Si no ve carga de trabajo → "No sé quién está libre u ocupado"

---

#### Elena (Admin)

**Estado Actual - Método Actual:**
- Busca en 3 Excels diferentes para datos
- No tiene indicadores reales
- No puede fundamentar decisiones

**Mental Model:**
- **Espera:** Datos para tomar decisiones (como dashboard financiero)
- **Frustración:** "No tengo indicadores reales"
- **Necesita:** KPIs claros y drill-down

**Dónde se confunden o frustran:**
- Si dashboard es confuso → "Voy a buscar en los Excels como siempre"
- Si requiere análisis complejo → "No entiendo estos datos"

---

### Success Criteria

**¿Qué hace que los usuarios digan "esto simplemente funciona"?**

#### Para Carlos (Operario)

1. **Rapidez:** Reporte completo en <30 segundos
   - Búsqueda predictiva <200ms
   - Descripción problema: 10 segundos
   - Seleccionar urgencia: 2 segundos
   - Enviar: 1 segundo
   - Total: ~30 segundos

2. **Confirmación inmediata:** "✓ Aviso #AV-234 recibido - Evaluando"
   - Feedback visual en <500ms después de tocar "Enviar"
   - Toast notification con ✓ verde

3. **Notificaciones push:** Recibe actualización en cada transición
   - "Tu aviso fue autorizado - OT asignada a María" (minutos después)
   - "OT en progreso - María está trabajando" (horas después)
   - "OT completada - ¿Confirma que funciona bien?" (al final)

4. **Cierre de ciclo:** Validación del operario
   - "OT completada - ¿Confirma que su perfiladora funciona bien?"
   - Carlos toca "Sí, funciona bien"
   - Sistema: "Gracias por tu reporte #AV-234"

**Indicadores de Éxito:**
- ✅ Carlos reporta en <30 segundos
- ✅ Carlos recibe confirmación visual inmediata
- ✅ Carlos recibe notificación en cada transición
- ✅ Carlos valida solución al final
- ✅ Carlos piensa: "¡Me escucharon! Mi voz importa."

---

#### Para María (Técnica)

1. **Lista clara:** Al abrir app, ve sus OTs priorizadas
   - 5 OTs del día con prioridad (urgente primero)
   - 2 rutinas de mantenimiento
   - Cada OT muestra: equipo, ubicación, problema, repuestos necesarios

2. **Contexto completo:** Toda la información relevante
   - Modal ℹ️ con historial completo del equipo
   - Stock visible al seleccionar repuesto
   - Click-to-call desde modal

3. **Actualización simple:** Un botón ▶️ "Iniciar"
   - Botón táctil 44x44px mínimo
   - Feedback visual inmediato
   - Tarjeta cambia a "En Progreso"

**Indicadores de Éxito:**
- ✅ María ve lista clara al abrir app
- ✅ María tiene toda la información necesaria
- ✅ María actualiza OT sin preguntar
- ✅ María piensa: "Trabajo de forma profesional y organizada."

---

#### Para Javier (Supervisor)

1. **Visibilidad total:** Ve carga de trabajo de todos los técnicos
   - Kanban con columnas por técnico
   - Contador de OTs: "María: 3 OTs, Ana: 5 OTs, Pedro: 2 OTs"
   - Código de colores por tipo de OT

2. **Asignación en 2 segundos:** Drag-and-drop fluido
   - Arrastrar tarjeta OT sobre "María" → assigned
   - Confirmación visual inmediata
   - No requiere llamar al técnico

3. **Alertas de balanceo:** Distribución eficiente
   - "María tiene 8 OTs, Laura solo 2" (toast warning)
   - Javier reasigna equitativamente

**Indicadores de Éxito:**
- ✅ Javier ve carga de trabajo completa
- ✅ Javier asigna en <2 segundos sin llamar
- ✅ Javier distribuye trabajo eficientemente
- ✅ Javier piensa: "Tengo control total de mi equipo."

---

#### Para Elena (Admin)

1. **KPIs claros:** Métricas ejecutivas visibles
   - MTTR: 4.2h (↓15% vs mes anterior) - verde
   - MTBF: 127h (↑8% vs mes anterior) - verde
   - OTs Abiertas: 23 (↓5 vs mes anterior)
   - Técnicos Activos: 5 (de 8 totales)

2. **Drill-down simple:** Un toque para profundizar
   - Toca MTTR → Global → Planta → Línea → Equipo
   - Identifica equipo problemático (Prensa PH-500 con MTTR 12h)

3. **Exportar Excel:** Un botón para reporte
   - Datos listos para presentación a dirección

**Indicadores de Éxito:**
- ✅ Elena ve KPIs claros al abrir dashboard
- ✅ Elena profundiza al equipo problemático
- ✅ Elena exporta datos sin esfuerzo
- ✅ Elena piensa: "Por primera vez tengo datos para fundamentar decisiones."

---

### Novel UX Patterns

**Análisis: ¿Usamos patrones establecidos o innovamos?**

**Veredicto: Combinación de Patrones Establecidos + Innovación en Contexto**

---

#### Patrones Establecidos que Adoptamos

**1. Transparencia de Estado (WhatsApp)**

- ✓ Confirmación visual: "Aviso recibido" ✓
- ✓ Notificaciones push en cada transición
- ✓ Código de estados (enviado, entregado, visto)
- **Por qué adoptarlo:** Usuarios ya conocen este patrón, curva de aprendizaje cero

**2. Kanban Visual (Trello)**

- ✓ Columnas con tarjetas
- ✓ Drag-and-drop para mover tarjetas
- ✓ Código de colores para categorización
- **Por qué adoptarlo:** Javier ya usa Kanban físico, transición natural

**3. Búsqueda Predictiva (Spotify)**

- ✓ Autocompletado mientras escribes
- ✓ Resultados contextuales con información relevante
- ✓ Un toque/selección para acción principal
- **Por qué adoptarlo:** Carlos usa Spotify, Netflix, conoce búsqueda instantánea

---

#### Innovación en Contexto (Nuestro Twist Único)

**1. Feedback Loop Completo con Operario**

**Qué lo hace diferente:**
- La mayoría de GMAOs no incluyen validación del operario
- Sistemas enterprise típicamente son opacos (solo técnicos/supervisores participan)

**Cómo lo enseñamos:**
- "OT completada - ¿Confirma que su perfiladora funciona bien?"
- Metáfora familiar: Como WhatsApp "visto", tenemos "confirmación del operario"

**Por qué es innovador:**
- Operario participa en validación de calidad
- Genera sentido de pertenencia: "mi voz importa"
- Feedback loop → detectar reparaciones incompletas → mejora MTBF

---

**2. Stock Visible al Seleccionar Repuesto**

**Qué lo hace diferente:**
- Sistemas típicos requieren navegar a página de inventario separada
- Usuario debe ir a módulo "Stock", buscar repuesto, ver stock

**Cómo lo enseñamos:**
- Tooltip contextual al seleccionar repuesto
- Muestra: "Rodamiento SKF-6208 (Stock: 12, 📍 Estante A3, Cajón 3)"
- Metáfora familiar: Como Spotify muestra artista/álbum al buscar canción

**Por qué es innovador:**
- Contexto sobre navegación (no perder lugar en formulario)
- María no llama a Pedro 10+ veces al día
- Stock visible donde se necesita (al usar, no al buscar)

---

**3. KPIs con Drill-down Jerárquico Industrial**

**Qué lo hace diferente:**
- Sistemas enterprise tienen dashboards complejos que abruman
- Elena no es experta en datos, necesita simplicidad

**Cómo lo enseñamos:**
- Un toque para profundizar (Global → Planta → Línea → Equipo)
- Metáfora familiar: Como folders en explorador de archivos

**Por qué es innovador:**
- KPIs accesibles para no-expertos (Elena)
- Drill-down simple sin navegación profunda
- Flechas ↑↓ vs mes anterior (visual, no numérico)

---

**4. Asignación Visual con Balanceo de Carga**

**Qué lo hace diferente:**
- Sistemas típicos requieren listados y cálculos manuales
- Supervisor debe sumar OTs mentalmente o en Excel

**Cómo lo enseñamos:**
- Alerta "María tiene 8 OTs, Laura solo 2" al arrastrar tarjeta
- Metáfora familiar: Como juegos donde ves niveles de carga

**Por qué es innovador:**
- Balanceo de carga visible sin cálculos manuales
- Supervisor distribuye trabajo eficientemente
- Equipo balanceado → técnicos no sobrecargados → mayor moral

---

### Experience Mechanics

**Mecánicas Detalladas de la Experiencia Defining**

---

#### Flujo 1: Carlos Reporta Avería

**1. Iniciación**

- **Trigger:** Perfiladora P-201 falla a las 09:00
- **Invitación:** Carlos saca móvil, abre app, ve botón grande "Reportar Avería"
- **Motivación:** "Necesito que esto se arregle para seguir produciendo"

**UI Elements:**
- Botón: `bg-danger text-white h-14 w-full rounded-lg font-semibold` (touch target 56px)
- Icono: ⚠️ (warning icon)
- Texto: "Reportar Avería"

---

**2. Interacción**

**Paso 1: Búsqueda de Equipo (<200ms)**

- Carlos toca input "Buscar Equipo"
- Placeholder: "Escribe nombre del equipo..."
- Carlos escribe "perfi"
- Sistema responde con autocompletado:
  - "Perfiladora P-201 (Stock: 12, 📍 Estante A3, Cajón 3)"
  - "Perfiladora P-202 (Stock: 8, 📍 Estante A3, Cajón 5)"
- Carlos toca "Perfiladora P-201" → seleccionado

**UI Elements:**
- Input: `h-12 w-full px-4 border rounded-lg`
- Dropdown: `absolute w-full bg-white border rounded-lg shadow-lg mt-1`
- Debouncing: 300ms

---

**Paso 2: Descripción del Problema**

- Input: "¿Qué falla?" (textarea multiline)
- Carlos escribe: "No arranca, hace raro click-click"
- Optional: Botón "📷 Adjuntar Foto" (si quiere tomar foto)

**UI Elements:**
- Textarea: `h-24 w-full px-4 py-2 border rounded-lg resize-none`
- Foto button: `bg-neutral-200 text-neutral-700 h-10 px-4 rounded-lg`

---

**Paso 3: Selección de Urgencia**

- Radio buttons: 🔴 Crítica, 🔴 Urgente, 🟡 Media, 🟢 Baja
- Default: "Media" (seleccionado)
- Carlos cambia a "Urgente" (máquina parada)

**UI Elements:**
- Radio group: `flex gap-2 flex-wrap`
- Buttons: `h-11 px-6 rounded-full border-2`

---

**Paso 4: Enviar Aviso**

- Botón: "Enviar Aviso" (`bg-danger text-white h-14 w-full`)
- Carlos toca → **Confirmación visual inmediata**

**UI Elements:**
- Button: `bg-danger text-white h-14 w-full rounded-lg font-semibold touch-manipulation`
- Loading state (si tarda): Spinner + "Enviando..."

---

**3. Feedback**

**Confirmación Inmediata (Toast + In-App):**

- Icono: ✓ verde + Texto: "✓ Aviso #AV-234 recibido - Evaluando"
- Duración: 5 segundos (desaparece automáticamente)
- Posición: Top-center o Bottom-center

**UI Elements:**
- Toast: `fixed top-4 left-1/2 transform -translate-x-1/2 bg-success text-white px-6 py-3 rounded-lg shadow-lg`

---

**Notificación Push #1 (minutos después):**

- "Tu aviso #AV-234 fue autorizado - OT #OT-567 asignada a María"
- Carlos toca notificación → abre app → ve detalles de OT

**UI Elements:**
- Push notification (PWA)
- Deep link: Abre app en pantalla de detalles de OT #OT-567

---

**Notificación Push #2 (horas después):**

- "OT #OT-567 en progreso - María está trabajando"
- Carlos piensa: "¡Genial! Ya están arreglándolo."

---

**Notificación Push #3 (al completar):**

- "OT #OT-567 completada - ¿Confirma que su perfiladora funciona bien?"
- Carlos toca notificación → abre app → dialog modal

---

**4. Completion**

**Validación Final del Operario:**

- Dialog modal: "¿Su perfiladora P-201 funciona bien ahora?"
- Botones: "Sí, funciona bien" / "No, todavía falla"
- Carlos toca "Sí, funciona bien"
- Sistema responde: "Gracias por tu reporte #AV-234"

**UI Elements:**
- Dialog (Shadcn): `Dialog` + `DialogHeader` + `DialogContent` + `DialogFooter`
- Buttons: `bg-success text-white` / `bg-neutral-200 text-neutral-700`

---

**Próxima Acción:**

- Carlos puede:
  - Reportar otra avería (botón "Reportar Otra Avería")
  - Ver historial de sus avisos (tab "Mis Avisos")

---

#### Flujo 2: Javier Asigna OT

**1. Iniciación**

- **Trigger:** Javier abre tablero Kanban a las 07:00
- **Invitación:** Ve tarjeta rosa (Aviso Carlos) en columna "Pendientes Triage"
- **Motivación:** "Necesito evaluar y asignar esta avería rápidamente"

**UI Elements:**
- Kanban board: 8 columnas horizontales
- Cards: Tarjetas con código de colores
- Badge: "Pendientes Triage: 3" (contador)

---

**2. Interacción**

**Paso 1: Triage (Modal ℹ️)**

- Javier toca tarjeta rosa → Modal ℹ️ se abre
- Muestra:
  - Código #AV-234
  - Origen: "Carlos"
  - Fecha/Hora: "2026-02-27 09:03"
  - Equipo: "Perfiladora P-201"
  - Problema: "No arranca, hace raro click-click"
  - Foto adjunta (si Carlos tomó foto)
  - Urgencia: "Urgente" (seleccionado por Carlos)

- Javier evalúa: "Es urgente, la máquina está parada"

**UI Elements:**
- Modal (Shadcn): `Dialog` + `DialogContent`
- Typography: `text-foreground`, `text-muted-foreground`
- Badge: `bg-danger text-white` (urgencia)

---

**Paso 2: Convertir en OT**

- Javier toca botón "Convertir en OT"
- Modal de confirmación: "¿Convertir Aviso #AV-234 en OT?"
- Javier selecciona técnico: Dropdown con lista
  - Sistema muestra carga actual: "María: 3 OTs, Ana: 5 OTs, Pedro: 2 OTs"
  - Javier selecciona "María" (menos carga)
- Javier toca "Confirmar"

**UI Elements:**
- Button: "Convertir en OT" (`bg-primary text-white`)
- Select (Shadcn): `Select` + `SelectTrigger` + `SelectContent`
- Option items: Muestran nombre técnico + contador OTs

---

**Paso 3: Asignación Alternativa (Drag-and-Drop)**

- Javier arrastra tarjeta OT sobre "María" (columna o tarjeta de técnico)
- Sistema confirma visualmente: Tarjeta aparece en columna de María
- Sistema alerta si desbalance: "María tiene 8 OTs, Laura solo 2" (toast warning)

**UI Elements:**
- Drag-and-drop: `@dnd-kit/core` + `@dnd-kit/sortable`
- Droppable areas: Columnas o tarjetas de técnicos
- Visual feedback: Tarjeta con sombra mientras arrastra

---

**3. Feedback**

**Confirmación Visual Inmediata:**

- Tarjeta cambia de rosa 🌸 a rojizo 🔴 (Avería → Correctivo Propio)
- Tarjeta se mueve a columna "En Progreso" o a "María"
- Animación suave de transición

**UI Elements:**
- Background color: `bg-ot-averia-triage` → `bg-ot-correctivo-propio`
- Transition: `transition-all duration-300 ease-in-out`

---

**Notificación Push a Carlos:**

- "Tu aviso #AV-234 fue autorizado - OT #OT-567 asignada a María"
- Carlos recibe feedback sin preguntar

---

**Notificación Push a María:**

- "Nueva OT #OT-567 asignada - Perfiladora P-201, urgencia Urgente"
- María ve notificación → abre app → ve lista de OTs actualizada

---

**4. Completion**

**Próxima Acción:**

- Javier ve siguiente tarjeta en "Pendientes Triage"
- O ve dashboard con KPIs actualizados

---

#### Flujo 3: Elena Ve KPIs y Drill-Down

**1. Iniciación**

- **Trigger:** Elena abre dashboard a las 08:00
- **Invitación:** Ve 4 KPIs grandes con números y flechas ↑↓
- **Motivación:** "Necesito datos para reportar a dirección"

**UI Elements:**
- Dashboard: Grid layout con 4 cards
- KPI cards: Números grandes + flechas + colores semánticos

---

**2. Interacción**

**Paso 1: Ver KPIs**

Elena ve dashboard con 4 KPIs:

- **MTTR:** 4.2h (↓15% vs mes anterior) - verde ✓
- **MTBF:** 127h (↑8% vs mes anterior) - verde ✓
- **OTs Abiertas:** 23 (↓5 vs mes anterior)
- **Técnicos Activos:** 5 (de 8 totales)

**UI Elements:**
- Card (Shadcn): `Card` + `CardContent`
- Typography: `text-4xl font-bold` (números grandes)
- Badge: `bg-success text-white` (flechas ↓↑)

---

**Paso 2: Drill-down (MTTR)**

- Elena toca "MTTR: 4.2h"
- Sistema abre modal con drill-down jerárquico:
  - **Global:** MTTR 4.2h (todas las plantas)
  - **Planta Acero:** MTTR 3.8h
  - **Planta Panel:** MTTR 4.9h (🔴 más alto) - Elena toca
  - **Línea 2:** MTTR 6.2h (🔴 más alto) - Elena toca
  - **Equipo Prensa PH-500:** MTTR 12h, 3 fallos (🔴 problemático)

**UI Elements:**
- Modal: `Dialog` + `DialogContent` (scrollable)
- List items: Clickable con hover state
- Breadcrumbs: "Global > Planta Panel > Línea 2 > Prensa PH-500"
- Badges: `bg-danger text-white` (problemático)

---

**Paso 3: Ver Detalles (Equipo)**

- Elena toca "Prensa PH-500"
- Sistema abre modal ℹ️ con historial:
  - Fechas de fallos: 2026-01-15, 2026-02-03, 2026-02-20
  - OTs asociadas: #OT-123, #OT-456, #OT-567
  - Técnico asignado: María en los 3 casos
  - Repuestos usados: Rodamiento SKF-6208 (3 veces)

**UI Elements:**
- Modal: `Dialog` + `DialogContent`
- Table: `Table` + `TableBody` + `TableRow` + `TableCell`
- Chip badges: `bg-neutral-100 text-neutral-700`

---

**3. Feedback**

**Feedback Visual Inmediato:**

- Cada toque responde en <500ms (animación suave)
- Colores semánticos: Verde = mejora, Rojo = problema

**UI Elements:**
- Transition: `transition-all duration-200 ease-in-out`
- Active state: `bg-accent` al hacer clic en item

---

**Indicadores Visuales:**

- Flechas ↑↓ vs mes anterior
- Badges 🔴 en KPIs problemáticos
- Breadcrumbs: "Global > Planta Panel > Línea 2 > Prensa PH-500"

**UI Elements:**
- Arrow icons: `ArrowUpIcon`, `ArrowDownIcon`
- Badges: `bg-danger text-white` (problemático), `bg-success text-white` (mejora)

---

**4. Completion**

**Acción Tomada:**

- Elena identifica equipo problemático (Prensa PH-500)
- Decide acción: "Programar mantenimiento preventivo para Prensa PH-500"

**Próxima Acción:**

- Elena exporta datos a Excel (botón "Exportar Excel")
- O reporta a dirección con dashboard proyectado

**UI Elements:**
- Button: "Exportar Excel" (`bg-primary text-white`)
- Export: Genera archivo .xlsx con datos filtrados

---

## Visual Design Foundation

### Color System

**Brand Guidelines Assessment:**

No existen guías de marca previas para **gmao-hiansa**. Basándome en la personalidad del proyecto y los objetivos emocionales definidos, he diseñado un sistema de colores que transmite profesionalismo industrial, confianza y control.

**Personalidad del Proyecto:**
- Profesional e industrial (sector metal)
- Confiable y estable (transparencia radical)
- Moderno pero no "tech startup" (GMAO enterprise)

**Diferenciación de Competidores:**
- IBM Maximo/SAP PM: Colores corporativos genéricos (azules, grises)
- Infraspeak/Fracttal: Colores "tech startup" (vibrantes, modernos)
- **gmao-hiansa:** Profesional industrial con identidad única

---

**Primary Colors (Colores Primarios):**

**#722F37 Velvet Red (Rojo Burdeos) - Elegancia Industrial**

- **Uso:** Acciones principales (botones "Enviar", "Asignar", "Guardar")
- **Por qué rojo burdeos:** Color elegante, profesional, transmita fuerza y decisión
- **Contraste WCAG AA:** 8.2:1 con texto blanco ✅ (excelente)
- **Variaciones:**
  - `#722F37` (Velvet Red) - Botones primarios, links, headers
  - `#5A1A21` (Dark Velvet) - Hover states, elementos activos, elementos seleccionados
  - `#3A1215` (Darker Velvet) - Footers, elementos de bajo contraste

---

**Semantic Colors (Colores Semánticos):**

**Success #212529 - Negro (Completado, Stock OK, Confirmación)**

- **Uso:**
  - OT completada ✓
  - Stock OK (badge negro)
  - Confirmación de acción (botón "Sí", "Confirmar")
  - Texto primary (headings, contenido)
- **Contraste:** Con fondo blanco: 16.1:1 ✅ (excelente)
- **Notas:** Negro se usa para "finalización" y "completado" (estilo minimalista)

**Warning #6C757D - Gris Medio (En Progreso, Stock Bajo, Atención)**

- **Uso:**
  - OT en progreso (badge gris)
  - Stock bajo (alerta de stock mínimo)
  - Atención requerida (toast warning)
  - Texto secondary (labels, metadata)
- **Contraste:** Con fondo blanco: 5.7:1 ✅ (WCAG AA compliance)
- **Notas:** Gris medio indica "pendiente" o "en progreso"

**Danger #000000 - Negro Puro (Crítico, Error, Eliminar)**

- **Uso:**
  - OT avería (tipo de OT) - máxima urgencia
  - Urgencia crítica (producción detenida)
  - Stock crítico (alerta negra)
  - Empeoramiento KPIs (MTTR ↑15%, MTBF ↓8%)
  - Botón "Cancelar", "No", "Eliminar"
- **Contraste:** Con fondo blanco: 21.1:1 ✅ (excelente)
- **Notas:** Negro puro para máxima atención y contraste

**Info #495057 - Gris Oscuro (Información General)**

- **Uso:**
  - Notificaciones informativas
  - Tooltips
  - Badges de información
  - Bordes, separadores, dividers
- **Contraste:** Con texto blanco: 10.4:1 ✅ (WCAG AA compliance)

---

**OT Type Colors (Código de Colores Kanban):**

Estos colores son específicos para los tipos de OT en el tablero Kanban. Cada color tiene un significado semántico y se usa consistentemente en toda la aplicación.

| Código de Color | HEX | Emoji | Tipo de OT | Descripción |
|----------------|-----|-------|------------|-------------|
| **ot-averia-triage** | #E57373 | 🌸 Rosa Claro | Avería Triage | Avisos de avería pendientes de triage |
| **ot-reparacion-triage** | #F5F5F5 | ⚪ Blanco Grisáceo | Reparación Triage | Reparaciones pendientes de triage |
| **ot-correctivo-propio** | #722F37 | 🔴 Velvet Red | Correctivo Propio | Correctivos realizados por taller propio (PRIMARY COLOR) |
| **ot-correctivo-externo** | #5A1A21 | 🔴📏 Dark Velvet | Correctivo Externo | Correctivos enviados a proveedor externo (línea diagonal) |
| **ot-taller-propio** | #FFA726 | 🟡 Naranja | Taller Propio | Equipos en taller propio para reparación |
| **ot-enviado-proveedor** | #546E7A | 🔵 Azul Grisáceo | Enviado Proveedor | Equipos enviados a proveedor externo |

**Accesibilidad de OT Type Colors:**
- **#722F37 (Velvet Red)** con texto blanco: 8.2:1 ✅ (WCAG AA compliance)
- **#E57373 (Rosa Claro)** con texto blanco: 4.5:1 ✅ (WCAG AA compliance)
- **#F5F5F5 (Blanco Grisáceo)** usa texto negro #212529: 16.1:1 ✅ (WCAG AA compliance)
- **#FFA726 (Naranja)** con texto blanco: 4.5:1 ✅ (WCAG AA compliance)
- **#546E7A (Azul Grisáceo)** con texto blanco: 4.5:1 ✅ (WCAG AA compliance)
- Código de colores siempre acompañado de iconos/labels (no solo color)

---

**Priority Colors (Colores de Urgencia):**

Estos colores se usan en badges y etiquetas para indicar urgencia de una OT.

| Prioridad | HEX | Emoji | Uso |
|-----------|-----|-------|-----|
| **Crítica** | #000000 | 🔴 Negro | Máxima urgencia, producción detenida, seguridad |
| **Alta** | #6C757D | 🟡 Gris Medio | Alta urgencia, afecta producción |
| **Media** | #ADB5BD | 🟢 Gris Claro | Urgencia media, no afecta producción críticamente |
| **Baja** | #E9ECEF | 🟢 Gris Muy Claro | Baja urgencia, puede programarse |

---

**Neutral Colors (Colores Neutros):**

**Text Colors (Colores de Texto):**

| Token | HEX | Usage | Contraste |
|-------|-----|-------|----------|
| **text-primary** | #212529 | Texto principal, headings, contenido | 16.1:1 (con blanco) ✅ Excelente |
| **text-secondary** | #6C757D | Labels, metadata, descripciones, timestamps | 5.7:1 (con blanco) ✅ Bueno |
| **text-tertiary** | #ADB5BD | Captions, placeholders, texto deshabilitado | 3.0:1 (con blanco) ⚠️ Solo para decorativo |

**Background Colors (Colores de Fondo):**

| Token | HEX | Usage |
|-------|-----|-------|
| **background-primary** | #FFFFFF | Background principal de páginas, cards, modals (blanco puro) |
| **background-secondary** | #F8F9FA | Backgrounds secundarios, secciones alternadas, dashboard (gris muy claro) |
| **background-tertiary** | #E9ECEF | Backgrounds terciarios (gris claro) |

**Borders (Bordes):**

| Token | HEX | Usage |
|-------|-----|-------|
| **border-default** | #212529 | Bordes de inputs, cards, separadores (negro) |
| **border-focus** | #722F37 | Borde de input en focus (rojo burdeos - primary) |
| **border-error** | #000000 | Borde de input con error (negro puro) |

---

### Typography System

**Font Family: Inter**

**Por qué Inter:**
- Moderno pero no "startup trendy"
- Altamente legible en pantallas (optimizado para UI)
- Variable font (light, regular, medium, semibold, bold)
- System UI font fallback (San Francisco, Segoe UI, Roboto)
- Excelente para números y símbolos (importante para KPIs, OT codes)

**CSS Declaration:**
```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

---

**Type Scale (Escala Tipográfica):**

| Size | Weight | Line Height | Letter Spacing | Usage |
|------|--------|-------------|----------------|-------|
| **32px** | 700 (Bold) | 1.2 (38px) | -0.02em | **H1** - Dashboard títulos, page headers |
| **24px** | 600 (Semibold) | 1.3 (31px) | -0.01em | **H2** - KPIs grandes, section headers |
| **20px** | 600 (Semibold) | 1.4 (28px) | 0em | **H3** - Subtítulos, OT títulos, card headers |
| **18px** | 500 (Medium) | 1.5 (27px) | 0em | **Lead** - Lead paragraphs, introducciones |
| **16px** | 400 (Regular) | 1.5 (24px) | 0em | **Body** - Contenido principal, descripciones |
| **14px** | 400 (Regular) | 1.4 (20px) | 0em | **Small** - Labels, metadata, captions |
| **12px** | 400 (Regular) | 1.3 (16px) | 0.01em | **XSmall** - Timestamps, badges pequeños |

**Principios de Jerarquía Tipográfica:**
1. **H1 (32px):** Solo una vez por página (page title)
2. **H2 (24px):** KPIs grandes, section headers (2-3 por página)
3. **H3 (20px):** Subtítulos, OT titles (múltiples por página)
4. **Body (16px):** Contenido principal, descripciones
5. **Small (14px):** Labels, metadata (información secundaria)
6. **XSmall (12px):** Solo para captions no-críticos (timestamps)

---

**Font Weights (Pesos de Fuente):**

| Weight | Value | Usage |
|--------|-------|-------|
| **Light** | 300 | Decorativo, no usado en UI (evitar) |
| **Regular** | 400 | Body text, descripciones, labels |
| **Medium** | 500 | Lead paragraphs, emphasis en texto |
| **Semibold** | 600 | H3, subtítulos, elementos interactivos (botones, links) |
| **Bold** | 700 | H1, H2, page headers, énfasis fuerte |

---

**Line Heights (Interlineados):**

| Context | Line Height | Valor |
|---------|-------------|-------|
| **Headings (H1-H3)** | 1.2 - 1.4 | Más compacto para énfasis visual |
| **Body text** | 1.5 | Óptimo para legibilidad (WCAG recomendación) |
| **Captions** | 1.3 | Compacto pero legible |

**Por qué 1.5 para body:**
- WCAG recomendación para legibilidad
- Mejor lectura en pantallas (evita fatiga visual)
- Suficiente espacio para descenders (g, j, p, q, y)

---

**Letter Spacing (Espaciado entre letras):**

| Context | Letter Spacing | Rationale |
|---------|----------------|-----------|
| **Headings (MAYÚSCULAS)** | -0.02em a -0.01em | Más compacto para MAYÚSCULAS (mejor legibilidad) |
| **Headings (Title Case)** | -0.01em a 0em | Normal, Inter ya tiene spacing óptimo |
| **Body text** | 0em | Normal, Inter ya tiene spacing óptimo |
| **Small/Captions** | 0.01em | Más aireado para legibilidad en texto pequeño |

---

### Spacing & Layout Foundation

**Spacing Unit (Unidad de Espaciado):**

**Base: 4px** (Tailwind default)

Todos los espaciados son múltiplos de 4px: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

**Rationale:**
- Sistema consistente (múltiplos de 4)
- Flexibilidad suficiente (desde 4px hasta 96px)
- Algoritmo mental simple (4 × n)

---

**Spacing Scale (Escala de Spacing):**

| Token | Value | CSS | Usage |
|-------|-------|-----|-------|
| **0.5** | 2px | `gap-0.5` | Spacing mínimo (icon padding) |
| **1** | 4px | `gap-1` | Small gaps, icon padding |
| **2** | 8px | `gap-2` | Button padding, small spacing |
| **3** | 12px | `gap-3` | Form fields vertical spacing |
| **4** | 16px | `gap-4` | Card padding (móvil), form fields |
| **6** | 24px | `gap-6` | Gutters entre cards, secciones |
| **8** | 32px | `gap-8` | Section spacing |
| **10** | 40px | `gap-10` | Major sections |
| **12** | 48px | `gap-12` | Page margins (desktop) |
| **16** | 64px | `gap-16` | Large spacing (hero sections) |
| **20** | 80px | `gap-20` | Extra large spacing |
| **24** | 96px | `gap-24` | Hero sections, page headers |

---

**Component Spacing (Espaciado de Componentes):**

| Component | Padding | Margin (Horizontal) | Margin (Vertical) |
|-----------|---------|---------------------|-------------------|
| **Card (Desktop)** | 24px | 0 | 0 |
| **Card (Móvil)** | 16px | 0 | 0 |
| **Button** | 12px 24px | 8px | 8px |
| **Input** | 12px (vertical) | 0 | 8px |
| **Modal** | 24px | 0 | 0 |
| **Badge** | 4px 12px | 4px | 4px |
| **Table Cell** | 12px 16px | 0 | 0 |

---

**Grid System:**

**Desktop (>1200px):**
- **Columnas:** 12-column grid
- **Column width:** calc((100% - 264px) / 12)
- **Gutters:** 24px entre columnas
- **Max-width:** 1440px (contenedor centrado)
- **Margins:** Auto (centrado)

**Tablet (768-1200px):**
- **Columnas:** 6-column grid
- **Column width:** calc((100% - 120px) / 6)
- **Gutters:** 16px entre columnas
- **Max-width:** 100% (ancho completo)

**Móvil (<768px):**
- **Columnas:** 4-column grid
- **Column width:** calc((100% - 48px) / 4)
- **Gutters:** 12px entre columnas
- **Max-width:** 100% (ancho completo)

---

**Layout Principles (Principios de Layout):**

1. **Visual Hierarchy (Jerarquía Visual):**
   - KPIs grandes → Top (dashboard)
   - OTs Kanban → Middle (espacio principal)
   - Detalles → Bottom (modal ℹ️)

2. **Proximity (Proximidad):**
   - Elementos relacionados cerca
   - Código de colores + leyenda en misma sección
   - Botón "Convertir en OT" + Modal ℹ️ adyacentes

3. **Alignment (Alineación):**
   - Left-aligned para texto LTR (left-to-right)
   - Center para elementos interactivos (botones, cards)
   - Consistencia en margins/paddings

4. **Consistency (Consistencia):**
   - Múltiplos de 4px para spacing
   - Grid consistente (12-column desktop, 6 tablet, 4 móvil)
   - Componentes con padding consistente (24px desktop, 16px móvil)

---

**Responsive Breakpoints (Puntos de Quiebre):**

| Breakpoint | Min Width | Max Width | Layout | Device |
|------------|-----------|-----------|--------|--------|
| **xs** | 0px | 639px | 4-column grid, 1 columna Kanban | Móvil pequeño |
| **sm** | 640px | 767px | 4-column grid, 2 columnas Kanban | Móvil grande |
| **md** | 768px | 1023px | 6-column grid, 2 columnas Kanban | Tablet |
| **lg** | 1024px | 1279px | 12-column grid, 4 columnas Kanban | Desktop |
| **xl** | 1280px | 1535px | 12-column grid, 6 columnas Kanban | Desktop grande |
| **2xl** | 1536px | ∞ | 12-column grid, 8 columnas Kanban | TV 4K |

---

**Content Density (Densidad de Contenido):**

**Desktop (>1200px):**
- **Kanban:** 8 columnas visibles simultáneamente
- **KPIs:** 4 cards por fila (grid 2x2)
- **Listas:** Table con 15-20 filas visibles sin scroll

**Tablet (768-1200px):**
- **Kanban:** 2 columnas visibles (swipe para más)
- **KPIs:** 2 cards por fila (grid 2x2 vertical)
- **Listas:** Table con 10-15 filas visibles

**Móvil (<768px):**
- **Kanban:** 1 columna visible (swipe para más)
- **KPIs:** 1 card por fila (stacked vertical)
- **Listas:** List con 5-8 filas visibles

---

### Accessibility Considerations

**WCAG AA Compliance (Cumplimiento WCAG AA):**

**1. Color Contrast (Contraste de Color):**

| Elemento | Foreground | Background | Ratio | WCAG AA | Status |
|----------|-----------|------------|-------|---------|--------|
| Primary button | #FFFFFF | #0066CC | 7.4:1 | 4.5:1 | ✅ Excelente |
| Success badge | #FFFFFF | #28A745 | 3.0:1 | 4.5:1 | ⚠️ Use texto blanco |
| Warning badge | #000000 | #FFC107 | 4.5:1 | 4.5:1 | ✅ Compliance |
| Danger badge | #FFFFFF | #DC3545 | 5.9:1 | 4.5:1 | ✅ Compliance |
| Text primary | #212529 | #FFFFFF | 16.1:1 | 4.5:1 | ✅ Excelente |
| Text secondary | #6C757D | #FFFFFF | 5.7:1 | 4.5:1 | ✅ Bueno |

**Estrategia para colores con contraste <4.5:1:**
- Success (#28A745): Usar texto blanco sobre fondo verde (badge, botón)
- No usar texto verde sobre blanco (fallo WCAG AA)

---

**2. Font Size (Tamaño de Fuente):**

| Elemento | Size | WCAG AA (14px) | WCAG AA (16px) | Status |
|----------|------|----------------|----------------|--------|
| Body text | 16px | ✅ | ✅ | ✅ Compliance |
| Small text | 14px | ✅ | ✅ | ✅ Compliance |
| XSmall text | 12px | ⚠️ | ✅ | ⚠️ Solo captions no-críticos |

**Estrategia:**
- Mínimo 16px para body text
- 12px solo para captions no-críticos (timestamps, badges)
- 14px para labels, metadata

---

**3. Touch Targets (Targets Táctiles):**

| Elemento | Size | WCAG AA (44x44px) | Status |
|----------|------|-------------------|--------|
| Buttons | 56px altura × width variable | ✅ | ✅ Compliance |
| Links | 44px altura × width variable | ✅ | ✅ Compliance |
| Inputs | 44px altura × width variable | ✅ | ✅ Compliance |
| Checkboxes/Radios | 44×44px (incluyendo label) | ✅ | ✅ Compliance |

**Estrategia:**
- Mínimo 44×44px para elementos interactivos
- 56px para botones primarios (mejor tapability)
- Padding adicional para mobile (tablets, móviles)

---

**4. Text Resize (Redimensión de Texto):**

- **Requisito WCAG:** Layout soporta 200% zoom
- **Estrategia:** Usar unidades relativas (rem, em) para spacing
- **Fixed units:** Solo para borders (px)
- **Test:** Zoom 200% en browser → layout no se rompe

---

**5. Keyboard Navigation (Navegación por Teclado):**

- **Tab order:** Orden lógico (left-to-right, top-to-bottom)
- **Focus indicators:** Ring azul #0066CC (2px outline)
- **Skip links:** Si hay navegación principal, añadir "Skip to content"
- **Shortcuts:**
  - `Tab`: Navegar elementos interactivos
  - `Shift+Tab`: Navegar hacia atrás
  - `Enter`: Activar botón, link
  - `Escape`: Cerrar modal, cancelar acción

---

**6. Screen Reader (Lector de Pantalla):**

- **ARIA labels:** En elementos interactivos sin texto visible
  - Ejemplo: `<button aria-label="Cerrar modal">×</button>`
- **Alt text:** En imágenes
  - Ejemplo: `<img src="equipo.jpg" alt="Perfiladora P-201" />`
- **Semantic HTML:** Usar elementos semánticos
  - `<button>` vs `<div>` (screen reader reconoce botón)
  - `<h1>` vs `<div class="title">` (screen reader reconoce heading)
- **Roles:**
  - `role="dialog"` para modales
  - `role="alert"` para notificaciones críticas
  - `role="status"` para notificaciones informativas

---

**7. Color Blindness (Daltonismo):**

- **Estrategia:** No depender solo de color para comunicar información
- **Implementación:**
  - Iconos + color (✓ verde + icono de check, no solo verde)
  - Texto + color ("Completada" en verde, no solo verde)
  - Patrones (línea diagonal en rojo para correctivo externo)
- **Test:** Simular daltonismo en browser (DevTools → Rendering → Emulate vision deficiencies)

---

**Accessibility Checklist (Lista de Verificación):**

✅ Todos los colores cumplen contraste WCAG AA (4.5:1 mínimo)
✅ Tamaño mínimo de texto: 16px body, 14px small
✅ Touch targets mínimos: 44×44px
✅ Layout soporta 200% zoom
✅ Tab order lógico
✅ Focus indicators visibles
✅ ARIA labels en elementos interactivos
✅ Alt text en imágenes
✅ Semantic HTML (button, input, h1-h6)
✅ Color + iconos/texto (no solo color)
✅ Keyboard shortcuts documentados
✅ Skip links (si hay navegación principal)

---

## Design Direction Decision

### Design Directions Explored

He generado **6 direcciones de diseño** que exploran diferentes enfoques visuales y de interacción para **gmao-hiansa**:

| Dirección | Concepto | Densidad | Ideal Para | Key Feature |
|----------|----------|----------|------------|-------------|
| **1. Dashboard KPIs First** | KPIs prominentes en top | Media | Elena (Admin) | Datos ejecutivos al abrir app |
| **2. Kanban First** | Kanban prominente, KPIs widget lateral | Alta | Javier (Supervisor) | Visibilidad total de carga de trabajo |
| **3. List View** | Lista de OTs con filtros y detalles inline | Muy Alta | Elena (Admin) | Máximo detalle en pantalla |
| **4. Card Grid** | Grid de cards minimalista | Media-Aira | María (Técnica) | Organización visual |
| **5. Mobile First** | Optimizado para touch | Media | Carlos (Operario) | Touch targets grandes, swipe gestures |
| **6. Split View** | Split view lista + detalles | Alta | María/Javier | Productividad con lista + detalles simultáneos |

---

### Chosen Direction

**Dirección Recomendada: Híbrida Enfocada por Rol (Role-Based Adaptive Layout)**

Basándome en el análisis de los 5 usuarios primarios (Carlos, María, Javier, Elena, Pedro) y sus necesidades específicas, recomiendo una **dirección híbrida que adapta el layout según el rol del usuario**.

**Concepto Core:**

> **"La interfaz se adapta al rol del usuario, presentando la información más relevante de manera prominente mientras mantiene consistencia visual en toda la aplicación."**

**Layout por Rol:**

#### Para Carlos (Operario) - Mobile First Approach

**Layout:**
- **Top:** Botón grande "Reportar Avería" (CTA primario, 56px altura)
- **Middle:** Lista de "Mis Avisos" (solo sus averías, scrollable)
- **Bottom:** Tab bar (Home, Mis Avisos, Notificaciones, Perfil)

**Características:**
- **Densidad:** Media (optimizado para touch 44x44px)
- **Peso Visual:** Botón "Reportar" prominente (rojo #DC3545)
- **Interacción:** Touch-first, swipe gestures (left = ver detalles, right = archivar)
- **Notificaciones Push:** Prominentes (icono + badge contador)

**Cuando reporta avería:**
- Flujo simplificado de 3 pasos
- Búsqueda predictiva <200ms
- Confirmación inmediata + notificaciones en cada transición

---

#### Para María (Técnica) - Split View Approach

**Layout:**
- **Top:** Breadcrumb + Filtros (Estado, Urgencia) + Botón "Mis OTs"
- **Left (40%):** Lista de sus OTs (scrollable, selección resaltada)
- **Right (60%):** Detalles de OT seleccionada (fijo, no dismissible)

**Características:**
- **Densidad:** Alta (máxima información sin scroll)
- **Peso Visual:** Lista left con badges, detalles right con modal ℹ️
- **Interacción:** Click en lista → detalles right actualizan in-place
- **Colores:** Código de colores OT en lista, azul primario para selección

**Detalles Right Panel:**
- Código OT, equipo, ubicación, problema
- Historial de equipo (intervenciones previas)
- Repuestos usados (stock visible inline)
- Botones "▶️ Iniciar", "⏸️ Pausar", "✓ Completar"

---

#### Para Javier (Supervisor) - Kanban First Approach

**Layout:**
- **Top:** Breadcrumb + Filtros (Técnico, Tipo OT, Urgencia) + Botón "Triage"
- **Left (70%):** Tablero Kanban con 8 columnas (scroll horizontal)
- **Right (30%):** Widget KPIs compacto + Lista de Técnicos (carga de trabajo)

**Características:**
- **Densidad:** Alta (máxima información en pantalla)
- **Peso Visual:** Kanban con código de colores predominante
- **Interacción:** Drag-and-drop fluido, click en tarjeta → modal ℹ️
- **Alertas:** Toast warning si desbalance de carga

**Kanban 8 Columnas:**
1. Pendientes Triage (tarjetas 🌸 rosa)
2. Asignaciones (tarjetas divididas por técnico)
3. En Progreso (tarjetas 🔴/🟡/🔵 según tipo)
4. Pendiente Repuesto (tarjetas ⚪ blanco)
5. Pendiente Parada (tarjetas ⚪ blanco)
6. Reparación Externa (tarjetas 🔴📏 rojo línea)
7. Completadas (tarjetas 🟢 verdes)
8. Descartadas (tarjetas 🪵 gris)

**Widget KPIs Compacto:**
- MTTR 4.2h (↓15%) - click → drill-down
- MTBF 127h (↑8%) - click → drill-down
- OTs Abiertas: 23
- Técnicos Activos: 5/8

**Lista de Técnicos:**
- María: 3 OTs (badge verde si balanceado)
- Ana: 5 OTs (badge amarillo si cargado)
- Pedro: 2 OTs (badge verde si balanceado)
- Laura: 2 OTs (badge verde si balanceado)

---

#### Para Elena (Admin) - Dashboard KPIs First Approach

**Layout:**
- **Top:** 4 KPIs grandes con números y flechas ↑↓
- **Middle Left (60%):** Kanban resumido (8 columnas, tarjetas compactas)
- **Middle Right (40%):** Gráficos (MTTR/MTBF trends) + Filtros avanzados

**Características:**
- **Densidad:** Media (suficiente espacio para KPIs grandes)
- **Peso Visual:** KPIs con énfasis (números 32px bold)
- **Interacción:** Click en KPI → drill-down modal, click en gráfico → expand
- **Exportar:** Botón "Exportar Excel" prominent

**KPIs Top Row:**
| KPI | Valor | Tendencia | Click Action |
|-----|-------|-----------|--------------|
| MTTR | 4.2h | ↓15% (verde) | Modal drill-down: Global → Planta → Línea → Equipo |
| MTBF | 127h | ↑8% (verde) | Modal drill-down: Global → Planta → Línea → Equipo |
| OTs Abiertas | 23 | ↓5 (verde) | Lista de OTs abiertas (filtrar por urgencia) |
| Técnicos Activos | 5/8 | - | Lista de técnicos con carga de trabajo |

**Gráficos Middle Right:**
- MTTR Trend: Gráfico de línea (últimos 6 meses)
- MTBF by Equipo: Gráfico de barras (top 10 equipos problemáticos)
- OTs by Type: Pie chart (avería vs rutina vs preventivo)

**Filtros Avanzados:**
- Planta (Acero/Panel/Todas)
- Línea (All / Línea 1-6)
- Período (Hoy / Esta semana / Este mes / Últimos 3 meses)
- Técnico (All / María / Ana / Pedro / Laura)

---

#### Para Pedro (Stock) - Inventory Focus Approach

**Layout:**
- **Top:** Search bar + Filtros (Categoría, Stock Mínimo, Ubicación)
- **Middle:** Tabla de repuestos (columnas: Código, Nombre, Stock, Mínimo, Ubicación, Último Uso)
- **Bottom:** Botón "Generar Pedido" + Alertas Stock Mínimo

**Características:**
- **Densidad:** Alta (máxima información en tabla)
- **Peso Visual:** Badges de stock (rojo crítico, amarillo bajo, verde OK)
- **Interacción:** Click en repuesto → modal ℹ️ (historial de uso)
- **Notificaciones:** Solo alertas stock mínimo (NO spam por cada uso)

**Tabla Columnas:**
- Código: SKF-6208 (click → modal ℹ️)
- Nombre: Rodamiento SKF-6208
- Stock: 3 unidades 🔴 (crítico si <5)
- Mínimo: 5 unidades
- Ubicación: Estante A3, Cajón 3
- Último Uso: 2026-02-20 (hace 7 días)
- Acciones: "Ajustar Stock", "Ver Historial"

---

### Design Rationale

**Por qué una dirección híbrida adaptada por rol:**

1. **Diferentes necesidades por usuario:**
   - Carlos necesita simplicidad y rapidez (Mobile First)
   - María necesita organización y contexto (Split View)
   - Javier necesita visibilidad total (Kanban First)
   - Elena necesita datos ejecutivos (Dashboard KPIs First)
   - Pedro necesita control de inventario (Inventory Focus)

2. **Experiencia core soportada:**
   - Cada rol tiene layout optimizado para su tarea principal
   - Consistencia visual (colores, tipografía, componentes) mantiene identidad de marca
   - Usuario puede cambiar entre "vistas" si necesita (ej: Javier puede ver Dashboard KPIs si lo desea)

3. **Escalabilidad:**
   - Nuevos roles pueden ser añadidos con layouts específicos
   - Componentes reutilizables (Kanban, KPIs, Lista) usados en múltiples vistas
   - Sistema de permisos controla qué vistas accessibles para cada rol

4. **Mantenibilidad:**
   - Base de código consistente (Tailwind + Shadcn/ui)
   - Componentes modulares (KanbanBoard, KPIDashboard, OTList)
   - Layouts adaptados vía conditional rendering basado en rol de usuario

**Trade-offs:**

- **Complejidad:** Mayor complejidad inicial (múltiples layouts)
- **Beneficio:** Mejor UX para cada rol, mayor adopción
- **MVP:** Empezar con 2-3 layouts core (Mobile First para Carlos, Kanban First para Javier, Dashboard KPIs First para Elena)

---

### Implementation Approach

**Fase 1: Layout Core (Semana 1-2)**

**1. Setup Role-Based Routing:**

```typescript
// app/layout.tsx
import { currentUser } from '@/lib/auth'

export default function RootLayout({ children }) {
  const user = currentUser()
  const role = user.role // 'operario', 'tecnico', 'supervisor', 'admin', 'stock'

  return (
    <html lang="es">
      <body>
        <RoleBasedLayout role={role}>
          {children}
        </RoleBasedLayout>
      </body>
    </html>
  )
}
```

**2. Componente RoleBasedLayout:**

```typescript
// components/layouts/RoleBasedLayout.tsx
interface RoleBasedLayoutProps {
  role: 'operario' | 'tecnico' | 'supervisor' | 'admin' | 'stock'
  children: React.ReactNode
}

export function RoleBasedLayout({ role, children }: RoleBasedLayoutProps) {
  switch (role) {
    case 'operario':
      return <MobileFirstLayout>{children}</MobileFirstLayout>
    case 'tecnico':
      return <SplitViewLayout>{children}</SplitViewLayout>
    case 'supervisor':
      return <KanbanFirstLayout>{children}</KanbanFirstLayout>
    case 'admin':
      return <DashboardKPIsFirstLayout>{children}</DashboardKPIsFirstLayout>
    case 'stock':
      return <InventoryFocusLayout>{children}</InventoryFocusLayout>
    default:
      return <DefaultLayout>{children}</DefaultLayout>
  }
}
```

---

**Fase 2: Componentes Específicos por Vista (Semana 3-8)**

**1. MobileFirstLayout (Para Carlos):**

- **Top Bar:** Botón "Reportar Avería" + Tab bar navigation
- **Mis Avisos List:** Lista de averías del usuario (scrollable)
- **Tab Bar:** Home, Mis Avisos, Notificaciones (badge contador), Perfil

**Componentes:**
- `ReportarAveriaButton` (CTA primario, 56px altura)
- `MisAvisosList` (Scrollable list con cards)
- `TabBarNavigation` (Bottom tab bar con iconos)

---

**2. SplitViewLayout (Para María):**

- **Top:** Breadcrumb + Filtros + "Mis OTs"
- **Left Panel:** Lista de OTs (40% width)
- **Right Panel:** Detalles de OT seleccionada (60% width, fixed)

**Componentes:**
- `OTListPanel` (Left panel, scrollable)
- `OTDetailPanel` (Right panel, fixed, modal ℹ️ trigger)
- `OTFilters` (Estado, Urgencia, Técnico)

---

**3. KanbanFirstLayout (Para Javier):**

- **Top:** Breadcrumb + Filtros + "Triage"
- **Left Panel (70%):** KanbanBoard con 8 columnas
- **Right Panel (30%):** KPIs Widget + Lista de Técnicos

**Componentes:**
- `KanbanBoard` (8 columnas, drag-and-drop)
- `KPIsWidget` (Compact KPIs con click-to-drill-down)
- `TechniciansList` (Lista con carga de trabajo)

---

**4. DashboardKPIsFirstLayout (Para Elena):**

- **Top Row:** 4 KPIs grandes con números y flechas ↑↓
- **Middle Left (60%):** Kanban resumido
- **Middle Right (40%):** Gráficos + Filtros avanzados

**Componentes:**
- `KPIsCardsRow` (4 KPIs con drill-down)
- `KanbanResumido` (8 columnas, tarjetas compactas)
- `ChartsPanel` (Recharts con MTTR/MTBF trends)

---

**5. InventoryFocusLayout (Para Pedro):**

- **Top:** Search bar + Filtros
- **Middle:** Tabla de repuestos (columnas: Código, Nombre, Stock, Mínimo, Ubicación)
- **Bottom:** Botón "Generar Pedido" + Alertas Stock Mínimo

**Componentes:**
- `RepuestosTable` (Tabla con badges de stock)
- `StockAlerts` (Lista de repuestos con stock mínimo)
- `GenerarPedidoButton` (Botón para generar pedido a proveedor)

---

**Fase 3: Consistencia Visual (Semana 9-10)**

**Elementos Consistentes Across All Layouts:**

1. **Colores:** Primary azul #0066CC, Success verde #28A745, Danger rojo #DC3545
2. **Tipografía:** Inter font, type scale consistente (H1 32px, H2 24px, Body 16px)
3. **Spacing:** Múltiplos de 4px, padding consistente (24px desktop, 16px móvil)
4. **Componentes:** Button, Input, Card, Badge, Dialog (Shadcn/ui)
5. **Iconos:** Lucide React icons (consistent style)
6. **Rounded corners:** 4px (border-radius)
7. **Shadows:** `shadow-card` para cards, `shadow-modal` para modals

---

**Fase 4: Responsive Adaptation (Semana 11-12)**

**Responsive Strategy:**

- **Desktop (>1200px):** Layouts específicos por rol como se describe arriba
- **Tablet (768-1200px):** Layouts adaptados (2 columnas en lugar de 8, panels stackeados)
- **Móvil (<768px):** Todos los layouts convierten a Mobile First (1 columna, tab bar navigation)

**Ejemplo: KanbanFirstLayout en móvil:**
- Desktop: 8 columnas horizontales
- Tablet: 2 columnas (swipe para ver más)
- Móvil: 1 columna (swipe para ver más, OT card expandida)

---

**Next Steps:**

1. **Setup Role-Based Routing:** Implementar routing basado en rol de usuario
2. **Build Core Layouts:** Crear 5 layouts específicos (MobileFirst, SplitView, KanbanFirst, DashboardKPIsFirst, InventoryFocus)
3. **Build Specific Components:** Crear componentes específicos por vista (KanbanBoard, KPIsWidget, OTList, etc.)
4. **Ensure Visual Consistency:** Validar que colores, tipografía, spacing son consistentes
5. **Responsive Testing:** Testear en desktop, tablet, móvil para cada layout

---

## Component Strategy

### Design System Components

**Foundation from Shadcn/ui:**

Based on our design system choice (Tailwind CSS + Shadcn/ui from Step 6), we have access to comprehensive component primitives that require no custom development:

**Form & Input Components:**
- Button, Input, Textarea, Select, Checkbox, Radio Group
- Form labels with validation states
- Search input with debouncing capability

**Layout & Containers:**
- Card - For information containers (OT details, dashboards)
- Dialog/Modal - For OT detail views
- Separator - For visual hierarchy in cards
- Scroll Area - For vertical scrolling within columns
- Tabs - For Kanban ↔ List view toggle

**Feedback & Communication:**
- Toast - Success/error notifications
- Alert - Warning and information messages
- Tooltip - Contextual information
- Badge - Priority indicators and status labels
- Avatar - Technician initials and profile pictures

**Navigation & Interaction:**
- Dropdown Menu - Quick action menus
- Popover - Contextual actions
- Command Palette - Future universal search (Phase 2)

**Data Display:**
- Table - Alternative list view for OTs
- Progress - Time tracking and completion status

**Strategy:** Use Shadcn/ui components as building blocks. All custom components will compose these primitives for consistency and maintainability.

---

### Custom Components

Based on user journey analysis and gap assessment, the following custom components require specialized design:

#### 1. Kanban Board

**Purpose:** Central control dashboard for maintenance department workflow visualization. Enables supervisors to perform triage, assign work, and monitor real-time status across 8 workflow stages.

**Usage:**
- Default view for Supervisors and Technicians on login
- Continuous supervision throughout shift
- Morning assignment planning (15-20 min sessions)
- Used on desktop, tablet, and 4K TV displays

**Anatomy:**
```
Header (60px fixed)
├─ Logo + Title "Tablero Kanban"
├─ Search bar (global equipment/OT search)
├─ Filters (State | Technician | Urgency)
└─ View toggle (Kanban | List) | New OT button

Board (calc(100vh - 60px))
└─ 8 Columns (min 320px width, 16px gap)
   ├─ 1. Pendientes Triage
   ├─ 2. Asignaciones (SPLIT COLUMN)
   │  ├─ Top: Pendiente de Asignar (unassigned)
   │  └─ Bottom: Programada (assigned)
   ├─ 3. En Progreso
   ├─ 4. Pendiente Repuesto
   ├─ 5. Pendiente Parada
   ├─ 6. Reparación Externa
   ├─ 7. Completadas
   └─ 8. Descartadas
```

**Column "Asignaciones" Split Design:**
- Horizontal divider (2px solid #722F37)
- Top section: "🔴 PENDIENTE DE ASIGNAR (N)" - unassigned OTs
- Bottom section: "📋 PROGRAMADA (N)" - assigned OTs
- When technician assigned: Card animates down (slide 200ms)

**States:**
1. **Loading:** Skeleton screens for columns
2. **Default:** Full board with OTs in current states
3. **Empty Column:** "No hay OTs en este estado" message
4. **Filtering:** Badge showing "3 de 12 OTs visibles"
5. **Dragging:** Source card opacity 60%, elevated +8px
6. **Drop Target:** Valid column shows red burgundy border + subtle highlight
7. **Error:** Retry button + error message

**Variants:**
- **Full Desktop (>1400px):** All 8 columns visible
- **Tablet (768-1400px):** 4-6 columns + horizontal scroll
- **Mobile (<768px):** 1 column + swipe lateral + dots indicator
- **Personalized View:** Filtered by user (e.g., "Solo mis OTs" for technicians)
- **Technician View:** Only shows assigned OTs (other technicians' cards semi-transparent)

**Accessibility (WCAG AA):**
- **Contrast:** All text 4.5:1 minimum (met by burgundy/white palette)
- **Touch Targets:** Cards 44x44px minimum (actual: 296x140px)
- **Keyboard Navigation:**
  - Tab: Navigate between cards in visual order
  - Enter/Space: Open OT detail modal
  - Arrow keys: Navigate between columns and cards
  - Escape: Close modal
  - Home/End: First/last card in column
- **ARIA Labels:** Full card information announced on focus
- **Focus Indicators:** 3px solid #722F37 border + 2px outline

**Interaction Behavior:**

**Drag & Drop Permissions:**
- **Javier (Supervisor):** Can drag any card between columns
- **María (Technician):** Can drag HER cards only (Asignada→En Progreso, En Progreso→Completada, En Progreso→Pendiente Repuesto)
- **Elena (Admin):** Read-only (no drag)
- **Carlos (Operator):** Does not use Kanban

**Valid State Transitions:**
```
Pendientes Triage (1)
    ↓ [Convertir en OT + Assign technician]
Asignaciones - Pendiente de Asignar (2a)
    ↓ [Assign technician]
Asignaciones - Programada (2b)
    ↓ [▶️ Start]
En Progreso (3)
    ├─→ [Complete] → Completadas (7)
    ├─→ [Need parts] → Pendiente Repuesto (4)
    └─→ [Pause] → Pendiente Parada (5)
Pendiente Repuesto (4) ← [Parts arrived]
    ↓
En Progreso (3)
Pendiente Parada (5) ← [Resume]
    ↓
En Progreso (3) or Asignaciones (2)
```

**Click Behavior:**
1. Click card → Opens Modal ℹ️ with full OT details
2. Quick actions in modal (role-dependent):
   - Technician: [▶️ Start], [✅ Complete], [📦 Need parts], [📎 Add part], [💬 Note], [📷 Photo]
   - Supervisor: [▶️ Start], [✅ Complete], [👤 Reassign], [✏️ Edit], [📎 Add part], [💬 Note], [📷 Photo]
   - Admin: Read-only view

**Real-time Updates (WebSockets):**

**Scenario 1: María completes OT**
- T=0ms: María clicks [✅ Complete]
- T=50ms: Local card fades out from "En Progreso" (200ms)
- T=250ms: Card fades in to "Completadas" (200ms)
- T=300ms: WebSocket broadcasts update
- T=400ms: All clients see card move with animation
- T=600ms: Carlos (operator) receives push notification

**Scenario 2: New alert reported**
- T=0ms: Carlos submits failure report from mobile
- T=200ms: New pink card appears in Javier's "Pendientes Triage" (fade in + slide up 200ms)
- T=300ms: "NUEVA" badge pulses on card
- T=400ms: Javier receives push: "Nueva avería reportada: MA-001"

**Performance Optimizations:**
- **Virtual Scrolling:** Render only visible cards + 10 buffer (for columns with 50+ cards)
- **Lazy Loading:** Modal ℹ️ loads details on-demand (skeleton 200ms)
- **Debouncing:** 300ms debounce on search/filters
- **WebSocket Heartbeat:** Ping/pong every 30 seconds
- **Cache:** LocalStorage cache of last Kanban state (5-minute TTL)
- **Optimized Renders:** React.memo on cards, only re-render changed columns/cards

---

#### 2. OT Card

**Purpose:** Rich information display component for maintenance work orders within Kanban columns.

**Usage:** Used exclusively within Kanban Board columns. Each card represents one OT with critical information at a glance.

**Anatomy:**
```
┌────────────────────────────────────────────┐
│ OT-2026-0001           ┌──────────┐        │ Header Row
│ Motor principal no     │ 🔴 CRÍTICA│       │ ID + Title + Priority Badge
│ arranca                └──────────┘        │
├────────────────────────────────────────────┤
│ 🏭 MA-001 │ Planta A │ Línea 1            │ Machine Row (Code + Location)
├────────────────────────────────────────────┤
│ 👤 Carlos García                            │ Assignment (or "Sin asignar")
├────────────────────────────────────────────┤
│ ⏱️ Hace 2 horas en este estado             │ Time in State
│                                              │
│ ┌──────────────────────────────────────┐  │ Conditional Alert (if parts missing)
│ │ 📦 Faltan 2 repuestos               │  │
│ └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

**Dimensions:**
- Width: 100% of column (~296px with 12px padding)
- Min Height: 140px
- Max Height: None (grows with content)
- Border Radius: 8px
- Padding: 12px
- Element Gap: 8px

**Mandatory Information:**
1. **OT Number:** OT-2026-0001 (format: OT-YYYY-NNNN)
2. **Priority:** Badge (Crítica/Alta/Media/Baja) with color code
3. **Title:** Motor principal no arranca (max 2 lines, truncate with "...")
4. **Machine:** MA-001 (code) + Planta A + Línea 1 (location)
5. **Assignment:**
   - Assigned technician: "Carlos García" + avatar (CG initials)
   - Unassigned: "👤 Sin asignar" in gray
6. **Time in State:** "Hace 2 horas" / "Hace 45 min" / "Hace 3 días"

**Conditional Information:**

| Condition | Display | Visualization |
|-----------|---------|---------------|
| Missing parts | 📦 Faltan X repuestos | Alert badge in footer |
| External repair | 🔵 Enviada a proveedor | Blue border + icon |
| Internal workshop | 🟡 Taller propio | Yellow border + icon |
| Regulatory maintenance | 🟣 Mant. Reglamentario | Purple border + icon |
| Time >24h | ⚠️ Más de 24h | Warning badge |
| New OT (<5min) | NUEVA | Pulsing badge |

**Color Coding (adapted to burgundy/white/black palette):**

| OT Type | Background | Border | Text |
|---------|------------|--------|------|
| Aviso avería triage | #F8B4C4 (light pink) | #F8B4C4 | #212529 |
| Aviso reparación triage | #FFFFFF (white) | #DEE2E6 | #212529 |
| Correctivo propio | #FFFFFF (white) | #722F37 (burgundy) | #212529 |
| Correctivo externo | #FFFFFF (white) | #722F37 + white line inner | #212529 |
| Reparación interna (taller) | #FFF8DC (cream) | #F4C430 (yellow) | #212529 |
| Reparación externa | #F0F8FF (alice blue) | #4A90E2 (blue) | #212529 |
| Mantenimiento Reglamentario | #F3E5F5 (lavender) | #9B59B6 (purple) | #212529 |
| Rutina Preventiva | #F0FFF0 (honeydew) | #90EE90 (green) | #212529 |

**Priority Badges:**

| Priority | Background | Text | Icon |
|----------|------------|------|------|
| Crítica | #DC3545 (red) | #FFFFFF | ⚠️ |
| Alta | #FFC107 (yellow) | #212529 | 🔴 |
| Media | #6C757D (gray) | #FFFFFF | 🟡 |
| Baja | #28A745 (green) | #FFFFFF | 🟢 |

**States:**
1. **Default:** Normal visualization in column
2. **Hover:** Subtle elevation (`box-shadow: 0 4px 12px rgba(0,0,0,0.15)`)
3. **Dragging:** Opacity 60%, strong elevation, 2deg rotation
4. **Selected:** 3px solid burgundy border + subtle highlight
5. **New (temporal badge):** "NUEVA" badge disappears after 5 min
6. **Disabled:** Opacity 50%, cursor not-allowed

---

#### 3. Machine Status Indicator

**Purpose:** Visual indicator showing current operational state of production equipment.

**Usage:**
- Asset inventory dashboard
- Equipment detail views
- Historical OT views per machine
- Maintenance compliance dashboards

**States:**

| State | Color | Icon | Meaning |
|-------|-------|------|---------|
| Operativo | #28A745 (green) | ✅ | Machine running normally |
| Averiado | #DC3545 (red) | ❌ | Machine down, OT open |
| En Reparación | #FFC107 (yellow) | 🔧 | Being repaired |
| Retirado | #6C757D (gray) | 📦 | Removed from service |
| Bloqueado | #212529 (black) | 🚫 | Blocked (regulatory failure) |

**Visual Design:**
- **Inline version:** Small badge (24px height) for tables/lists
- **Card version:** Large indicator (48px height) for equipment cards
- **Interactive version:** Clickable to show OTs affecting this machine

**Accessibility:**
- **ARIA Label:** "Estado de máquina: Operativo" (or current state)
- **Color Blind Support:** Icon + text, never color alone
- **Contrast:** All states meet WCAG AA 4.5:1

---

#### 4. Parts Inventory Picker

**Purpose:** Specialized autocomplete for selecting replacement parts during OT completion, showing real-time stock and physical warehouse location.

**Usage:**
- Technician completing OT: "Rodamiento SKF-6208" usage
- Shows current stock: "Stock: 12"
- Shows location: "📍 Estante A3, Cajón 3"
- Updates stock automatically on selection

**Anatomy:**
```
┌────────────────────────────────────────┐
│ 📎 Agregar Repuesto                   │
├────────────────────────────────────────┤
│ 🔍 Search: [rodamiento......]         │
│         ┌────────────────────────────┐ │
│         │ Rodamiento SKF-6208        │ │
│         │ Stock: 12 │ 📍 A3-C3       │ │
│         └────────────────────────────┘ │
│         ┌────────────────────────────┐ │
│         │ Rodamiento SKF-6209        │ │
│         │ Stock: 3  │ 📍 A3-C4       │ │
│         └────────────────────────────┘ │
├────────────────────────────────────────┤
│ Cantidad: [1] │ Stock actual: 12       │
│         [✓ Cancelar]  [Agregar +]     │
└────────────────────────────────────────┘
```

**Features:**
- **Predictive Search:** <200ms response, debounced 300ms
- **Stock Display:** Real-time stock quantity visible in autocomplete
- **Location Display:** Physical warehouse location (Estante A3, Cajón 3)
- **Low Stock Warning:** "⚠️ Stock bajo (3 unidades, mínimo: 5)" in red if below minimum
- **Auto-update:** Stock decrements immediately on confirmation
- **Undo:** 5-second window to undo stock deduction

**Interaction Flow:**
1. María clicks "📎 Agregar Repuesto" in OT completion form
2. Dialog opens with search input
3. María types "rodamiento" (300ms debounce)
4. Autocomplete shows matching parts with stock + location
5. María selects "Rodamiento SKF-6208 (Stock: 12, 📍 A3-C3)"
6. Quantity field appears: [1] (default)
7. María adjusts quantity if needed: [2]
8. System confirms: "✓ Agregado. Stock actualizado: 12 → 10"
9. Part appears in OT's "Repuestos Usados" list

**Accessibility:**
- **Keyboard Navigation:** Arrow keys navigate autocomplete results
- **ARIA Live:** Stock quantity announced on selection
- **Error Prevention:** Cannot select more parts than available stock

---

#### 5. Photo Upload Component

**Purpose:** Multi-photo upload with preview for failure reports and OT documentation.

**Usage:**
- Carlos reporting failure: "Motor no arranca" + photo
- María documenting repair: Before/after photos
- Regulatory inspections: Certificate attachments

**Features:**
- **Multi-upload:** Up to 5 photos per report
- **Preview:** Thumbnail grid (100x100px)
- **Compression:** Auto-compress to <500KB per photo
- **Progress:** Upload progress bar per photo
- **Validation:** File type (JPG/PNG), max size 10MB uncompressed
- **Reorder:** Drag to reorder photos before upload
- **Delete:** X button on each thumbnail to remove

**States:**
1. **Empty:** Show upload button only
2. **Selected:** Show thumbnails preview
3. **Uploading:** Progress bars per photo
4. **Completed:** Green checkmarks on thumbnails
5. **Error:** Red X on failed photo, retry button

**Accessibility:**
- **Alt Text:** Auto-generated "Foto 1 de motor averiado"
- **Keyboard:** Tab navigates thumbnails, Delete removes selected
- **Error Announcements:** ARIA live for upload failures

---

#### 6. Time Tracking Widget

**Purpose:** Displays relative time since OT entered current state, with automatic updates every minute.

**Usage:**
- In OT Card footer: "⏱️ Hace 2 horas en este estado"
- In Modal ℹ️: Detailed timestamp with relative time
- KPIs: MTTR calculation (time from report to completion)

**Visual Design:**
- **Compact version:** "⏱️ Hace 2 horas" (card footer)
- **Detailed version:** "En este estado desde: 09:30 AM (hace 2 horas 15 min)" (modal)

**Features:**
- **Auto-update:** Refreshes every 60 seconds (client-side)
- **Relative Time:** Human-readable format
  - < 1 hour: "Hace 45 min"
  - 1-24 hours: "Hace 2 horas"
  - 1-7 days: "Hace 3 días"
  - > 7 days: "14 Ene 2026" (absolute date)
- **Warning Threshold:** "⚠️ Más de 24h" badge if stuck >24h
- **Timezone:** Displays in user's local timezone

**Implementation:**
- **Client-side calculation:** No server calls (performance)
- **Efficient:** `setInterval` every 60s, not every second
- **Cleanup:** Clear interval on component unmount

---

#### 7. KPI Dashboard Charts

**Purpose:** Visual analytics for maintenance performance metrics (MTTR, MTBF, trends).

**Usage:**
- Elena's dashboard (admin view)
- Drilling down from global → plant → line → machine
- Executive reports for management

**Charts:**

**1. MTTR (Mean Time To Repair):**
- **Type:** Line chart
- **X-axis:** Time (weeks/months)
- **Y-axis:** Hours (target: decreasing trend)
- **Goal Line:** Horizontal line showing target MTTR

**2. MTBF (Mean Time Between Failures):**
- **Type:** Line chart
- **X-axis:** Time (weeks/months)
- **Y-axis:** Days (target: increasing trend)

**3. OTs by Week:**
- **Type:** Bar chart
- **Stacked:** Completed vs. Open vs. Overdue

**4. Top 5 Recurrent Failures:**
- **Type:** Horizontal bar chart
- **Y-axis:** Machine/Component
- **Drill-down:** Click bar → OTs for that machine

**5. Technician Productivity:**
- **Type:** Bar chart (horizontal)
- **Y-axis:** Technician name
- **Benchmark:** Average line across chart

**Drill-down Behavior:**
1. Elena clicks "MTTR" chart → February week 3
2. Modal opens: "MTTR detallado - Semana 3"
3. Shows breakdown: Planta A: 3.2h, Planta B: 5.1h
4. Elena clicks "Planta A → Línea 1"
5. Shows: Línea 1 breakdown by machine
6. Elena clicks "MA-001"
7. Shows: OT history for MA-001

**Real-time Updates:**
- Charts refresh every 30-60 seconds (polling or WebSocket)
- Smooth transitions (300ms fade) when data changes

**Accessibility:**
- **Data Tables:** Every chart has "View as table" alternative
- **Screen Reader:** ARIA describes chart data in text format

**Export:**
- Button "📊 Exportar Excel"
- Generates .xlsx with multiple sheets (MTTR, MTBF, OTs, etc.)
- Compatible with Excel 2016+

---

### Component Implementation Strategy

**Hybrid Approach:**

Our component strategy balances using proven design system primitives with custom domain-specific components:

**1. Foundation Components (Shadcn/ui):**
- Use Shadcn/ui primitives for consistency (buttons, inputs, cards, dialogs, badges)
- Leverage built-in accessibility (ARIA, keyboard navigation)
- Benefit from community-tested components

**2. Custom Components (Domain-Specific):**
- Build specialized components for maintenance workflows
- Compose Shadcn/ui primitives internally
- Maintain design consistency through shared tokens (colors, spacing, typography)

**3. Compositional Example:**

```tsx
// Kanban Board (custom) uses Shadcn/ui internally:
<KanbanBoard>
  <KanbanColumn>
    <OTCard>
      <Card>              {/* ← Shadcn/ui Card */}
      <Badge>             {/* ← Shadcn/ui Badge */}
      <Avatar>            {/* ← Shadcn/ui Avatar */}
      <Button>            {/* ← Shadcn/ui Button */}
      <Separator>         {/* ← Shadcn/ui Separator */}
    </OTCard>
  </KanbanColumn>
</KanbanBoard>
```

**4. Design Tokens:**
All custom components use design tokens defined in Visual Foundation (Step 8):
- Colors: Primary #722F37 (burgundy), Background #FFFFFF, etc.
- Typography: Inter font family, 16px base
- Spacing: 4px base unit (8, 12, 16, 24, 32, 48px)
- Border Radius: 4px, 8px

**5. Accessibility Strategy:**
- Shadcn/ui primitives provide ARIA foundation
- Custom components extend with domain-specific ARIA labels
- All components meet WCAG AA (4.5:1 contrast, 44x44px targets)
- Keyboard navigation support throughout

**6. State Management:**
- Real-time updates via WebSockets (Kanban, OT states)
- Optimistic UI updates (immediate feedback, rollback on error)
- Offline fallback (show cached state, disable actions)

**7. Performance Strategy:**
- Virtual scrolling for large lists (50+ items)
- Lazy loading of detail views (on-demand)
- Debouncing on search inputs (300ms)
- Memoization to prevent unnecessary re-renders

---

### Implementation Roadmap

**Prioritized by User Journey Criticality (MVP → Post-MVP):**

#### Phase 1 - Core Components (MVP - Month 1)

**Goal:** Enable critical user journeys (Report → Assign → Execute → Complete)

**1. Kanban Board** ⭐ **HIGHEST PRIORITY**
- **Why first:** Central view for entire system
- **Dependencies:** None (can be built in parallel with backend)
- **Enables:** Javier triage, María sees assigned OTs, Elena supervision
- **Effort:** 2 weeks (drag & drop complexity, real-time sync)

**2. OT Card**
- **Why:** Required for Kanban Board
- **Dependencies:** Kanban Board
- **Enables:** Visual OT representation in columns
- **Effort:** 3 days (states, interactions, accessibility)

**3. Parts Inventory Picker**
- **Why:** María needs to register parts used when completing OTs
- **Dependencies:** Parts module (backend), Stock data
- **Enables:** Complete OT workflow, stock tracking
- **Effort:** 1 week (predictive search + stock + location)

**4. Photo Upload Component**
- **Why:** Carlos reports failures with photos, María documents repairs
- **Dependencies:** Storage service (backend)
- **Enables:** Rich failure reports, repair documentation
- **Effort:** 3 days (upload, preview, compression)

**Phase 1 Success Metrics:**
- ✅ Supervisors can perform triage in Kanban
- ✅ Technicians can see and update their OTs
- ✅ OTs can be completed with parts + photos
- ✅ Real-time updates work across devices

---

#### Phase 2 - Supporting Components (MVP+ - Month 2)

**Goal:** Enhance UX with specialized views and analytics

**5. Machine Status Indicator**
- **Why:** Asset dashboard, equipment history views
- **Dependencies:** Assets module (backend)
- **Enables:** Quick visual equipment state
- **Effort:** 2 days (5 states, color coding, icons)

**6. Time Tracking Widget**
- **Why:** OT cards show "Hace 2 horas en este estado"
- **Dependencies:** None (client-side calculation)
- **Enables:** Time-in-state visibility, MTTR calculation
- **Effort:** 1 day (relative time formatting, auto-update)

**7. KPI Dashboard Charts**
- **Why:** Elena needs MTTR, MTBF, trends for decision-making
- **Dependencies:** KPI module (backend), analytics data
- **Enables:** Data-driven decisions, executive reports
- **Effort:** 2 weeks (charts library integration, drill-down, export)

**Phase 2 Success Metrics:**
- ✅ Admin dashboard shows actionable KPIs
- ✅ Charts support drill-down (Global → Plant → Line → Machine)
- ✅ KPIs export to Excel for management
- ✅ Equipment status visible at a glance

---

#### Phase 3 - Enhancement Components (Post-MVP - Month 3+)

**Goal:** Advanced features for scalability and optimization

**8. Advanced Search Filters**
- **Why:** Universal search across all fields (Phase 2 of PRD)
- **Dependencies:** Search engine (Elasticsearch/PostgreSQL full-text)
- **Enables:** "Find all OTs for MA-001 with 'rodamiento' in description"
- **Effort:** 1 week (multi-field search, debouncing, caching)

**9. QR Code Scanner**
- **Why:** Track equipment with QR codes (Phase 3 of PRD)
- **Dependencies:** Mobile camera, QR labels on equipment
- **Enables:** Instant equipment identification, chain of custody
- **Effort:** 1 week (scanner library, integration, camera permissions)

**Phase 3 Success Metrics:**
- ✅ Universal search finds anything in <200ms
- ✅ QR scanning works on mobile (Android/iOS)
- ✅ Equipment tracking enables physical location traceability

---

#### Summary Timeline

| Phase | Duration | Components | Key Outcome |
|-------|----------|------------|-------------|
| **Phase 1** | Month 1 | Kanban Board, OT Card, Parts Picker, Photo Upload | Core workflows functional |
| **Phase 2** | Month 2 | Machine Status, Time Widget, KPI Charts | Analytics + enhanced UX |
| **Phase 3** | Month 3+ | Advanced Search, QR Scanner | Scalability + optimization |

**Total Estimated Effort:**
- **Phase 1:** ~4 weeks (1 developer)
- **Phase 2:** ~3 weeks (1 developer)
- **Phase 3:** ~2 weeks (1 developer)

**Parallel Development Opportunities:**
- Week 1-2: Kanban Board (frontend) + Backend APIs (parallel)
- Week 3: OT Card + Parts Picker (frontend) + Stock module (backend)
- Week 4: Photo Upload + Integration testing
- Week 5-6: KPI Charts (frontend) + Analytics backend
- Week 7-8: Advanced features + Performance optimization

---

## UX Consistency Patterns

### Button Hierarchy

**Purpose:** Clear visual hierarchy guides users to primary actions while preventing accidental destructive actions.

**When to Use:**
- **Primary Buttons:** Main action on a page/screen (e.g., "Reportar Avería", "Completar OT")
- **Secondary Buttons:** Alternative or less important actions (e.g., "Cancelar", "Guardar como borrador")
- **Tertiary Buttons:** Low-emphasis actions (e.g., "Ver más", "Editar")
- **Danger Buttons:** Destructive actions requiring confirmation (e.g., "Eliminar OT", "Descartar aviso")

**Visual Design:**

| Button Type | Background | Text | Border | Height | Use Case |
|-------------|------------|------|--------|--------|----------|
| **Primary** | #722F37 (burgundy) | #FFFFFF (white) | None | 44px | Main CTAs: "Reportar Avería", "Crear OT", "Guardar" |
| **Secondary** | Transparent | #722F37 | #722F37 (2px) | 44px | Alternative: "Cancelar", "Volver" |
| **Tertiary** | Transparent | #212529 (black) | None | 40px | Low-emphasis: "Ver detalles", "Editar" |
| **Danger** | #212529 (black) | #FFFFFF | None | 44px | Destructive: "Eliminar", "Descartar" |
| **Disabled** | #F8F9FA (light gray) | #6C757D | None | 44px | Unavailable actions |

**Spacing:**
- **Gap between buttons:** 12px (desktop), 8px (mobile)
- **Button groups:** Related actions grouped visually
- **Alignment:** Left-aligned for forms, right-aligned for modal actions

**Behavior:**
- **Hover:** Darken background by 10% (Primary: #5A1A21)
- **Active:** Scale to 98% (tactile feedback)
- **Focus:** 2px solid #722F37 outline + 4px offset
- **Loading:** Show spinner inside button, disable interaction
- **Success:** Change to green (#28A745) with checkmark icon (2s, then reverts)

**Accessibility:**
- **Touch Targets:** Minimum 44x44px (WCAG AA)
- **Contrast:** All combinations meet 4.5:1 minimum
- **Keyboard:** Full keyboard navigation (Tab, Enter, Space)
- **ARIA:** `aria-label` for icon-only buttons, `aria-disabled` for disabled state
- **Screen Reader:** Button purpose clearly announced

**Mobile Considerations:**
- **Full-width buttons:** On mobile <768px, primary buttons expand to 100% width
- **Stack vertically:** Button groups stack on mobile (gap: 8px)
- **Thumb-friendly:** 44px minimum height maintained

**Variants:**

**1. Action Confirmation (Critical Actions):**
```
Scenario: Javier clicks "Eliminar OT"
→ Button changes to "¿Confirmar?" (2s window)
→ If clicked again: Deletes OT
→ If not clicked: Reverts to "Eliminar OT"
```

**2. Loading State (Async Actions):**
```
Scenario: María clicks "Completar OT"
→ Button shows: [⏳ Guardando...] + spinner
→ Button disabled during save
→ On success: Button shows [✓ ¡Guardado!] (green, 2s)
→ On error: Button shows [❌ Error. Reintentar] (red)
```

---

### Feedback Patterns

**Purpose:** Keep users informed about system state, action results, and important events through clear, timely feedback.

**When to Use:**
- **Success Feedback:** After completing important actions (OT assigned, OT completed)
- **Error Feedback:** When actions fail (network error, validation error)
- **Warning Feedback:** For potentially problematic situations (low stock, OT stuck >24h)
- **Info Feedback:** For informational updates (new OT assigned, system maintenance)

#### 1. Toast Notifications (Non-intrusive)

**Visual Design:**
```
┌────────────────────────────────────────┐
│ ✓ OT completada exitosamente    [X]    │ ← Success toast
├────────────────────────────────────────┤
│ ⚠️ Stock bajo: Rodamiento SKF-6208  [X]│ ← Warning toast
├────────────────────────────────────────┤
│ ❌ Error al guardar. Reintentar.  [X]  │ ← Error toast
├────────────────────────────────────────┤
│ ℹ️ Nueva versión disponible          [X] │ ← Info toast
└────────────────────────────────────────┘
```

**Timing:**
- **Success:** 3s auto-dismiss (user can extend with hover)
- **Error:** Persistent (no auto-dismiss, requires user action)
- **Warning:** 5s auto-dismiss
- **Info:** 2s auto-dismiss

**Position:**
- **Desktop:** Top-right corner (24px from edges)
- **Mobile:** Top center (full width)

**Behavior:**
- **Stacking:** Multiple toasts stack vertically (max 3 visible)
- **Priority:** Error toasts always appear on top
- **Animation:** Slide in from right (desktop) / top (mobile), fade out on dismiss

**Accessibility:**
- **ARIA Live:** `role="status"` for toasts, `aria-live="polite"`
- **Screen Reader:** Full toast text announced
- **Keyboard:** Esc to dismiss, Tab to next toast
- **Focus:** Focus does NOT move to toast (non-modal)

**Use Cases:**
- ✅ "✓ OT-2026-0001 completada exitosamente"
- ⚠️ "⚠️ Stock bajo: SKF-6208 (3 unidades, mínimo: 5)"
- ❌ "❌ Error de conexión. Reintentando..."
- ℹ️ "ℹ️ Nueva OT asignada: OT-2026-0002"

---

#### 2. Inline Validation (Forms)

**Visual Design:**
```
┌─────────────────────────────────────┐
│ Equipo: [Perfiladora P-201    ✓]    │ ← Success state
│         ──────────────────────────   │
│ Equipo: [                ⚠️]         │ ← Warning state
│         Este equipo tiene 3 OTs abiertas│
│         ──────────────────────────   │
│ Equipo: [                ❌]         │ ← Error state
│         Campo requerido             │
└─────────────────────────────────────┘
```

**Timing:**
- **Real-time:** Validate on blur (field loses focus)
- **Debounced:** For search inputs, validate 300ms after last keystroke

**Behavior:**
- **Success:** Green checkmark + "¡Válido!" message
- **Warning:** Yellow warning + helpful message
- **Error:** Red X + error message below input
- **Disabled:** Gray + "Omitido" message

**Accessibility:**
- **ARIA:** `aria-invalid="true"`, `aria-describedby` for error message
- **Color + Icon:** Never rely on color alone (always use icon + text)
- **Screen Reader:** Error message announced on field focus

---

#### 3. Confirmation Dialogs (Destructive Actions)

**Visual Design:**
```
┌────────────────────────────────────────┐
│ ¿Eliminar esta OT?           [X]       │ ← Dialog title
├────────────────────────────────────────┤
│ Esta acción no se puede deshacer.     │
│                                        │
│ OT-2026-0001: Motor principal no      │
│ arranca                                │
│                                        │
│ ¿Estás seguro de que deseas eliminarla?│
├────────────────────────────────────────┤
│         [Cancelar]  [Eliminar]         │ ← Actions
└────────────────────────────────────────┘
```

**When to Use:**
- **Destructive actions:** Delete OT, discard alert, remove equipment
- **Irreversible actions:** Complete OT, change technician assignment
- **Mass actions:** Bulk delete, bulk reassign

**Behavior:**
- **Focus trap:** Keyboard focus cannot leave dialog
- **Backdrop:** Dark semi-transparent overlay (click outside to cancel)
- **Escape key:** Closes dialog and cancels action
- **Enter key:** Activates primary action button

**Accessibility:**
- **ARIA:** `role="dialog"`, `aria-labelledby` for title, `aria-modal="true"`
- **Focus:** Moves to dialog on open, returns to trigger on close
- **Screen Reader:** Full dialog content announced

---

#### 4. Push Notifications (Mobile/Real-time)

**Visual Design (Mobile):**
```
┌────────────────────────────────────────┐
│ 📱 gmao-hiansa          Ahora  hace 2m│
├────────────────────────────────────────┤
│ OT-2026-0001 completada                │
│                                        │
│ ¿Confirma que funciona correctamente?  │
│                                        │
│          [Sí, funciona]  [Reportar    │
│                          problema]     │
└────────────────────────────────────────┘
```

**When to Use:**
- **OT assigned:** "Nueva OT asignada: OT-2026-0002"
- **OT in progress:** "OT en progreso - María está trabajando"
- **OT completed:** "OT completada - ¿Confirma que funciona?"
- **Stock critical:** "⚠️ Stock crítico: SKF-6208 alcanzó mínimo"

**Behavior:**
- **Actionable:** Some notifications have quick actions (Yes/No buttons)
- **Deep links:** Tapping notification opens relevant screen (OT details)
- **Grouping:** Multiple similar notifications group (e.g., "3 OTs asignadas")
- **Quiet hours:** No notifications 10pm-6am (except critical alerts)

---

#### 5. Empty States (No Data)

**Visual Design:**
```
┌────────────────────────────────────────┐
│                                        │
│             📭                         │
│                                        │
│     No hay OTs en este estado          │
│                                        │
│ Las OTs aparecerán aquí cuando se      │
│ creen o asignen.                       │
│                                        │
│         [Crear nueva OT]               │
│                                        │
└────────────────────────────────────────┘
```

**When to Use:**
- **Kanban column empty:** "No hay OTs en este estado"
- **Search no results:** "No se encontraron OTs que coincidan con 'X'"
- **Zero notifications:** "No tienes notificaciones pendientes"
- **No equipment:** "No hay equipos registrados aún"

**Elements:**
1. **Icon:** Relevant illustration or emoji (📭, 🔍, 📊)
2. **Title:** Clear, friendly message
3. **Description:** Helpful context (why is this empty?)
4. **Action:** Primary CTA to resolve empty state (optional)

**Tone:**
- **Friendly:** "Aún no tienes OTs asignadas" (not "ERROR: No data found")
- **Helpful:** "Las OTs aparecerán aquí cuando tu supervisor te asigne trabajo"
- **Action-oriented:** "Crear primera OT" or "Solicitar acceso"

---

#### 6. Loading States

**Skeleton Screens (Preferred):**
```
┌────────────────────────────────────────┐
│ ┌──────────┐ ┌──────────┐ ┌───────┐  │
│ │ ▓▓▓▓▓▓▓▓  │ │ ▓▓▓▓▓▓▓▓  │ │ ▓▓▓▓▓  │  │ ← Skeleton cards
│ └──────────┘ └──────────┘ └───────┘  │
│ ┌──────────┐ ┌──────────┐             │
│ │ ▓▓▓▓▓▓▓▓  │ │ ▓▓▓▓▓▓▓▓  │             │
│ └──────────┘ └──────────┘             │
└────────────────────────────────────────┘
```

**When to Use:**
- **Initial page load:** Skeleton of expected content
- **Data fetching:** Skeleton rows while loading table/Kanban
- **Image upload:** Progress bar + thumbnail

**Progress Indicators:**
- **Spinner:** For actions <3s (e.g., form submission)
- **Progress bar:** For multi-step actions >3s (e.g., photo upload)
- **Percentage:** For long-running operations (e.g., "Cargando... 67%")

**Animation:**
- **Skeleton pulse:** Subtle shimmer animation (opacity 0.5 → 1)
- **Spinner:** 60fps rotation (smooth, not distracting)
- **Progress bar:** Smooth transition (300ms ease)

**Accessibility:**
- **ARIA:** `aria-busy="true"`, `aria-live="polite"` for status updates
- **Screen Reader:** "Cargando..." or percentage announced
- **Focus:** Focus stays on trigger, not stolen by loading state

---

### Form Patterns

**Purpose:** Consistent, accessible form design optimized for industrial environment (factory floor, tablet use).

**When to Use:**
- **Reportar Avería:** Operator creates failure report
- **Completar OT:** Technician completes work order
- **Crear OT Manual:** Supervisor creates OT directly
- **Editar Perfil:** User updates personal information

#### 1. Form Layout

**Visual Design (Desktop >768px):**
```
┌────────────────────────────────────────────┐
│ Reportar Avería                     [X]     │ ← Modal title
├────────────────────────────────────────────┤
│ * Equipo:                                │
│ ┌──────────────────────────────────────┐ │
│ │ 🔍 Buscar equipo o código...        │ │ ← Search input
│ └──────────────────────────────────────┘ │
│         ┌─────────────────────────────┐  │
│         │ Perfiladora P-201 (MA-001)  │  │ ← Autocomplete
│         │ Planta A - Línea 1          │  │
│         └─────────────────────────────┘  │
│                                        │
│ * Tipo de Avería:                      │
│ ○ Eléctrica  ○ Mecánica  ○ Neumática  │ ← Radio buttons
│               ○ Otra                   │
│                                        │
│ * Urgencia:                            │
│ ○ Baja  ○ Media  ● Alta  ○ Crítica    │ ← Radio buttons
│                                        │
│ * Descripción:                         │
│ ┌──────────────────────────────────────┐ │
│ │ Describe el problema observado...   │ │ ← Textarea
│ │                                      │ │
│ └──────────────────────────────────────┘ │
│ Mínimo 20 caracteres                   │
│                                        │
│ Adjuntar Fotos (opcional):             │
│ ┌────┐ ┌────┐ ┌────┐                  │
│ │📷  │ │IMG │ │IMG │   [+ Add more]  │ ← Photo upload
│ └────┘ └────┘ └────┘                  │
│                                        │
├────────────────────────────────────────────┤
│                [Cancelar]  [Enviar ↵]     │ ← Actions
└────────────────────────────────────────────┘
```

**Mobile (<768px):**
- **Single column:** All fields stacked vertically
- **Full-width inputs:** Inputs expand to 100% width
- **Larger touch targets:** 44px minimum height maintained
- **Sticky submit:** "Enviar" button sticks to bottom when scrolling long forms

**Spacing:**
- **Field gap:** 16px vertical spacing between fields
- **Label gap:** 8px between label and input
- **Section gap:** 24px between form sections

#### 2. Form Validation

**Validation Timing:**
- **On blur:** Validate field when user leaves it (desktop)
- **On submit:** Validate all fields on form submission
- **Real-time:** For search fields, validate 300ms after last keystroke

**Validation States:**

**1. Default (Pristine):**
```
Equipo: [Buscar equipo...]        ← No validation yet
```

**2. Success (Valid):**
```
Equipo: [Perfiladora P-201  ✓]    ← Green checkmark
```

**3. Warning (Valid with issues):**
```
Equipo: [Perfiladora P-201  ⚠️]    ← Yellow warning
         Este equipo tiene 3 OTs abiertas
```

**4. Error (Invalid):**
```
Equipo: [                  ❌]     ← Red X
         Campo requerido
```

**5. Disabled:**
```
Equipo: [Perfiladora P-201  🔒]    ← Gray + lock icon
         (solo lectura)
```

**Error Message Placement:**
- **Below input:** Error messages appear immediately below the invalid field
- **Red text:** Error messages in #DC3545 (red)
- **Icon prefix:** ❌ or ⚠️ icon for quick scanning

**Required Fields:**
- **Asterisk (*):** Mark required fields with red asterisk
- **Legend:** "Los campos marcados con * son obligatorios" at top of form

#### 3. Form Actions

**Button Placement:**
- **Desktop:** Right-aligned (primary action most prominent)
- **Mobile:** Stacked vertically, full-width buttons

**Button Order:**
- **Left:** Secondary action ("Cancelar")
- **Right:** Primary action ("Enviar", "Guardar")

**Submit Behavior:**
```
1. User clicks [Enviar]
2. Form validates all fields
   → If errors: Show error messages, focus first error
   → If valid: Proceed to step 3
3. Button shows: [⏳ Enviando...] (disabled)
4. On success:
   → Button shows: [✓ ¡Enviado!] (green, 2s)
   → Toast: "✓ Avería reportada exitosamente"
   → Form closes (modal) or redirects
5. On error:
   → Button shows: [❌ Error. Reintentar]
   → Toast: "❌ Error de conexión. Inténtalo de nuevo."
```

#### 4. Accessibility

**Form Labels:**
- **Visible labels:** All inputs have visible labels (never placeholder-only)
- **Association:** `for` attribute links label to input (`<label for="equipo">`)
- **Required indication:** Asterisk (*) in label, `aria-required="true"`

**Focus Management:**
- **Focus order:** Logical tab order (top to bottom, left to right)
- **Focus visible:** 2px solid #722F37 outline + 4px offset
- **First error focus:** On validation failure, focus moves to first invalid field
- **Error announcements:** `aria-live="polite"` for error messages

**Instructions:**
- **Helper text:** Additional context below input (e.g., "Mínimo 20 caracteres")
- **Examples:** Show format example (e.g., "MA-001" for machine codes)
- **Error prevention:** Validate before submit (real-time when possible)

**Keyboard:**
- **Tab/Shift+Tab:** Navigate between fields
- **Enter:** Submit form (if in text field) or activate focused button
- **Escape:** Cancel form (close modal or confirm before discarding)
- **Arrow keys:** Navigate radio button groups, select dropdowns

---

### Navigation Patterns

**Purpose:** Consistent navigation patterns help users move through the application intuitively.

#### 1. Primary Navigation (Desktop/Tablet)

**Visual Design:**
```
┌────────────────────────────────────────────────────────┐
│ gmao-hiansa        [Kanban ▼] [Activos] [Repuestos]  │ ← Top nav
│                    [KPIs]      [Configuración] [👤]  │
├────────────────────────────────────────────────────────┤
│                                                         │
│  (Content area)                                         │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Behavior:**
- **Active state:** Current section highlighted with burgundy background
- **Hover:** Subtle background change (#F8F9FA)
- **Dropdown:** "Kanban" dropdown shows sub-options (if applicable)
- **Responsive:** On tablet, collapses to "☰" hamburger menu

**Accessibility:**
- **Landmark:** `<nav>` element with `aria-label="Navegación principal"`
- **Current page:** `aria-current="page"` on active link
- **Keyboard:** Arrow keys navigate menu items

#### 2. Mobile Navigation (<768px)

**Visual Design:**
```
┌────────────────────────────────────────┐
│ gmao-hiansa                            │
├────────────────────────────────────────┤
│                                        │
│  (Content area with scroll)            │
│                                        │
│                                        │
├────────────────────────────────────────┤
│ [Kanban] [Activos] [Repuestos] [KPIs] │ ← Bottom tab bar
│          [👤]                          │
└────────────────────────────────────────┘
```

**Behavior:**
- **Fixed bottom:** Tab bar fixed at bottom of screen
- **Active tab:** Burgundy icon + label
- **3-5 tabs max:** Limit to 5 tabs (iOS/Android convention)
- **Badge indicators:** Show notification count (e.g., "3" on Kanban for pending OTs)

**Accessibility:**
- **Touch targets:** Minimum 44x44px per tab
- **Labels:** Both icon + text label (never icon-only)

#### 3. Breadcrumb Navigation

**Visual Design:**
```
Kanban > Planta A > Línea 1 > MA-001 > Historial OTs
```

**When to Use:**
- **Deep navigation:** More than 2 levels deep
- **Drill-down:** Global → Planta → Línea → Equipo

**Behavior:**
- **Clickable:** All breadcrumb segments are clickable links
- **Current page:** Last segment is plain text (not a link)
- **Separator:** ">" or "/" between segments
- **Truncation:** Long paths truncate middle: "Kanban > ... > Línea 1 > MA-001"

---

### Modal & Overlay Patterns

**Purpose:** Focused user attention for critical tasks or information without leaving context.

#### 1. Modal Dialog (OT Details)

**Visual Design:**
```
┌───────────────────────────────────────────────┐
│ OT-2026-0001                        [X]      │ ← Modal header
├───────────────────────────────────────────────┤
│                                               │
│ **Información General**                       │
│ - Título: Motor principal no arranca         │
│ - Equipo: MA-001 (Perfiladora P-201)        │
│ - Ubicación: Planta A, Línea 1               │
│ - Prioridad: 🔴 Crítica                      │
│                                               │
│ **Asignación**                                │
│ - Técnico: Carlos García                     │
│ - Asignada: 27 Feb 2026, 09:15 AM            │
│                                               │
│ **Historial de Estados**                      │
│ 1. Reportada (Carlos García) - 09:03 AM      │
│ 2. Asignada (Javier) - 09:10 AM              │
│ 3. En Progreso (Carlos García) - 09:15 AM    │
│                                               │
├───────────────────────────────────────────────┤
│ [▶️ Iniciar]  [✅ Completar]  [👤 Reasignar]  │ ← Actions
├───────────────────────────────────────────────┤
│ [💬 Nota]  [📷 Foto]  [📎 Agregar Repuesto]  │ ← Secondary
└───────────────────────────────────────────────┘
```

**Dimensions:**
- **Width:** min(600px, 90vw) - responsive
- **Max height:** 80vh - scrollable if content overflows
- **Padding:** 24px

**Behavior:**
- **Backdrop:** Dark semi-transparent overlay (#212529 with 50% opacity)
- **Click outside:** Closes modal (unless form has unsaved changes)
- **Escape key:** Closes modal
- **Focus trap:** Keyboard focus cannot leave modal
- **Scroll locking:** Body scroll locks when modal is open

**Accessibility:**
- **ARIA:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` for title
- **Focus:** Moves to modal on open, returns to trigger on close
- **Escape:** Announces "Modal cerrado" to screen reader

#### 2. Drawer (Side Panel)

**Visual Design:**
```
┌─────────────┬───────────────────────────────────┐
│             │ OT-2026-0001                [X]  │ ← Panel
│   (Main     ├───────────────────────────────────┤
│   content   │ Panel slides in from right       │
│   dimmed)   │ Width: 400px (desktop)           │
│             │ Or: 100% (mobile)                │
└─────────────┴───────────────────────────────────┘
```

**When to Use:**
- **Supplementary information:** Details that complement main view
- **Mobile:** Alternative to modal (better for mobile UX)
- **Complex workflows:** Multi-step processes

**Behavior:**
- **Slide animation:** 300ms ease-in-out from right
- **Backdrop:** Click backdrop to close
- **Responsive:** 100% width on mobile, 400px on desktop

#### 3. Bottom Sheet (Mobile)

**Visual Design:**
```
┌────────────────────────────────────────┐
│                                        │
│         (Main content                  │
│          scrolled up)                  │
│                                        │
├────────────────────────────────────────┤
│ ┌──────────────────────────────────┐  │ ← Bottom sheet
│ │ Agregar Repuesto          [X]    │  │ (slides up)
│ ├──────────────────────────────────┤  │
│ │ 🔍 Search: [rodamiento...]      │  │
│ │                                  │  │
│ │ [Rodamiento SKF-6208]            │  │
│ │ [Rodamiento SKF-6209]            │  │
│ │                                  │  │
│ │             [Cancelar] [Agregar] │  │
│ └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

**When to Use:**
- **Mobile forms:** Quick input forms on mobile
- **Action sheets:** Choose from list of actions
- **Selection:** Select from list (e.g., choose technician)

**Behavior:**
- **Slide up:** From bottom, 300ms animation
- **Drag handle:** User can drag down to dismiss
- **Backdrop:** Tap backdrop to close

---

### Additional Patterns

#### 1. Search & Filtering

**Predictive Search:**
- **Debounce:** 300ms after last keystroke
- **Min characters:** 2 characters minimum before search
- **Response time:** <200ms target
- **Max results:** 10 results shown, "Ver todos..." link for more

**Filter Chips:**
```
[Filtros activos: Planta A ×] [Crítica ×] [Asignada a Carlos ×]
                                                      [+ Añadir filtro]
```

**Clear filters:** "Limpiar filtros" button when filters active

#### 2. Data Display

**Tables (Alternative to Kanban):**
- **Sortable columns:** Click header to sort, indicator shows sort direction
- **Row actions:** Three-dot menu (...) for row-specific actions
- **Selection:** Checkbox column for bulk actions
- **Pagination:** 50 rows per page (configurable: 25, 50, 100)

**Cards (Mobile List View):**
- **One card per row:** Tables convert to cards on mobile
- **Expandable:** Tap card to expand details

#### 3. Progress Indication

**Step Progress (Multi-step forms):**
```
Reportar Avería
┌─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │
│Datos│Detal│Fotos│Conf.│
│  ✓  │  →  │     │     │
└─────┴─────┴─────┴─────┘
```

**Progress Bar (File Upload):**
```
Subiendo foto_1.jpg...
[████████████░░] 67% (2.3 MB de 3.4 MB)
```

---

### Pattern Implementation Guidelines

**Consistency Rules:**

1. **Always use Shadcn/ui primitives first:** Button, Input, Dialog, Toast, etc.
2. **Custom patterns must align:** Visual hierarchy, spacing, typography match design system
3. **Accessibility first:** Every pattern meets WCAG AA minimum
4. **Mobile-responsive:** All patterns work on mobile, tablet, desktop
5. **User feedback:** Every action provides feedback (success, error, loading)

**When to Create Custom Pattern:**

- **Domain-specific needs:** GMAO workflows don't fit standard patterns
- **Industrial context:** Factory floor use cases (tablets, gloves, bright lighting)
- **Performance requirements:** Real-time updates, <200ms search
- **Shadcn/ui insufficient:** Component doesn't exist or doesn't meet requirements

**Custom Pattern Examples:**
- ✅ Kanban Board (not in Shadcn/ui, domain-specific)
- ✅ Parts Inventory Picker (Shadcn Select insufficient for stock + location)
- ✅ OT Card (custom card for Kanban)
- ❌ Standard Button (use Shadcn Button)
- ❌ Standard Form Input (use Shadcn Input)

**Developer Handoff:**

For each pattern, provide:
1. **When to use:** Clear usage guidelines
2. **Visual specs:** Colors, spacing, typography, states
3. **Behavior:** Interactions, animations, transitions
4. **Accessibility:** ARIA attributes, keyboard navigation, screen reader support
5. **Code examples:** React/TypeScript snippets using Shadcn/ui components
6. **Responsive:** Mobile, tablet, desktop behavior

---

## Responsive Design & Accessibility

### Responsive Strategy

**Purpose:** Ensure gmao-hiansa provides optimal user experience across all devices used in maintenance operations: desktop workstations, industrial tablets, mobile phones, and 4K TVs in common areas.

**Device Context:**

Based on PRD requirements and User Journeys, gmao-hiansa operates in diverse environments:

| Device Type | Use Case | Environment | Usage Pattern |
|-------------|----------|-------------|---------------|
| **Desktop (>1400px)** | Supervisors (Javier), Admin (Elena) | Office, well-lit | Planning, KPIs analysis, reporting |
| **Tablet (768-1400px)** | Technicians (María), Supervisors | Factory floor, variable lighting | Mobile access to Kanban, OT updates |
| **Mobile (<768px)** | Operators (Carlos) for alerts, Technicians on-the-go | Pocket, quick checks | Failure reporting, push notifications |
| **TV 4K (>2160px)** | Common area dashboard | Factory floor, bright lighting | Real-time status display, transparency |

**Responsive Design Philosophy:**

**Mobile-First Approach:**
- Design for mobile constraints first, then enhance for larger screens
- Progressive enhancement: Start with essential features, add complexity as screen real estate increases
- Touch-friendly baseline: All interactions work with touch, enhance with mouse hover on desktop

**Content Priority Strategy:**

**Mobile (<768px) - Critical Only:**
- Single column layouts
- One primary action per screen
- Bottom navigation (5 tabs max)
- Essential information only (reports, assigned OTs, critical alerts)
- Simplified Kanban: 1 column visible + swipe

**Tablet (768-1400px) - Optimized for Touch:**
- 2-4 column layouts
- Side-by-side content (when valuable)
- Touch-optimized targets (44x44px minimum)
- Simplified Kanban: 4-6 columns + horizontal scroll
- Balance between information density and touch usability

**Desktop (>1400px) - Information Rich:**
- Multi-column layouts (8-column Kanban)
- Side navigation + breadcrumbs
- Hover states and keyboard shortcuts
- Information density: Dashboard widgets, detailed tables
- Power user features: Advanced filters, bulk actions

**TV 4K (>2160px) - Supervision Mode:**
- Read-optimized view (large text, high contrast)
- Automatic refresh (no interaction expected)
- Real-time Kanban with 8 columns
- KPIs dashboard with charts
- No navigation (users don't interact, just monitor)

**Responsive Behavior by Component:**

**1. Kanban Board:**

| Screen Size | Layout | Interaction |
|-------------|--------|-------------|
| <768px (Mobile) | 1 column visible, swipe lateral, dots indicator | Tap to open modal, pull-to-refresh |
| 768-1024px (Tablet) | 4 columns visible, horizontal scroll | Touch drag & drop (long press) |
| 1024-1400px (Tablet/Desktop) | 6 columns visible, horizontal scroll | Mouse/touch drag & drop |
| >1400px (Desktop) | All 8 columns visible | Mouse drag & drop, hover effects |
| >2160px (TV 4K) | All 8 columns visible, 120% scale | Read-only (monitoring mode) |

**2. Navigation:**

| Screen Size | Navigation Pattern |
|-------------|-------------------|
| <768px (Mobile) | Bottom tab bar (5 tabs max), hamburger menu for secondary |
| 768-1400px (Tablet/Desktop) | Top horizontal navigation, dropdowns for sub-items |
| >1400px (Desktop) | Top nav + sidebar (collapsible), breadcrumbs |

**3. Forms:**

| Screen Size | Layout |
|-------------|--------|
| <768px (Mobile) | Single column, full-width inputs, sticky submit button |
| 768-1400px (Tablet/Desktop) | 2-column grid (when appropriate), standard width inputs |
| >1400px (Desktop) | Multi-column, side-by-side related fields |

**4. Modals:**

| Screen Size | Dimensions |
|-------------|------------|
| <768px (Mobile) | 100% width, 90vh height, bottom sheet (slides up) |
| 768-1400px (Tablet) | 600px width, 80vh height, centered |
| >1400px (Desktop) | 600px width, 80vh height, centered |

**5. Tables (Alternative to Kanban):**

| Screen Size | Behavior |
|-------------|----------|
| <768px (Mobile) | Convert to cards (one card per row) |
| 768-1400px (Tablet/Desktop) | Standard table with horizontal scroll if needed |
| >1400px (Desktop) | Full table visible, sortable columns, bulk actions |

---

### Breakpoint Strategy

**Tailwind CSS Default Breakpoints:**

We use Tailwind's responsive utility classes with standard breakpoints:

| Breakpoint | Min Width | Max Width | Target Devices |
|------------|-----------|-----------|----------------|
| **sm** | 640px | 767px | Large phones (landscape), small tablets |
| **md** | 768px | 1023px | Tablets (iPad, Android tablets) |
| **lg** | 1024px | 1279px | Small laptops, large tablets |
| **xl** | 1400px | 1919px | Desktops, laptops |
| **2xl** | 1536px+ | None | Large desktops, 4K TVs (scaled) |

**Additional Custom Breakpoints:**

For gmao-hiansa specific needs:

| Breakpoint | Min Width | Target Use Case |
|------------|-----------|-----------------|
| **xs** | 320px | Minimum mobile (small phones) |
| **tv** | 2160px | 4K TVs (factory common areas) |

**Tailwind Configuration (tailwind.config.js):**

```javascript
module.exports = {
  theme: {
    screens: {
      'xs': '320px',    // Small phones
      'sm': '640px',    // Large phones landscape
      'md': '768px',    // Tablets
      'lg': '1024px',   // Laptops
      'xl': '1400px',   // Desktops
      '2xl': '1536px',  // Large desktops
      'tv': '2160px',   // 4K TVs
    },
  },
}
```

**Media Query Strategy:**

**Mobile-First (Recommended):**

```tsx
// Default: Mobile styles (no breakpoint)
<div className="flex flex-col gap-4">
  {/* Mobile: Single column */}
</div>

// Tablet+: Enhance layout
<div className="md:grid md:grid-cols-2 md:gap-6">
  {/* Tablet: 2 columns */}
</div>

// Desktop+: Further enhance
<div className="lg:grid lg:grid-cols-4 lg:gap-8">
  {/* Desktop: 4 columns */}
</div>
```

**Responsive Utilities Examples:**

```tsx
// Navigation
<nav className="md:flex md:items-center md:gap-6">
  {/* Mobile: Stacked, Tablet+: Horizontal */}
</nav>

// Kanban columns
<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8">
  {/* Mobile: 1 col, Tablet: 4 cols, Desktop: 8 cols */}
</div>

// Buttons
<button className="w-full md:w-auto md:px-8">
  {/* Mobile: Full-width, Desktop+: Auto-width */}
</button>

// Text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  {/* Mobile: 24px, Tablet: 30px, Desktop: 48px */}
</h1>
```

**Critical Breakpoint Transitions:**

**1. Mobile → Tablet (768px):**
- Stacked → Side-by-side layouts
- Bottom tab bar → Top navigation
- Full-width buttons → Standard width
- Single-column Kanban → 4-column Kanban

**2. Tablet → Desktop (1024px):**
- 4-column Kanban → 6-column Kanban
- Simplified dashboards → Full dashboards with widgets
- Touch-optimized → Mouse/touch hybrid

**3. Desktop → Large Desktop (1400px):**
- 6-column Kanban → 8-column Kanban (full)
- Side navigation appears
- Information density increases

**4. Desktop → TV 4K (2160px):**
- Read-optimized mode (120% scale)
- Hover states disabled
- Auto-refresh (no interaction expected)

---

### Accessibility Strategy

**Accessibility Goal: WCAG 2.1 Level AA Compliance**

**Rationale for WCAG AA:**

- **Legal compliance:** Meets accessibility requirements in most jurisdictions
- **Industry standard:** Considered baseline for professional web applications
- **Achievable:** Balances user needs with development constraints
- **Impact:** Benefits users with disabilities without excessive complexity

**Note:** WCAG AAA is not targeted due to implementation complexity and diminishing returns for industrial web application context.

**Accessibility Principles (POUR):**

**1. Perceivable:**

**Color Contrast:**

| Element Type | Contrast Ratio | Our Colors | Compliance |
|--------------|----------------|-------------|------------|
| Normal text (<18px) | 4.5:1 minimum | #212529 on #FFFFFF = 16.1:1 ✅ | WCAG AA |
| Large text (18px+) | 3:1 minimum | #212529 on #FFFFFF = 16.1:1 ✅ | WCAG AA |
| UI components | 3:1 minimum | #722F37 on #FFFFFF = 8.2:1 ✅ | WCAG AA |
| Graphic objects | 3:1 minimum | Icons on backgrounds | WCAG AA |

**Our palette exceeds WCAG AA requirements:**
- ✅ Primary (#722F37) on white: 8.2:1
- ✅ Black (#212529) on white: 16.1:1
- ✅ Pure black (#000000) on white: 21:1

**Text Alternatives:**
- **Images:** All images have `alt` text
- **Icons:** Icon-only buttons have `aria-label`
- **Charts:** Data tables provided as alternatives
- **Emojis:** Used as supplement, not replacement for text

**2. Operable:**

**Keyboard Accessibility:**

**Full Keyboard Navigation:**
- **Tab:** Logical navigation order (left-to-right, top-to-bottom)
- **Enter/Space:** Activate buttons, links, form controls
- **Escape:** Close modals, cancel operations
- **Arrow keys:** Navigate menus, radio groups, grids (Kanban)
- **Home/End:** First/last item in list/grid
- **Page Up/Down:** Scroll by page

**Focus Management:**
- **Visible focus:** 2px solid #722F37 outline + 4px offset
- **Focus trap:** Modals trap focus (cannot Tab outside)
- **Focus restoration:** When modal closes, focus returns to trigger
- **Skip links:** "Saltar al contenido" link at top of page
- **No keyboard traps:** All functionality accessible via keyboard

**3. Understandable:**

**Language:**
- **Default language:** `lang="es"` on HTML element (Spanish)
- **Consistent terminology:** Same words for same concepts
- **Simple language:** Plain Spanish, avoiding technical jargon where possible

**Error Identification:**
- **Clear error messages:** Specific, actionable error messages
- **Inline validation:** Errors appear near invalid fields
- **Error explanation:** Explain what went wrong and how to fix it
- **Error prevention:** Validate before submit (real-time when possible)

**4. Robust:**

**Compatibility:**
- **Assistive technologies:** Compatible with screen readers (NVDA, JAWS, VoiceOver)
- **Browser compatibility:** Works with Chrome, Edge (Chromium-based only per PRD)
- **Future-proof:** Semantic HTML, graceful degradation

**ARIA Implementation:**

**Landmarks:**
```html
<nav aria-label="Navegación principal">
<main aria-label="Tablero Kanban">
<aside aria-label="Filtros">
```

**Roles:**
```html
<button role="button" aria-label="Cerrar modal">
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
<div role="status" aria-live="polite">
<div role="alert" aria-live="assertive">
```

**Color Blindness:**

**Never Rely on Color Alone:**
- **Status indicators:** Always use icon + color
- **Priority badges:** Text label + color
- **Links:** Underlined + color
- **Charts:** Patterns + colors

**Touch Target Accessibility:**

**Minimum Sizing:**
- **All interactive elements:** 44x44px minimum (WCAG AAA)
- **Critical actions:** 48x48px recommended
- **Spacing:** 8px minimum gap between touch targets

**Industrial Environment Considerations:**

**Factory Floor Accessibility:**
- **Bright lighting:** High contrast (our palette: 16.1:1)
- **Noise:** Visual indicators + text (never audio-only)
- **Gloves:** Large touch targets (44x44px), avoid precision gestures
- **Tablets:** Touch-optimized, no reliance on hover

---

### Testing Strategy

**Purpose:** Comprehensive testing ensures responsive design and accessibility requirements are met.

**Responsive Testing:**

**1. Device Testing Matrix:**

| Device Category | Test Devices | Screen Sizes | Test Priority |
|-----------------|--------------|--------------|---------------|
| **Mobile** | iPhone SE, Android (small) | 320px - 375px | Critical |
| **Tablet** | iPad Mini, Android tablet | 768px - 820px | Critical |
| **Desktop** | Windows laptop (1366x768) | 1366px+ | Critical |
| **Desktop** | Windows desktop (1920x1080) | 1920px+ | High |
| **TV 4K** | 4K TV display | 2160px+ | Medium |

**2. Browser Testing:**

Per PRD requirements, **Chrome and Edge only** (Chromium-based):
- ✅ Chrome (latest 2 versions)
- ✅ Edge (latest 2 versions, Chromium)
- ❌ Firefox, Safari: NOT supported

**3. Responsive Testing Checklist:**

**Layout Testing:**
- ✅ No horizontal scroll at minimum width (320px)
- ✅ Content fits viewport without zooming
- ✅ Text reflows without loss of content
- ✅ Images scale appropriately
- ✅ Tables/cards switch appropriately on mobile
- ✅ Navigation works on all screen sizes

**Component Testing:**
- ✅ Kanban Board: All 8 columns accessible on desktop, swipe on mobile
- ✅ Forms: Single column on mobile, multi-column on desktop
- ✅ Modals: Full-screen on mobile, centered on desktop
- ✅ Buttons: Full-width on mobile, auto-width on desktop
- ✅ Tables: Convert to cards on mobile

**Touch Interaction Testing:**
- ✅ All interactive elements reachable
- ✅ Touch targets ≥44x44px
- ✅ Drag & drop works via long-press + drag
- ✅ Swipe gestures work (Kanban columns)
- ✅ Pull-to-refresh works (mobile)

**Accessibility Testing:**

**1. Automated Accessibility Testing:**

**Tools:**
- **axe DevTools** (Chrome extension)
- **Lighthouse** (Chrome built-in)
- **WAVE** (browser extension)
- **pa11y** (CLI tool)

**2. Manual Accessibility Testing:**

**Keyboard-Only Navigation:**
- ✅ Tab through entire application (logical order)
- ✅ All interactive elements reachable via keyboard
- ✅ Focus visible on all elements
- ✅ Escape key closes modals/menus
- ✅ Arrow keys navigate menus, dropdowns, grids

**Screen Reader Testing:**

**Screen Readers to Test:**
- **NVDA** (Windows, free) - Primary target
- **JAWS** (Windows, paid) - Secondary target
- **VoiceOver** (macOS/iOS) - iOS testing
- **TalkBack** (Android) - Android testing

**3. User Testing with Disabilities:**

**Test Tasks:**
- Report failure from mobile (motor impairment)
- Navigate Kanban using keyboard only
- Complete OT using screen reader
- Find specific OT using search
- View KPIs with low vision settings

---

### Implementation Guidelines

**Purpose:** Provide developers with clear, actionable guidelines.

**Responsive Development Guidelines:**

**1. Use Relative Units:**
```css
/* ✅ GOOD: Relative units */
.container {
  width: 100%;
  max-width: 1200px;
  padding: 1.5rem; /* 24px */
  font-size: 1rem; /* 16px */
  gap: 1rem; /* 16px */
}
```

**2. Mobile-First Media Queries:**
```css
/* ✅ GOOD: Mobile-first */
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .card {
    flex-direction: row;
    gap: 2rem;
  }
}
```

**3. Tailwind Responsive Utilities:**
```tsx
<div className="
  flex flex-col gap-4          /* Mobile: Column */
  md:flex-row md:gap-6        /* Tablet+: Row */
  lg:gap-8                    /* Desktop+: Larger gap */
">
```

**Accessibility Development Guidelines:**

**1. Semantic HTML:**
```tsx
<header>
  <nav aria-label="Navegación principal">
    <ul>
      <li><a href="/kanban">Kanban</a></li>
    </ul>
  </nav>
</header>

<main>
  <h1>Tablero Kanban</h1>
  <KanbanBoard />
</main>
```

**2. ARIA Attributes:**
```tsx
<button aria-label="Cerrar modal">
  <Icon name="x" />
</button>

<input
  id="password"
  aria-describedby="password-requirements"
  type="password"
/>
```

**3. Keyboard Navigation:**
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isModalOpen]);
```

**4. Focus Management:**
```tsx
const buttonFocused = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#722F37]';

<button className={buttonFocused}>
  Click me
</button>
```

**Developer Checklist:**

**Before Pull Request:**
- ✅ Test on mobile (320px width)
- ✅ Test on tablet (768px width)
- ✅ Test on desktop (1400px width)
- ✅ Keyboard navigation works
- ✅ Color contrast meets WCAG AA
- ✅ All images have alt text
- ✅ All form inputs have labels
- ✅ Run automated accessibility tests