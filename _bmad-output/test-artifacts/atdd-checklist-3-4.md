---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests']
lastStep: 'step-04-generate-tests'
lastSaved: '2026-03-31'
workflowType: 'testarch-atdd'
inputDocuments:
  - '_bmad-output/implementation-artifacts/3-4-vista-de-listado-con-filtros-y-sync-real-time.md'
  - '_bmad-output/project-context.md'
  - '_bmad/tea/testarch/knowledge/data-factories.md'
  - '_bmad/tea/testarch/knowledge/test-quality.md'
  - '_bmad/tea/testarch/knowledge/test-levels-framework.md'
  - '_bmad/tea/testarch/knowledge/test-healing-patterns.md'
---

# ATDD Checklist - Epic 3, Story 3.4: Vista de Listado con Filtros y Sync Real-time

**Date:** 2026-03-31
**Author:** Bernardo
**Primary Test Level:** E2E + Integration + Unit

---

## Story Summary

Como supervisor con capability `can_view_all_ots`, quiero ver todas las OTs en una vista de listado con filtros avanzados, para encontrar rápidamente órdenes específicas y realizar acciones en lote.

**As a** supervisor con capability can_view_all_ots
**I want** ver todas las OTs en una vista de listado con filtros avanzados
**So that** encontrar rápidamente órdenes específicas y realizar acciones en lote

---

## Acceptance Criteria

1. **AC1: Tabla de OTs con paginación** - Tabla con columnas: Número, Equipo, Estado, Tipo, Asignados, Fecha Creación, Acciones. Paginación: 100 OTs por página.
2. **AC2: Filtros por 5 criterios** - estado, técnico, fecha, tipo, equipo con AND lógica
3. **AC3: Ordenamiento por cualquier columna** - Toggle asc/desc con indicador visual
4. **AC4: Acciones en lote** - Asignar, cambiar estado, agregar comentarios para OTs seleccionadas
5. **AC5: Toggle Kanban ↔ Listado con sync** - Mismos filtros y SSE sync en tiempo real
6. **AC6: Modal de detalles completo** - Fechas, origen, técnicos, repuestos, comentarios
7. **AC7: Link a avería original** - Si OT creada desde avería, mostrar link
8. **AC8: Link a rutina preventiva** - Si OT creada desde rutina, mostrar link

---

## Test Strategy

### E2E Tests (Playwright)

| File | AC | Priority | Scenarios |
|------|-----|----------|-----------|
| `P0-ac1-tabla-paginacion.spec.ts` | AC1 | P0 | Tabla visible, columnas correctas, paginación |
| `P0-ac2-filtros.spec.ts` | AC2 | P0 | 5 filtros, combinaciones AND, URL state |
| `P0-ac3-sorting.spec.ts` | AC3 | P0 | Sort por columna, toggle, indicador visual |
| `P0-ac5-sync-sse.spec.ts` | AC5 | P0 | Toggle vistas, SSE sync, filtros compartidos |
| `P1-ac4-batch-actions.spec.ts` | AC4 | P1 | Selección, acciones en lote, validaciones |
| `P1-ac6-modal-detalles.spec.ts` | AC6, AC7, AC8 | P1 | Modal completo, links a avería/rutina |

### Integration Tests (Vitest)

| File | Priority | Scenarios |
|------|----------|-----------|
| `work-orders-list.test.ts` | P0 | getWorkOrdersList, batchAssignTechnicians, batchUpdateStatus, batchAddComment |

### Unit Tests (Vitest)

| File | Priority | Scenarios |
|------|----------|-----------|
| `work-orders-list-utils.test.ts` | P1 | Sorting logic, filter validation, pagination helpers |

---

## Failing Tests Created (RED Phase)

### E2E Tests (6 files)

Tests generated in `tests/e2e/story-3.4/`:
- `P0-ac1-tabla-paginacion.spec.ts`
- `P0-ac2-filtros.spec.ts`
- `P0-ac3-sorting.spec.ts`
- `P0-ac5-sync-sse.spec.ts`
- `P1-ac4-batch-actions.spec.ts`
- `P1-ac6-modal-detalles.spec.ts`

### Integration Tests (1 file)

Tests generated in `tests/integration/story-3.4/`:
- `work-orders-list.test.ts`

### Unit Tests (1 file)

Tests generated in `tests/unit/story-3.4/`:
- `work-orders-list-utils.test.ts`

---

## Required data-testid Attributes

### OT List Page

- `ots-lista-tabla` - Tabla principal de OTs
- `ot-row-{id}` - Fila de cada OT
- `pagination-controls` - Controles de paginación
- `pagination-info` - Texto "Mostrando X-Y de Z"
- `btn-first-page` - Botón primera página
- `btn-prev-page` - Botón página anterior
- `btn-next-page` - Botón página siguiente
- `btn-last-page` - Botón última página

### Filter Bar

- `filter-bar` - Barra de filtros
- `filtro-estado` - Dropdown de estados
- `filtro-tecnico` - Combobox de técnicos
- `filtro-fecha-inicio` - Date picker inicio
- `filtro-fecha-fin` - Date picker fin
- `filtro-tipo` - Select tipo (Preventivo/Correctivo)
- `filtro-equipo` - Combobox de equipos
- `btn-limpiar-filtros` - Botón limpiar filtros
- `filtros-activos-badge` - Badge con count de filtros activos

### Sortable Headers

- `sort-header-numero` - Header columna Número
- `sort-header-equipo` - Header columna Equipo
- `sort-header-estado` - Header columna Estado
- `sort-header-tipo` - Header columna Tipo
- `sort-header-asignados` - Header columna Asignados
- `sort-header-fecha` - Header columna Fecha Creación

### Batch Actions

- `batch-actions-bar` - Barra de acciones en lote
- `select-all-checkbox` - Checkbox seleccionar todos
- `ot-checkbox-{id}` - Checkbox individual por OT
- `selected-count` - Texto "X seleccionadas"
- `btn-batch-asignar` - Botón asignar en lote
- `btn-batch-estado` - Botón cambiar estado en lote
- `btn-batch-comentario` - Botón agregar comentario en lote
- `btn-limpiar-seleccion` - Botón limpiar selección

### View Toggle

- `view-toggle` - Toggle Kanban/Lista
- `view-toggle-kanban` - Botón vista Kanban
- `view-toggle-lista` - Botón vista Lista

### Modal Details

- `modal-ot-info-{id}` - Modal de detalles
- `modal-ot-fechas` - Sección fechas
- `modal-ot-origen` - Sección origen
- `modal-ot-asignados` - Sección técnicos asignados
- `modal-ot-repuestos` - Sección repuestos usados
- `modal-ot-comentarios` - Sección comentarios
- `link-averia-original` - Link a avería original
- `link-rutina-original` - Link a rutina preventiva

---

## Implementation Checklist

### E2E Tests

#### Test: P0-ac1-tabla-paginacion.spec.ts

**Tasks to make these tests pass:**

- [ ] Crear `components/ot-list/ot-list-client.tsx` con tabla
- [ ] Añadir columnas: Número, Equipo, Estado, Tipo, Asignados, Fecha Creación, Acciones
- [ ] Implementar paginación server-side (100 por página)
- [ ] Añadir data-testid="ots-lista-tabla"
- [ ] Añadir data-testid="pagination-controls"
- [ ] Run test: `npx playwright test tests/e2e/story-3.4/P0-ac1-tabla-paginacion.spec.ts`
- [ ] ✅ Tests pass (green phase)

---

#### Test: P0-ac2-filtros.spec.ts

**Tasks to make these tests pass:**

- [ ] Crear `components/ot-list/filter-bar.tsx`
- [ ] Implementar 5 filtros: estado, técnico, fecha, tipo, equipo
- [ ] Usar URL params para filtros
- [ ] Implementar AND lógica para filtros combinados
- [ ] Añadir data-testid="filter-bar"
- [ ] Añadir data-testid para cada filtro
- [ ] Run test: `npx playwright test tests/e2e/story-3.4/P0-ac2-filtros.spec.ts`
- [ ] ✅ Tests pass (green phase)

---

#### Test: P0-ac3-sorting.spec.ts

**Tasks to make these tests pass:**

- [ ] Crear `components/ot-list/sortable-header.tsx`
- [ ] Implementar toggle asc/desc
- [ ] Añadir indicador visual (↑/↓)
- [ ] Mantener sorting al cambiar página
- [ ] Usar URL params para sorting
- [ ] Añadir data-testid="sort-header-{column}"
- [ ] Run test: `npx playwright test tests/e2e/story-3.4/P0-ac3-sorting.spec.ts`
- [ ] ✅ Tests pass (green phase)

---

#### Test: P0-ac5-sync-sse.spec.ts

**Tasks to make these tests pass:**

- [ ] Actualizar `components/kanban/view-toggle.tsx` para compartir filtros
- [ ] Implementar SSE sync con `useSSEConnection` hook
- [ ] Mantener filtros al cambiar vista
- [ ] Actualizar lista en tiempo real
- [ ] Añadir data-testid="view-toggle"
- [ ] Run test: `npx playwright test tests/e2e/story-3.4/P0-ac5-sync-sse.spec.ts`
- [ ] ✅ Tests pass (green phase)

---

#### Test: P1-ac4-batch-actions.spec.ts

**Tasks to make these tests pass:**

- [ ] Crear `components/ot-list/batch-actions.tsx`
- [ ] Implementar selección individual y "seleccionar todos"
- [ ] Crear Server Actions batch en `app/actions/work-orders.ts`
- [ ] Implementar batchAssignTechnicians, batchUpdateStatus, batchAddComment
- [ ] Validar máximo 50 OTs por batch
- [ ] Emitir SSE para cada OT modificada
- [ ] Añadir data-testid="batch-actions-bar"
- [ ] Run test: `npx playwright test tests/e2e/story-3.4/P1-ac4-batch-actions.spec.ts`
- [ ] ✅ Tests pass (green phase)

---

#### Test: P1-ac6-modal-detalles.spec.ts

**Tasks to make these tests pass:**

- [ ] Actualizar `components/kanban/ot-details-modal.tsx`
- [ ] Añadir sección "Avería Original" con link si failure_report_id existe
- [ ] Añadir sección "Rutina Preventiva" con link si rutina_id existe
- [ ] Mostrar fechas, origen, técnicos, repuestos, comentarios
- [ ] Añadir data-testid="modal-ot-info-{id}"
- [ ] Run test: `npx playwright test tests/e2e/story-3.4/P1-ac6-modal-detalles.spec.ts`
- [ ] ✅ Tests pass (green phase)

---

### Integration Tests

#### Test: work-orders-list.test.ts

**Tasks to make these tests pass:**

- [ ] Crear `getWorkOrdersList(params)` Server Action
- [ ] Implementar filtros, sorting, paginación en query Prisma
- [ ] Crear `batchAssignTechnicians()` Server Action
- [ ] Crear `batchUpdateStatus()` Server Action
- [ ] Crear `batchAddComment()` Server Action
- [ ] Validar PBAC: can_view_all_ots para ver lista
- [ ] Validar PBAC: can_assign_technicians para batch assign
- [ ] Run test: `npx vitest run tests/integration/story-3.4/work-orders-list.test.ts`
- [ ] ✅ Tests pass (green phase)

---

### Unit Tests

#### Test: work-orders-list-utils.test.ts

**Tasks to make these tests pass:**

- [ ] Crear `lib/utils/work-orders-list.ts` con funciones puras
- [ ] Implementar `buildFilterQuery()` para convertir filtros a query Prisma
- [ ] Implementar `buildSortQuery()` para sorting
- [ ] Implementar `validateBatchLimit()` para límite de 50 OTs
- [ ] Run test: `npx vitest run tests/unit/story-3.4/work-orders-list-utils.test.ts`
- [ ] ✅ Tests pass (green phase)

---

## Running Tests

```bash
# Run all E2E tests for this story
npx playwright test tests/e2e/story-3.4/

# Run specific E2E test file
npx playwright test tests/e2e/story-3.4/P0-ac1-tabla-paginacion.spec.ts

# Run tests in headed mode (see browser)
npx playwright test tests/e2e/story-3.4/ --headed

# Debug specific test
npx playwright test tests/e2e/story-3.4/P0-ac1-tabla-paginacion.spec.ts --debug

# Run integration tests
npx vitest run tests/integration/story-3.4/

# Run unit tests
npx vitest run tests/unit/story-3.4/

# Run all tests with coverage
npx vitest run --coverage tests/integration/story-3.4/ tests/unit/story-3.4/
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All tests written and failing
- ✅ Fixtures and factories documented
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

## Knowledge Base References Applied

- **data-factories.md** - Factory patterns with faker.js for unique test data
- **test-quality.md** - Deterministic tests, explicit assertions, <300 lines
- **test-levels-framework.md** - E2E for user journeys, Integration for Server Actions
- **test-healing-patterns.md** - Network-first pattern, robust selectors

---

**Generated by BMad TEA Agent** - 2026-03-31
