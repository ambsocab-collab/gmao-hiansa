# Epic 4: Órdenes de Trabajo y Kanban Digital

Permitir a técnicos como María y supervisores como Javier gestionar el ciclo de vida completo de Órdenes de Trabajo con 8 estados (Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada), Kanban digital de 8 columnas con código de colores (7 tipos visuales), asignación múltiple de 1-3 técnicos o proveedores, vista de listado con filtros, capacidad de agregar repuestos usados, notas internas, comentarios con timestamp y fotos antes/después de la reparación.

**FRs cubiertos:** FR11-FR31 (21 requerimientos funcionales)
**Usuario principal:** María (Técnica), Javier (Supervisor)
**Valor entregado:**
- María ve sus OTs asignadas organizadas en dashboard personal
- María actualiza estado de OTs en tiempo real (botón ▶️ Iniciar)
- María agrega repuestos usados con stock visible
- Javier gestiona visualmente en Kanban 8 columnas
- Código de colores permite identificación inmediata (7 tipos visuales)
- Asignación múltiple 1-3 técnicos/proveedores
- Modal ℹ️ con trazabilidad completa en 1 clic
- Vista de listado con filtros y ordenamiento
- Sincronización real-time entre vistas Kanban y listado

**Dependencias:** Epic 1 (requiere autenticación), Epic 2 (requiere jerarquía de activos), Epic 3 (requiere sistema de avisos como origen de OTs correctivas)

---

## Story 4.1: Modelo de Datos de Órdenes de Trabajo

As a developer of the system,
I want to create the Prisma data model for Work Orders (Órdenes de Trabajo) with 8 states, support for preventive/corrective types, multiple technician assignments, stock tracking, and relationships to assets, providers, and failure reports,
So that the system can manage the complete lifecycle of work orders from creation to completion.

**Acceptance Criteria:**

**Given** that I am defining the Prisma schema in `prisma/schema.prisma`
**When** I create the WorkOrder (Orden de Trabajo) model
**Then** the WorkOrder model has fields:
- id (UUID, primary key)
- numeroOT (String, unique, auto-generated format "OT-YYYYMMDD-####")
- equipoId (UUID, foreign key → Equipo.id, required)
- tipoMantenimiento (Enum TipoMantenimiento, default CORRECTIVO)
- estado (Enum OTEstado, default PENDIENTE)
- descripcion (String, required, max 5000 characters for work description)
- origenTipo (Enum OrigenTipo, values: AVISO, MANUAL, RUTINA)
- origenId (String, optional, references aviso number or routine ID)
- prioridad (Enum Prioridad, default MEDIA)
- fechaCreacion (DateTime, default now())
- fechaInicio (DateTime, optional, set when estado changes to EN_PROGRESO)
- fechaCompletado (DateTime, optional, set when estado changes to COMPLETADA)
- notaInterna (String, optional, max 2000 characters for internal notes)
- requerimientoParada (Boolean, default false, indicates if machine stoppage is required)
- repuestosUsados (String, optional, JSON array of used parts)
- costoEstimado (Decimal, optional, estimated cost in local currency)
- costoReal (Decimal, optional, actual cost after completion)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "work_orders" table
- And there is a many-to-one relationship from WorkOrder to Equipo (equipoId → Equipo.id)

**Given** that the WorkOrder model is created
**When** I create the TipoMantenimiento enum
**Then** the enum has values: PREVENTIVO, CORRECTIVO
- And PREVENTIVO indicates scheduled maintenance from routines
- And CORRECTIVO indicates unscheduled maintenance from failure reports

**Given** that the TipoMantenimiento enum is created
**When** I create the OTEstado enum with 8 states
**Then** the enum has values:
- PENDIENTE: OT created but not yet assigned or started
- ASIGNADA: OT assigned to technician(s) but not yet started
- EN_PROGRESO: Technician has started working on the OT
- PENDIENTE_REPUESTO: Waiting for spare parts (blocked)
- PENDIENTE_PARADA: Waiting for machine to be available/stopped for maintenance
- REPARACION_EXTERNA: Sent to external provider
- COMPLETADA: Work finished and validated
- DESCARTADA: Cancelled or discarded
- And each state has specific business rules for transitions

**Given** that the OTEstado enum is created
**When** I create the OrigenTipo enum
**Then** the enum has values:
- AVISO: OT created from a failure report (aviso)
- MANUAL: OT created manually by supervisor/admin
- RUTINA: OT generated automatically from a maintenance routine

**Given** that the OrigenTipo enum is created
**When** I create the Prioridad enum
**Then** the enum has values: BAJA, MEDIA, ALTA, URGENTE
- And default is MEDIA
- And URGENTE is for safety-critical or production-blocking issues

**Given** that the basic WorkOrder model is created
**When** I create the OTAssignment model for multiple technicians/providers
**Then** the OTAssignment model has fields:
- id (UUID, primary key)
- workOrderId (UUID, foreign key → WorkOrder.id)
- userId (UUID, foreign key → User.id, optional, for internal technicians)
- providerId (UUID, foreign key → Provider.id, optional, for external providers)
- rol (Enum AsignacionRol, values: TECNICO_PRINCIPAL, TECNICO_SECUNDARIO, PROVEEDOR)
- fechaAsignacion (DateTime, default now())
- isActive (Boolean, default true)
- @@map for "ot_assignments" table
- And there is a many-to-one relationship from OTAssignment to WorkOrder
- And there is a many-to-one relationship from OTAssignment to User (optional)
- And there is a many-to-one relationship from OTAssignment to Provider (optional)
- And there is a unique composite index (workOrderId, userId) to avoid duplicate user assignments
- And there is a unique composite index (workOrderId, providerId) to avoid duplicate provider assignments

**Given** that the OTAssignment model is created
**When** I create the AsignacionRol enum
**Then** the enum has values: TECNICO_PRINCIPAL, TECNICO_SECUNDARIO, PROVEEDOR
- And TECNICO_PRINCIPAL indicates the lead technician
- And TECNICO_SECUNDARIO indicates supporting technician(s)
- And PROVEEDOR indicates external provider assignment

**Given** that the OTAssignment model is created
**When** I create the OTComment model for timestamped comments
**Then** the OTComment model has fields:
- id (UUID, primary key)
- workOrderId (UUID, foreign key → WorkOrder.id, required)
- userId (UUID, foreign key → User.id, required)
- comentario (String, required, max 1000 characters)
- fotoUrls (String, optional, JSON array of photo URLs)
- createdAt (DateTime, default now())
- @@map for "ot_comments" table
- And there is a many-to-one relationship from OTComment to WorkOrder
- And there is a many-to-one relationship from OTComment to User

**Given** that all models are defined
**When** I run `npx prisma migrate dev --name init_work_orders`
**Then** the initial migration is created
- And the work_orders, ot_assignments, ot_comments tables are created
- And the enums are created correctly
- And foreign keys are created correctly
- And unique indexes are created correctly

**Given** that migrations are executed
**When** I run `npx prisma generate`
**Then** the Prisma Client is regenerated with the new models
- And TypeScript types are generated automatically

**Given** that models are generated
**When** I create the `types/work-orders.ts` file
**Then** TypeScript types derived from Prisma are exported for WorkOrder, OTAssignment, OTComment
- And an OTEstado type is created with the 8 possible states
- And a TipoMantenimiento type is created with PREVENTIVO and CORRECTIVO
- And a Prioridad type is created with the 4 priority levels

**FRs covered:** FR11 (8 states), FR11-A (tipo mantenimiento), FR11-B (etiquetas visible), base structure for FR17-FR19 (asignación múltiple), FR31 (sincronización futura)

---

## Story 4.2: Creación Manual de Órdenes de Trabajo

As a Javier (Supervisor with can_create_manual_ot and can_assign_technicians capabilities) or Elena (Admin with can_create_manual_ot capability),
I want to manually create work orders without requiring a prior failure report or routine, by selecting equipment, describing the work, assigning technicians/providers, and setting priority,
So that I can proactively create maintenance work for known issues or planned activities that don't originate from operator reports.

**Acceptance Criteria:**

**Given** that I am logged in as a user with can_create_manual_ot capability
**When** I access the `/ordenes-trabajo/nueva` route or tap the "+ Nueva OT" button on the dashboard
**Then** I see a work order creation form with:
- Equipment search field with predictive autocomplete
- Description textarea (required, max 5000 characters)
- Maintenance type dropdown: "Correctivo" (default) or "Preventivo"
- Priority dropdown: "Baja", "Media" (default), "Alta", "Urgente"
- Technician assignment multi-select (1-3 users)
- Provider assignment (optional, if external repair)
- Requires machine stop checkbox (default unchecked)
- Internal notes textarea (optional, max 2000 characters)
- Estimated cost number input (optional, local currency)
- Estimated hours number input (optional, default 2)
- "Cancelar" and "Crear OT" buttons
- And the form is optimized for desktop/tablet use

**Given** that I am on the manual OT creation form
**When** I start typing in the equipment search field
**Then** the predictive search shows suggestions in <200ms (reusing Epic 3 search component)
- And suggestions include equipment name, hierarchical context, status
- And I can select an equipment from the suggestions

**Given** that I select an equipment (e.g., "Prensa PH-500")
**When** the equipment is selected
**Then** the form shows additional context:
- Equipment location: "Panel Sandwich, Línea 2"
- Current status: "Operativo 🟢" or "Averiado 🔴"
- Last OT: "Última OT: OT-20260301-0042 completada hace 5 días"
- And this context helps me make informed decisions

**Given** that I fill in the description field
**When** I enter: "Cambio de rodamiento principal según plan de mantenimiento anual"
**Then** the description is validated:
- Required field validation: cannot be empty
- Maximum length validation: 5000 characters
- Character counter shows: "120 / 5000 caracteres"

**Given** that I select the maintenance type
**When** I choose "Preventivo" from the dropdown
**Then** the OT will be labeled "Preventivo" in the Kanban and list views (FR11-B)
- And the OT card will show a green indicator for preventive type

**Given** that I choose "Correctivo" from the dropdown
**When** the maintenance type is set to Correctivo
**Then** the OT will be labeled "Correctivo" in views
- And the OT card will show a reddish indicator for corrective type

**Given** that I need to assign technicians
**When** I use the technician multi-select field
**Then** I see a searchable dropdown of all users with can_update_own_ot capability
- And the dropdown shows:
  - User name
  - Role/Classification label (e.g., "Técnico")
  - Current workload indicator (e.g., "2 OTs asignadas", "Disponible")
- And I can select up to 3 technicians
- And selected technicians appear as removable chips/tags
- And the first technician selected is automatically marked as TECNICO_PRINCIPAL
- And subsequent technicians are marked as TECNICO_SECUNDARIO
- And if I don't assign any technicians, the "Crear OT" button is disabled with inline error

**Given** that I want to assign to an external provider instead
**When** I use the provider assignment field
**Then** I see a searchable dropdown of all providers with providerType "Mantenimiento"
- And I can select one provider
- And when a provider is selected, the technician field is disabled (providers work alone)
- And the OT will have rol PROVEEDOR in the assignment

**Given** that I have filled in all required fields (equipment, description, at least 1 technician or 1 provider)
**When** I tap/click the "Crear OT" button
**Then** the system validates all required fields
- And if validation is correct:
  - The WorkOrder record is created with estado PENDIENTE
  - The origenTipo is set to MANUAL
  - The numeroOT is auto-generated: "OT-20260307-0001"
  - The OTAssignment records are created for each technician/provider
  - All assigned technicians receive push notifications: "Nueva OT asignada: OT-20260307-0001 - Prensa PH-500 - Cambio de rodamiento principal"
  - I see success message: "OT creada exitosamente"
  - I am redirected to the OT details view or Kanban
  - The new OT appears in the Kanban in the appropriate column

**Given** that I want to cancel the creation
**When** I tap/click the "Cancelar" button
**Then** the form closes without creating an OT
- And no notifications are sent
- And I return to the previous screen

**Error Scenarios:**

**Given** that I try to create an OT without filling required fields
**When** I tap/click "Crear OT" with empty equipment or description
**Then** the system shows inline errors:
- "Debes seleccionar un equipo" if equipment is empty
- "La descripción es requerida" if description is empty
- "Debes asignar al menos 1 técnico o 1 proveedor" if no assignments
- And the form remains open for correction
- And the "Crear OT" button is disabled until all required fields are filled

**Given** that the system is down when I try to create the OT
**When** the API call fails
**Then** the system shows error message: "Error al crear OT. Por favor intenta nuevamente."
- And the form data is preserved (not lost) for retry
- And a "Reintentar" button appears

**FRs covered:** FR25 (crear OT manual), FR17 (asignar técnicos), FR18 (asignar proveedores), FR19 (seleccionar 1-3), FR19-A (múltiples asignados pueden actualizar)

---

## Story 4.3: Kanban Digital de 8 Columnas

As a Javier (Supervisor with can_view_all_ots capability),
I want to view all work orders in a Kanban board with 8 columns corresponding to OT states, where each OT card shows key information with color coding by type and assignment, and I can drag-and-drop cards between columns to update status,
So that I have a visual overview of all work in progress and can quickly manage OT workflow by moving cards between states.

**Acceptance Criteria:**

**Given** that I am logged in as a user with can_view_all_ots capability
**When** I access the `/ordenes-trabajo/kanban` route
**Then** I see a Kanban board with 8 columns displayed horizontally:
- Column 1: "Pendientes" (estado PENDIENTE)
- Column 2: "Asignadas" (estado ASIGNADA)
- Column 3: "En Progreso" (estado EN_PROGRESO)
- Column 4: "Pendiente Repuesto" (estado PENDIENTE_REPUESTO)
- Column 5: "Pendiente Parada" (estado PENDIENTE_PARADA)
- Column 6: "Reparación Externa" (estado REPARACION_EXTERNA)
- Column 7: "Completadas" (estado COMPLETADA)
- Column 8: "Descartadas" (estado DESCARTADA)
- And each column shows a count of OTs: "En Progreso (5)"
- And the columns are arranged in logical workflow order from left to right

**Given** that the Kanban is displayed
**When** I view OT cards in each column
**Then** each OT card displays:
- numeroOT (e.g., "OT-20260307-0001")
- equipo: "Prensa PH-500"
- descripcion: First 100 characters with "..." if longer
- tipoMantenimiento badge: "Preventivo" (green) or "Correctivo" (reddish)
- prioridad indicator: "🔴 Urgente", "🟠 Alta", "🟡 Media", "🔵 Baja"
- Assigned technicians/provider: Small avatars with initials
- Time indicators: "Hace 2 horas" or "En progreso desde 10:30 AM"
- Color coding by repair type:
  - Reparación interna (taller propio): Orange background (#FD7E14)
  - Reparación enviada a proveedor: Blue background (#17A2B8)
  - Preventivo: Green background (#28A745)
- And the cards are touch-friendly (44x44px minimum interactive elements)

**Given** that I want to see more details about an OT
**When** I tap/click on an OT card
**Then** a modal (ℹ️) opens with complete OT details:
- All OT fields (numeroOT, equipo, descripcion, tipo, prioridad, estado, fechas)
- Assigned technicians/providers with contact info
- Stock repuestos used (if any)
- Comments with timestamps
- Photos before/after (if any)
- Origin information: "Creado manualmente por Javier" or "Derivada de Aviso AVG-20260307-0001"
- Timeline of state changes
- Action buttons: "Asignar Técnico", "Actualizar Estado", "Agregar Comentario"
- And the modal can be closed by tapping outside, X button, or Escape key

**Given** that I want to update an OT's status by moving it
**When** I drag-and-drop an OT card from one column to another
**Then** the system validates the state transition:
- PENDIENTE → ASIGNADA: ✅ Allowed
- ASIGNADA → EN_PROGRESO: ✅ Allowed
- EN_PROGRESO → PENDIENTE_REPUESTO: ✅ Allowed (if waiting for parts)
- EN_PROGRESO → COMPLETADA: ✅ Allowed (if work finished)
- COMPLETADA → Any state: ❌ Not allowed (final state)
- DESCARTADA → Any state: ❌ Not allowed (final state)
- And if the transition is valid:
  - The OT's estado is updated to the new column's state
  - The OT's updatedAt is set to now()
  - The card appears in the new column
  - Assigned technicians receive push notification: "OT OT-20260307-0001 cambió a estado: EN_PROGRESO"
  - I see success message: "OT actualizada exitosamente"
- And if the transition is invalid:
  - The card snaps back to the original column
  - I see error message: "No se puede mover una OT completada"

**Given** that the Kanban is displayed on desktop (>1200px)
**When** I view the board
**Then** I see all 8 columns side-by-side
- And each column has a minimum width of 250px
- And horizontal scrolling is enabled if needed
- And I can see the complete workflow at a glance

**Given** that the Kanban is displayed on tablet (768-1200px)
**When** I view the board
**Then** I see a simplified 2-column view:
- Column A: "Pendientes" (includes PENDIENTE, ASIGNADA)
- Column B: "En Progreso" (includes EN_PROGRESO, PENDIENTE_REPUESTO, PENDIENTE_PARADA, REPARACION_EXTERNA)
- And completed/discarded OTs are in a modal accessed via "Ver Completadas" button
- And swipe gestures allow switching between the 2 columns

**Given** that the Kanban is displayed on mobile (<768px)
**When** I view the board
**Then** I see a single-column view with swipe navigation
- And the current column shows at the top: "En Progreso (1/8)"
- And I can swipe left/right to move between columns
- And an indicator dots shows which column I'm viewing: "• ◦ ◦ ◦ ◦ ◦ ◦"
- And tap on a card opens the details modal (no drag-drop on mobile)

**Given** that the Kanban is open
**When** new OTs are created or status changes occur
**Then** the Kanban updates in real-time via SSE (every 30 seconds)
- And new OT cards appear automatically
- And status changes are reflected immediately
- And column counts update dynamically
- And I see a visual indicator when updates occur: "3 cambios pendientes"

**Given** that I want to filter the OTs shown
**When** I use the filter controls at the top of the Kanban
**Then** I can filter by:
- Technician: "Solo mis OTs" or "Todos"
- Estado: Multi-select of states to show/hide
- Prioridad: "Solo Urgente y Alta"
- Equipo: Search by equipment name
- Tipo: "Solo Preventivo" or "Solo Correctivo"
- And the Kanban updates to show only filtered OTs
- And column counts reflect the filtered view

**Given** that I have applied filters
**When** I want to clear them
**Then** a "Limpiar Filtros" button appears
- And tapping it resets all filters to show all OTs

**FRs covered:** FR11 (8 estados), FR22 (colores preventivo/correctivo), FR23 (colores reparación interna/externa), FR24 (modal ℹ️), FR26-27 (vista listado con filtros - shared with Story 4.7), FR30 (toggle vistas), FR31 (sincronización real-time), NFR-P5 (<100ms transiciones)

---

## Story 4.4: Gestión de Estados por Técnico (María)

As a María (Técnica with can_update_own_ot capability),
I want to view my assigned work orders in a personal dashboard and update their status (start work, mark as completed, add comments and photos) from a simple mobile-friendly interface,
So that I can manage my daily work efficiently and keep supervisors informed of progress.

**Acceptance Criteria:**

**Given** that I am logged in as a user with can_update_own_ot and can_view_own_ots capabilities
**When** I access the `/mis-ordenes` route or dashboard home
**Then** I see a personalized dashboard with:
- "Mis OTs de Hoy" section showing my assigned work orders for today
- Each OT displayed as a card with:
  - numeroOT (e.g., "OT-20260307-0001")
  - equipo: "Prensa PH-500"
  - descripcion: First 80 characters with "..." if longer
  - estado badge: "ASIGNADA" (amber), "EN_PROGRESO" (purple), "PENDIENTE_REPUESTO" (red)
  - prioridad indicator: "🔴 Urgente", "🟠 Alta", "🟡 Media"
  - Time information: "Asignada hace 2 horas" or "En progreso desde 10:30 AM"
  - Action buttons based on state:
    - If ASIGNADA: "▶️ Iniciar" button (primary, prominent)
    - If EN_PROGRESO: "✅ Completar" button (primary), "⏸ Pausar" button (secondary)
    - If PENDIENTE_REPUESTO: "📦 Repuesto Listo" button to resume
- And the cards are touch-friendly (44x44px buttons)

**Given** that I have an OT in ASIGNADA state
**When** I tap/click the "▶️ Iniciar" button
**Then** a confirmation dialog appears: "¿Iniciar trabajo en OT OT-20260307-0001?"
- And the dialog has two buttons: "Cancelar" and "Sí, Iniciar"
**When** I confirm "Sí, Iniciar"
**Then** the system updates the OT with:
  - estado: EN_PROGRESO
  - fechaInicio: set to current timestamp
  - updatedAt: set to now()
- And Javier receives push notification: "María inició OT OT-20260307-0001"
- And the OT card moves to "En Progreso" section
- And the "▶️ Iniciar" button is replaced with "✅ Completar" and "⏸ Pausar" buttons
- And I see success message: "OT iniciada. ¡Buena suerte, María!"
- And the action is logged in the OT history

**Given** that I have an OT in EN_PROGRESO state
**When** I tap/click the "✅ Completar" button
**Then** a form modal opens to confirm completion:
- Pre-filled with OT details (equipo, descripcion, assigned technicians)
- Confirmation checkbox: "¿Trabajo completado satisfactoriamente?"
- Repuestos usados section (see Story 4.5)
- Photos section for "after" photos (optional)
- Final notes textarea (optional)
- "Cancelar" and "Confirmar Completado" buttons
**When** I fill in the required information and tap "Confirmar Completado"
**Then** the system updates the OT with:
  - estado: COMPLETADA
  - fechaCompletado: set to current timestamp
  - All provided data saved
- And Carlos (who reported the original aviso, if applicable) receives push notification: "OT OT-20260307-0001 completada. ¿Confirma que funciona?"
- And Javier receives push notification: "María completó OT OT-20260307-0001"
- And the OT card moves to "Completadas" section
- And I see success message: "¡Excelente trabajo, María! OT completada."
- And I can no longer edit this OT (read-only)

**Given** that I have an OT in EN_PROGRESO state
**When** I tap/click the "⏸ Pausar" button
**Then** a dropdown asks: "¿Por qué pausas?"
**And** I can select:
  - "Pendiente Repuesto" (changes state to PENDIENTE_REPUESTO)
  - "Pendiente Parada" (changes state to PENDIENTE_PARADA)
  - "En espera de coordinación" (stays EN_PROGRESO with note)
**When** I select "Pendiente Repuesto"
**Then** the OT estado changes to PENDIENTE_REPUESTO
- And Pedro (stock manager) receives notification: "Repuesto needed for OT OT-20260307-0001"
- And the OT card moves to "Pendiente Repuesto" column
- And I see success message: "OT pausada por falta de repuesto"

**Given** that I want to add comments while working on an OT
**When** I tap/click the OT card to open details
**Then** I see a comments section with:
- Existing comments with timestamps (if any)
- Textarea to add new comment: "Agregar nota de progreso..."
- "Publicar" button
- Photo attachment button (optional)
**When** I type a comment: "Rodamiento reemplazado, falta ajustar alineación" and tap "Publicar"
**Then** the system:
  - Creates an OTComment record with my userId, comentario, current timestamp
  - Shows the comment in the comments section with "María - Hace 2 minutos"
  - Javier (supervisor) can see this comment in the OT details
  - I see success message: "Comentario agregado"

**Given** that I am working on an OT and need to take "after" photos
**When** I tap the photo attachment button in the comments section
**Then** the camera opens and I can take photos
- And I can attach up to 5 "after" photos
- And photos are shown as thumbnails
- And these photos are visible to Javier in the OT details modal
- And photos help document the completed work

**Given** that I am on my mobile device
**When** I use the OT management interface
**Then** the interface is optimized for mobile:
- Large touch targets (44x44px minimum)
- Swipe gestures to navigate between sections
- Bottom navigation for quick access
- Photos and comments load quickly
- "Iniciar" and "Completar" buttons are thumb-friendly

**Given** that multiple technicians are assigned to the same OT
**When** I (María) start working on the OT
**Then** my action is independent of other assigned technicians
- And I can mark my progress without waiting for others
- And the OT remains EN_PROGRESO until all assigned tasks are done
- And each technician can add their own comments and photos
- And the OT shows which technicians have completed their assigned tasks

**Error Scenarios:**

**Given** that I try to complete an OT without required information
**When** I tap "Confirmar Completado" with missing data
**Then** the system shows inline errors:
- "Debes confirmar si el trabajo quedó completado" if checkbox not checked
- And the form remains open for correction

**Given** that the system is down when I try to update OT status
**When** the API call fails
**Then** the system shows error message: "Error al actualizar OT. Por favor intenta nuevamente."
- And the action is preserved for retry

**FRs covered:** FR12 (iniciar OT), FR14 (completar OT), FR15 (notas internas), FR19-A (múltiples asignados pueden actualizar), FR106 (comentarios con timestamp), FR107 (fotos antes/después)

---

## Story 4.5: Uso de Repuestos durante Ejecución de OT

As a María (Técnica working on an OT),
I want to add used spare parts to the work order while documenting progress, with the system automatically deducting from stock in real-time and showing location information,
So that stock levels are accurately maintained and Pedro (stock manager) is not spammed with notifications for each part used.

**Acceptance Criteria:**

**Given** that I am working on an OT and need to use a spare part
**When** I access the OT details or completion form
**Then** I see a "Repuestos Usados" section with:
- "Agregar Repuesto" button
- List of already added parts (if any)
- For each part: name, quantity used, stock location

**Given** that I tap/click "Agregar Repuesto"
**Then** a search modal opens with:
- Search field: "Buscar repuesto (ej: rodamiento, filtro)"
- Predictive autocomplete with <200ms response
- Results show:
  - Repuesto name
  - Current stock: "12 disponibles"
  - Location: "📍 Estante A3, Cajón 3"
  - SKU: "SKF-6208"
  - And all users can see stock and location (FR44-47)

**Given** that I search for "rodamiento"
**When** I see the suggestions
**Then** "Rodamiento SKF-6208" appears with:
  - Highlighted term: "**Rodamiento** SKF-6208"
  - Context: "Para Prensa PH-500, Perfiladora P-201"
  - Stock: "12 unidades 🟢"
  - Location: "📍 Estante A3, Cajón 3"
  - Last used: "Usado hace 2 días en OT OT-20260305-0023"

**Given** that I select "Rodamiento SKF-6208" from the suggestions
**When** the repuesto is selected
**Then** the search modal shows:
- Repuesto details (name, SKU, current stock, location)
- Quantity input field (number, default 1)
- "Agregar" and "Cancelar" buttons
- And I can adjust the quantity (e.g., "2 unidades")

**Given** that I enter quantity "2" and tap "Agregar"
**Then** the system:
- Validates that the quantity is available (stock >= requested quantity)
- If validation fails: Shows error "Solo 12 disponibles. Solicitaste 15."
- If validation succeeds:
  - Adds the repuesto to the OT's repuestosUsados list
  - Deducts 2 units from stock in real-time (within 1 second per FR16)
  - Shows success message: "✓ Agregado: Rodamiento SKF-6208 (x2). Stock actual: 10"
  - Pedro does NOT receive a notification (silent update per FR16)
  - The search modal closes or allows adding more parts

**Given** that I have added multiple parts to the OT
**When** I view the "Repuestos Usados" section
**Then** I see a list of all added parts:
- For each part:
  - Name: "Rodamiento SKF-6208"
  - Quantity: "x2"
  - Location: "📍 Estante A3, Cajón 3"
  - "Remover" button (X)
- And total estimated cost is calculated (if parts have unit cost)
- And I can remove a part if I made a mistake

**Given** that I tap "Remover" on a part
**When** I confirm the removal
**Then** the system:
- Removes the part from the repuestosUsados list
- Restores the quantity to stock (silent update, no notification to Pedro)
- Shows success message: "Repuesto removido. Stock restaurado."

**Given** that Pedro (stock manager) views the repuesto catalog
**When** he checks "Rodamiento SKF-6208"
**Then** he sees:
- Current stock: "10 unidades" (after María used 2)
- Location: "📍 Estante A3, Cajón 3"
- Recent usage: "Usado hace 5 minutos en OT OT-20260307-0001 por María"
- Stock minimum alert: "Mínimo: 5 unidades 🟢" (still above minimum)

**Given** that the stock reaches minimum level
**When** María uses parts and stock drops to 4 (minimum is 5)
**Then** Pedro receives a push notification: "⚠️ Alerta: Rodamiento SKF-6208 alcanzó mínimo (4 unidades, mínimo: 5)"
- And Pedro can generate a purchase order from this notification
- And María can continue using parts (system doesn't block)

**Given** that multiple technicians work on the same OT simultaneously
**When** they all add repuestos to the same OT
**Then** the repuestosUsados list is cumulative
- And each technician sees parts added by others (real-time sync)
- And stock is deducted correctly (no race conditions)
- And the total shows all parts used across all technicians

**Performance Validation:**

**Given** that stock updates must be fast
**When** María adds a part to the OT
**Then** the stock update completes in <1 second (FR16, NFR-P3)
- And the UI shows the updated stock immediately
- And Pedro sees the updated stock when he refreshes (SSE update)

**Accessibility:**

**Given** that I am using a screen reader
**When** I interact with the repuesto search
**Then** each suggestion has aria-label: "Rodamiento SKF-6208, 12 disponibles, ubicación Estante A3 Cajón 3"
- And the quantity input has aria-label: "Cantidad a usar"

**FRs covered:** FR13 (agregar repuestos durante cumplimiento), FR16 (actualización stock tiempo real 1s, silenciosa), FR44-47 (todos ven stock y ubicación), FR50 (alertas stock mínimo)

---

## Story 4.6: Asignación Múltiple de Técnicos y Proveedores

As a Javier (Supervisor with can_assign_technicians capability),
I want to assign 1 to 3 internal technicians or 1 external provider to each work order, with all assigned users receiving notifications and any of them being able to update the OT status or add comments,
So that work can be distributed across team members or external partners efficiently.

**Acceptance Criteria:**

**Given** that I am creating or editing an OT (Story 4.2 or via OT details modal)
**When** I access the technician/provider assignment field
**Then** I see two tabs/options:
- Tab 1: "Técnicos Internos" (default)
- Tab 2: "Proveedor Externo"

**Given** that I am on the "Técnicos Internos" tab
**When** I search for technicians
**Then** I see a searchable dropdown of all users with can_update_own_ot capability
- And the dropdown shows:
  - User name: "María González"
  - Role/Classification: "Técnica"
  - Current workload: "2 OTs activas" or "Disponible"
  - Skills/Tags (if available): "Electricidad, Hidráulica"
  - Last OT completed: "Hace 3 horas"
- And I can search by name or role
- And suggestions appear in <200ms

**Given** that I select a technician (e.g., "María González")
**When** she is added
**Then** she appears as a chip/tag:
- "María González - Técnica"
- Role selector: "Principal" (default) or "Secundario"
- Remove "X" button
- And I can select up to 3 technicians total
- And if I try to add a 4th technician:
  - System shows error: "Máximo 3 técnicos por OT"
  - The 4th selection is rejected

**Given** that I have selected multiple technicians
**When** I view the assignment list
**Then** I see:
- First technician: "María González - Técnica Principal" ⭐
- Second technician: "Juan Pérez - Técnico Secundario"
- Third technician: "Ana López - Técnica Secundaria"
- And the "Principal" technician receives a ⭐ indicator
- And I can change who is Principal by selecting from a dropdown

**Given** that I switch to the "Proveedor Externo" tab
**When** I select an external provider
**Then** the technician field is disabled (only 1 provider per OT)
- And I can search for providers by name
- And the provider dropdown shows:
  - Provider name: "Talleres Eléctricos SA"
  - Service types: "Mantenimiento Correctivo, Mantenimiento de Equipos Específicos"
  - Contact: "Tel: +54 11 1234-5678, Email: contacto@talleselectricos.sa"
  - Availability: "Disponible" or "Ocupado (2 OTs activas)"
- And when I select a provider:
  - They appear as a chip: "Talleres Eléctricos SA - Proveedor"
  - Their rol is automatically set to PROVEEDOR

**Given** that I have assigned technicians and/or providers
**When** I save the OT
**Then** the system creates OTAssignment records for each:
- For technicians: userId, rol (TECNICO_PRINCIPAL or TECNICO_SECUNDARIO), fechaAsignacion
- For provider: providerId, rol (PROVEEDOR), fechaAsignacion
- And all assigned users receive push notifications:
  - Technicians: "Nueva OT asignada: OT-20260307-0001 - Prensa PH-500 - [Descripción corta]"
  - Provider: "Nueva OT asignada: OT-20260307-0001 - Prensa PH-500 - [Descripción corta]"
- And the OT appears in their "Mis OTs" dashboards

**Given** that an OT has multiple technicians assigned
**When** any of them (María, Juan, or Ana) updates the OT
**Then** any of them can:
- Change the OT state (e.g., ASIGNADA → EN_PROGRESO)
- Add comments with timestamp
- Attach photos
- Add used repuestos
- And all other assigned technicians see the updates in real-time via SSE
- And Javier sees who made each update in the OT history

**Given** that the OT is assigned to an external provider
**When** the provider marks it as completed
**Then** Javier (supervisor) must confirm the receipt before the OT is fully completed (Story 4.6 continuation)
- And the OT state changes to a special "PENDIENTE_RECEPCION" state
- And Javier receives notification: "Proveedor completó OT OT-20260307-0001. ¿Confirmar recepción?"
- And the OT cannot be marked COMPLETADA until Javier confirms

**Given** that I am viewing an OT with multiple assignments
**When** I tap/click the ℹ️ modal
**Then** the "Asignados" section shows:
- For technicians: Name, role, contact (phone), photo
- For providers: Name, service type, phone, email
- "Llamar" button for technicians and providers (tap to call)
- "Ver OTs Asignadas" link to see other OTs assigned to this person
- And each assignment shows the assignment date: "Asignado hace 2 horas"

**Given** that I need to remove an assignment
**When** I tap/click the "X" on a technician chip
**Then** a confirmation dialog appears: "¿Remover a María González de esta OT?"
- And if I confirm:
  - The OTAssignment record is deleted or marked as inactive
  - María receives notification: "Fuiste removido de OT OT-20260307-0001"
  - The OT disappears from María's "Mis OTs" dashboard
  - I can reassign the OT to someone else

**Error Scenarios:**

**Given** that I try to save an OT without any assignments
**When** I tap "Crear OT" or "Guardar"
**Then** the system shows inline error: "Debes asignar al menos 1 técnico o 1 proveedor"
- And the form remains open for correction

**FRs covered:** FR17 (asignar 1-3 técnicos internos), FR18 (asignar proveedores externos), FR19 (seleccionar 1-3 según tipo), FR19-A (múltiples asignados pueden actualizar), FR24 (modal ℹ️ con detalles de asignados)

---

## Story 4.7: Vista de Listado con Filtros Avanzados

As a Javier (Supervisor with can_view_all_ots capability),
I want to view all work orders in a paginated table format with advanced filtering by 5 criteria (estado, técnico, fecha, tipo, equipo) and sortable columns,
So that I can quickly find specific OTs, analyze patterns, and export data for reporting.

**Acceptance Criteria:**

**Given** that I am on the Kanban board or dashboard
**When** I tap/click the "Vista de Lista" toggle button
**Then** the Kanban view transitions to a table view in <100ms (NFR-P5)
- And the transition animation is smooth (fade/resize)
- And the "Vista de Lista" button changes to "Vista Kanban"

**Given** that the list view is displayed
**When** I view the OT table
**Then** I see columns:
- numeroOT (clickable, opens OT details)
- equipo (Equipment name with location)
- descripcion (truncated to 100 chars with "...")
- tipo (Preventivo/Correctivo badge)
- estado (State badge)
- prioridad (Priority indicator)
- asignados (Avatar stack of assigned technicians/providers)
- fechaCreacion (Date/time or relative "Hace 2 horas")
- fechaCompletado (If completed, date/time)
- acciones (Action buttons: "Ver Detalles", "Editar" if permissions allow)
- And each row is clickable to view OT details
- And the table has 20 OTs per page by default

**Given** that the list view is displayed
**When** I want to filter the OTs
**Then** I see filter controls at the top:
- Estado: Multi-select dropdown with 8 states
- Técnico: Searchable dropdown of technicians
- Fecha: Date range picker (Desde/Hasta)
- Tipo: Dropdown "Todos", "Preventivo", "Correctivo"
- Equipo: Search field for equipment name
- Priority: Multi-select "Baja", "Media", "Alta", "Urgente"
- "Aplicar Filtros" button
- "Limpiar Filtros" button

**Given** that I apply filters
**When** I select Estado: "EN_PROGRESO, COMPLETADA" and Técnico: "María González"
**Then** the table updates to show only OTs matching these criteria
- And the page title updates: "OTs Filtradas (15 encontrados)"
- And column counts reflect the filtered view
- And the filters are preserved when navigating between pages
- And I can see which filters are active: "Estado (2), Técnico (María)"

**Given** that I have applied multiple filters
**When** I tap "Limpiar Filtros"
**Then** all filters are reset to default (show all)
- And the table shows all OTs again
- And the page title updates: "Todas las OTs (127 totales)"

**Given** that I want to sort the table
**When** I tap/click any column header
**Then** the table sorts by that column:
- First tap: Ascending order (↑)
- Second tap: Descending order (↓)
- And a sort indicator appears in the column header
- And I can sort by any column: numeroOT, equipo, fechaCreacion, fechaCompletado, prioridad
- And the default sort is by fechaCreacion descending (newest first)

**Given** that the table has many OTs (e.g., 500+)
**When** I view the list
**Then** the table is paginated:
- 20 OTs per page by default
- Pagination controls at bottom: "Anterior", "Página 1 de 25", "Siguiente"
- I can jump to a specific page
- I can change page size: "20 por página", "50 por página", "100 por página"
- And the pagination is URL-based (deep linking: `/ordenes-trabajo?pagina=3`)

**Given** that I am in the list view
**When** I want to return to the Kanban
**Then** I tap/click the "Vista Kanban" toggle button
- And the table transitions back to the Kanban in <100ms
- And my filters are preserved between views (Kanban and List show same filtered OTs)

**Given** that I want to export the filtered list
**When** I tap/click the "Exportar" button
**Then** I can export to Excel (.xlsx) or CSV
- And the export includes only the filtered/sorted OTs (not all OTs if filters are active)
- And the Excel file has multiple sheets if OT count is large
- And the exported data includes all OT fields (numeroOT, equipo, descripcion, estado, fechas, etc.)

**Performance Validation:**

**Given** that the OT table can have many rows
**When** I load the list view
**Then** the initial load completes in <2 seconds (NFR-P4 for dashboard)
- And pagination ensures fast loads (only 20 rows at a time)
- And filters apply in <500ms for large datasets

**Given** that I switch between views
**When** I toggle from List to Kanban or vice versa
**Then** the transition completes in <100ms (NFR-P5)
- And the state (filters, sort) is preserved between views

**Accessibility:**

**Given** that I am using a keyboard
**When** I navigate the table
**Then** I can:
- Use Tab to move between rows
- Use Enter to open OT details
- Use Arrow keys in column headers for sorting
- And focus is visible on all interactive elements

**Mobile Optimization:**

**Given** that I view the list on mobile (<768px)
**When** the table is displayed
**Then** it's optimized for mobile:
- Only essential columns shown: numeroOT, equipo, estado
- Other columns are hidden or moved to "Ver Detalles" modal
- Horizontal scrolling is enabled if needed
- Tap on row opens full details in a modal

**FRs covered:** FR26 (vista de listado), FR27 (filtros por 5 criterios), FR28 (ordenar por columnas), FR29 (acciones disponibles = Kanban), FR30 (toggle vistas), FR31 (sincronización real-time), NFR-P5 (<100ms transiciones)

---

## Story 4.8: Comentarios con Timestamp, Fotos y Notas

As a María (Técnica) or Javier (Supervisor) working on an OT,
I want to add timestamped comments with optional photos and internal notes to document progress, ask questions, or provide context, with all comments visible to other assigned users and the supervisor,
So that there is a complete audit trail of communication and decisions throughout the OT lifecycle.

**Acceptance Criteria:**

**Given** that I am viewing an OT's details modal (ℹ️)
**When** I scroll to the "Comentarios" section
**Then** I see:
- List of existing comments with timestamps (if any)
- Each comment shows:
  - Author name and avatar: "María González"
  - Role badge: "Técnica" (if assigned technician) or "Supervisor"
  - Timestamp: "2026-03-07 a las 14:35" or "Hace 2 horas"
  - Comment text: "Rodamiento reemplazado, falta ajustar alineación"
  - Photos: Thumbnails if photos attached (max 3 per comment)
  - For photos: Tap to view full size in modal
- "Agregar Comentario" button at bottom

**Given** that I tap/click "Agregar Comentario"
**Then** a comment form appears with:
- Textarea: "Escribe tu comentario..." (max 1000 characters)
- Photo attachment button: "📷 Adjuntar Foto" (optional, up to 3 photos per comment)
- "Cancelar" and "Publicar" buttons
- And the form is optimized for both mobile and desktop

**Given** that I type a comment: "Se encontró daño adicional en el eje principal. ¿Continuar con reparación o escalar?"
**When** I tap/click "Publicar"
**Then** the system:
- Creates an OTComment record with my userId, workOrderId, comentario, current timestamp
- Sends push notifications to:
  - Other assigned technicians: "María comentó en OT OT-20260307-0001"
  - Javier (supervisor): "María comentó en OT OT-20260307-0001: 'Se encontró daño adicional...'"
- Shows the comment in the comments section with "Hace un momento"
- Shows success message: "Comentario publicado"
- And the comment is visible to all users with access to this OT

**Given** that I attach photos to my comment
**When** I select 2 photos from the gallery
**Then** the photos are uploaded to cloud storage
- And URLs are stored in the OTComment fotoUrls field (JSON array)
- And thumbnails appear next to the comment
- And other users can tap thumbnails to view full-size photos

**Given** that I am Javier (supervisor) and want to add internal notes
**When** I access the "Notas Internas" section in the OT details
**Then** I see:
- Existing internal notes (if any) with timestamps
- Textarea for new note: "Agregar nota interna..."
- "Guardar" button
- And internal notes are separate from public comments
- And internal notes are visible only to users with can_view_all_ots capability (supervisors, admins)
- And technicians (María, Juan) CANNOT see internal notes

**Given** that I add an internal note: "Llamar al proveedor para cotizar repuesto de eje. Si es >$5000, escalar a Gerente."
**When** I tap "Guardar"
**Then** the note is saved in the OT.notaInterna field (or in OTComment with a special isInternal flag)
- And the note is visible only to me and other supervisors/admins
- And María (technician) does NOT see this note in her view
- And the note is timestamped for audit trail

**Given** that multiple people add comments to the same OT
**When** I view the comments section
**Then** I see a chronological timeline of all comments:
- "María - Hace 3 horas: Rodamiento reemplazado..."
- "Javier - Hace 2 horas: ¿Necesitas ayuda con la alineación?"
- "María - Hace 1 hora: Sí, si tienes el alineador, avísame."
- "Javier - Hace 30 minutos: Alineador disponible en el taller."
- And each comment has the author's name, role, and timestamp
- And comments are ordered newest first (most recent at top)

**Given** that the OT is completed and archived
**When** I view the OT in "Completadas" state
**Then** all comments are preserved in read-only format
- And no new comments can be added (OT is locked)
- And the complete comment history is part of the OT's audit trail

**Given** that I am Carlos (operator who reported the original aviso)
**When** the OT derived from my aviso is completed
**Then** I can see the OT details but NOT the internal notes
- And I can see comments that technicians chose to make visible
- And I can see the completion confirmation asking if the repair works

**Performance:**

**Given** that an OT may have many comments (50+)
**When** I view the comments section
**Then** the comments are paginated (20 per page)
- Or lazy-loaded as I scroll down
- And the initial load shows the 10 most recent comments

**Accessibility:**

**Given** that I am using a screen reader
**When** I navigate the comments section
**Then** each comment has proper aria-labels:
- "Comentario de María González, Técnica, hace 2 horas: Rodamiento reemplazado, falta ajustar alineación"
- And photo attachments have alt text: "Foto 1: Eje dañado"

**FRs covered:** FR15 (notas internas), FR106 (comentarios con timestamp), FR107 (fotos adjuntas), FR24 (modal ℹ️ con trazabilidad completa)

---

## Story 4.9: Sincronización SSE y Toggle entre Vistas

As a María (Técnica) or Javier (Supervisor) viewing OTs in different formats,
I want real-time synchronization of updates via Server-Sent Events (SSE) every 30 seconds, with seamless toggle between Kanban and List views without losing filters or state,
So that I always see the current state of OTs without manual refresh and can switch between visual and tabular views based on my needs.

**Acceptance Criteria:**

**SSE Real-Time Synchronization:**

**Given** that I am viewing the Kanban board
**When** another user (Javier) creates a new OT or changes an OT's state
**Then** within 30 seconds (NFR-P3 heartbeat):
- My Kanban updates automatically without manual refresh
- New OT cards appear in the appropriate columns
- OT cards move between columns when state changes
- Column counts update dynamically
- I see a visual indicator: "3 cambios pendientes - Click para actualizar"
- And clicking the indicator applies all pending updates

**Given** that I am viewing the List view
**When** OTs are updated or new OTs are created
**Then** within 30 seconds:
- My table updates automatically
- New rows appear or existing rows are updated
- Sort order is maintained
- Filters remain applied
- Pagination shows updated counts

**Given** that I am viewing my personal dashboard ("Mis OTs")
**When** a new OT is assigned to me
**Then** within 30 seconds:
- The new OT appears in my dashboard
- I receive a push notification: "Nueva OT asignada: OT-20260307-0001"
- And I can tap the notification to view the OT details

**Given** that multiple users are viewing the same OT simultaneously
**When** one user (María) adds a comment or changes state
**Then** all other users see the update within 30 seconds
- And the comment appears in their comments section
- Or the OT state badge updates
- And the change is attributed to "María" with timestamp

**SSE Connection Management:**

**Given** that the SSE connection is active
**When** I navigate to a different page or close the browser tab
**Then** the SSE connection is automatically closed
- And resources are freed

**Given** that I lose network connection temporarily (<30 seconds)
**When** the SSE connection drops
**Then** the client attempts automatic reconnection within 30 seconds
- And if reconnection succeeds: "Conexión restablecida."
- And if reconnection fails after 30 seconds: "Sin conexión. Reintentando..."
- And the system retries every 30 seconds

**Given** that I am on a mobile device and the app goes to background
**When** I return to the app
**Then** the SSE connection automatically resumes
- And any updates missed during background are fetched upon return
- And the app shows: "Sincronizando cambios..." then "Actualizado"

**Toggle Between Views (Kanban ↔ List):**

**Given** that I am viewing the Kanban board with filters applied
**When** I have filters: Estado="EN_PROGRESO, COMPLETADA" and Técnico="María"
**And** I tap/click the "Vista de Lista" button
**Then** the transition completes in <100ms (NFR-P5)
- And the List view shows with the SAME filters applied
- And the List shows only OTs in EN_PROGRESO or COMPLETADA assigned to María
- And the sort order is preserved
- And the page title reflects the filtered count: "OTs Filtradas (15)"

**Given** that I am in the List view and make changes (e.g., change sort order)
**When** I sort by "fechaCreacion" descending
**And** I toggle back to Kanban view
**Then** the Kanban opens in <100ms
- And my filters are preserved
- And the Kanban shows the same filtered OTs as the List did
- And the OT cards are ordered consistently with the List sort (newest first in each column)

**Given** that I have both views open in different browser tabs
**When** I update an OT in one tab
**Then** both tabs receive the SSE update
- And both tabs update within 30 seconds
- And I don't need to refresh either tab manually

**Performance Validation:**

**Given** that SSE updates arrive every 30 seconds
**When** 10 OTs are updated simultaneously
**Then** the UI updates smoothly without lag
- And all 10 changes are reflected in <1 second total
- And the browser remains responsive

**Given** that I toggle between views rapidly
**When** I switch 5 times in 10 seconds
**Then** each transition completes in <100ms
- And there is no visual lag or jank
- And the animation is smooth (60fps)

**Error Recovery:**

**Given** that the SSE server has an error
**When** the error occurs
**Then** the client shows: "Error de sincronización. Reintentando..."
- And the client attempts reconnection every 30 seconds
- And manual refresh is still possible: "Toca para recargar manualmente"

**Accessibility:**

**Given** that I am using a screen reader
**When** SSE updates occur
**Then** I am notified: "3 órdenes de trabajo actualizadas"
- And I can choose to review the updates

**FRs covered:** FR31 (sincronización multi-dispositivo), FR30 (toggle vistas Kanban/Listado), NFR-P3 (SSE 30s heartbeat), NFR-P4 (dashboard <2s), NFR-P5 (transiciones <100ms), NFR-R4 (SSE auto-reconexión <30s)

---

## Epic 4 Completion Criteria

**Epic 4 is complete when:**
- ✅ All 9 stories are implemented with passing acceptance criteria
- ✅ María can view and manage her assigned OTs in mobile-friendly interface
- ✅ María can update OT states, add comments, attach photos
- ✅ María can add used parts with stock deduction
- ✅ Javier can view all OTs in Kanban with 8 columns
- ✅ Javier can drag-drop cards to update states
- ✅ Color coding works (7 types: preventivo, correctivo propio/externo, reparación interna/externa)
- ✅ Javier can assign 1-3 technicians or 1 provider
- ✅ Multiple assignees can all update the OT
- ✅ List view with advanced filters works
- ✅ Toggle between Kanban and List views is seamless (<100ms)
- ✅ SSE real-time sync works (30s updates)
- ✅ All FR11-FR31 are covered and tested
- ✅ Performance NFRs are met (<100ms transitions, <2s dashboard, <30s SSE)

**Dependencies Satisfied:**
- Epic 1: Authentication and capabilities working
- Epic 2: Asset hierarchy available for equipment selection
- Epic 3: Avisos system working as source of correctivas OTs

**Next Epic Enabled:**
- Epic 5: Stock management (can track repuestos used in OTs)
- Epic 7: Routines (can generate preventivas OTs)
- Epic 8: KPIs (has OT data for MTTR/MTBF calculations)

**Value Delivered:**
- María: "¡Todo está aquí. No tengo que preguntar nada."
- Javier: "Un clic y tengo toda la historia."
- Visual control of workload without calling technicians
- Real-time collaboration across team members

**Technical Achievements:**
- Complex state machine with 8 states working
- Drag-and-drop Kanban with mobile swipe support
- SSE multi-user real-time sync
- Search with debouncing and caching
- Stock updates silent and real-time
- Responsive design for 3 breakpoints

---

**Epic 4 Documentation Complete**
- Date: 2026-03-07
- Version: 2.0 (Complete format)
- Stories: 9 (all expanded to full Given/When/Then format)
- Total Estimated Effort: 55-70 story points (approx 6-8 sprints)
- Previous Epic: 3 (Reporte de Averías)
- Next Epics: 5 (Stock), 6 (Providers), 7 (Routines)
