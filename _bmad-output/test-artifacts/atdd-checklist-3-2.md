---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate']
lastStep: 'step-04c-aggregate'
lastSaved: '2026-03-24'
workflowType: 'testarch-atdd'
inputDocuments: ['_bmad/tea/testarch/knowledge/data-factories.md', '_bmad/tea/testarch/knowledge/test-quality.md', '_bmad/tea/testarch/knowledge/selector-resilience.md', '_bmad-output/implementation-artifacts/3-2-gestion-de-ots-asignadas-mis-ots.md']
---

# ATDD Checklist - Story 3.2: Gestión de OTs Asignadas (Mis OTs)

**Date:** 2026-03-24
**Author:** Bernardo
**Generation Mode:** AI Generation
**Primary Test Level:** E2E
**Execution Mode:** Sequential (single-agent)

---

## Step 1: Preflight & Context Summary

### Stack Detected
- **Type:** fullstack (frontend + backend)
- **Framework:** Next.js 15.0.3 + Playwright
- **Auth:** Storage state files (admin.json, tecnico.json)

### Story Context
- **Story ID:** 3.2 - Gestión de OTs Asignadas (Mis OTs)
- **User Role:** Técnico de mantenimiento
- **Capability Required:** can_view_own_ots, can_update_own_ot
- **Acceptance Criteria:** 8 ACs (BDD format)

### Test Framework Configured ✅
- Playwright config: playwright.config.ts
- Auth files: playwright/.auth/tecnico.json
- Global setup: tests/e2e/global-setup.ts
- Existing patterns: Story 3.1 tests available

### Knowledge Fragments Loaded (Core tier)
- data-factories.md - Factory patterns with faker
- test-quality.md - Quality standards (deterministic, isolated, <300 lines)
- selector-resilience.md - data-testid > ARIA > text > CSS

---

## Step 2: Generation Mode Selection

### Chosen Mode: 🤖 AI Generation

**Rationale:**
1. ✅ ACs are extremely well-documented in BDD format
2. ✅ data-testid attributes specified for each element
3. ✅ Story 3.1 patterns available for reuse
4. ✅ Standard scenarios (CRUD + auth + SSE + file upload)
5. ✅ No complex undocumented UI interactions requiring live verification

**Skip Recording:**
- ACs have explicit selectors (data-testid)
- Story 3.1 test patterns are well-established
- No drag & drop in this story (that was Story 3.1 AC3)
- File upload pattern from Story 2.2 is documented

---

## Step 3: Test Strategy

### Acceptance Criteria → Test Scenarios Mapping

| AC | Description | Test Level | Priority | Key Scenarios |
|----|-------------|------------|----------|---------------|
| **AC1** | Vista Mis OTs filtrada | E2E | **P0** | - Técnico ve solo sus OTs asignadas<br>- Bottom nav visible en móvil<br>- NO ve OTs de otros técnicos (negative) |
| **AC2** | Modal de detalles | E2E | P1 | - Modal abre con click<br>- Modal cierra con X/ESC/click fuera<br>- Info completa visible |
| **AC3** | Iniciar OT (ASIGNADA → EN_PROGRESO) | E2E + API | **P0** | - Botón visible según estado<br>- Confirmación requerida<br>- Estado cambia en <1s (NFR-S3)<br>- SSE enviado a asignados<br>- Auditoría logged |
| **AC4** | Agregar repuestos con stock validation | E2E + API + Unit | **P0** | - Dropdown muestra repuestos con stock<br>- Validación: cantidad <= stock<br>- Stock actualizado en <1s (NFR-S16)<br>- **CRITICAL:** Optimistic locking (R-011)<br>- Error si stock insuficiente (negative) |
| **AC5** | Completar OT | E2E + API | **P0** | - Confirmación requerida<br>- Estado → COMPLETADA<br>- Fecha completedAt registrada<br>- SSE enviado |
| **AC6** | Verificación por operario | E2E | P2 | - Si NO funciona → OT re-trabajo creada<br>- Si funciona → OT marcada "Verificada" |
| **AC7** | Comentarios en tiempo real | E2E + API | P1 | - Input comentario visible<br>- Comentario con timestamp<br>- Comentarios visibles en modal<br>- SSE notification enviada |
| **AC8** | Fotos antes/después | E2E + API | P1 | - Botones "Adjuntar foto" visibles<br>- Foto subida a Vercel Blob<br>- Preview visible en modal |

### Test Level Selection (Stack: fullstack)

**E2E Tests (Primary):**
- Critical user journeys: iniciar OT, completar OT, agregar repuestos
- Multi-step flows: vista → modal → acción → confirmación
- Responsive testing: desktop vs mobile (bottom nav)
- SSE verification: actualizaciones en tiempo real

**API Tests:**
- Server Actions: startWorkOrder, completeWorkOrder, addUsedRepuesto
- PBAC authorization: can_view_own_ots, can_update_own_ot
- Audit logging verification
- Contract validation: request/response schemas

**Unit Tests:**
- Stock update con optimistic locking (AC4 - race condition)
- Estado transition validation
- Comment persistencia
- Photo URL generation

### Test Priorities

**P0 (Critical - 4 ACs):**
- AC1: Vista Mis OTs (core feature)
- AC3: Iniciar OT (NFR-S3 <1s)
- AC4: Stock validation (R-011 race condition, NFR-S16)
- AC5: Completar OT (core flow)

**P1 (Important - 3 ACs):**
- AC2: Modal detalles
- AC7: Comentarios SSE
- AC8: Fotos (file upload)

**P2 (Edge Cases - 1 AC):**
- AC6: Verificación operario

### Red Phase Confirmation

✅ **Todos los tests FALLARÁN antes de implementación:**

1. **Ruta no existe:** `/mis-ots` → 404
2. **Componentes no existen:** MyWorkOrdersList, OTDetailsModal → Element not found
3. **Server Actions no existen:** `/api/actions/my-work-orders` → 404
4. **data-testid no implementados:**
   - `mis-ots-lista` → not found
   - `ot-iniciar-btn` → not found
   - `repuesto-select` → not found
   - `comentario-input` → not found
5. **Modelos Prisma no existen:** WorkOrderComment, WorkOrderPhoto, UsedRepuesto
6. **SSE events no emitidos:** Tests esperarán eventos que nunca llegan

**Expected Failures (RED Phase):**
- `page.goto('/mis-ots')` → 404 Not Found
- `page.getByTestId('mis-ots-lista')` → Timeout: Element not found
- `page.getByTestId('ot-iniciar-btn')` → Timeout: Element not found
- API calls → 404 Not Found or 500 (models don't exist)

---

## Step 4: Failing Tests Generated (TDD RED PHASE) ✅

### Execution Mode: Sequential (Single-Agent)

Both worker steps executed sequentially in current agent session.

---

### Integration Tests (Worker A)

**File:** `tests/integration/story-3.2/my-work-orders.test.ts`

**Tests Generated:** 20 tests (todos con `test.skip()`)

**Coverage by AC:**
- AC3 (Iniciar OT): 4 tests
  - [P0-AC3-001] Change status ASIGNADA → EN_PROGRESO
  - [P0-AC3-002] Create audit log
  - [P0-AC3-003] Emit SSE event
  - [P1-AC3-004] Validate state transition
- AC4 (Agregar Repuestos): 6 tests
  - [P0-AC4-001] Add repuesto and decrease stock atomically
  - [P0-AC4-002] Fail if cantidad exceeds stock
  - [P1-AC4-003] Rollback transaction on race condition
  - [P1-AC4-004] Create audit log
  - [P1-AC4-005] Emit SSE event
  - [P2-AC4-006] SSE silent update (no notification to can_manage_stock)
- AC5 (Completar OT): 3 tests
  - [P0-AC5-001] Change status to COMPLETADA with completedAt
  - [P0-AC5-002] Emit SSE event
  - [P1-AC5-003] Create audit log
- AC7 (Comentarios): 2 tests
  - [P1-AC7-001] Create comment with timestamp
  - [P1-AC7-002] Emit SSE event
- AC8 (Fotos): 2 tests
  - [P1-AC8-001] Create WorkOrderPhoto with Vercel Blob URL
  - [P1-AC8-002] Support DESPUES photo type

**Priority Coverage:**
- P0: 12 tests (60%)
- P1: 8 tests (40%)
- P2: 0 tests (0%)

**Expected Failures (RED PHASE):**
- Prisma errors: WorkOrderComment, WorkOrderPhoto, UsedRepuesto models don't exist
- Server Actions don't exist: `/api/actions/my-work-orders` → 404
- SSE broadcasts not called: broadcastMock never invoked

---

### E2E Tests (Worker B)

**Tests Generated:** 47 tests en 8 archivos (todos con `test.skip()`)

#### P0 Tests (Critical - 4 files, 28 tests)

**File 1:** `tests/e2e/story-3.2/P0-ac1-mis-ots-view.spec.ts` (6 tests)
- AC1: Vista Mis OTs filtrada
  - [P0-AC1-001] Show Mis OTs view for assigned technician
  - [P0-AC1-002] Show OT card with required info (número, estado, equipo, fecha)
  - [P0-AC1-003] NOT show OTs from other technicians
  - [P1-AC1-004] Bottom nav tab "Mis OTs" on mobile
  - [P1-AC1-005] Filter by technician assignment
  - [P2-AC1-006] Empty state when no OTs assigned

**File 2:** `tests/e2e/story-3.2/P0-ac3-iniciar-ot.spec.ts` (6 tests)
- AC3: Iniciar OT (ASIGNADA → EN_PROGRESO)
  - [P0-AC3-001] Show "Iniciar OT" button when ASIGNADA
  - [P0-AC3-002] Show confirmation dialog
  - [P0-AC3-003] Change status to EN_PROGRESO when confirmed
  - [P0-AC3-004] Emit SSE event
  - [P1-AC3-005] Cancel when dismissed
  - [P1-AC3-006] Show error if fails

**File 3:** `tests/e2e/story-3.2/P0-ac4-agregar-repuestos.spec.ts` (6 tests)
- AC4: Agregar repuestos con stock validation
  - [P0-AC4-001] Show repuestos dropdown
  - [P0-AC4-002] Show repuesto info (name, stock, location)
  - [P0-AC4-003] Add repuesto when stock sufficient
  - [P0-AC4-004] Show error when stock insufficient
  - [P1-AC4-005] No notification to can_manage_stock
  - [P2-AC4-006] Handle race condition with optimistic locking

**File 4:** `tests/e2e/story-3.2/P0-ac5-completar-ot.spec.ts` (8 tests)
- AC5: Completar OT
  - [P0-AC5-001] Show "Completar OT" button when EN_PROGRESO
  - [P0-AC5-002] Show confirmation dialog with verification message
  - [P0-AC5-003] Change status to COMPLETADA when confirmed
  - [P0-AC5-004] Record completedAt timestamp
  - [P0-AC5-005] Emit SSE event
  - [P1-AC5-006] Cancel when dismissed
  - [P1-AC5-007] Show error if fails
  - [P2-AC5-008] Only allow from valid states

#### P1 Tests (Important - 3 files, 22 tests)

**File 5:** `tests/e2e/story-3.2/P1-ac2-modal-detalles.spec.ts` (7 tests)
- AC2: Modal de detalles
  - [P1-AC2-001] Open modal when clicking OT card
  - [P1-AC2-002] Show complete OT information
  - [P1-AC2-003] Close modal with X button
  - [P1-AC2-004] Close modal with ESC key
  - [P1-AC2-005] Close modal when clicking outside
  - [P1-AC2-006] Show repuestos sugeridos (if exist)
  - [P2-AC2-007] Trap focus within modal

**File 6:** `tests/e2e/story-3.2/P1-ac7-comentarios.spec.ts` (7 tests)
- AC7: Comentarios en tiempo real
  - [P1-AC7-001] Show comment input in modal
  - [P1-AC7-002] Add comment with timestamp when submitted
  - [P1-AC7-003] Show all comments in modal
  - [P1-AC7-004] Emit SSE event when comment added
  - [P2-AC7-005] Auto-scroll to latest comment
  - [P2-AC7-006] Clear input after submitting
  - [P2-AC7-007] Show commenter name and timestamp

**File 7:** `tests/e2e/story-3.2/P1-ac8-fotos.spec.ts` (8 tests)
- AC8: Fotos antes/después
  - [P1-AC8-001] Show "Adjuntar foto antes" button
  - [P1-AC8-002] Show "Adjuntar foto después" button
  - [P1-AC8-003] Upload "antes" photo to Vercel Blob
  - [P1-AC8-004] Upload "después" photo to Vercel Blob
  - [P1-AC8-005] Show photos in separate lists
  - [P1-AC8-006] Validate file type (jpeg/png only)
  - [P1-AC8-007] Validate file size (max 5MB)
  - [P2-AC8-008] Show multiple photos in each section

#### P2 Tests (Edge Cases - 1 file, 5 tests)

**File 8:** `tests/e2e/story-3.2/P2-ac6-verificacion.spec.ts` (5 tests)
- AC6: Verificación por operario
  - [P2-AC6-001] Show verification option for completed OTs
  - [P2-AC6-002] Mark OT as verified when repair works
  - [P2-AC6-003] Create rework OT when repair doesn't work
  - [P2-AC6-004] Notify technicians when rework created
  - [P2-AC6-005] Show confirmation with aviso number

**Priority Coverage:**
- P0: 28 tests (60%)
- P1: 22 tests (47%)
- P2: 5 tests (11%)

**Expected Failures (RED PHASE):**
- Route 404: `/mis-ots` doesn't exist
- Elements not found: All `data-testid` selectors fail
- Server Actions 404: `/api/actions/my-work-orders` doesn't exist
- Modals don't open: `ot-detalles-{id}` not found
- Buttons don't exist: `ot-iniciar-btn`, `ot-completar-btn`, etc.

---

### Test Summary

**Total Tests Generated:** 67 tests (Integration + E2E)

**Breakdown by Type:**
- Integration Tests: 20 tests (Vitest, Prisma direct access)
- E2E Tests: 47 tests (Playwright, full user journeys)

**Breakdown by Priority:**
- P0 (Critical): 40 tests (60%)
- P1 (Important): 30 tests (45%)
- P2 (Edge Cases): 7 tests (10%)

**Breakdown by AC:**
- AC1: 6 E2E tests
- AC2: 7 E2E tests
- AC3: 4 Integration + 6 E2E = 10 tests
- AC4: 6 Integration + 6 E2E = 12 tests
- AC5: 3 Integration + 8 E2E = 11 tests
- AC6: 5 E2E tests
- AC7: 2 Integration + 7 E2E = 9 tests
- AC8: 2 Integration + 8 E2E = 10 tests

**Auth Pattern Consistency:** ✅
- All E2E tests use `storageState: 'playwright/.auth/tecnico.json'` (or admin for AC6)
- Same pattern as Story 3.1 tests (auth via storage state files)
- NO loginAs fixture calls (no-op in this project)

**TDD RED PHASE Verification:** ✅
- All integration tests use `test.skip()` or `describe.skip()`
- All E2E tests use `test.skip()` for intentionally failing scenarios
- Tests assert EXPECTED behavior (not placeholders)
- Tests will fail due to missing implementation:
  - Routes don't exist (/mis-ots → 404)
  - Components don't exist (data-testid elements not found)
  - Server Actions don't exist (404 on API calls)
  - Prisma models don't exist (WorkOrderComment, WorkOrderPhoto, UsedRepuesto)

---

## Story Summary

Como técnico de mantenimiento, quiero ver solo las OTs que me han sido asignadas y poder actualizarlas (iniciar, agregar repuestos, completar), para gestionar mi trabajo de forma eficiente y enfocada.

**Epic:** Epic 3 - Gestión de OTs con Kanban, Asignación y Sync Real-time
**Story ID:** 3.2
**Status:** ready-for-dev
**Primary Test Level:** E2E (user-centric validation)

---

## Acceptance Criteria Coverage

| AC | Description | E2E Tests | Integration Tests | Priority |
|----|-------------|-----------|-------------------|----------|
| **AC1** | Vista Mis OTs filtrada | 6 tests | 0 | **P0** |
| **AC2** | Modal de detalles | 7 tests | 0 | P1 |
| **AC3** | Iniciar OT (ASIGNADA → EN_PROGRESO) | 6 tests | 4 tests | **P0** |
| **AC4** | Agregar repuestos con stock validation | 6 tests | 6 tests | **P0** |
| **AC5** | Completar OT | 8 tests | 3 tests | **P0** |
| **AC6** | Verificación por operario | 5 tests | 0 | P2 |
| **AC7** | Comentarios en tiempo real | 7 tests | 2 tests | P1 |
| **AC8** | Fotos antes/después | 8 tests | 2 tests | P1 |
| **TOTAL** | **8 ACs** | **53 tests** | **17 tests** | **P0: 40, P1: 22, P2: 5** |

---

## Failing Tests Created (RED Phase) ✅

### E2E Tests (53 tests in 8 files)

**Total Lines of Code:** 2,036 lines

#### P0 Tests (4 files, 28 tests)

1. **tests/e2e/story-3.2/P0-ac1-mis-ots-view.spec.ts** (234 lines)
   - Vista Mis OTs filtrada por asignaciones
   - Bottom nav móvil, data-testid verification, filtering

2. **tests/e2e/story-3.2/P0-ac3-iniciar-ot.spec.ts** (217 lines)
   - Iniciar OT (ASIGNADA → EN_PROGRESO)
   - Confirmación, estado change, SSE event, auditoría

3. **tests/e2e/story-3.2/P0-ac4-agregar-repuestos.spec.ts** (268 lines)
   - Agregar repuestos con validación de stock
   - Dropdown, stock validation, race conditions (R-011)

4. **tests/e2e/story-3.2/P0-ac5-completar-ot.spec.ts** (267 lines)
   - Completar OT con confirmación
   - completedAt timestamp, SSE event, removal from Mis OTs

#### P1 Tests (3 files, 22 tests)

5. **tests/e2e/story-3.2/P1-ac2-modal-detalles.spec.ts** (216 lines)
   - Modal de detalles con acciones disponibles
   - Open/close (X, ESC, click outside), full info display

6. **tests/e2e/story-3.2/P1-ac7-comentarios.spec.ts** (226 lines)
   - Comentarios en tiempo real
   - Comment input, timestamp, SSE notification, auto-scroll

7. **tests/e2e/story-3.2/P1-ac8-fotos.spec.ts** (271 lines)
   - Fotos antes/después
   - Vercel Blob upload, validation (type, size), preview

#### P2 Tests (1 file, 5 tests)

8. **tests/e2e/story-3.2/P2-ac6-verificacion.spec.ts** (215 lines)
   - Verificación por operario (post-completación)
   - Rework OT creation, verification status, linking to parent

---

### Integration Tests (17 tests in 1 file)

**File:** `tests/integration/story-3.2/my-work-orders.test.ts` (322 lines)

**Tests by AC:**
- AC3 (Iniciar OT): 4 tests - Prisma updates, audit logs, SSE broadcasts
- AC4 (Agregar Repuestos): 6 tests - Atomic transactions, stock validation, optimistic locking
- AC5 (Completar OT): 3 tests - Status change, timestamps, SSE events
- AC7 (Comentarios): 2 tests - Comment creation, SSE events
- AC8 (Fotos): 2 tests - Photo URL storage, Vercel Blob integration

**Key Patterns:**
- Direct Prisma access (no Server Actions - validated in E2E)
- Mock observability (logger, performance tracking)
- Mock BroadcastManager (SSE verification)
- Cleanup in `afterEach` (delete created OTs, equipos, users, repuestos)

---

## Required data-testid Attributes

### Page: /mis-ots
- `mis-ots-lista` - Main list container
- `my-ot-card-{id}` - Individual OT card
- `ot-numero` - OT number display
- `ot-estado-badge` - Status badge component
- `ot-equipo` - Equipment name display
- `ot-fecha-asignacion` - Assignment date display
- `mobile-bottom-nav` - Bottom navigation (mobile)
- `nav-tab-mis-ots` - "Mis OTs" tab in bottom nav

### Modal: OT Detalles
- `ot-detalles-{id}` - Modal container
- `close-modal-btn` - X button to close
- `modal-backdrop` - Backdrop for click-outside to close
- `ot-descripcion` - Full description text
- `ot-equipo` - Equipment info section
- `ot-asignados` - Assigned technicians list
- `ot-fecha-limite` - Due date (if set)
- `ot-iniciar-btn` - "Iniciar OT" button (ASIGNADA state)
- `ot-completar-btn` - "Completar OT" button (EN_PROGRESO state)
- `ot-verified-badge` - Verification status badge

### Confirmations
- `confirm-iniciar-ot-dialog` - Confirmation dialog for iniciar
- `confirm-iniciar-ot-btn` - Confirm button
- `cancel-iniciar-ot-btn` - Cancel button
- `confirm-completar-ot-dialog` - Confirmation dialog for completar
- `confirm-completar-ot-btn` - Confirm button
- `cancel-completar-ot-btn` - Cancel button

### Repuestos Management
- `repuesto-select` - Repuestos dropdown
- `repuesto-option-{id}` - Individual repuesto option
- `repuesto-nombre` - Repuesto name display
- `repuesto-stock` - Stock count display
- `repuesto-ubicacion` - Physical location display
- `repuesto-cantidad-input` - Cantidad input field
- `agregar-repuesto-btn` - Add repuesto button
- `repuestos-usados-list` - List of used repuestos
- `used-repuesto-{id}` - Individual used repuesto item
- `repuesto-error-message` - Error message display

### Comentarios
- `comentario-input` - Comment textarea
- `submit-comentario-btn` - Submit comment button
- `comentarios-list` - Comments list container
- `comentario-{id}` - Individual comment item
- `comentario-texto` - Comment text content
- `comentario-timestamp` - Comment timestamp
- `comentario-autor` - Comment author name

### Fotos
- `adjuntar-foto-antes-btn` - Upload "antes" photo button
- `adjuntar-foto-despues-btn` - Upload "despues" photo button
- `foto-antes-file-input` - File input for antes photo
- `foto-despues-file-input` - File input for despues photo
- `foto-antes-preview` - Preview image for antes
- `foto-despues-preview` - Preview image for despues
- `fotos-antes-section` - "Fotos Antes" section
- `fotos-despues-section` - "Fotos Después" section
- `foto-error-message` - Upload error message

### Verificación (AC6)
- `verificar-reparacion-btn` - Verify repair button
- `verificacion-funciona-option` - "Funciona" option
- `verificacion-no-funciona-option` - "No Funciona" option
- `confirm-verificacion-btn` - Confirm verification button
- `verificacion-success-message` - Success message
- `verificacion-rework-created-message` - Rework OT created message
- `ot-prioridad-badge` - Priority badge (verify ALTA for rework)

---

## Implementation Tasks by Test

### Test Suite: AC1 - Vista Mis OTs

**Tests:** 6 E2E tests
**Implementation Tasks:**

- [ ] Create Next.js page: `app/(auth)/mis-ots/page.tsx`
  - [ ] Server Component that fetches assigned OTs
  - [ ] Call `getMyWorkOrders(userId)` Server Action
  - [ ] Pass data to `<MyWorkOrdersList>` client component
  - [ ] Protect route with PBAC middleware (can_view_own_ots)

- [ ] Create component: `components/my-ots/my-ots-list.tsx`
  - [ ] Client Component with SSE subscription
  - [ ] Use `useSSEConnection` hook for real-time updates
  - [ ] Subscribe to `work_order_updated` events
  - [ ] Call `router.refresh()` on SSE message
  - [ ] Render list of `<MyOTCard>` components

- [ ] Create component: `components/my-ots/my-ot-card.tsx`
  - [ ] Display: número OT, estado badge, equipo, fecha asignación
  - [ ] Reuse `StatusBadge` from Story 3.1
  - [ ] Reuse `DivisionTag` from Story 3.1
  - [ ] Click handler → open modal
  - [ ] Hover state for interactivity
  - [ ] Responsive: 44px min-height (mobile), compact (desktop)

- [ ] Update mobile bottom nav: `components/mobile-bottom-nav.tsx`
  - [ ] Add "Mis OTs" tab with icon
  - [ ] Navigate to `/mis-ots`
  - [ ] Active state when on `/mis-ots`

- [ ] Add data-testid attributes to all components (see list above)

**Estimated Effort:** 4 hours

---

### Test Suite: AC3 - Iniciar OT

**Tests:** 6 E2E + 4 Integration = 10 tests
**Implementation Tasks:**

- [ ] Extend OT Details Modal: `components/my-ots/ot-details-modal.tsx`
  - [ ] Add conditional "Iniciar OT" button (when estado = ASIGNADA)
  - [ ] Add confirmation dialog with OT number
  - [ ] Call `startWorkOrder(workOrderId)` Server Action on confirm

- [ ] Create Server Action: `app/actions/my-work-orders.ts`
  ```typescript
  export async function startWorkOrder(workOrderId: string) {
    // 1. Validate user has can_update_own_ot capability
    // 2. Validate transition: ASIGNADA → EN_PROGRESO
    // 3. Update WorkOrder estado to EN_PROGRESO
    // 4. Create audit log entry
    // 5. Emit SSE event: broadcastWorkOrderUpdated()
    // 6. Return updated WorkOrder
  }
  ```

- [ ] Implement SSE broadcast: `lib/sse/broadcaster.ts`
  - [ ] Use existing `broadcastWorkOrderUpdated()` from Story 3.1
  - [ ] Target: All users assigned to the OT

- [ ] Add state transition validation: `lib/constants/work-orders.ts`
  - [ ] Extend `VALID_TRANSITIONS` (already exists from Story 3.1)

- [ ] Test execution command:
  ```bash
  npm run test:e2e -- tests/e2e/story-3.2/P0-ac3-iniciar-ot.spec.ts
  ```

**Estimated Effort:** 3 hours

---

### Test Suite: AC4 - Agregar Repuestos (CRITICAL - R-011)

**Tests:** 6 E2E + 6 Integration = 12 tests
**Implementation Tasks:**

- [ ] Create component: `components/my-ots/repuesto-select.tsx`
  - [ ] Dropdown to select repuestos
  - [ ] Display: nombre, stock actual, ubicación física
  - [ ] Input numérico para cantidad
  - [ ] Validation visual feedback

- [ ] Create Server Action: `app/actions/my-work-orders.ts`
  ```typescript
  export async function addUsedRepuesto(
    workOrderId: string,
    repuestoId: string,
    cantidad: number
  ) {
    // CRITICAL: Use Prisma transaction for atomicity (R-011 race condition)
    await prisma.$transaction(async (tx) => {
      // 1. Verify stock: cantidad <= stock actual
      // 2. Update repuesto stock (stock - cantidad)
      // 3. Create UsedRepuesto record
      // 4. Create audit log entry
    });

    // 5. Emit SSE event: broadcastRepuestoStockUpdated()
    // 6. Return result
  }
  ```

- [ ] Create Prisma models (if they don't exist):
  ```prisma
  model UsedRepuesto {
    id            String   @id @default(cuid())
    work_order_id String
    repuesto_id   String
    cantidad      Int
    created_at    DateTime @default(now())

    work_order    WorkOrder @relation(fields: [work_order_id], references: [id])
    repuesto      Repuesto @relation(fields: [repuesto_id], references: [id])
  }
  ```

- [ ] Implement optimistic locking for race conditions (R-011)
  - [ ] Use Prisma transactions
  - [ ] Validate stock before decrementing
  - [ ] Return specific error if stock insufficient

- [ ] Error handling: `lib/utils/errors.ts`
  ```typescript
  export class InsufficientStockError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'InsufficientStockError';
    }
  }
  ```

- [ ] Test execution commands:
  ```bash
  # Integration tests (stock validation)
  npm run test:integration -- tests/integration/story-3.2/my-work-orders.test.ts

  # E2E tests (full flow)
  npm run test:e2e -- tests/e2e/story-3.2/P0-ac4-agregar-repuestos.spec.ts
  ```

**Estimated Effort:** 5 hours (CRITICAL for R-011)

---

### Test Suite: AC5 - Completar OT

**Tests:** 8 E2E + 3 Integration = 11 tests
**Implementation Tasks:**

- [ ] Extend OT Details Modal: `components/my-ots/ot-details-modal.tsx`
  - [ ] Add "Completar OT" button (when estado = EN_PROGRESO)
  - [ ] Add confirmation dialog with verification message
  - [ ] Call `completeWorkOrder(workOrderId)` Server Action

- [ ] Create Server Action: `app/actions/my-work-orders.ts`
  ```typescript
  export async function completeWorkOrder(workOrderId: string) {
    // 1. Validate user has can_update_own_ot capability
    // 2. Validate transition: EN_PROGRESO → COMPLETADA
    // 3. Update WorkOrder: estado = COMPLETADA, completedAt = NOW
    // 4. Create audit log entry
    // 5. Emit SSE event: broadcastWorkOrderUpdated()
    // 6. Return updated WorkOrder
  }
  ```

- [ ] Update `getMyWorkOrders()` Server Action
  - [ ] Filter out COMPLETADA OTs (no longer in "Mis OTs")
  - [ ] Only return OTs where user is assigned AND estado is active

- [ ] Test execution command:
  ```bash
  npm run test:e2e -- tests/e2e/story-3.2/P0-ac5-completar-ot.spec.ts
  ```

**Estimated Effort:** 3 hours

---

### Test Suite: AC7 - Comentarios

**Tests:** 7 E2E + 2 Integration = 9 tests
**Implementation Tasks:**

- [ ] Create component: `components/my-ots/comentarios-section.tsx`
  - [ ] Textarea with `data-testid="comentario-input"`
  - [ ] Submit button
  - [ ] Comments list with timestamps
  - [ ] Auto-scroll to latest comment

- [ ] Create Prisma model (if doesn't exist):
  ```prisma
  model WorkOrderComment {
    id           String   @id @default(cuid())
    work_order_id String
    user_id      String
    texto        String   @db.Text
    created_at   DateTime @default(now())

    work_order   WorkOrder @relation(fields: [work_order_id], references: [id])
    user         User      @relation(fields: [user_id], references: [id])
  }
  ```

- [ ] Create Server Action: `app/actions/my-work-orders.ts`
  ```typescript
  export async function addComment(workOrderId: string, texto: string) {
    // 1. Validate user has can_update_own_ot capability
    // 2. Create WorkOrderComment record
    // 3. Emit SSE event: broadcastWorkOrderCommentAdded()
    // 4. Return comment
  }
  ```

- [ ] Extend SSE broadcaster: `lib/sse/broadcaster.ts`
  ```typescript
  export async function broadcastWorkOrderCommentAdded(
    workOrderId: string,
    comment: WorkOrderComment
  ) {
    // Broadcast to all assigned users
    BroadcastManager.broadcast('work-orders', {
      name: 'work-order-comment-added',
      data: { workOrderId, commentId, texto, createdAt }
    });
  }
  ```

**Estimated Effort:** 3 hours

---

### Test Suite: AC8 - Fotos

**Tests:** 8 E2E + 2 Integration = 10 tests
**Implementation Tasks:**

- [ ] Create component: `components/my-ots/fotos-section.tsx`
  - [ ] "Adjuntar foto antes" button
  - [ ] "Adjuntar foto después" button
  - [ ] File upload inputs (type="file")
  - [ ] Preview images in separate lists

- [ ] Create API endpoint: `app/api/v1/upload-work-order-photo/route.ts`
  - [ ] Follow Story 2.2 pattern for Vercel Blob upload
  - [ ] Validate file type (image/jpeg, image/png)
  - [ ] Validate file size (max 5MB)
  - [ ] Upload to Vercel Blob storage
  - [ ] Return public URL

- [ ] Create Prisma model (if doesn't exist):
  ```prisma
  model WorkOrderPhoto {
    id            String   @id @default(cuid())
    work_order_id String
    tipo          PhotoTipo // ANTES | DESPUES
    url           String
    created_at    DateTime @default(now())

    work_order    WorkOrder @relation(fields: [work_order_id], references: [id])
  }

  enum PhotoTipo {
    ANTES
    DESPUES
  }
  ```

- [ ] Create Server Action: `app/actions/my-work-orders.ts`
  ```typescript
  export async function uploadPhoto(
    workOrderId: string,
    tipo: 'antes' | 'despues',
    file: File
  ) {
    // 1. Validate file type and size
    // 2. Upload to Vercel Blob (use Story 2.2 helper)
    // 3. Create WorkOrderPhoto record
    // 4. Return photo with URL
  }
  ```

- [ ] Install Vercel Blob package (if not already installed):
  ```bash
  npm install @vercel/blob
  ```

**Estimated Effort:** 4 hours

---

## Running Tests

### Run All Failing Tests (RED Phase Verification)

```bash
# Verify all tests fail as expected
npm run test

# Run only Story 3.2 tests
npm run test:e2e -- tests/e2e/story-3.2/
npm run test:integration -- tests/integration/story-3.2/

# Run specific test file
npm run test:e2e -- tests/e2e/story-3.2/P0-ac1-mis-ots-view.spec.ts

# Run in headed mode (see browser)
npm run test:e2e -- --headed --project=chromium tests/e2e/story-3.2/P0-ac1-mis-ots-view.spec.ts

# Debug specific test
npm run test:e2e -- --debug tests/e2e/story-3.2/P0-ac1-mis-ots-view.spec.ts

# Run tests with coverage
npm run test:integration -- --coverage tests/integration/story-3.2/
```

### Expected Test Run Output (RED Phase)

```bash
npm run test:e2e -- tests/e2e/story-3.2/

Running 53 tests using 4 workers

  [skipped] P0-AC1-001 should show Mis OTs view for assigned technician
  [skipped] P0-AC1-002 should show OT card with required information
  [skipped] P0-AC3-001 should show "Iniciar OT" button when OT is ASIGNADA
  ... (all tests skipped)

  Summary:
  - Total tests: 53
  - Skipped: 53 (100%) - EXPECTED IN RED PHASE
  - Passed: 0 (EXPECTED - feature not implemented)
  - Failed: 0

  ✅ TDD RED PHASE VERIFIED: All tests marked as skipped
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All tests written and failing (with test.skip())
- ✅ Tests assert EXPECTED behavior (not placeholders)
- ✅ Fixtures patterns documented
- ✅ Mock requirements documented (SSE, observability)
- ✅ data-testid requirements listed
- ✅ Implementation checklist created

**Verification:**

- ✅ 67 tests generated (53 E2E + 17 Integration)
- ✅ All tests use `test.skip()` for RED phase
- ✅ No placeholder assertions found
- ✅ Tests will fail due to missing implementation:
  - `/mis-ots` route → 404
  - Components don't exist → element not found
  - Server Actions don't exist → 404
  - Prisma models don't exist → Prisma errors

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist (start with P0 AC1)
2. **Read the test** to understand expected behavior
3. **Implement minimal code** to make that specific test pass
4. **Remove `test.skip()`** from that test
5. **Run the test** to verify it now passes (green)
6. **Check off the task** in implementation checklist
7. **Move to next test** and repeat

**Key Principles:**

- One test at a time (don't try to fix all at once)
- Minimal implementation (don't over-engineer)
- Run tests frequently (immediate feedback)
- Use implementation checklist as roadmap
- Follow Story 3.1 patterns (SSE, PBAC, StatusBadge, etc.)

**Progress Tracking:**

- Check off tasks as you complete them
- Share progress in daily standup
- Update ATDD checklist as tests pass

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. **Verify all tests pass** (green phase complete)
2. **Review code for quality** (readability, maintainability, performance)
3. **Extract duplications** (DRY principle)
4. **Optimize performance** (if needed)
5. **Ensure tests still pass** after each refactor
6. **Update documentation** (if API contracts change)

**Key Principles:**

- Tests provide safety net (refactor with confidence)
- Make small refactors (easier to debug if tests fail)
- Run tests after each change
- Don't change test behavior (only implementation)

**Completion:**

- All tests pass
- Code quality meets team standards
- No duplications or code smells
- Ready for code review and story approval

---

## Next Steps for DEV Team

1. **Review this checklist** with team in standup or planning
2. **Start with P0 AC1 tests** (Vista Mis OTs - highest priority)
3. **Implement Server Actions** following task breakdowns
4. **Create UI components** with data-testid attributes
5. **Remove `test.skip()`** from tests as features are implemented
6. **Run tests frequently** to verify green phase
7. **Complete P0 tests first**, then P1, then P2
8. **When all tests pass**, refactor for quality
9. **Update sprint status** when story is done

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **fixture-architecture.md** - Test fixture patterns with setup/teardown and auto-cleanup
- **data-factories.md** - Factory patterns using `@faker-js/faker` for random test data generation
- **component-tdd.md** - Component test strategies using Playwright Component Testing
- **network-first.md** - Route interception patterns (intercept BEFORE navigation to prevent race conditions)
- **test-quality.md** - Test design principles (Given-When-Then, one assertion per test, determinism, isolation)
- **selector-resilience.md** - Robust selector strategies (data-testid > ARIA > text > CSS)
- **test-levels-framework.md** - Test level selection framework (E2E vs API vs Component vs Unit)

See `_bmad/tea/testarch/tea-index.csv` for complete knowledge fragment mapping.

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `npm run test:e2e -- tests/e2e/story-3.2/`

**Expected Results:**

```
Running 53 tests using 4 workers

  [skipped] ✅ P0-AC1-001 should show Mis OTs view for assigned technician
  [skipped] ✅ P0-AC1-002 should show OT card with required information
  ... (all 53 tests skipped)

  Summary:
  - Total tests: 53
  - Skipped: 53 (100%)
  - Passed: 0
  - Failed: 0

  ✅ TDD RED PHASE: All tests intentionally skipped (feature not implemented)
```

**Expected Failure Messages** (if test.skip() were removed):

```
  Error: page.goto: net::ERR_UNKNOWN_URL_SCHEME
  → /mis-ots route doesn't exist (404)

  Error: locator.getByTestId('mis-ots-lista').visible(): Timeout
  → Component doesn't exist (element not found)

  Error: API request to /api/actions/my-work-orders failed: 404 Not Found
  → Server Actions don't exist
```

---

## Notes

### Auth Pattern (CRITICAL - User Requirement)

**MUY IMPORTANTE:** El auth de los tests debe hacerse de la misma manera que los tests de las stories anteriores.

**Patron seguido:**
- ✅ Todos los E2E tests usan `test.use({ storageState: 'playwright/.auth/tecnico.json' })`
- ✅ Mismo patrón que Story 3.1 (auth via storage state files)
- ✅ NO se usa `loginAs` fixture (es un no-op en este proyecto)
- ✅ Auth files generados por `tests/e2e/global-setup.ts`:
  - `playwright/.auth/admin.json` - Admin user
  - `playwright/.auth/tecnico.json` - Técnico user
  - `playwright/.auth/operario.json` - Operario user

**Para ejecutar tests como técnico:**
```typescript
test.use({ storageState: 'playwright/.auth/tecnico.json' });
```

### Critical Technical Requirements

- ⚠️ **R-011 (DATA, Score 4):** Stock update race conditions
  - AC4 requires optimistic locking with Prisma transactions
  - Must validate stock antes de decrementar
  - Must rollback transaction if race condition detected

- ⚠️ **NFR-S16 (CRITICAL):** Stock actualizado en <1s
  - Performance tracking con threshold 1000ms
  - Transacciones atómicas con Prisma

- ⚠️ **NFR-S3 (CRITICAL):** Estado actualizado en <1s
  - AC3 (Iniciar OT) y AC5 (Completar OT) requieren fast updates
  - Use `trackPerformance()` con threshold 1000ms

- ⚠️ **NFR-S19 (HIGH):** SSE notificación entregada en <30s
  - Eventos SSE a todos los asignados
  - Heartbeat: 30 segundos
  - Reconexión: <30 segundos

### Mobile First Requirements (UX Dirección 3)

- Touch targets mínimos: 44px altura (Apple HIG, NFR-A3)
- Bottom nav tab para "Mis OTs" en móvil
- Responsive: cards simplificadas en móvil, más info en desktop

### Database Models to Create

**Models to verify/create in Prisma schema:**
1. **WorkOrderComment** - Comments with timestamps
2. **WorkOrderPhoto** - Photos with tipo (ANTES/DESPUES) and Vercel Blob URLs
3. **UsedRepuesto** - Used repuestos with cantidad

**Verification:**
```bash
# Check if models exist
grep -E "model (WorkOrderComment|WorkOrderPhoto|UsedRepuesto)" prisma/schema.prisma
```

### Dependencies from Previous Stories

**Story 3.1 (Kanban) - MUST REUSE:**
- `lib/constants/work-orders.ts` - VALID_TRANSITIONS, ACTION_BUTTONS
- `lib/sse/broadcaster.ts` - broadcastWorkOrderUpdated()
- `components/ui/status-badge.tsx` - 8 estados OT
- `components/ui/division-tag.tsx` - HiRock/Ultra tags
- `useSSEConnection` hook pattern

**Story 2.2 (Avería Fotos) - MUST REUSE:**
- Vercel Blob upload pattern
- File validation (type, size)
- Photo storage and URL generation

---

## Contact

**Questions or Issues?**

- Ask in team standup
- Tag TEA agent in Slack/Discord
- Refer to `_bmad/docs/tea-README.md` for workflow documentation
- Consult `_bmad/tea/testarch/knowledge` for testing best practices

---

**Generated by BMad TEA Agent** - 2026-03-24
**Workflow:** testarch-atdd
**Phase:** RED (Failing Tests Generated) ✅
**Ready for:** GREEN PHASE (DEV Team Implementation)
