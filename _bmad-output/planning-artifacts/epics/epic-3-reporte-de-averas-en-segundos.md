# Epic 3: Reporte de Averías en Segundos

Permitir a operarios como Carlos reportar averías en menos de 30 segundos con búsqueda predictiva de equipos (<200ms), descripción textual, fotos opcionales, recibiendo confirmación inmediata con número de aviso (<3 segundos), notificaciones push de estado en tiempo real (recibido, autorizado, en progreso, completado) dentro de los 30 segundos siguientes al cambio, y capacidad de confirmar si la reparación funciona correctamente. Los supervisores pueden ver avisos nuevos en columna de triage con distinción visual por color (rosa para avería, blanco para reparación).

**FRs cubiertos:** FR1-FR10, FR102 (11 requerimientos funcionales)
**Usuario principal:** Carlos (Operario de Línea), Javier (Supervisor con capability can_view_all_ots)
**Valor entregado:**
- Carlos reporta averías en <30s vs 2-5 minutos actuales
- Búsqueda predictiva <200ms con contexto jerárquico
- Confirmación inmediata con número de aviso (<3s)
- Notificaciones push de estado en tiempo real (SSE cada 30s)
- Carlos confirma si reparación funciona (feedback loop)
- Javier gestiona triage de avisos con vista Kanban
- Carlos siente "mi voz importa" vs "nadie hace caso"

**Dependencias:** Epic 1 (requiere autenticación), Epic 2 (requiere jerarquía de activos)

---

## Story 3.1: Modelo de Datos de Avisos de Avería

As a developer of the system,
I want to create the Prisma data model for failure reports (avisos de avería) with support for photos, status tracking, and conversion to work orders,
So that the system can store and manage the complete lifecycle of failure reports from creation to resolution.

**Acceptance Criteria:**

**Given** that I am defining the Prisma schema in `prisma/schema.prisma`
**When** I create the Aviso model
**Then** the Aviso model has fields:
- id (UUID, primary key)
- numeroAviso (String, unique, auto-generated format "AVG-YYYYMMDD-####")
- equipoId (UUID, foreign key → Equipo.id, required)
- reportadoPor (UUID, foreign key → User.id, required)
- descripcion (String, optional, max 2000 characters for problem description)
- fotoUrl (String, optional, URL to uploaded photo)
- estado (Enum AvisoEstado, default NUEVO)
- tipo (Enum AvisoTipo, default FALLA_REPORTE)
- fechaReporte (DateTime, default now())
- ubicacionReporte (String, optional, for context)
- confirmadoPorOperario (Boolean, default false)
- confirmacionFunciona (Boolean, optional)
- observacionConfirmacion (String, optional, max 500 characters)
- convertidoAOT (Boolean, default false)
- otId (UUID, foreign key → WorkOrder.id, optional, when converted)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt on)
- @@map for "avisos" table
- And there is a many-to-one relationship from Aviso to Equipo (equipoId → Equipo.id)
- And there is a many-to-one relationship from Aviso to User (reportadoPor → User.id)
- And there is a many-to-one relationship from Aviso to WorkOrder (otId → WorkOrder.id, optional)

**Given** that the Aviso model is created
**When** I create the AvisoEstado enum
**Then** the enum has values: NUEVO, RECIBIDO, AUTORIZADO, EN_PROGRESO, COMPLETADO, RECHAZADO
- And NUEVO indicates the aviso was just created
- And RECIBIDO indicates the supervisor has seen it
- And AUTORIZADO indicates the aviso was approved to become an OT
- And EN_PROGRESO indicates work has started
- And COMPLETADO indicates work is finished
- And RECHAZADO indicates the aviso was discarded

**Given** that the AvisoEstado enum is created
**When** I create the AvisoTipo enum
**Then** the enum has values: FALLA_REPORTE, REPARACION
- And FALLA_REPORTE indicates a new failure reported by an operator
- And REPARACION indicates a repair report after work is completed

**Given** that all models and enums are defined
**When** I run `npx prisma migrate dev --name init_avisos_averia`
**Then** the initial migration is created
**And** the avisos table is created in the database
**And** the AvisoEstado and AvisoTipo enums are created correctly
**And** foreign keys to Equipo, User, and WorkOrder are created correctly
**And** unique indexes are created on numeroAviso

**Given** that migrations are executed
**When** I run `npx prisma generate`
**Then** the Prisma Client is regenerated with the new models
**And** TypeScript types are generated automatically
**And** Prisma helpers include the new Aviso model

**Given** that models are generated
**When** I create the `types/avisos.ts` file
**Then** TypeScript types derived from Prisma are exported for Aviso
**And** an AvisoEstado type is created with the 6 possible states
**And** an AvisoTipo type is created with the 2 possible types

**FRs covered:** FR1 (base structure for creating avisos), FR7 (base structure for viewing avisos), FR10 (base structure for tipo distinction)

---

## Story 3.2: Reportar Avería en 30 Segundos (Journey Core de Carlos)

As a Carlos (Operario de Línea with can_create_failure_report capability),
I want to quickly report equipment failures using predictive search in less than 30 seconds by selecting the equipment, optionally describing the problem and attaching a photo,
So that I can report issues immediately without leaving my work area and receive confirmation that my voice was heard.

**Acceptance Criteria:**

**Given** that I am logged in as a user with can_create_failure_report capability
**When** I access the `/avisos/nuevo` route or tap the "+ Nueva Avería" button on the dashboard
**Then** I see a simplified report form optimized for speed with:
- A prominent equipment search field with predictive autocomplete
- An optional description textarea (placeholder: "Describe brevemente la falla")
- An optional photo attachment button with camera icon
- "Enviar" button (primary, blue, right-aligned)
- "Cancelar" button (secondary, gray, left-aligned)
- And the form is optimized for mobile (touch targets 44x44px minimum)
- And the form loads in <2 seconds (NFR-P2 compliance)

**Given** that I am on the report form
**When** I start typing in the equipment search field (3+ characters)
**Then** the system shows predictive suggestions in <200ms with:
- Equipment name highlighted matching my search term
- Hierarchical context: "Prensa PH-500 (Panel Sandwich, Línea 2)"
- Current equipment status (e.g., "Operativo", "Última avería: hace 3 días")
- And suggestions update in real-time as I type (debouncing 300ms)
- And the first suggestion is auto-selected for quick selection
- And I can navigate suggestions with arrow keys (Up/Down) and select with Enter
- And the search includes the complete 5-level hierarchy (Planta → Línea → Equipo → Componente → Repuesto)

**Given** that I have selected an equipment from the suggestions (e.g., "Prensa PH-500")
**When** I tap the description textarea
**Then** the textarea allows up to 2000 characters
**And** I can describe the problem: "No arranca, hace ruido raro cuando intento arrancar"
**And** the textarea is optional (I can skip it if in a hurry)
**And** the textarea supports emoji picker for quick status icons

**Given** that I have filled in the equipment (required) and optionally the description
**When** I tap the "Adjuntar Foto" button
**Then** the camera opens on my mobile device (or file picker on desktop)
**And** I can take a photo or select from gallery
**And** the photo is shown as a preview thumbnail
**And** I can remove the photo by tapping an "X" on the thumbnail
**And** I can attach up to 3 photos (optional)
**And** the photo upload is optional (not required for submission)

**Given** that I have selected the equipment and optionally added description and photos
**When** I tap the "Enviar" button
**Then** the system validates that equipment is selected
**And** if validation fails:
- Shows inline error: "Debes seleccionar un equipo"
- The form remains open for correction
- And the "Enviar" button is disabled until equipment is selected

**Given** that validation is correct (equipment selected)
**When** I tap the "Enviar" button
**Then** the system creates the Aviso record in the database with:
- numeroAviso auto-generated: "AVG-20260307-0001"
- estado: NUEVO
- tipo: FALLA_REPORTE
- All provided data saved
- And the system sends me a confirmation within 3 seconds
- And I see a toast notification: "✓ Aviso AVG-20260307-0001 recibido. Gracias por tu reporte."
- And the toast notification shows for 5 seconds then disappears
- And the button "+ Nueva Avería" changes to "¡Reportado! AVG-20260307-0001"
- And I am redirected to the dashboard showing my recent reports

**Given** that the aviso was successfully created
**When** a notification is triggered
**Then** I receive a push notification on my device: "Tu aviso AVG-20260307-0001 fue recibido. Gracias por reportar."
**And** the notification appears within 3 seconds of submission
**And** tapping the notification opens the app and shows the aviso details

**Error Scenarios:**

**Given** that I am filling the form and lose internet connection
**When** I tap "Enviar"
**Then** the system shows: "Sin conexión. Reintentando..."
**And** the system automatically retries every 5 seconds for up to 1 minute
**And** if connection is restored, the aviso is submitted successfully
**And** if connection fails after retries, the system shows: "Error al enviar. Por favor intenta nuevamente."
**And** the form data is preserved (not lost) for retry

**Given** that the system timeout occurs (>10 seconds)
**When** I am waiting for confirmation
**Then** the system shows: "Tiempo de espera agotado. Reintentar?"
**And** a "Reintentar" button appears
**And** the form data is preserved for retry

**FRs covered:** FR1, FR2, FR3, FR5, FR6, NFR-P1 (<200ms search), NFR-P2 (<3s confirmation)

---

## Story 3.3: Búsqueda Predictiva Universal con Debouncing

As a developer of the system,
I want to implement a universal predictive search component with debouncing, caching, and hierarchical context that works across all entity types (equipos, componentes, repuestos, técnicos, usuarios),
So that users can find any entity in <200ms regardless of the search context.

**Acceptance Criteria:**

**Given** that the universal search component is being implemented
**When** I create the `lib/search.ts` utility
**Then** the utility includes:
- A `debounce` function with 300ms delay to avoid excessive API calls
- A `searchEntities` function that accepts search term and entity type
- A cache layer using Next.js Data Cache for frequent searches
- Type-ahead suggestions with highlighting
- Hierarchical context display

**Given** that the search utility is created
**When** I implement the AssetSearch component in `components/AssetSearch.tsx`
**Then** the component includes:
- Input field with placeholder: "Buscar equipo (ej: prensa, perfiladora)"
- Loading state with spinner while searching
- Results dropdown with max 10 suggestions
- Highlighting of matched search term (e.g., "**Pren**sa PH-500")
- Hierarchical context for each result
- Keyboard navigation (arrow keys + Enter)
- Touch-friendly selection (44x44px minimum)
- Accessibility: role="combobox", aria-expanded, aria-label

**Given** that a user types in the search field
**When** they type "pren" (3 characters)
**Then** the debounce function waits 300ms after the last keystroke
**And** after 300ms, the search query is executed
**And** results are returned in <200ms
**And** suggestions are displayed in the dropdown

**Given** that search results are returned
**When** I display the suggestions
**Then** each suggestion shows:
- Equipment name with highlighted term: "**Pren**sa PH-500"
- Hierarchical context: "(Panel Sandwich, Línea 2)"
- Equipment status: "Operativo 🟢" or "Averiado 🔴"
- Last failure date: "Última avería: hace 3 días" (if applicable)
- And the suggestions are ordered by relevance (exact match first, then partial matches)
- And keyboard navigation is supported (Up/Down arrows, Enter to select)

**Given** that the user searches frequently
**When** I implement caching
**Then** frequent searches are cached for 5 minutes
**And** cache key includes: search term + entity type
**And** cached results are returned instantly (<50ms)
**And** cache is invalidated when entities are updated

**Given** that I need to support multiple entity types
**When** I extend the search to other entities
**Then** the same component works for:
- Equipos (default): Search by name, code, serial number
- Componentes: Search by name, part number
- Repuestos: Search by name, SKU
- Técnicos: Search by name, email
- Usuarios: Search by name, email
- OTs: Search by numero OT, equipment name
- And the search context adapts based on where it's used

**Performance Validation:**

**Given** that the search is implemented
**When** I measure search performance with JMeter
**Then** 90th percentile search time is <200ms
**And** 95th percentile search time is <500ms for complex queries
**And** the system handles 50 concurrent searches without degradation

**FRs covered:** FR6, FR102 (búsqueda predictiva universal), NFR-P1 (<200ms search), NFR-P3 (SSE updates)

---

## Story 3.4: Notificaciones Push en Tiempo Real (Server-Sent Events)

As a Carlos (Operario who reported a failure),
I want to receive push notifications within 30 seconds when the status of my aviso changes (received, authorized, in progress, completed),
So that I feel that my voice matters and know the system is working on my report without having to check manually.

**Acceptance Criteria:**

**Given** that SSE infrastructure was created in Epic 1 Story 1.1
**When** I enhance the SSE system for aviso status updates
**Then** the `/api/v1/sse/route.ts` endpoint supports broadcasting updates to connected clients
**And** updates are sent within 30 seconds of state change
**And** each update includes: avisoId, estado, timestamp, message

**Given** that an aviso status changes in the database
**When** the change occurs (e.g., supervisor converts aviso to OT)
**Then** the system pushes an SSE event to all connected clients
**And** the event includes:
- eventType: "AVISO_STATUS_CHANGED"
- data: { avisoId, numeroAviso, estadoNuevo, estadoAnterior, timestamp, mensaje }
- Example: { avisoId: "uuid-123", numeroAviso: "AVG-20260307-0001", estadoNuevo: "AUTORIZADO", estadoAnterior: "RECIBIDO", timestamp: "2026-03-07T10:15:30Z", mensaje: "Tu aviso fue autorizado. OT asignada a María." }

**Given** that I am Carlos and have the aviso AVG-20260307-0001
**When** the status changes from NUEVO to RECIBIDO
**Then** I receive a push notification on my device: "Aviso AVG-20260307-0001 recibido. Gracias por tu reporte."
**And** the notification arrives within 30 seconds of the status change
**And** tapping the notification opens the app and shows aviso details

**Given** that the status changes to AUTORIZADO
**When** the supervisor authorizes my aviso and creates an OT
**Then** I receive a push notification: "Tu aviso AVG-20260307-0001 fue autorizado. OT asignada a María."
**And** the notification includes the OT number if available
**And** the notification arrives within 30 seconds

**Given** that the status changes to EN_PROGRESO
**When** María starts working on the OT
**Then** I receive a push notification: "María está trabajando en tu OT AVG-20260307-0001."
**And** the notification arrives within 30 seconds

**Given** that the status changes to COMPLETADO
**When** María completes the repair
**Then** I receive a push notification: "OT AVG-20260307-0001 completada. ¿Confirma que funciona?"
**And** the notification includes a Confirm button and a Reject button
**And** the notification arrives within 30 seconds

**Given** that I tap "Confirm" on the completion notification
**When** I confirm the repair works
**Then** the system updates the aviso with:
- confirmadoPorOperario: true
- confirmacionFunciona: true
- And I see: "Gracias por tu confirmación. Tu feedback nos ayuda a mejorar."

**Given** that I tap "Reject" on the completion notification
**When** I reject the repair (it doesn't work)
**Then** the system updates the aviso with:
- confirmadoPorOperario: true
- confirmacionFunciona: false
- observacionConfirmacion: [required input field]
- And a re-work OT is created with priority ALTA
- And Javier receives notification: "Re-trabajo requerido para OT AVG-20260307-0001"

**Given** that the app is in the background or closed
**When** a push notification is sent
**Then** the notification appears on my device lock screen
**And** the notification includes the message and app icon
**And** tapping the notification opens the app to the relevant aviso details

**Given** that SSE connection is lost temporarily (<30 seconds)
**When** the network issue is resolved
**Then** the SSE client automatically reconnects
**And** any missed updates are fetched upon reconnection
**And** the connection resumes without user intervention

**Given** that SSE connection is lost for >30 seconds
**When** the client cannot reconnect
**Then** the system shows: "Conexión perdida. Reintentando..."
**And** the system attempts reconnection every 30 seconds
**And** once reconnected, the system shows: "Conexión restablecida."

**FRs covered:** FR4, FR5 (confirmación), NFR-P3 (SSE 30s heartbeat), NFR-R4 (SSE auto-reconnection <30s)

---

## Story 3.5: Vista de Triage de Avisos para Javier

As a Javier (Supervisor with can_view_all_ots capability),
I want to see all new failure reports in a triage column with visual distinction (pink for failure reports, white for repair reports), where I can quickly review, authorize (convert to OT), or discard each aviso,
So that I can control which reports become work orders and prevent invalid reports from cluttering the system.

**Acceptance Criteria:**

**Given** that I am logged in as a user with can_view_all_ots capability
**When** I access the `/avisos/triage` route or "Ver Triage" button on the dashboard
**Then** I see a triage view organized as a single-column Kanban-style list
**And** the column is labeled "Nuevos Avisos" or "Triage"
**And** each aviso is displayed as a card with:
- numeroAviso (e.g., "AVG-20260307-0001")
- equipo: "Prensa PH-500 (Panel Sandwich, Línea 2)"
- reportadoPor: "Carlos - Operario"
- fechaReporte: "Hace 5 minutos" (relative time)
- descripcion: First 100 characters with "..." if longer
- Color coding: Pink background (#FFC0CB) for FALLA_REPORTE, White background (#FFFFFF) for REPARACION
- foto: Thumbnail if photo attached (optional)
- Action buttons: "Autorizar (Convertir a OT)" and "Descartar"
- Details button: ℹ️ to view full details

**Given** that I am viewing the triage column
**When** I tap/click the ℹ️ button on an aviso card
**Then** a modal opens with complete aviso details:
- All aviso fields (numeroAviso, equipo, reportadoPor, descripcion, fotoUrl if exists, fechaReporte, ubicacionReporte)
- Equipment details: Full name, location in hierarchy, current status, last failure date
- Reporter details: Name, role (Operario), contact info
- History: Timeline showing when the aviso was reported, current status
- Actions: "Autorizar (Convertir a OT)" and "Descartar" buttons
- Close button: X or tap outside to close

**Given** that I review an aviso and decide it's valid
**When** I tap/click "Autorizar (Convertir a OT)" button
**Then** a modal or form opens to create the OT with pre-filled data:
- equipo: Pre-selected with the aviso's equipo
- descripcion: Pre-filled with the aviso's descripcion
- tipo: Pre-selected as "Correctivo" (default for aviso-derived OTs)
- origen: Pre-filled with "Aviso AVG-20260307-0001 reportado por Carlos"
- estado: Pre-selected as "Pendiente"
- And I can adjust OT details before creation
- And when I confirm OT creation:
  - The OT is created in the database
  - The aviso is updated with:
    - estado: "AUTORIZADO"
    - convertidoAOT: true
    - otId: [new OT ID]
  - Carlos receives push notification: "Tu aviso AVG-20260307-0001 fue autorizado. OT asignada a María."
  - The aviso card is removed from the triage column
  - I see success message: "Aviso autorizado y OT creada exitosamente"

**Given** that I review an aviso and decide it's not valid
**When** I tap/click "Descartar" button
**Then** a confirmation dialog appears: "¿Descartar este aviso? Esta acción no se puede deshacer."
**And** the dialog has two buttons: "Cancelar" and "Sí, Descartar"
**When** I confirm "Sí, Descartar"
**Then** the aviso is updated with:
- estado: "RECHAZADO"
- And Carlos receives a push notification: "Tu aviso AVG-20260307-0001 fue descartado. Si no estás de acuerdo, contacta a Javier."
**And** the aviso card is removed from the triage column
**And** I see success message: "Aviso descartado exitosamente"

**Given** that there are multiple avisos in triage
**When** I view the triage column
**Then** avisos are ordered by fechaReporte (newest first)
**And** the list is paginated (20 avisos per page)
**And** I can filter the list by:
- Date range: "Hoy", "Ayer", "Últimos 7 días"
- Equipment: Search by equipment name
- Reporter: Filter by user who reported
- And I can sort by: fechaReporte (newest/oldest), equipo (A-Z)

**Given** that an aviso has a photo attached
**When** I view the aviso card
**Then** I see a thumbnail preview of the photo
**And** tapping the thumbnail opens a full-size view in a modal
**And** the full-size photo is zoomable (pinch to zoom)

**Given** that the triage view is displayed
**When** new avisos are reported by operators
**Then** the triage column updates in real-time via SSE (every 30 seconds)
**And** new aviso cards appear at the top of the list automatically
**And** I see a visual indicator when new avisos arrive: "3 nuevos avisos"

**Visual Distinction Validation:**

**Given** that I need to distinguish aviso types visually
**When** I view the triage column
**Then** I see clear color coding:
- Pink background (#FFC0CB) for FALLA_REPORTE (new failures)
- White background (#FFFFFF) for REPARACION (repair reports)
- And both colors meet WCAG AA contrast requirements (4.5:1 minimum)
- And colorblind users can distinguish via icon or text label

**FRs covered:** FR7, FR8, FR9, FR10, NFR-P3 (SSE real-time updates)

---

## Story 3.6: Conversión de Avisos a Órdenes de Trabajo

As a Javier (Supervisor with can_view_all_ots and can_assign_technicians capabilities),
I want to convert valid failure reports into work orders with the ability to assign technicians, set priority, and add initial notes,
So that the reported failures enter the formal work order workflow and get assigned to the appropriate team members.

**Acceptance Criteria:**

**Given** that I am in the triage view and have reviewed an aviso
**When** I tap/click "Autorizar (Convertir a OT)" on aviso AVG-20260307-0001
**Then** a modal opens with OT creation form pre-filled with aviso data:
- equipo: "Prensa PH-500" (pre-selected, required)
- descripcion: "No arranca, hace ruido raro cuando intento arrancar" (pre-filled from aviso, editable)
- tipo: Dropdown with options: "Correctivo" (default), "Preventivo"
- prioridad: Dropdown with options: "Baja", "Media" (default), "Alta"
- tecnicoAsignados: Multi-select to assign 1-3 technicians (required)
- notasInternas: Textarea for internal notes (optional)
- origen: "Aviso AVG-20260307-0001 reportado por Carlos el 2026-03-07 a las 09:03" (read-only, pre-filled)
- estimatedHours: Number input (optional, default 2)
- And the form is optimized for desktop/tablet use (not mobile)

**Given** that the OT creation form is open
**When** I select technicians in the tecnicoAsignados field
**Then** I see a searchable dropdown of all users with can_update_own_ot capability
**And** the dropdown shows:
- User name
- Role/Classification (e.g., "Operario", "Técnico", "Supervisor")
- Current workload indicator (e.g., "3 OTs asignadas", "Disponible")
- And I can select up to 3 technicians
**And** selected technicians appear as chips/tags that can be removed
**And** each selected technician receives a notification when the OT is created

**Given** that I have filled in the required fields (equipo, descripcion, tecnicoAsignados)
**When** I tap/click "Crear OT" button
**Then** the system validates:
- equipo is selected
- descripcion is not empty
- 1-3 technicians are assigned
- And if validation fails, inline errors are shown
**And** if validation is correct:
- The OT record is created in the WorkOrder table with estado "PENDIENTE"
- The tipo is set to "Correctivo" (default for aviso-derived OTs)
- The origen field is set to reference the aviso
- The aviso is updated with:
  - estado: "AUTORIZADO"
  - convertidoAOT: true
  - otId: [new OT ID]
- All assigned technicians receive push notifications: "Nueva OT asignada: [OT Number] - [Equipo] - [Descripción corta]"
- Carlos (who reported the aviso) receives push notification: "Tu aviso AVG-20260307-0001 fue autorizado. OT asignada a [Técnico names]."
- The modal closes
- The aviso card is removed from the triage column
- I see success message: "OT creada exitosamente. Aviso autorizado."
- The new OT appears in the "Asignadas" column of the Kanban

**Given** that the OT was created from an aviso
**When** I view the OT details
**Then** the OT shows:
- Link to the original aviso: "Derivado de: Aviso AVG-20260307-0001"
- Aviso details are accessible via the ℹ️ modal
- The OT's tipo is labeled "Correctivo" to distinguish from preventive OTs

**Given** that I want to cancel the OT creation
**When** I tap/click "Cancelar" or close the modal
**Then** the modal closes
**And** the aviso remains unchanged in the triage column
**And** no OT is created
**And** no notifications are sent

**Error Scenarios:**

**Given** that I try to create an OT without assigning technicians
**When** I tap/click "Crear OT" with empty tecnicoAsignados
**Then** the system shows inline error: "Debes asignar al menos 1 técnico"
**And** the form remains open for correction
**And** the "Crear OT" button is disabled until technicians are assigned

**Given** that the system is down when I try to create the OT
**When** the API call fails
**Then** the system shows error message: "Error al crear OT. Por favor intenta nuevamente."
**And** the form data is preserved (not lost) for retry
**And** a "Reintentar" button appears

**FRs covered:** FR8, FR17 (asignar técnicos), FR19 (seleccionar 1-3 técnicos)

---

## Story 3.7: Adjuntar Fotos a Avisos (Opcional)

As a Carlos (Operario reporting a failure),
I want to optionally attach up to 3 photos to my failure report to show the problem visually,
So that technicians have better context to diagnose the issue before arriving at the equipment location.

**Acceptance Criteria:**

**Given** that I am on the "Reportar Avería" form (Story 3.2)
**When** I tap/click the "Adjuntar Foto" button
**Then** the device camera opens (mobile) or file picker opens (desktop/tablet)
**And** I can:
- Take a new photo with the camera
- Select an existing photo from the gallery
- Cancel the action
**And** I can attach up to 3 photos total
**And** each photo has a maximum size of 5MB

**Given** that I take or select a photo
**When** the photo is selected
**Then** a thumbnail preview appears in the form
**And** the thumbnail shows:
- The photo preview (resized to fit)
- An "X" button to remove the photo
- A photo number indicator: "1 de 3", "2 de 3", etc.
**And** the thumbnail is approximately 100x100px
**And** the thumbnails are arranged horizontally

**Given** that I have attached 1 photo
**When** I tap/click the "Adjuntar Foto" button again
**Then** I can attach a second photo (up to 3 total)
**And** a second thumbnail appears
**And** I see a counter: "2 de 3 fotos adjuntas"

**Given** that I have attached 3 photos (maximum)
**When** I try to attach a 4th photo
**Then** the system shows inline message: "Máximo 3 fotos permitidas"
**And** the "Adjuntar Foto" button is disabled
**And** I can remove existing photos to attach different ones

**Given** that I have attached photos and want to remove one
**When** I tap/click the "X" button on a thumbnail
**Then** the photo is removed from the list
**And** the counter updates: "2 de 3 fotos adjuntas" (if I had 3)
**And** I can attach a different photo to replace it

**Given** that I am submitting the aviso with attached photos
**When** I tap/click "Enviar" button
**Then** the system:
- Uploads each photo to cloud storage (Vercel Blob or similar)
- Generates a unique URL for each photo
- Stores the photo URLs in the aviso record (comma-separated if multiple, or use a separate AvisoFoto table)
- Shows loading progress: "Subiendo fotos... 1 de 3"
- Once uploaded, proceeds with aviso creation
- And if upload fails for any photo:
  - Shows error: "Error al subir foto. Por favor intenta nuevamente o continúa sin foto."
  - Allows me to retry or remove the failed photo
  - Does not block aviso submission if photo upload fails (photos are optional)

**Given** that the aviso is created with photos
**When** Javier views the aviso in the triage modal
**Then** he sees:
- All attached photos as thumbnails
- Full-size view when tapping any thumbnail
- Photo metadata: upload date, file size
- And the photos help him understand the problem before converting to OT

**Given** that the aviso is converted to an OT
**When** the OT is created
**Then** the photos are copied/associated with the OT record
**And** technicians assigned to the OT can view the photos in their OT details
**And** the photos remain visible throughout the OT lifecycle

**Performance Considerations:**

**Given** that photo uploads can be slow on poor connections
**When** I am in an area with weak WiFi
**Then** the system:
- Compresses photos before upload (reduce file size)
- Shows progress indicator: "Subiendo... 50%"
- Allows me to continue using the app while photos upload in background
- If upload is incomplete when I submit, asks: "Las fotos aún se están subiendo. ¿Esperar a que terminen o continuar sin ellas?"

**Given** that storage costs need to be controlled
**When** photos are uploaded
**Then** the system:
- Limits photo file size to 5MB each
- Compresses photos to reasonable quality (80% JPEG compression)
- Stores photos in a CDN with automatic cache expiration
- Implements cleanup: photos from rejected avisos are deleted after 30 days

**Accessibility:**

**Given** that I am using a screen reader
**When** I interact with photo attachments
**Then** the "Adjuntar Foto" button has aria-label: "Adjuntar foto de falla"
**And** thumbnails have aria-label: "Foto 1 de 3: Prensa con humo saliendo"
**And** the remove "X" button has aria-label: "Remover foto 1"

**FRs covered:** FR3, NFR-P2 (initial load <3s applies to photo uploads)

---

## Epic 3 Completion Criteria

**Epic 3 is complete when:**
- ✅ All 7 stories are implemented with passing acceptance criteria
- ✅ Carlos can report failures in <30 seconds on mobile
- ✅ Búsqueda predictiva returns results in <200ms
- ✅ Confirmación con número de aviso llega en <3 segundos
- ✅ Notificaciones push llegan en 30 segundos
- ✅ Javier puede ver y gestionar triage de avisos
- ✅ Javier puede convertir avisos a OTs
- ✅ Photos can be attached optionally
- ✅ All FR1-FR10, FR102 are covered and tested
- ✅ Performance NFRs are met (<200ms search, <3s confirmation, <30s notifications)

**Dependencies Satisfied:**
- Epic 1: Authentication system working (User model, capabilities)
- Epic 2: Asset hierarchy available (Equipo model for selection)

**Next Epic Enabled:**
- Epic 4 can now be implemented (OT workflow starts from authorized avisos)

**Value Delivered:**
- Carlos siente "¡Mi voz importa!" vs "Nadie hace caso"
- Reporte de averías en <30s vs 2-5 minutos actuales
- Feedback loop completo con confirmaciones y notificaciones
- Javier tiene control visual del triage de averías

**Technical Achievements:**
- SSE real-time notifications working
- Predictive search with debouncing and caching
- Photo upload with compression and CDN storage
- Push notifications on mobile (PWA)
- Responsive design optimized for mobile (Carlos) and desktop (Javier)

---

**Epic 3 Documentation Complete**
- Date: 2026-03-07
- Version: 1.0
- Stories: 7 (all in full Given/When/Then format)
- Total Estimated Effort: 35-45 story points (approx 4-5 sprints)
- Blocking Epic: 4 (Órdenes de Trabajo), 7 (Rutinas), 8 (KPIs)
