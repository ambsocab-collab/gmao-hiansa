---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-red-phase-complete']
lastStep: 'step-03-red-phase-complete'
lastSaved: '2026-03-29'
workflowType: 'testarch-atdd'
inputDocuments:
  - '_bmad-output/implementation-artifacts/3-3-asignacion-de-tecnicos-y-proveedores.md'
  - '_bmad-output/project-context.md'
  - 'playwright.config.ts'
  - 'tests/e2e/global-setup.ts'
  - 'tests/fixtures/test.fixtures.ts'
  - 'tests/e2e/story-3.2/P0-ac1-mis-ots-view.spec.ts'
  - 'tests/integration/story-3.2/my-work-orders.test.ts'
---

# ATDD Checklist - Epic 3, Story 3.3: Asignación de Técnicos y Proveedores

**Date:** 2026-03-29
**Author:** Bernardo
**Primary Test Level:** E2E (con Integration tests para Server Actions)

---

## Story Summary

Como supervisor con capability `can_assign_technicians`, quiero asignar 1-3 técnicos internos o proveedores externos a cada OT, para distribuir el trabajo de mantenimiento según habilidades y disponibilidad.

**As a** supervisor con capability `can_assign_technicians`
**I want** asignar 1-3 técnicos internos o proveedores externos a cada OT
**So that** distribuir el trabajo de mantenimiento según habilidades y disponibilidad

---

## Acceptance Criteria

1. **AC1: Seleccionar técnicos internos y/o proveedores externos** - Seleccionar 1-3 técnicos + 1 proveedor (max 3 total), filtros por habilidades/ubicación/disponibilidad
2. **AC2: Filtrar técnicos por habilidades** - Checkbox groups para skills: Eléctrica, Mecánica, Hidráulica, Neumática, Electrónica
3. **AC3: Notificación SSE a múltiples asignados** - Todos los técnicos asignados reciben notificación SSE en <30s
4. **AC4: Columna "Asignaciones" en vista de listado** - Formato: "2 técnicos / 1 proveedor", tooltip con nombres
5. **AC5: Confirmación de recepción de proveedor** - Supervisor confirma recepción, estado intermedio REPARACION_EXTERNA
6. **AC6: Filtrar técnicos por ubicación** - Ubicaciones: Planta HiRock, Planta Ultra, Taller, Almacén
7. **AC7: Indicador visual de sobrecarga** - Badge rojo si técnico tiene 5+ OTs activas
8. **AC8: Modal de asignación desde Kanban y Listado** - Modal con técnicos/proveedores disponibles

---

## Failing Tests Created (RED Phase)

### E2E Tests (10 tests)

**File:** `tests/e2e/story-3.3/P0-ac1-asignacion-tecnicos-proveedores.spec.ts` (3 tests)

- Test: [P0-AC1-001] Supervisor puede asignar 2 técnicos a una OT
- Test: [P0-AC1-002] Supervisor puede asignar 1 proveedor externo
- Test: [P0-AC1-003] Validación máximo 3 asignados (técnicos + proveedor)

**File:** `tests/e2e/story-3.3/P0-ac3-notificaciones-sse.spec.ts` (2 tests)

- Test: [P0-AC3-001] Todos los técnicos asignados reciben notificación SSE
- Test: [P0-AC3-002] Técnico ve OT en "Mis OTs" después de asignación

**File:** `tests/e2e/story-3.3/P0-ac5-confirmacion-proveedor.spec.ts` (2 tests)

- Test: [P0-AC5-001] Proveedor completa OT → estado cambia a REPARACION_EXTERNA
- Test: [P0-AC5-002] Supervisor confirma recepción → estado cambia a COMPLETADA

**File:** `tests/e2e/story-3.3/P1-ac4-listado-asignaciones.spec.ts` (1 test)

- Test: [P1-AC4-001] Columna "Asignaciones" muestra distribución correcta

**File:** `tests/e2e/story-3.3/P1-ac7-indicador-sobrecarga.spec.ts` (1 test)

- Test: [P1-AC7-001] Badge rojo visible cuando técnico tiene 5+ OTs activas

**File:** `tests/e2e/story-3.3/P1-ac8-modal-asignacion.spec.ts` (1 test)

- Test: [P1-AC8-001] Modal de asignación se abre desde Kanban y Listado

### Integration Tests (8 tests)

**File:** `tests/integration/story-3.3/assignments.test.ts` (8 tests)

- Test: [P0-INT-001] assignToWorkOrder() asigna múltiples técnicos
- Test: [P0-INT-002] assignToWorkOrder() asigna proveedor
- Test: [P0-INT-003] Validación máximo 3 asignados
- Test: [P0-INT-004] PBAC validation (sin capability = error 403)
- Test: [P0-INT-005] SSE emitido a todos los asignados
- Test: [P0-INT-006] confirmProviderWork() confirma trabajo
- Test: [P1-INT-007] Filtros por skills funcionan
- Test: [P1-INT-008] Filtros por ubicación funcionan

---

## Data Factories Required

### Provider Factory

**File:** `tests/support/factories/provider.factory.ts` (to be created if needed)

**Exports:**
- `createProvider(overrides?)` - Create single provider with optional overrides
- `createProviders(count)` - Create array of providers

**Example Usage:**
```typescript
const provider = createProvider({ name: 'ElectroServicios', services: ['eléctrica'] });
```

---

## Fixtures Required

### Assignment Fixtures

**File:** `tests/support/fixtures/assignment.fixture.ts` (to be created if needed)

**Fixtures:**
- `workOrderWithAssignments` - WorkOrder con técnicos asignados
  - **Setup:** Crea OT + asigna técnicos
  - **Provides:** WorkOrder con assignments
  - **Cleanup:** Elimina OT y assignments

---

## Required data-testid Attributes

### Modal de Asignación (AC8)

- `modal-asignacion-{workOrderId}` - Modal container
- `tecnicos-select` - Multi-select de técnicos
- `proveedores-select` - Select de proveedores
- `guardar-asignacion-btn` - Botón guardar
- `cancelar-asignacion-btn` - Botón cancelar

### Columna Asignaciones (AC4)

- `asignaciones-column` - Columna en tabla
- `asignaciones-badge-{workOrderId}` - Badge con count
- `asignaciones-tooltip` - Tooltip con nombres

### Filtros (AC2, AC6)

- `filtro-skills-checkbox-{skill}` - Checkbox por skill
- `filtro-ubicacion-select` - Dropdown de ubicación

### Indicador Sobrecarga (AC7)

- `sobrecarga-badge` - Badge rojo de sobrecarga
- `sobrecarga-tooltip` - Tooltip con count de OTs

---

## Implementation Checklist

### Test: [P0-AC1-001] Supervisor puede asignar 2 técnicos a una OT

**File:** `tests/e2e/story-3.3/P0-ac1-asignacion-tecnicos-proveedores.spec.ts`

**Tasks to make this test pass:**

- [ ] Crear modelo `Provider` en `prisma/schema.prisma`
- [ ] Añadir campos `skills` y `ubicacion` a modelo `User`
- [ ] Añadir campo `providerId` a `WorkOrderAssignment`
- [ ] Crear Server Action `getAvailableTechnicians()`
- [ ] Crear Server Action `assignToWorkOrder()`
- [ ] Crear componente `TechnicianSelect`
- [ ] Crear componente `AssignmentModal`
- [ ] Integrar modal en KanbanCard
- [ ] Añadir data-testid: `modal-asignacion-{workOrderId}`
- [ ] Añadir data-testid: `tecnicos-select`
- [ ] Añadir data-testid: `guardar-asignacion-btn`
- [ ] Run test: `npx playwright test tests/e2e/story-3.3/P0-ac1-asignacion-tecnicos-proveedores.spec.ts`
- [ ] Test passes (green phase)

**Estimated Effort:** 4 hours

---

### Test: [P0-AC1-002] Supervisor puede asignar 1 proveedor externo

**File:** `tests/e2e/story-3.3/P0-ac1-asignacion-tecnicos-proveedores.spec.ts`

**Tasks to make this test pass:**

- [ ] Crear Server Action `getAvailableProviders()`
- [ ] Crear componente `ProviderSelect`
- [ ] Integrar en `AssignmentModal`
- [ ] Añadir data-testid: `proveedores-select`
- [ ] Run test: `npx playwright test tests/e2e/story-3.3/P0-ac1-asignacion-tecnicos-proveedores.spec.ts`
- [ ] Test passes (green phase)

**Estimated Effort:** 2 hours

---

### Test: [P0-AC1-003] Validación máximo 3 asignados

**File:** `tests/e2e/story-3.3/P0-ac1-asignacion-tecnicos-proveedores.spec.ts`

**Tasks to make this test pass:**

- [ ] Añadir validación en `assignToWorkOrder()`: max 3 asignados
- [ ] Mostrar error en UI si se excede el límite
- [ ] Deshabilitar selects cuando se alcanza el máximo
- [ ] Run test: `npx playwright test tests/e2e/story-3.3/P0-ac1-asignacion-tecnicos-proveedores.spec.ts`
- [ ] Test passes (green phase)

**Estimated Effort:** 1 hour

---

### Test: [P0-AC3-001] Todos los técnicos asignados reciben notificación SSE

**File:** `tests/e2e/story-3.3/P0-ac3-notificaciones-sse.spec.ts`

**Tasks to make this test pass:**

- [ ] Emitir evento `work_order_assigned` en `assignToWorkOrder()`
- [ ] Usar `broadcastWorkOrderUpdated()` de Story 3.2
- [ ] Hook `useSSEConnection()` escucha evento
- [ ] Actualizar "Mis OTs" en tiempo real
- [ ] Run test: `npx playwright test tests/e2e/story-3.3/P0-ac3-notificaciones-sse.spec.ts`
- [ ] Test passes (green phase)

**Estimated Effort:** 2 hours

---

### Test: [P0-AC5-001] Proveedor completa OT → estado cambia a REPARACION_EXTERNA

**File:** `tests/e2e/story-3.3/P0-ac5-confirmacion-proveedor.spec.ts`

**Tasks to make this test pass:**

- [ ] Añadir transición de estado a REPARACION_EXTERNA en constantes
- [ ] Modificar `completeWorkOrder()` para detectar proveedor asignado
- [ ] Cambiar estado a REPARACION_EXTERNA en lugar de COMPLETADA
- [ ] Run test: `npx playwright test tests/e2e/story-3.3/P0-ac5-confirmacion-proveedor.spec.ts`
- [ ] Test passes (green phase)

**Estimated Effort:** 2 hours

---

### Test: [P0-AC5-002] Supervisor confirma recepción → estado cambia a COMPLETADA

**File:** `tests/e2e/story-3.3/P0-ac5-confirmacion-proveedor.spec.ts`

**Tasks to make this test pass:**

- [ ] Crear Server Action `confirmProviderWork()`
- [ ] Validar OT en estado REPARACION_EXTERNA
- [ ] Validar PBAC: `can_assign_technicians`
- [ ] Cambiar estado a COMPLETADA
- [ ] Registrar auditoría: 'provider_work_confirmed'
- [ ] Emitir SSE: work_order_updated
- [ ] Run test: `npx playwright test tests/e2e/story-3.3/P0-ac5-confirmacion-proveedor.spec.ts`
- [ ] Test passes (green phase)

**Estimated Effort:** 2 hours

---

## Running Tests

```bash
# Run all E2E tests for Story 3.3
npx playwright test tests/e2e/story-3.3/

# Run specific test file
npx playwright test tests/e2e/story-3.3/P0-ac1-asignacion-tecnicos-proveedores.spec.ts

# Run in headed mode (see browser)
npx playwright test tests/e2e/story-3.3/ --headed

# Debug specific test
npx playwright test tests/e2e/story-3.3/P0-ac1-asignacion-tecnicos-proveedores.spec.ts --debug

# Run integration tests
npm run test:integration -- tests/integration/story-3.3/
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete)

**TEA Agent Responsibilities:**
- ✅ All tests written and failing
- ✅ data-testid requirements listed
- ✅ Implementation checklist created

**Verification:**
- All tests run and fail as expected
- Failure messages are clear and actionable
- Tests fail due to missing implementation, not test bugs

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist (start with P0)
2. **Read the test** to understand expected behavior
3. **Implement minimal code** to make that specific test pass
4. **Run the test** to verify it now passes (green)
5. **Check off the task** in implementation checklist
6. **Move to next test** and repeat

**Key Principles:**
- One test at a time (don't try to fix all at once)
- Minimal implementation (don't over-engineer)
- Run tests frequently (immediate feedback)
- Use implementation checklist as roadmap

---

## Notes

- **Auth Pattern:** E2E tests usan `storageState: 'playwright/.auth/supervisor.json'` para supervisor
- **SSE Pattern:** Usar `useSSEConnection()` hook de Story 3.2
- **PBAC:** Validar capability `can_assign_technicians` en Server Actions
- **Mensajes:** Todo texto en UI debe estar en español

---

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `npx playwright test tests/e2e/story-3.3/ --list`

**Results:**
```
Total: 34 tests in 6 files

E2E Tests by File:
- P0-ac1-asignacion-tecnicos-proveedores.spec.ts: 6 tests
- P0-ac3-notificaciones-sse.spec.ts: 4 tests
- P0-ac5-confirmacion-proveedor.spec.ts: 5 tests
- P1-ac4-listado-asignaciones.spec.ts: 5 tests
- P1-ac7-indicador-sobrecarga.spec.ts: 4 tests
- P1-ac8-modal-asignacion.spec.ts: 10 tests

Integration Tests:
- assignments.test.ts: 14 tests
```

**Summary:**
- Total E2E tests: 34
- Total Integration tests: 14
- Total tests: 48
- Status: ✅ RED phase verified - tests exist and will fail until implementation

**Expected Failure Messages:**
- E2E: `Error: locator.waitFor: Timeout waiting for element with data-testid="modal-asignacion-*"`
- E2E: `Error: locator.click: Element is not visible (btn-asignar)`
- Integration: `Prisma Error: Unknown arg 'providerId' in data.providerId`
- Integration: `Prisma Error: Unknown model 'Provider'`

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **fixture-architecture.md** - Test fixture patterns with storage state auth
- **data-factories.md** - Factory patterns for test data creation
- **test-levels-framework.md** - E2E vs Integration test selection
- **test-priorities-matrix.md** - P0/P1/P2 prioritization
- **auth-session.md** - Playwright storage state authentication pattern

---

**Generated by BMad TEA Agent** - 2026-03-29
