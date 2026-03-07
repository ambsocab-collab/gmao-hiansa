# User Journey Flows

## Journey 1: Reportar Avería en 30 Segundos (Carlos)

**User Persona:** Carlos - Operario de Línea (25 años)
**Contexto:** Piso de fábrica, móvil en mano, necesita reportar rápido
**Meta:** Reportar avería y recibir confirmación en <30 segundos

Los detalles completos del flow con diagramas Mermaid están documentados en el archivo de diseño. Este journey es el **core experience** que hace que Carlos sienta "¡Mi voz importa".

**Optimizaciones clave:**
- Autocomplete predictivo con debouncing de 300ms
- QR code scanning para pre-completar equipo
- Campo descripción opcional
- Toast notification con número único de aviso
- Reintento automático en caso de error

## Journey 2: Ver y Actualizar OTs Asignadas (María)

**User Persona:** María - Técnica de Mantenimiento (28 años)
**Contexto:** Abre app cada mañana en tablet, ve OTs del día
**Meta:** Trabajar en sus OTs asignadas, actualizar estados, ver repuestos

**Optimizaciones clave:**
- Dashboard con "Mis OTs de Hoy" al abrir
- Modal ℹ️ con historia completa de OT
- Actualización de estado en 2 taps
- Stock de repuestos con ubicación visible
- Real-time sync via WebSockets

## Journey 3: Gestionar Kanban de OTs (Javier)

**User Persona:** Javier - Supervisor de Mantenimiento (32 años)
**Contexto:** Desktop en oficina, necesita control visual de carga de equipo
**Meta:** Ver todas las OTs, asignar técnicos, drag-and-drop

**Optimizaciones clave:**
- Kanban de 8 columnas con OT cards
- Drag & drop entre columnas
- Asignar técnico en 2 taps
- Push notifications a técnicos afectados
- Panel lateral con KPIs del día

## Journey 4: Ver KPIs y Drill-Down (Elena)

**User Persona:** Elena - Administrador / Jefa de Mantenimiento (38 años)
**Contexto:** Desktop en oficina, necesita datos para decisiones
**Meta:** Ver KPIs, hacer drill-down, exportar reportes

**Optimizaciones clave:**
- KPIs principales con tendencias
- Drill-down en 3 niveles (División → Equipo → Historia)
- Comparar períodos
- Exportar a PDF/Excel/CSV
- Configurar alertas automáticas

## Journey 5: Gestionar Stock y Alertas Críticas (Pedro)

**User Persona:** Pedro - Usuario con Capacidad de Gestión de Stock (35 años)
**Contexto:** Desktop, necesita ver stock y alertas críticas
**Meta:** Gestionar repuestos, alertas de stock crítico, reposición

**Optimizaciones clave:**
- Panel de alertas con ítems críticos
- Solicitar reposición con cantidad sugerida
- Buscar repuestos por nombre/SKU/proveedor
- Ajustar stock con razones
- Ver stock por ubicación

## Journey Patterns

**Navigation Patterns:**
1. Dashboard como hub: Todos los journeys inician desde dashboard contextual
2. Modal ℹ️ para detalles: Detalles completos sin perder contexto
3. Breadcrumb o Back button: Navegación clara hacia atrás
4. Filtros contextuales: Específicos según pantalla actual

**Decision Patterns:**
1. Confirmación antes de acciones destructivas
2. Autocomplete con sugerencias
3. Smart defaults según contexto
4. Undo/Redo cuando aplica

**Feedback Patterns:**
1. Toast notifications (✓/✗)
2. Push notifications en tiempo real
3. Inline validation
4. Loading states con spinners
5. Progressive disclosure

**Error Recovery Patterns:**
1. Reintentar automáticamente (sin conexión/timeout)
2. Guardar draft local
3. Modo offline con sync posterior
4. Mensajes claros de qué pasó y qué hacer

## Flow Optimization Principles

**Minimizar Steps to Value:**
- Reportar avería: 3 pasos máximo (<30s)
- Ver OTs: 1 tap desde dashboard
- Actualizar estado: 2 taps
- Asignar técnico: 2 taps

**Reducir Cognitive Load:**
- Progressive disclosure
- Smart defaults
- Autocomplete
- Redundancia semántica (icono + color + texto)

**Clear Feedback & Progress:**
- Toast notifications
- Push notifications
- Loading states
- Progress indicators

**Moments of Delight:**
- Aviso #XXX: Número único genera "¡Funcionó!"
- Real-time sync via WebSockets
- Micro-interacciones (200-300ms)

**Graceful Error Handling:**
- Reintentar automáticamente
- Modo offline
- Mensajes claros
- No data loss

