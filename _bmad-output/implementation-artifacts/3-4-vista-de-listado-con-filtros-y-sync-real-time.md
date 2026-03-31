# Story 3.4: Vista de Listado con Filtros y Sync Real-time

Status: ready-for-dev

## Story

Como supervisor con capability `can_view_all_ots`,
quiero ver todas las OTs en una vista de listado con filtros avanzados,
para encontrar rápidamente órdenes específicas y realizar acciones en lote.

## Acceptance Criteria

**AC1: Tabla de OTs con paginación**

**Given** que soy supervisor con capability can_view_all_ots
**When** accedo a /ots/lista
**Then** veo tabla con todas las OTs de la organización (NFR-S21)
**And** tabla tiene columnas: Número, Equipo, Estado, Tipo, Asignados, Fecha Creación, Acciones
**And** tabla tiene data-testid="ots-lista-tabla"
**And** paginación: 100 OTs por página (NFR-SC4)

**AC2: Filtros por 5 criterios**

**Given** vista de listado visible
**When** aplico filtros
**Then** puedo filtrar por 5 criterios: estado, técnico, fecha, tipo, equipo (NFR-S27)
**And** filtro de estado: dropdown con 8 estados posibles
**And** filtro de técnico: búsqueda predictiva de usuarios
**And** filtro de fecha: range picker (fecha inicio, fecha fin)
**And** filtro de tipo: Preventivo/Correctivo (NFR-S11-A)
**And** filtros combinados con AND lógica

**AC3: Ordenamiento por cualquier columna**

**Given** filtros aplicados
**When** ordeno por cualquier columna (NFR-S28)
**Then** orden ascendente/descendente toggle
**And** indicador visual de columna ordenada (icono ↑/↓)
**And** sorting mantenido cuando cambio de página

**AC4: Acciones en lote**

**Given** lista filtrada
**When** realizo acciones
**Then** mismas acciones disponibles que en Kanban (NFR-S29)
**And** puedo: asignar técnicos, cambiar estado, agregar comentarios, ver detalles
**And** acciones en lote disponibles para OTs seleccionadas (checkbox)

**AC5: Toggle Kanban ↔ Listado con sync**

**Given** lista visible
**When** hago toggle a vista Kanban
**Then** mismos filtros y sorting aplicados en Kanban (NFR-S30)
**And** sincronización en tiempo real entre vistas (NFR-S31)
**And** cambios en Kanban reflejados en Listado instantáneamente vía SSE
**And** cambios en Listado reflejados en Kanban instantáneamente vía SSE

**AC6: Modal de detalles completo**

**Given** que hago click en "Ver Detalles" de una OT
**Then** modal informativo se abre con detalles completos (NFR-S24)
**And** modal tiene data-testid="modal-ot-info-{id}"
**And** muestra: fechas (creación, asignación, última actualización), origen (avería/rutina/manual), técnicos asignados, repuestos usados, comentarios
**And** modal puede cerrarse con click en "X", ESC key, o click fuera

**AC7: Link a avería original**

**Given** modal de detalles abierto
**When** OT fue creada desde avería
**Then** link a avería original visible
**And** puedo ver datos del avería: reporter, descripción, foto

**AC8: Link a rutina preventiva**

**Given** modal de detalles abierto
**When** OT fue creada desde rutina
**Then** link a rutina visible
**And** puedo ver: frecuencia, tareas, técnico responsable

## Tasks / Subtasks

- [ ] **Crear Server Actions para listado con filtros** (AC: 1, 2, 3)
  - [ ] Crear/actualizar `app/actions/work-orders.ts`:
    - [ ] `getWorkOrdersList(params: ListParams)` - Obtener OTs con filtros, sorting, paginación
    - [ ] Tipos: `ListParams` con filters, sort, pagination
    - [ ] Filtros: estado (array), técnico (string), fechaInicio/fechaFin (Date), tipo (enum), equipo (string)
    - [ ] Sorting: sortBy (columna), sortOrder (asc/desc)
    - [ ] Paginación: page (number), pageSize (100 default)
  - [ ] Validar con Zod: `WorkOrderListSchema`
  - [ ] Usar `getPaginationHelper()` de Story 3.2
  - [ ] Performance: usar índices existentes, evitar N+1 queries
  - [ ] Registrar auditoría para queries (opcional, solo en dev mode)

- [ ] **Crear Server Action para acciones en lote** (AC: 4)
  - [ ] En `app/actions/work-orders.ts`:
    - [ ] `batchAssignTechnicians(workOrderIds: string[], userIds: string[], providerId?: string)` - Asignar múltiples OTs
    - [ ] `batchUpdateStatus(workOrderIds: string[], newStatus: EstadoOT)` - Cambiar estado a múltiples OTs
    - [ ] `batchAddComment(workOrderIds: string[], comment: string)` - Agregar comentario a múltiples OTs
  - [ ] Validar: userId tiene capability `can_assign_technicians` para batch assign
  - [ ] Validar: userId tiene capability `can_update_own_ot` o `can_complete_ot` según acción
  - [ ] Máximo 50 OTs por batch (evitar timeout)
  - [ ] Emitir SSE: `work_order_updated` para cada OT modificada
  - [ ] Usar transacción Prisma para atomicidad

- [ ] **Crear componente FilterBar** (AC: 2)
  - [ ] Crear `components/ot-list/filter-bar.tsx` como Client Component
  - [ ] Filtro de estado: Dropdown con checkboxes (múltiples estados)
  - [ ] Filtro de técnico: Combobox con búsqueda predictiva (usar shadcn/ui Command + Popover)
  - [ ] Filtro de fecha: DateRangePicker (shadcn/ui Calendar)
  - [ ] Filtro de tipo: Select con opciones Preventivo/Correctivo
  - [ ] Filtro de equipo: Combobox con búsqueda predictiva de equipos
  - [ ] Botón "Limpiar filtros" visible cuando hay filtros activos
  - [ ] Indicador visual de filtros activos (badge con count)
  - [ ] data-testid="filter-bar"
  - [ ] Usar URL params para filtros (permite compartir URL con filtros)

- [ ] **Crear componente ColumnHeader con sorting** (AC: 3)
  - [ ] Crear `components/ot-list/sortable-header.tsx`
  - [ ] Props: `label`, `column`, `currentSort`, `onSortChange`
  - [ ] Indicador visual: ↑ ascendente, ↓ descendente, sin icono = no ordenado
  - [ ] Click toggle: no ordenado → asc → desc → no ordenado
  - [ ] data-testid="sort-header-{column}"
  - [ ] Usar Lucide icons: ArrowUp, ArrowDown, ArrowUpDown

- [ ] **Crear componente BatchActions** (AC: 4)
  - [ ] Crear `components/ot-list/batch-actions.tsx` como Client Component
  - [ ] Checkbox en header para "seleccionar todos" (visible en página actual)
  - [ ] Checkbox en cada fila para selección individual
  - [ ] Barra de acciones aparece cuando hay OTs seleccionadas
  - [ ] Acciones: Asignar, Cambiar estado, Agregar comentario
  - [ ] Mostrar count de seleccionados: "5 seleccionadas"
  - [ ] Botón "Limpiar selección"
  - [ ] data-testid="batch-actions-bar"
  - [ ] Usar AssignmentModal para asignación en lote
  - [ ] Usar Dialog para confirmar cambio de estado en lote

- [ ] **Crear componente Pagination** (AC: 1)
  - [ ] Crear `components/ot-list/pagination.tsx`
  - [ ] Mostrar: "Mostrando 1-100 de 500"
  - [ ] Botones: Primera, Anterior, Siguiente, Última
  - [ ] Deshabilitar botones en boundaries
  - [ ] data-testid="pagination-controls"
  - [ ] Usar URL params para página actual

- [ ] **Crear componente ViewToggle compartido** (AC: 5)
  - [ ] Verificar/refactorizar `components/kanban/view-toggle.tsx`
  - [ ] Debe compartir estado de filtros entre vistas
  - [ ] Usar URL params o Context para sincronizar filtros
  - [ ] data-testid="view-toggle"
  - [ ] Opciones: "Kanban" | "Lista"

- [ ] **Implementar SSE sync entre vistas** (AC: 5)
  - [ ] Usar `useSSEConnection` hook de Story 3.2
  - [ ] Escuchar eventos: `work_order_created`, `work_order_updated`, `work_order_deleted`
  - [ ] Actualizar lista en tiempo real cuando llegan eventos
  - [ ] Mantener filtros y sorting al actualizar
  - [ ] Optimistic updates para acciones locales
  - [ ] Indicador visual de conexión SSE (icono verde/rojo)

- [ ] **Actualizar OTListClient con filtros y paginación** (AC: 1, 2, 3, 4, 5)
  - [ ] Modificar `components/ot-list/ot-list-client.tsx`
  - [ ] Integrar FilterBar en header
  - [ ] Integrar ColumnHeader con sorting
  - [ ] Integrar BatchActions
  - [ ] Integrar Pagination
  - [ ] Integrar ViewToggle
  - [ ] Usar TanStack Query para data fetching con refetchOnWindowFocus
  - [ ] Actualizar data-testid a "ots-lista-tabla"

- [ ] **Actualizar página de lista** (AC: 1)
  - [ ] Modificar `app/(auth)/ots/lista/page.tsx`
  - [ ] Leer filtros de URL searchParams
  - [ ] Pasar filtros a Server Action
  - [ ] Implementar paginación server-side (100 por página)
  - [ ] Metadata dinámica con filtros activos

- [ ] **Actualizar OTDetailsModal para links** (AC: 6, 7, 8)
  - [ ] Modificar `components/kanban/ot-details-modal.tsx`
  - [ ] Si `failure_report_id` existe: mostrar sección "Avería Original"
    - [ ] Link a `/averias/[id]`
    - [ ] Mostrar: reporter, descripción, foto (si existe)
  - [ ] Si `rutina_id` existe: mostrar sección "Rutina Preventiva"
    - [ ] Link a `/rutinas/[id]`
    - [ ] Mostrar: frecuencia, tareas, técnico responsable
  - [ ] data-testid="modal-ot-info-{id}"

- [ ] **Testing Strategy - Integration Tests** (AC: 1-8)
  - [ ] Test file: `tests/integration/story-3.4/work-orders-list.test.ts`
  - [ ] Test: `getWorkOrdersList()` con filtros combinados
  - [ ] Test: `getWorkOrdersList()` con sorting
  - [ ] Test: `getWorkOrdersList()` con paginación
  - [ ] Test: `batchAssignTechnicians()` asigna múltiples OTs
  - [ ] Test: `batchUpdateStatus()` cambia estado a múltiples OTs
  - [ ] Test: PBAC validation (sin capability = error 403)
  - [ ] Test: Performance <500ms con 1000 OTs

- [ ] **Testing Strategy - E2E Tests** (AC: 1-8)
  - [ ] Test file: `tests/e2e/story-3.4/P0-ac1-tabla-paginacion.spec.ts`
  - [ ] Test file: `tests/e2e/story-3.4/P0-ac2-filtros.spec.ts`
  - [ ] Test file: `tests/e2e/story-3.4/P0-ac3-sorting.spec.ts`
  - [ ] Test file: `tests/e2e/story-3.4/P0-ac5-sync-sse.spec.ts`
  - [ ] Test file: `tests/e2e/story-3.4/P1-ac4-batch-actions.spec.ts`
  - [ ] Test file: `tests/e2e/story-3.4/P1-ac6-modal-detalles.spec.ts`
  - [ ] Test file: `tests/e2e/story-3.4/P1-ac7-link-averia.spec.ts`
  - [ ] Test file: `tests/e2e/story-3.4/P1-ac8-link-rutina.spec.ts`

## Dev Notes

### Architecture Patterns (Seguir estrictamente)

**Source:** `_bmad-output/project-context.md` + Story 3.3 learnings

1. **Server Actions Pattern:**
   - Ubicación: `app/actions/{domain}.ts`
   - Siempre async, validar con Zod primero
   - PBAC validation: `session.user.capabilities.includes('can_view_all_ots')`
   - Performance tracking con `trackPerformance()`
   - Auditoría logged via `AuditLog` model

2. **Prisma Patterns:**
   - Campos DB: snake_case (ej: `work_order_id`, `created_at`)
   - Campos TypeScript: camelCase (ej: `workOrderId`, `createdAt`)
   - Transacciones para operaciones atómicas (batch actions)
   - Índices para búsquedas frecuentes (ya existen de Story 3.1-3.3)

3. **SSE Pattern (de Story 3.2/3.3):**
   - Hook: `useSSEConnection()` en `components/sse/use-sse-connection.tsx`
   - Eventos: `work_order_updated`, `work_order_created`, `work_order_deleted`
   - Channel: `work-orders`
   - Optimistic updates en client

4. **Component Patterns:**
   - Client Components con `'use client'` directive
   - Named exports: `export function ComponentName()`
   - Props destructuring en signature
   - data-testid attributes para E2E

5. **URL State Pattern (NEW para Story 3.4):**
   - Filtros en URL searchParams: `?estado=PENDIENTE&tipo=CORRECTIVO`
   - Sorting en URL: `?sortBy=created_at&sortOrder=desc`
   - Paginación en URL: `?page=2`
   - Permite compartir URLs con estado
   - Use `useSearchParams()` y `useRouter()` de Next.js

### Existing Components to Reuse

**De Story 3.1 (Kanban):**
- `components/kanban/kanban-board.tsx` - Para referencia de SSE
- `components/kanban/ot-card.tsx` - Para estilo de tarjetas
- `components/kanban/ot-details-modal.tsx` - Para modal de detalles (ACTUALIZAR)
- `components/kanban/view-toggle.tsx` - Para toggle Kanban/Lista (ACTUALIZAR)

**De Story 3.2 (Mis OTs):**
- `components/my-ots/my-ots-list.tsx` - Para patrón de lista
- `lib/pagination.ts` - `getPaginationHelper()` para paginación server-side

**De Story 3.3 (Asignaciones):**
- `components/assignments/assignment-modal.tsx` - Para asignar técnicos
- `components/assignments/assignment-badge.tsx` - Para mostrar asignados
- `app/actions/assignments.ts` - Server Actions de asignación

**shadcn/ui Components:**
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Button`, `Badge`, `Checkbox`, `Select`, `Dialog`, `Command`, `Popover`
- `Calendar` (para DateRangePicker)
- `DropdownMenu` (para filtros de estado múltiples)

### Database Schema (Ya existe)

**WorkOrder model tiene estos campos relevantes:**
```prisma
model WorkOrder {
  id                String        @id @default(cuid())
  numero            Int           @unique
  descripcion       String
  estado            WorkOrderEstado
  tipo              WorkOrderTipo      // PREVENTIVO, CORRECTIVO
  priority          WorkOrderPriority  // BAJA, MEDIA, ALTA, CRITICA
  equipo_id         String
  failure_report_id String?            // Link a avería original
  rutina_id         String?            // Link a rutina (null por ahora)
  created_at        DateTime     @default(now())
  updated_at        DateTime     @updatedAt

  equipo        Equipo               @relation(...)
  failureReport FailureReport?       @relation(...)
  assignments   WorkOrderAssignment[]
  comments      WorkOrderComment[]
  spareParts    WorkOrderSparePart[]

  @@index([estado])
  @@index([tipo])
  @@index([equipo_id])
  @@index([created_at])
  @@map("work_orders")
}
```

**NOTA:** `rutina_id` existe en schema pero las rutinas se implementan en Epic 7.
Para AC8, verificar si `rutina_id` existe pero mostrar "Rutina no disponible" si es null.

### Critical Rules from project-context.md

1. **NO usar any types** - Usar tipos específicos de Prisma
2. **Mensajes en español** - Toda UI y errores en castellano
3. **PBAC en 3 capas** - Middleware + Server Action + UI
4. **SSE no WebSockets** - Server-Sent Events únicamente
5. **Async/await siempre** - NO usar .then()/.catch()
6. **Zod para validación** - Todos los inputs validados
7. **URL state para filtros** - Permite compartir URLs

### FRs Covered

- **FR26:** Se puede acceder a una vista de listado de todas las órdenes de trabajo
- **FR27:** Se puede filtrar el listado de órdenes de trabajo por 5 criterios
- **FR28:** Se puede ordenar el listado de órdenes de trabajo por cualquier columna
- **FR29:** Se pueden realizar las mismas acciones en la vista de listado que en el Kanban
- **FR30:** Se puede alternar entre vista Kanban y vista de listado
- **FR31:** Las vistas Kanban y de listado mantienen sincronización en tiempo real
- **FR24:** Se pueden ver detalles completos de una orden de trabajo en modal informativo

### NFRs Covered

- **NFR-S21:** Tabla muestra todas las OTs de la organización
- **NFR-S27:** Filtros por 5 criterios
- **NFR-S28:** Ordenamiento por cualquier columna
- **NFR-S29:** Mismas acciones que en Kanban
- **NFR-S30:** Filtros compartidos entre vistas
- **NFR-S31:** Sincronización en tiempo real entre vistas
- **NFR-S24:** Modal con detalles completos
- **NFR-SC4:** Paginación de 100 OTs por página
- **NFR-S11-A:** Filtro por tipo Preventivo/Correctivo

### Risks from TEA Handoff

- **R-002 (DATA, Score 9):** Multi-device sync race conditions
  - Mitigación: Usar transacciones Prisma, optimistic locking

### Previous Story Learnings (Story 3.3)

1. **Integration tests son críticos** - Cubren Server Actions con DB real
2. **E2E tests requieren setup cuidadoso** - global-setup con sesiones
3. **SSE events deben estandarizarse** - snake_case para eventos
4. **Pagination helper pattern** - Usar `getPaginationHelper()` de Story 3.2
5. **URL state es mejor que React state** - Para filtros y paginación (permite compartir URLs)
6. **Batch operations necesitan límite** - Máximo 50 OTs por batch para evitar timeouts
7. **E2E tests en paralelo pueden fallar** - Usar `--workers=1` para tests críticos

### Git Commits Context (Últimos 10)

```
a9514f5 fix(story-3.3): resolve N+1 query and flaky E2E tests
3474f6d test(story-3.3): fix E2E tests for AC1 assignment validation
f5f9994 fix(story-3.3): resolve E2E test failures for AC1 assignment tests
9585fc6 docs(story-3.3): mark test comments update as resolved
a684ee6 test(story-3.3): update E2E test comments to GREEN phase
c76c01b test(story-3.3): update E2E test comments from RED to GREEN phase
2728b2a docs(story-3.3): update review status and sprint status
8257824 feat(story-3.3): add provider confirmation UI for AC5
af07a99 fix(story-3.3): implement proper removeAssignment server action
cca7c70 feat(story-3.3): address code review issues round 1
```

### Project Structure Notes

**Componentes nuevos en:**
- `components/ot-list/filter-bar.tsx` - Barra de filtros
- `components/ot-list/sortable-header.tsx` - Header con sorting
- `components/ot-list/batch-actions.tsx` - Acciones en lote
- `components/ot-list/pagination.tsx` - Controles de paginación

**Server Actions en:**
- `app/actions/work-orders.ts` - Acciones de listado y batch (ACTUALIZAR/CREAR)

**Tests en:**
- `tests/integration/story-3.4/` - Integration tests
- `tests/e2e/story-3.4/` - E2E tests

### References

- [Source: prisma/schema.prisma] - Modelos WorkOrder, WorkOrderAssignment, User
- [Source: lib/constants/work-orders.ts] - Estados y transiciones válidas
- [Source: _bmad-output/planning-artifacts/epics.md:1590-1655] - Story 3.4 AC completo
- [Source: _bmad-output/implementation-artifacts/3-3-asignacion-de-tecnicos-y-proveedores.md] - Story anterior para patrones
- [Source: _bmad-output/project-context.md] - Reglas críticas de implementación
- [Source: components/sse/use-sse-connection.tsx] - Hook SSE existente
- [Source: lib/pagination.ts] - Helper de paginación de Story 3.2
- [Source: components/ot-list/ot-list-client.tsx] - Lista actual (mejorar)
- [Source: app/(auth)/ots/lista/page.tsx] - Página actual (mejorar)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
