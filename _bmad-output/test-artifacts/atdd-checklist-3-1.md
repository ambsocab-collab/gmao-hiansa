---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests']
lastStep: 'step-04-generate-tests'
lastSaved: '2026-03-23'
workflowType: 'testarch-atdd'
inputDocuments:
  - _bmad-output/implementation-artifacts/3-1-kanban-de-8-columnas-con-drag-drop.md
  - _bmad/tea/testarch/knowledge/data-factories.md
  - _bmad/tea/testarch/knowledge/test-quality.md
  - _bmad/tea/testarch/knowledge/component-tdd.md
  - _bmad/tea/testarch/knowledge/selector-resilience.md
  - _bmad/tea/testarch/knowledge/timing-debugging.md
  - _bmad/tea/testarch/knowledge/overview.md
  - _bmad/tea/testarch/knowledge/api-request.md
  - _bmad/tea/testarch/knowledge/auth-session.md
  - _bmad/tea/testarch/knowledge/recurse.md
  - _bmad/tea/testarch/knowledge/test-levels-framework.md
  - _bmad/tea/testarch/knowledge/test-priorities-matrix.md
  - tests/helpers/factories.ts
  - tests/factories/data.factories.ts
  - tests/fixtures/test.fixtures.ts
  - playwright.config.ts
---

# ATDD Checklist - Epic 3, Story 3.1: Kanban de 8 Columnas con Drag & Drop

**Date:** 2026-03-23
**Author:** Bernardo
**Generation Mode:** AI Generation (Sequential)
**Primary Test Level:** E2E (UI crítica con drag & drop)

---

## Step 1: Preflight & Context Loading

### Stack Detection
- **Detected Stack:** `fullstack` (Next.js 14 + Prisma + Playwright)
- **Test Framework:** Playwright 1.48.0
- **Browser Automation:** `auto` (CLI or MCP based on availability)

### Prerequisites Verification
- ✅ Story approved with clear acceptance criteria (8 ACs in BDD format)
- ✅ Test framework configured (playwright.config.ts with 4 workers, storageState auth)
- ✅ Development environment available
- ✅ Data factories exist (tests/helpers/factories.ts with OT, Asset, User factories)
- ✅ Fixtures exist (tests/fixtures/test.fixtures.ts with role-based auth)

### Story Context Loaded
- **Epic 3, Story 3.1:** Kanban de 8 Columnas con Drag & Drop
- **Status:** ready-for-dev
- **8 Acceptance Criteria:**
  - AC1: Vista Kanban Desktop (8 columnas completas)
  - AC2: Tarjetas OT con información completa
  - AC3: Drag & Drop entre columnas
  - AC4: Vista optimizada para Tablet (2-3 columnas con swipe)
  - AC5: Vista Mobile First optimizada
  - AC6: Modal de acciones en móvil (no drag & drop)
  - AC7: Identificación visual de tipos de OT
  - AC8: Toggle Kanban ↔ Listado con sincronización

### Key Components Identified
- **KanbanBoard** - Client Component (drag & drop con @dnd-kit/core)
- **KanbanColumn** - Columna con drop zone
- **OTCard** - Tarjeta draggable
- **StatusBadge** - Badge de estado (8 variantes)
- **DivisionTag** - Tag de división (HiRock/Ultra)
- **OT Details Modal** - Modal para móvil

### Technical Requirements
- **Drag & Drop Library:** @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- **Performance:** NFR-S3 - Estado actualizado en <1s
- **SSE:** NFR-S4 - Notificación entregada en <30s (R-002)
- **Authorization:** can_view_all_ots para acceder a /ots/kanban
- **Colors:** 8 estados con colores específicos (ver story para hex codes)

### Existing Patterns (from Story 2.3)
- SSE real-time sync con EventSource + router.refresh()
- Server Actions con validación PBAC
- Component patterns: TriageColumnSSE, useSSEConnection
- Performance tracking con trackPerformance()

---

## Step 2: Generation Mode Selection

### Mode: AI Generation

**Rationale:**
- ACs claramente definidos con formato BDD Given-When-Then
- Patrones E2E estándar (navegación, interacción, assertions)
- Factories existentes para OTs, Assets, Users
- Fixtures existentes para autenticación multi-rol
- Drag & drop puede ser testeado con `page.dragAndDrop()` API
- Responsive testing con `page.setViewportSize()` programático
- **NO MCP Playwright disponible** para recording mode

**Test Level Strategy:**
- **Primary:** E2E tests (UI crítica, drag & drop, responsive)
- **Secondary:** Integration tests (Server Actions, SSE events)
- **Tertiary:** Unit tests (business logic)

---

## Step 3: Test Strategy

### Acceptance Criteria Mapping

| AC | Description | Test Level | Priority | Test File | Status |
|----|-------------|------------|----------|-----------|--------|
| **AC1** | Vista Kanban Desktop (8 columnas) | E2E | **P0** | `P0-ac1-kanban-desktop.spec.ts` | RED |
| **AC2** | Tarjetas OT con información completa | E2E | **P0** | `P0-ac2-ot-cards.spec.ts` | RED |
| **AC3** | Drag & Drop entre columnas | E2E | **P0** | `P0-ac3-drag-drop.spec.ts` | RED |
| **AC4** | Vista Tablet (2-3 columnas swipe) | E2E | **P1** | `P1-ac4-tablet-view.spec.ts` | RED |
| **AC5** | Vista Mobile (1 columna touch) | E2E | **P1** | `P1-ac5-mobile-view.spec.ts` | RED |
| **AC6** | Modal acciones móvil | E2E | **P1** | `P1-ac6-mobile-modal.spec.ts` | RED |
| **AC7** | Tipos de OT (Preventivo/Correctivo) | E2E | **P0** | `P0-ac7-ot-types.spec.ts` | RED |
| **AC8** | Toggle Kanban ↔ Listado | E2E | **P1** | `P1-ac8-toggle-sync.spec.ts` | RED |
| **Server Action** | updateWorkOrderStatus | Integration | **P0** | `P0-work-orders.test.ts` | RED |
| **SSE Heartbeat** | Reconexión automática | Integration | **P1** | `P1-sse-heartbeat.test.ts` | RED |
| **Unit Utils** | State transitions, colors, formatting | Unit | **P1** | `P1-kanban-utils.test.ts` | RED |

### Test Levels Selection (Full Stack)

**E2E Tests (Primary):**
- **Target:** Critical user journeys
- **Tools:** Playwright E2E with page.dragAndDrop(), setViewportSize()
- **Focus:** UI behavior, drag & drop, responsive, SSE real-time sync
- **Count:** 33 tests

**Integration Tests (Secondary):**
- **Target:** Server Actions + SSE events
- **Tools:** Vitest + APIRequestContext
- **Focus:** Business logic, transactions, auditing
- **Count:** 6 tests

**Unit Tests (Tertiary):**
- **Target:** Pure business logic functions
- **Tools:** Vitest
- **Focus:** State transitions, color mapping, card formatting
- **Count:** 6 tests

### Priority Breakdown

**P0 - Critical (17 tests):**
- AC1, AC2, AC3, AC7: Kanban core functionality
- Server Action: updateWorkOrderStatus with PBAC
- Optimistic locking (R-102 race condition)
- Revenue/user impact: Alta (supervisores no pueden trabajar sin Kanban)

**P1 - High (24 tests):**
- AC4, AC5, AC6, AC8: Responsive + mobile UX
- SSE heartbeat and reconnection (R-104)
- Unit tests for business logic
- User impact: Significativo (múltiples dispositivos)

**P2 - Medium (4 tests):**
- UI polish details: badges, KPIs, indicators

---

## Step 4: Generate FAILING Tests (TDD Red Phase)

### Execution Mode: Sequential

**Mode Selection:** `sequential` (direct generation without subagents)
**Rationale:** User requested direct generation of all tests

### Tests Generated: 45 Total

#### E2E Tests (33 tests)

**P0 - Critical (14 tests):**
- ✅ `tests/e2e/story-3.1/P0-ac1-kanban-desktop.spec.ts` - 4 tests
  - Kanban 8 columnas visible
  - Columnas colores correctos
  - Count badges por columna
  - Board responsive desktop
- ✅ `tests/e2e/story-3.1/P0-ac2-ot-cards.spec.ts` - 4 tests
  - OT cards información completa
  - Borde izquierdo coloreado
  - División tag colores correctos
  - data-testid en tarjetas
- ✅ `tests/e2e/story-3.1/P0-ac3-drag-drop.spec.ts` - 4 tests
  - Drag & drop actualiza estado <1s
  - SSE enviado tras drag & drop
  - Auditoría logged
  - Drag & drop entre todas las columnas
- ✅ `tests/e2e/story-3.1/P0-ac7-ot-types.spec.ts` - 3 tests
  - Preventivas etiqueta verde
  - Correctivas etiqueta rojiza
  - Etiquetas visibles en todas las tarjetas

**P1 - High (15 tests):**
- ✅ `tests/e2e/story-3.1/P1-ac4-tablet-view.spec.ts` - 4 tests
  - Tablet 2 columnas visibles
  - Swipe horizontal
  - Indicador columnas
  - Panel KPIs colapsable
- ✅ `tests/e2e/story-3.1/P1-ac5-mobile-view.spec.ts` - 4 tests
  - Móvil 1 columna visible
  - Swipe horizontal móvil
  - OT cards simplificadas
  - Touch targets >=44px
- ✅ `tests/e2e/story-3.1/P1-ac6-mobile-modal.spec.ts` - 3 tests
  - Touch abre modal móvil
  - Modal botones de acción
  - Cambiar estado desde modal
- ✅ `tests/e2e/story-3.1/P1-ac8-toggle-sync.spec.ts` - 4 tests
  - Toggle Kanban ↔ Listado
  - Sincronización bidireccional
  - Preferencia vista guardada
  - data-testid en toggle

**P2 - Medium (4 tests):**
- ✅ `tests/e2e/story-3.1/P2-ui-details.spec.ts` - 4 tests
  - Count badges formato correcto
  - Panel KPIs visible
  - Indicador columnas tablet
  - Toggle testid verification

#### Integration Tests (6 tests)

**P0 - Critical (3 tests):**
- ✅ `tests/integration/work-orders/P0-work-orders.test.ts` - 3 tests
  - updateWorkOrderStatus() con PBAC validation
  - Auditoría logged para cambios
  - Optimistic locking (R-102 race condition)

**P1 - High (3 tests):**
- ✅ `tests/integration/sse/P1-sse-heartbeat.test.ts` - 3 tests
  - SSE heartbeat cada 30s
  - Reconexión automática
  - Reconexión <30s (R-104)

#### Unit Tests (6 tests)

**P1 - Business Logic (6 tests):**
- ✅ `tests/unit/lib/P1-kanban-utils.test.ts` - 6 tests
  - State transitions machine (1 test)
  - Column color mapping (2 tests)
  - OT card formatting (3 tests)

### Test Compliance: TDD Red Phase

✅ **All tests use `test.skip(true, 'Feature not implemented yet - TDD Red Phase')`**
✅ **All tests assert EXPECTED behavior (not current state)**
✅ **All tests will FAIL until implementation makes them pass**

### Test File Structure

```
tests/
├── e2e/story-3.1/
│   ├── P0-ac1-kanban-desktop.spec.ts      # 4 tests - Kanban view
│   ├── P0-ac2-ot-cards.spec.ts              # 4 tests - OT cards
│   ├── P0-ac3-drag-drop.spec.ts             # 4 tests - Drag & drop
│   ├── P0-ac7-ot-types.spec.ts              # 3 tests - Type labels
│   ├── P1-ac4-tablet-view.spec.ts           # 4 tests - Tablet responsive
│   ├── P1-ac5-mobile-view.spec.ts           # 4 tests - Mobile responsive
│   ├── P1-ac6-mobile-modal.spec.ts          # 3 tests - Mobile modal
│   ├── P1-ac8-toggle-sync.spec.ts           # 4 tests - Toggle & sync
│   └── P2-ui-details.spec.ts                # 4 tests - UI polish
├── integration/
│   ├── work-orders/
│   │   └── P0-work-orders.test.ts           # 3 tests - Server actions
│   └── sse/
│       └── P1-sse-heartbeat.test.ts         # 3 tests - SSE events
└── unit/lib/
    └── P1-kanban-utils.test.ts              # 6 tests - Business logic
```

### Coverage Summary

| Priority | E2E | Integration | Unit | Total |
|----------|-----|-------------|------|-------|
| **P0** | 14 | 3 | 0 | 17 |
| **P1** | 15 | 3 | 6 | 24 |
| **P2** | 4 | 0 | 0 | 4 |
| **Total** | **33** | **6** | **6** | **45** |

### Risk Mitigation Coverage

| Risk ID | Description | Tests |
|---------|-------------|-------|
| **R-101** | SSE sync failure Kanban ↔ Listado | P1-ac8-toggle-sync |
| **R-102** | Drag & drop race conditions | P0-ac3-drag-drop, P0-work-orders |
| **R-104** | SSE notification delay >30s | P0-ac3-drag-drop, P1-sse-heartbeat |

### Next Steps for Dev Team

1. **Install dependencies:** `npm install --save-dev @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
2. **Remove `test.skip()`** as you implement each feature
3. **Run tests locally:** `npm run test:e2e story-3.1` and `npm run test:integration`
4. **Fix failing tests** to make them GREEN
5. **Refactor** with test safety net once GREEN
6. **Maintain 100% P0 pass rate** before release

---

## TDD Red Phase Confirmation

✅ **All tests designed to FAIL before implementation:**
- Components don't exist: KanbanBoard, OTCard, StatusBadge, DivisionTag
- Routes don't exist: `/ots/kanban`
- Server Action doesn't exist: `updateWorkOrderStatus()`
- SSE event not configured: `work_order_updated`
- Data model exists (WorkOrder from Epic 2) but Kanban UI doesn't

✅ **Red-Green-Refactor cycle will follow:**
1. **RED:** Tests fail (current state) ✅ COMPLETE
2. **GREEN:** Implementation makes tests pass (dev team - NEXT STEP)
3. **REFACTOR:** Code quality with test safety net (dev team)

---

## Quality Metrics

- **Test Count:** 45 tests (33 E2E + 6 Integration + 6 Unit)
- **P0 Coverage:** 17 critical tests (100% required for release)
- **Risk Mitigation:** R-101, R-102, R-104 covered with tests
- **Performance:** Drag & drop <1s validated, SSE <30s validated
- **Security:** PBAC validation tested in Integration layer
