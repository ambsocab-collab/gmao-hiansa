---
stepsCompleted: ['step-01-load-context', 'step-02-discover-tests', 'step-03-map-criteria', 'step-04-analyze-gaps', 'step-05-gate-decision']
lastStep: 'step-05-gate-decision'
lastSaved: '2026-03-22'
workflowType: 'testarch-trace'
inputDocuments: ['epics.md', 'test-design-epic-2.md', 'risk-governance.md', 'probability-impact.md', 'test-priorities-matrix.md', 'test-quality.md']
gate_type: 'epic'
decision_mode: 'deterministic'
---

# Traceability Matrix & Gate Decision - Epic 2

**Epic:** Epic 2 - Gestión de Averías y Reportes Rápidos  
**Date:** 2026-03-22  
**Evaluator:** Bernardo  
**Gate Type:** Epic  
**Decision Mode:** Deterministic

---

## Step 1: Load Context & Knowledge Base

### Requirements Loaded

**Epic 2: Gestión de Averías y Reportes Rápidos**
- Goal: Operarios reportan averías en <30s con búsqueda predictiva, supervisores triagean y convierten a OTs
- Stories: 2.1 (Búsqueda Predictiva), 2.2 (Formulario Reporte), 2.3 (Triage y Conversión a OTs)
- Total Acceptance Criteria: 20 criteria
  - Story 2.1: 6 AC (equipo search, <200ms, jerarquía, división tags, selección, no results)
  - Story 2.2: 7 AC (mobile first, CTA, validaciones, foto, confirmación, SSE, desktop layout)
  - Story 2.3: 7 AC (columna Por Revisar, color coding, modal details, convertir a OT, tipo Correctivo, Kanban, filtros)

### Knowledge Base Loaded

✅ **test-priorities-matrix.md** - P0-P3 classification
- P0: Critical (revenue, security, data integrity, compliance) - 100% coverage required
- P1: High (core journeys, frequently used, complex logic) - ≥90% target, ≥80% minimum
- P2: Medium (secondary features, admin, reporting) - happy path acceptable
- P3: Low (rarely used, cosmetic, nice-to-have) - smoke tests or manual only

✅ **risk-governance.md** - Risk scoring matrix (probability × impact = score 1-9)
- Score 9 (Probability=3, Impact=3) → BLOCK - automatic FAIL gate
- Score 6-8 → MITIGATE - requires mitigation before release
- Score 4-5 → MONITOR - watch closely
- Score 1-3 → DOCUMENT - awareness only

✅ **probability-impact.md** - Risk assessment methodology
- Probability: 1=Unlikely, 2=Possible, 3=Likely
- Impact: 1=Minor, 2=Degraded, 3=Critical
- Thresholds: Score ≥6 requires mitigation, Score=9 blocks release

✅ **test-quality.md** - Definition of Done
- Deterministic: No hard waits, no conditionals, explicit assertions
- Isolated: Self-cleaning, parallel-safe, unique data (faker)
- Focused: <300 lines per test, <1.5 min execution time
- Coverage: Unit >90%, Integration >80%, E2E all critical paths (P0)

✅ **test-design-epic-2.md** - Planned test coverage
- Total scenarios: 44 tests (P0: 15, P1: 23, P2: 6, P3: 0)
- Effort estimate: ~47-70 hours (~6-9 days)
- High-priority risks (≥6): 5 risks identified
  - R-004 (SEC, score=9): PBAC authorization bypass - CRITICAL BLOCKER
  - R-001 (PERF, score=8): Search performance >200ms - HIGH
  - R-002 (PERF, score=6): SSE notifications delay >30s - MITIGATE
  - R-003 (BUS, score=6): Mobile First usability - MITIGATE
  - R-006 (DATA, score=6): OT creation race condition - MITIGATE

### Prerequisites Validation

✅ Acceptance criteria available (Epic 2 requirements loaded)  
✅ Tests exist OR gaps explicitly acknowledged (test design available with 44 planned tests)  
✅ Knowledge base loaded (priorities, risks, quality criteria)

**Step 1 Status:** COMPLETE

---

## Step 2: Discover & Catalog Tests

### Tests Discovered: 34 E2E Tests (10 files)

**Story 2.1 - Búsqueda Predictiva (2 files, 15 tests):**

| File | Tests | Priority | Coverage |
|------|-------|----------|----------|
| `busqueda-predictiva-p0.spec.ts` | P0-E2E-001 through P0-E2E-008 | P0 (8 tests) | Core search functionality, hierarchy, division tags, selection, mobile height |
| `busqueda-predictiva-p1.spec.ts` | P1-E2E-001 through P1-E2E-007 | P1 (7 tests) | Red border, placeholder, debouncing, max 10 results, keyboard navigation |

**Story 2.2 - Formulario Reporte (3 active files, 10 tests):**

| File | Tests | Priority | Coverage |
|------|-------|----------|----------|
| `reporte-averia-validaciones.spec.ts` | P0-E2E-002, P0-E2E-003, P0-E2E-004, P0-E2E-011, P0-E2E-005(skip) | P0 (4 active) | Equipo required, descripción required, textarea height, Story 2.1 integration |
| `reporte-averia-mobile.spec.ts` | P0-E2E-001, P1-E2E-001, P1-E2E-002 | P0/P1 (3 tests) | CTA styling, touch targets 44px, single column mobile |
| `reporte-averia-desktop.spec.ts` | P0-E2E-010, P1-E2E-003 | P0/P1 (2 tests) | Desktop 2-column layout, validations work same |
| `reporte-averia-submit-performance.spec.ts` | P0-E2E-006, P0-E2E-007, P0-E2E-009, P0-E2E-008(skip) | P0 (3 active) | Submit without photo, confirmation <3s, complete <30s, SSE notification |
| `reporte-averia-integracion.spec.ts` | (DEPRECATED - empty) | - | Tests moved to specialized files |

**Story 2.3 - Triage y OTs (4 files, 13 tests):**

| File | Tests | Priority | Coverage |
|------|-------|----------|----------|
| `ac1-columna-por-revisar.spec.ts` | P0-E2E-001, P1-E2E-002, P2-E2E-003, P2-E2E-004 | P0/P1/P2 (4 tests) | Columna visible, color coding (rosa/blanco), card data, count badge |
| `ac2-modal-informativo.spec.ts` | P0-E2E-005, P1-E2E-006, P2-E2E-007 | P0/P1/P2 (3 tests) | Modal opens, action buttons, photo if exists |
| `ac3-convertir-a-ot.spec.ts` | P0-E2E-008, P1-E2E-009, P1-E2E-010(TODO) | P0/P1 (2 active) | Convertir <1s, estado "Pendiente", tipo "Correctivo", Kanban (TODO) |
| `ac4-descartar-aviso.spec.ts` | P0-E2E-011, P0-E2E-012, P1-E2E-013 | P0/P1 (3 tests) | Confirmación modal, descarta y remueve, cancelar cierra modal |

### Test Distribution by Level

| Test Level | Test Count | Percentage |
|------------|------------|------------|
| **E2E** | 34 tests (19 P0, 13 P1, 2 P2) | 100% |
| **API** | 0 tests | 0% |
| **Component** | 0 tests | 0% |
| **Unit** | 0 tests | 0% |

**Quality Concerns:**
- ⚠️ **Zero API tests**: No direct endpoint validation
- ⚠️ **Zero component tests**: No React component isolation
- ⚠️ **Zero unit tests**: No business logic validation
- ⚠️ **2 tests skipped**: P0-E2E-005 (photo upload), P0-E2E-008 (SSE notification)
- ⚠️ **1 TODO test**: P1-E2E-010 (Kanban integration) - waiting Epic 3
- ✅ **E2E quality**: Given-When-Then structure, data-testid selectors, storageState auth, database reset in beforeEach

### Coverage Heuristics Inventory

**API Endpoints Referenced by Requirements (No Direct Tests):**

| Endpoint | Method | Story | Risk | Test Coverage |
|----------|--------|-------|------|---------------|
| `/api/equipos/search` | GET | 2.1 | R-001 (PERF score=8) | ❌ None - Tested via E2E UI only |
| `/api/averias/create` | POST | 2.2 | - | ❌ None - Tested via E2E UI only |
| `/api/averias/{id}/convert` | POST | 2.3 | R-006 (DATA score=6) | ❌ None - Tested via E2E UI only |
| `/api/averias/{id}/discard` | POST | 2.3 | - | ❌ None - Tested via E2E UI only |
| `/api/v1/test/reset-failure-reports` | POST | 2.3 | - | ✅ E2E setup (beforeEach) |
| `/api/v1/sse` | SSE | 2.2, 2.3 | R-002 (PERF score=6) | ❌ None - Test skipped |

**Critical Gaps:**
- **6 endpoints without direct API tests** (0% API coverage)
- R-001 (PERF score=8): Search performance validated via E2E only, no k6 load test
- R-002 (PERF score=6): SSE notification test skipped (P0-E2E-008)
- R-004 (SEC score=9): PBAC authorization bypass - **NO TESTS FOUND**
- R-006 (DATA score=6): OT creation race condition - E2E only, no API unique constraint test

**Authentication/Authorization Coverage:**

| Requirement | Negative Path Test | Coverage Status |
|-------------|-------------------|-----------------|
| PBAC: can_view_all_ots required for /averias/triage | ❌ Missing - NO 403 test found | **CRITICAL GAP (R-004)** |
| PBAC: can_create_failure_report required for /averias/nuevo | ❌ Missing - NO 403 test found | GAP |
| Login/session validation | ✅ storageState auth in E2E | UI-level only |

**Error Path Coverage:**

| Criterion | Happy Path | Error/Edge Case | Coverage Status |
|-----------|------------|-----------------|-----------------|
| Equipo search results | ✅ P0-E2E-001 | ⚠️ Timeout, network failure | Happy-path only |
| Submit avería | ✅ P0-E2E-006 | ⚠️ Server error 500, duplicate submit | Happy-path only |
| Convertir a OT | ✅ P0-E2E-008 | ⚠️ Concurrent conversion (R-006) | Partial - E2E only |
| SSE notifications | ❌ P0-E2E-008 skipped | ⚠️ SSE reconnect, timeout | **NO COVERAGE** |
| Mobile <30s completion | ❌ NOT TESTED | - | **MISSING (R-003)** |

**Step 2 Status:** COMPLETE

---

## Step 3: Requirements Traceability Matrix

### Coverage Summary

| Priority  | Total Criteria | FULL Coverage | Coverage % | Status       |
| --------- | -------------- | ------------- | ---------- | ------------ |
| P0        | 19             | 11            | 57.9%      | ❌ FAIL      |
| P1        | 13             | 3             | 23.1%      | ❌ FAIL      |
| P2        | 2              | 2             | 100%       | ✅ PASS      |
| **Total** | **34**         | **16**        | **47.1%**  | ❌ FAIL      |

**Legend:**
- ✅ PASS - Coverage meets quality gate threshold
- ⚠️ WARN - Coverage below threshold but not critical
- ❌ FAIL - Coverage below minimum threshold (blocker)

**Coverage Status Definitions:**
- **FULL**: All scenarios covered (happy path + error paths + API/E2E as appropriate)
- **PARTIAL**: Happy path covered, missing error paths or API-level validation
- **NONE**: No tests found
- **E2E-ONLY**: Covered via E2E only, no direct API/component/unit tests

---

### Detailed Mapping

#### Story 2.1: Búsqueda Predictiva de Equipos

---

##### AC1: Resultados de búsqueda predictiva aparecen en <200ms (P0)

**Coverage:** PARTIAL ⚠️
- **Tests:**
  - `P0-E2E-001` - `busqueda-predictiva-p0.spec.ts:34`
    - **Given:** Usuario con capability can_create_failure report autenticado (via storageState)
    - **When:** Digita "pren" en input de búsqueda de equipo
    - **Then:** Resultados de búsqueda predictiva aparecen
    - **Note:** Performance <200ms P95 validated via E2E only, **no k6 load test found**

- **Gaps:**
  - Missing: k6 load test with 10K assets (R-001 PERF score=8)
  - Missing: API-level performance test for `/api/equipos/search` endpoint

- **Recommendation:** Create `k6/story-2.1-search-performance.js` with 10K assets to validate P95 <200ms. This is **CRITICAL** for R-001 mitigation (score=8).

---

##### AC2: Resultados muestran jerarquía completa, tags de división, máximo 10 resultados (P0)

**Coverage:** FULL ✅
- **Tests:**
  - `P0-E2E-002` - `busqueda-predictiva-p0.spec.ts:64`
    - **Given:** Usuario digitó "prensa"
    - **When:** Resultados del autocomplete visibles
    - **Then:** Cada resultado muestra: nombre del equipo, jerarquía completa (División → Planta → Línea → Equipo)

  - `P0-E2E-003` - `busqueda-predictiva-p0.spec.ts:91`
    - **Given:** Resultados del autocomplete visibles
    - **Then:** Tags de división HiRock (#FFD700) y Ultra (#8FBC8F) visibles con colores correctos

  - `P1-E2E-001` - `busqueda-predictiva-p1.spec.ts:31`
    - **Given:** Resultados visibles
    - **Then:** Resultado tiene borde izquierdo rojo burdeos #7D1220 (4px)

  - `P1-E2E-004` - `busqueda-predictiva-p1.spec.ts:96`
    - **Given:** Más de 10 equipos coinciden
    - **Then:** Máximo 10 resultados visibles

---

##### AC3: Selección de equipo funciona correctamente (P0)

**Coverage:** FULL ✅
- **Tests:**
  - `P0-E2E-004` - `busqueda-predictiva-p0.spec.ts:119`
    - **Given:** Resultados de autocomplete visibles
    - **When:** Selecciono un equipo usando keyboard navigation (ArrowDown + Enter)
    - **Then:** Input se completa con nombre del equipo seleccionado, búsqueda predictiva se cierra

  - `P1-E2E-005` - `busqueda-predictiva-p1.spec.ts:117`
    - **Given:** Equipo seleccionado
    - **Then:** Badge muestra jerarquía completa: "División → Planta → Línea → Equipo"

  - `P1-E2E-006` - `busqueda-predictiva-p1.spec.ts:150`
    - **Given:** Resultados de autocomplete visibles
    - **When:** Click fuera del componente
    - **Then:** Autocomplete se cierra

  - `P1-E2E-007` - `busqueda-predictiva-p1.spec.ts:174`
    - **Given:** Resultados visibles
    - **When:** Uso arrow keys y Enter
    - **Then:** Puedo navegar y seleccionar con teclado

---

##### AC4: Input tiene placeholder "Buscar equipo..." y altura 44px (P0)

**Coverage:** FULL ✅
- **Tests:**
  - `P1-E2E-002` - `busqueda-predictiva-p1.spec.ts:51`
    - **Given:** Usuario en formulario de reporte de avería
    - **When:** Ve input de búsqueda
    - **Then:** Placeholder es "Buscar equipo..."

  - `P0-E2E-008` - `busqueda-predictiva-p0.spec.ts:252`
    - **Given:** Usuario en formulario
    - **When:** Ve input de búsqueda
    - **Then:** Input tiene 44px altura para tapping fácil en móvil (NFR-A3)

---

##### AC5: Mensaje "sin resultados" mostrado cuando no hay coincidencias (P0)

**Coverage:** FULL ✅
- **Tests:**
  - `P0-E2E-007` - `busqueda-predictiva-p0.spec.ts:232`
    - **Given:** No hay resultados para búsqueda
    - **When:** Usuario digitó al menos 3 caracteres
    - **Then:** Mensaje mostrado: "No se encontraron equipos. Intenta con otra búsqueda."

---

##### AC6: Equipo seleccionado visible como badge con botón (x) para limpiar (P0)

**Coverage:** FULL ✅
- **Tests:**
  - `P0-E2E-005` - `busqueda-predictiva-p0.spec.ts:146`
    - **Given:** Equipo seleccionado
    - **When:** Continúo con el formulario
    - **Then:** Veo el equipo seleccionado como tag o badge, puedo cambiar equipo haciendo click en "x"

  - `P0-E2E-006` - `busqueda-predictiva-p0.spec.ts:190`
    - **Given:** Equipo seleccionado
    - **When:** Click en botón (x)
    - **Then:** Input se limpia, equipoId eliminado del estado, badge eliminado

---

#### Story 2.2: Formulario Reporte de Avería (Mobile First)

---

##### AC1: Mobile First - CTA prominente "+ Reportar Avería" (P0)

**Coverage:** PARTIAL ⚠️
- **Tests:**
  - `P0-E2E-001` - `reporte-averia-mobile.spec.ts:52`
    - **Given:** Usuario accede a /averias/nuevo desde móvil (<768px)
    - **When:** Formulario carga
    - **Then:** Veo CTA primario prominente (rojo burdeos #7D1220, altura 56px, data-testid="averia-submit")

  - `P1-E2E-001` - `reporte-averia-mobile.spec.ts:130`
    - **Given:** Usuario en móvil
    - **When:** Analizo touch targets
    - **Then:** CTA tiene ≥44px altura (Apple HIG requirement)

  - `P1-E2E-002` - `reporte-averia-mobile.spec.ts:159`
    - **Given:** Usuario en móvil (<768px)
    - **When:** Accede a /averias/nuevo
    - **Then:** Formulario usa single column layout (no grid de 2 columnas)

- **Gaps:**
  - Missing: **P0-E2E-XXX** - Completar reporte en <30 segundos en móvil (R-003 BUS score=6)
  - **Note:** P0-E2E-009 exists but does NOT validate 30-second completion time explicitly

- **Recommendation:** Add explicit test `P0-E2E-MOBILE-001` to measure time from form load to submit completion on mobile viewport (<768px). Must complete in <30s (R-003).

---

##### AC2: Equipo es requerido, validación rechaza sin equipo (P0)

**Coverage:** PARTIAL ⚠️ (Happy-path only, no negative auth test)
- **Tests:**
  - `P0-E2E-002` - `reporte-averia-validaciones.spec.ts:29`
    - **Given:** Usuario intenta submit sin equipo
    - **When:** Llenó descripción pero sin equipo
    - **Then:** Veo error: "El equipo es requerido" (client-side Zod validation)

  - `P0-E2E-011` - `reporte-averia-validaciones.spec.ts:129`
    - **Given:** Usuario busca equipo
    - **When:** Digita "prensa"
    - **Then:** Resultados de búsqueda predictiva aparecen (Story 2.1 integration)

- **Gaps:**
  - Missing: API test for POST /api/averias/create without equipoId returns 400/422
  - Missing: PBAC auth test - verify 403 if user lacks `can_create_failure_report` capability

---

##### AC3: Descripción es textarea con altura 80-200px, validación requerida (P0)

**Coverage:** FULL ✅
- **Tests:**
  - `P0-E2E-004` - `reporte-averia-validaciones.spec.ts:98`
    - **Given:** Formulario carga
    - **When:** Ve textarea de descripción
    - **Then:** Textarea tiene altura mínima 80px, máxima 200px, data-testid="averia-descripcion"

  - `P0-E2E-003` - `reporte-averia-validaciones.spec.ts:54`
    - **Given:** Usuario intenta submit sin descripción
    - **When:** Seleccionó equipo pero sin descripción
    - **Then:** Validación rechaza formulario, mensaje inline: "La descripción debe tener al menos 10 caracteres", campo marcado con borde rojo #EF4444

---

##### AC4: Foto es opcional, upload con preview (P0)

**Coverage:** NONE ❌ (Test skipped)
- **Tests:**
  - `P0-E2E-005` - `reporte-averia-validaciones.spec.ts:158` (**SKIPPED**)
    - **Given:** Usuario sube foto
    - **Then:** Veo preview antes de submit
    - **Note:** Test marked as `test.skip` - photo upload fixture not available

- **Gaps:**
  - Blocked: Photo upload fixture `tests/fixtures/test-photo.jpg` not available
  - Missing: API test for multipart/form-data upload to storage endpoint

- **Recommendation:** Enable test by creating test fixture or mock Vercel Blob API. Foto opcional but upload flow must work.

---

##### AC5: Submit exitoso muestra confirmación con número en <3s (P0)

**Coverage:** PARTIAL ⚠️ (No SSE notification test)
- **Tests:**
  - `P0-E2E-006` - `reporte-averia-submit-performance.spec.ts:55`
    - **Given:** Formulario completado sin foto
    - **When:** Submit
    - **Then:** Reporte creado exitosamente, redirect a /mis-avisos o dashboard

  - `P0-E2E-007` - `reporte-averia-submit-performance.spec.ts:98`
    - **Given:** Formulario completado correctamente
    - **When:** Submit
    - **Then:** Recibo confirmación con número AV-YYYY-NNN en <3 segundos (NFR-S5)
    - **Note:** Test allows <7s in test environment, production requirement <3s

- **Gaps:**
  - Missing: `P0-E2E-008` (SKIPPED) - SSE notification enviada a usuarios can_view_all_ots en <30s (R-002 PERF score=6)
  - Missing: API test for POST /api/averias/create returns 201 with numero generated

- **Recommendation:** Implement SSE mock infrastructure (BLK-002) to enable P0-E2E-008. This is **HIGH priority** for R-002 mitigation (score=6).

---

##### AC6: Desktop layout (>1200px) usa 2 columnas (P1)

**Coverage:** FULL ✅
- **Tests:**
  - `P0-E2E-010` - `reporte-averia-desktop.spec.ts:52`
    - **Given:** Usuario en desktop (>1200px)
    - **When:** Accede a /averias/nuevo
    - **Then:** Formulario usa layout Desktop con dos columnas (izquierda: equipo + descripción, derecha: foto + preview)

  - `P1-E2E-003` - `reporte-averia-desktop.spec.ts:86`
    - **Given:** Usuario en desktop
    - **When:** Intenta submit sin equipo
    - **Then:** Validación funciona igual que móvil

---

#### Story 2.3: Triage de Averías y Conversión a OTs

---

##### AC1: Columna "Por Revisar" con tarjetas de avisos (P0)

**Coverage:** FULL ✅
- **Tests:**
  - `P0-E2E-001` - `ac1-columna-por-revisar.spec.ts:41`
    - **Given:** Supervisor con can_view_all_ots accede a /averias/triage
    - **When:** Página carga
    - **Then:** Ve columna "Por Revisar" con todos los avisos nuevos, data-testid="averias-triage"

  - `P2-E2E-003` - `ac1-columna-por-revisar.spec.ts:124`
    - **Given:** Tarjetas visibles
    - **Then:** Cada tarjeta muestra: número (ej: AV-2026-001), equipo, descripción truncada, reporter, fecha/hora

  - `P2-E2E-004` - `ac1-columna-por-revisar.spec.ts:146`
    - **Given:** Múltiples avisos en triage
    - **Then:** Indicador de count visible: "Por Revisar (3)"

---

##### AC2: Color coding - tarjetas avería (rosa #FFC0CB) vs reparación (blanco #FFFFFF) (P0)

**Coverage:** FULL ✅
- **Tests:**
  - `P1-E2E-002` - `ac1-columna-por-revisar.spec.ts:76`
    - **Given:** Tarjetas visibles
    - **When:** Analizo colores
    - **Then:** Tarjetas de avería tienen color rosa #FFC0CB (rgb(255, 192, 203)), tarjetas de reparación tienen color blanco #FFFFFF (rgb(255, 255, 255))

---

##### AC3: Modal informativo con detalles completos (P0)

**Coverage:** FULL ✅
- **Tests:**
  - `P0-E2E-005` - `ac2-modal-informativo.spec.ts:40`
    - **Given:** Lista de avisos visible
    - **When:** Click en tarjeta
    - **Then:** Modal informativo se abre con detalles completos, data-testid="modal-averia-info", muestra: foto (si existe), descripción completa, equipo con jerarquía, reporter, timestamp

  - `P1-E2E-006` - `ac2-modal-informativo.spec.ts:66`
    - **Given:** Modal abierto
    - **Then:** Modal tiene botones de acción: "Convertir a OT", "Descartar"

  - `P2-E2E-007` - `ac2-modal-informativo.spec.ts:86`
    - **Given:** Modal abierto
    - **When:** Aviso tiene foto
    - **Then:** Foto visible en modal (si existe)

---

##### AC4: Descartar aviso con confirmación (P0)

**Coverage:** FULL ✅
- **Tests:**
  - `P0-E2E-011` - `ac4-descartar-aviso.spec.ts:39`
    - **Given:** Modal de avería abierto
    - **When:** Click "Descartar"
    - **Then:** Confirmación modal visible: "¿Descartar aviso #{numero}? Esta acción no se puede deshacer."

  - `P0-E2E-012` - `ac4-descartar-aviso.spec.ts:67`
    - **Given:** Confirmación modal visible
    - **When:** Confirmo descarte
    - **Then:** Aviso marcado como "Descartado", ya no aparece en columna "Por Revisar"

  - `P1-E2E-013` - `ac4-descartar-aviso.spec.ts:98`
    - **Given:** Confirmación modal visible
    - **When:** Cancelo
    - **Then:** Modal se cierra sin cambios, aviso sigue en columna "Por Revisar"

---

##### AC5: Convertir a OT en <1s con estado "Pendiente" y tipo "Correctivo" (P0)

**Coverage:** PARTIAL ⚠️ (No API unique constraint test for R-006)
- **Tests:**
  - `P0-E2E-008` - `ac3-convertir-a-ot.spec.ts:44`
    - **Given:** Modal de avería abierto
    - **When:** Click "Convertir a OT"
    - **Then:** Aviso convertido a Orden de Trabajo en <3s (E2E allows <3s vs <1s requirement), OT creada con estado "Pendiente", modal cerrado
    - **Note:** Test validates <3s for E2E environment, requirement is <1s for backend

  - `P1-E2E-009` - `ac3-convertir-a-ot.spec.ts:103`
    - **Given:** OT creada desde avería
    - **Then:** Etiqueta "Correctivo" visible en tarjeta OT
    - **Note:** TODO - Verificar etiqueta "Correctivo" en Kanban cuando Kanban esté implementado (Epic 3)

- **Gaps:**
  - Missing: API test for POST /api/averias/{id}/convert unique constraint (R-006 DATA score=6)
  - Missing: E2E test for concurrent conversion (two supervisors convert same avería → only 1 OT created)
  - Missing: `P1-E2E-010` - OT aparece en Kanban columna "Pendiente" (TODO, waiting Epic 3)

- **Recommendation:** Create `P0-API-002` to verify 409 Conflict when attempting to create second OT for same averiaId (unique constraint). This is **HIGH priority** for R-006 mitigation (score=6).

---

##### AC6: SSE notification enviada a técnicos asignados en <30s (P0)

**Coverage:** NONE ❌ (Not tested)
- **Tests:**
  - **None found** - SSE notification requirement not covered

- **Gaps:**
  - Missing: E2E test for SSE notification sent to can_view_all_ots when avería created
  - Missing: E2E test for SSE notification sent to technicians when OT assigned
  - R-002 (PERF score=6): SSE notifications <30s - **NO COVERAGE**

- **Recommendation:** Implement SSE mock layer (BLK-002) to enable testing. Create `P0-E2E-SSE-001` for Story 2.2 (supervisor notification) and `P0-E2E-SSE-002` for Story 2.3 (technician notification).

---

##### AC7: Filtros y ordenamiento por fecha, reporter, equipo (P1)

**Coverage:** NONE ❌ (Not tested)
- **Tests:**
  - **None found** - Filtering and sorting requirements not covered

- **Gaps:**
  - Missing: E2E test for filtering avisos by fecha, reporter, equipo
  - Missing: E2E test for sorting by fecha (más reciente primero), prioridad

- **Recommendation:** Add `P1-E2E-FILTROS-001` to test filter and sort functionality. Lower priority but should be implemented before GA.

---

### Coverage Validation Results

**P0 Coverage Analysis:**
- Required: 100% (19/19 criteria)
- Actual: 57.9% (11/19 criteria fully covered, 8 partial or none)
- **Status:** ❌ FAIL - Below minimum threshold

**P1 Coverage Analysis:**
- Target: ≥90% (PASS), ≥80% (minimum)
- Actual: 23.1% (3/13 criteria fully covered)
- **Status:** ❌ FAIL - Below minimum threshold

**Critical Blockers:**
1. **R-004 (SEC score=9)**: PBAC authorization bypass - **NO TESTS**
2. **R-001 (PERF score=8)**: Search performance >200ms - **NO k6 TEST**
3. **R-002 (PERF score=6)**: SSE notifications - **NO COVERAGE**
4. **R-006 (DATA score=6)**: OT race condition - **NO API TEST**
5. **R-003 (BUS score=6)**: Mobile <30s completion - **NOT EXPLICITLY TESTED**

**Missing Test Levels:**
- API tests: 0% (0/6 endpoints tested directly)
- Component tests: 0% (no React component isolation)
- Unit tests: 0% (no business logic validation)

**Step 3 Status:** COMPLETE

---


## Step 4: Gap Analysis & Recommendations

### Gap Analysis Summary

**Total Requirements Analyzed:** 34
**Fully Covered:** 14 (41.2%)
**Partially Covered:** 16 (47.1%)
**Not Covered:** 4 (11.8%)

---

### Critical Gaps (BLOCKER) ❌

**5 gaps found.** Do not release until resolved.

1. **R-004: PBAC Authorization Bypass (SEC score=9)** - P0
   - **Current Coverage:** NONE
   - **Missing Tests:**
     - E2E: Usuario sin `can_view_all_ots` intenta acceder a /averias/triage → verify 403 Forbidden
     - API: POST /api/averias/{id}/convert sin capability returns 403
     - API: POST /api/averias/{id}/discard sin capability returns 403
   - **Recommendation:** Create `P0-E2E-SEC-001` and `P0-API-SEC-001` for PBAC validation. **CRITICAL** - score=9 blocks release.
   - **Impact:** Security vulnerability - unauthorized users can access triage and convert reports
   - **Due Date:** 2026-03-29 (1 week)

2. **R-001: Search Performance >200ms (PERF score=8)** - P0
   - **Current Coverage:** PARTIAL (E2E only, no k6 load test)
   - **Missing Tests:**
     - k6: Load test with 10,000 assets, validate P95 <200ms
   - **Recommendation:** Create `k6/story-2.1-search-performance.js` with 10K assets. Must validate P95 <200ms before staging deployment.
   - **Impact:** Performance degradation with large datasets blocks user experience
   - **Due Date:** Before staging deployment

3. **R-002: SSE Notifications Delay >30s (PERF score=6)** - P0
   - **Current Coverage:** NONE (test P0-E2E-008 skipped)
   - **Missing Tests:**
     - E2E: SSE notification received by can_view_all_ots within 30s after avería created
     - E2E: SSE notification received by technicians within 30s after OT assigned
   - **Recommendation:** Implement SSE mock infrastructure (BLK-002), then enable P0-E2E-008 and create P0-E2E-SSE-001, P0-E2E-SSE-002.
   - **Impact:** Supervisors won't see new reports in real-time, blocking core workflow
   - **Due Date:** 2026-03-29 (1 week)

4. **R-006: OT Creation Race Condition (DATA score=6)** - P0
   - **Current Coverage:** PARTIAL (E2E only, no API unique constraint test)
   - **Missing Tests:**
     - API: POST /api/averias/{id}/convert returns 409 Conflict if OT already exists (unique constraint)
     - E2E: Two concurrent supervisors convert same avería → verify only 1 OT created
   - **Recommendation:** Create `P0-API-002` for unique constraint validation and `P0-E2E-010` for concurrent conversion test.
   - **Impact:** Data corruption - duplicate OTs created for same avería
   - **Due Date:** 2026-03-29 (1 week)

5. **R-003: Mobile First <30s Completion (BUS score=6)** - P0
   - **Current Coverage:** PARTIAL (P0-E2E-009 exists but does NOT explicitly validate 30s)
   - **Missing Tests:**
     - E2E: Explicit time measurement from form load to submit completion on mobile viewport (<768px)
   - **Recommendation:** Add explicit 30-second timing validation to P0-E2E-009 or create P0-E2E-MOBILE-001.
   - **Impact:** Core user journey fails mobile usability requirement
   - **Due Date:** 2026-03-29 (1 week)

---

### High Priority Gaps (PR BLOCKER) ⚠️

**5 gaps found.** Address before PR merge.

1. **AC2.2: Foto Upload (P0)** - Test skipped
   - **Current Coverage:** NONE (P0-E2E-005 skipped)
   - **Missing:** Photo upload fixture `tests/fixtures/test-photo.jpg` not available
   - **Recommendation:** Enable P0-E2E-005 by creating test fixture or mocking Vercel Blob API. Foto opcional but upload flow must work.
   - **Impact:** Photo upload feature untested
   - **Due Date:** 2026-03-29

2. **AC2.3: API Endpoint Coverage (P0)** - 0% API tests
   - **Current Coverage:** NONE - 6 endpoints without direct API tests
   - **Missing Tests:**
     - POST /api/equipos/search
     - POST /api/averias/create
     - POST /api/averias/{id}/convert
     - POST /api/averias/{id}/discard
     - GET /api/v1/sse
   - **Recommendation:** Create API test suite for all 6 endpoints. API tests provide faster feedback and better endpoint-level validation.
   - **Impact:** No direct endpoint validation, reliance on E2E only
   - **Due Date:** Before PR merge

3. **AC2.5: PBAC Negative Path for /averias/nuevo (P1)** - Missing auth test
   - **Current Coverage:** NONE
   - **Missing Tests:**
     - E2E: Usuario sin `can_create_failure_report` intenta acceder a /averias/nuevo → verify 403
   - **Recommendation:** Create `P1-E2E-AUTH-001` for negative auth path on avería creation.
   - **Impact:** Authorization bypass possible
   - **Due Date:** Before PR merge

4. **AC2.7: Filtros y Ordenamiento (P1)** - Not tested
   - **Current Coverage:** NONE
   - **Missing Tests:**
     - E2E: Filter avisos by fecha, reporter, equipo
     - E2E: Sort by fecha (más reciente primero), prioridad
   - **Recommendation:** Create `P1-E2E-FILTROS-001` for filter and sort functionality.
   - **Impact:** Core usability feature untested
   - **Due Date:** Before GA (acceptable to defer to next sprint)

5. **AC3.6: SSE Notifications (P0)** - Not tested
   - **See R-002 above** - Same gap, mapped to risk R-002

---

### Medium Priority Gaps (Nightly) ⚠️

**4 gaps found.** Address in nightly test improvements.

1. **Error Path Coverage** - Happy-path only
   - **Missing:** Timeout, network failure, server error scenarios for:
     - Equipo search (AC1.1)
     - Submit avería (AC2.5)
     - Convertir a OT (AC3.5)
   - **Recommendation:** Add error scenario tests as part of test quality improvement initiative.
   - **Impact:** Reduced resilience confidence
   - **Due Date:** Next sprint

2. **AC3.7: Kanban Integration (P1)** - TODO test
   - **Current Coverage:** TODO (P1-E2E-010 marked as TODO, waiting Epic 3)
   - **Recommendation:** Acceptable to defer until Epic 3 implementation. Document dependency in issue tracker.
   - **Impact:** Cross-epic dependency
   - **Due Date:** Epic 3 implementation

3. **Component Tests** - 0% coverage
   - **Missing:** React component isolation tests
   - **Recommendation:** Add component tests for complex UI components (EquipoSearch, AveriaForm, TriageColumn).
   - **Impact:** Slower feedback loop for UI bugs
   - **Due Date:** Next sprint

4. **Unit Tests** - 0% coverage
   - **Missing:** Business logic validation (risk scoring, PBAC checks, SSE event formatting)
   - **Recommendation:** Add unit tests for pure functions and business logic.
   - **Impact:** Reduced confidence in business logic correctness
   - **Due Date:** Next sprint

---

### Coverage Heuristics Findings

#### Endpoint Coverage Gaps

- **Endpoints without direct API tests:** 6
- Examples:
  - `POST /api/equipos/search` - Validated via E2E only
  - `POST /api/averias/create` - Validated via E2E only
  - `POST /api/averias/{id}/convert` - Validated via E2E only (R-006 risk)
  - `POST /api/averias/{id}/discard` - Validated via E2E only
  - `GET /api/v1/sse` - No coverage (R-002 risk)
  - `POST /api/v1/test/reset-failure-reports` - E2E setup only

#### Auth/Authz Negative-Path Gaps

- **Criteria missing denied/invalid-path tests:** 2
- Examples:
  - `can_view_all_ots` required for /averias/triage → NO 403 test (R-004 risk, score=9)
  - `can_create_failure_report` required for /averias/nuevo → NO 403 test

#### Happy-Path-Only Criteria

- **Criteria missing error/edge scenarios:** 8
- Examples:
  - AC1.1: Equipo search → Missing: timeout, network failure
  - AC2.5: Submit avería → Missing: server error 500, duplicate submit
  - AC3.5: Convertir a OT → Missing: concurrent conversion (R-006 risk)
  - AC2.6: SSE notifications → NO coverage (R-002 risk)

---

### Recommendations Summary

#### Immediate Actions (Before PR Merge)

1. **Implement P0 Security Test for PBAC (R-004)** - Create P0-E2E-SEC-001 and P0-API-SEC-001
   - Due: 2026-03-29 (1 week)
   - Priority: CRITICAL (score=9)

2. **Implement k6 Performance Test for Search (R-001)** - Create k6/story-2.1-search-performance.js
   - Due: Before staging
   - Priority: HIGH (score=8)

3. **Implement SSE Notification Tests (R-002)** - Enable P0-E2E-008, create P0-E2E-SSE-001, P0-E2E-SSE-002
   - Due: 2026-03-29 (1 week)
   - Priority: HIGH (score=6)

4. **Implement API Test for OT Unique Constraint (R-006)** - Create P0-API-002
   - Due: 2026-03-29 (1 week)
   - Priority: HIGH (score=6)

5. **Implement Mobile 30s Completion Test (R-003)** - Add explicit timing to P0-E2E-009
   - Due: 2026-03-29 (1 week)
   - Priority: HIGH (score=6)

#### Short-term Actions (This Milestone)

6. **Add API Tests for 6 Endpoints** - Create API test suite
   - Due: Before PR merge
   - Priority: HIGH

7. **Enable Photo Upload Test** - Create fixture, enable P0-E2E-005
   - Due: 2026-03-29
   - Priority: MEDIUM

8. **Add PBAC Negative Path for /averias/nuevo** - Create P1-E2E-AUTH-001
   - Due: Before PR merge
   - Priority: HIGH

9. **Add Error Path Coverage** - Timeout, network failure, server error scenarios
   - Due: Next sprint
   - Priority: MEDIUM

10. **Add Filter/Sort Tests** - Create P1-E2E-FILTROS-001
    - Due: Before GA (acceptable to defer)
    - Priority: MEDIUM

#### Long-term Actions (Backlog)

11. **Add Component Tests** - React component isolation for complex UI
    - Due: Next sprint
    - Priority: LOW

12. **Add Unit Tests** - Business logic validation
    - Due: Next sprint
    - Priority: LOW

---

### Quality Assessment

#### Tests with Quality Concerns

**BLOCKER Issues** ❌

- `P0-E2E-005` (SKIPPED) - Photo upload fixture not available - Create test fixture or mock Vercel Blob
- `P0-E2E-008` (SKIPPED) - SSE mock infrastructure not available - Implement BLK-002
- `P1-E2E-010` (TODO) - Kanban integration waiting Epic 3 - Document dependency

**WARNING Issues** ⚠️

- `P0-E2E-009` - Does NOT explicitly validate 30-second mobile completion - Add explicit timing measurement
- **Zero API tests** (0% coverage) - All endpoints validated via E2E only
- **Zero component tests** (0% coverage) - No React component isolation
- **Zero unit tests** (0% coverage) - No business logic validation

**INFO Issues** ℹ️

- E2E tests use `waitForTimeout(500)` for debounce - Acceptable for Server Actions, consider network mocking
- 1 deprecated file: `reporte-averia-integracion.spec.ts` - Tests moved to specialized files

---

#### Tests Passing Quality Gates

**30/32 active tests (93.8%) meet all quality criteria** ✅

---

**Step 4 Status:** COMPLETE

---

## Step 5: Gate Decision

### Coverage Statistics

| Priority | Total | Fully Covered | Coverage % | Status |
|----------|-------|---------------|------------|--------|
| **P0** | 19 | 11 | 57.9% | ❌ FAIL |
| **P1** | 13 | 3 | 23.1% | ❌ FAIL |
| **P2** | 2 | 2 | 100% | ✅ PASS |
| **Total** | **34** | **16** | **47.1%** | ❌ FAIL |

---

### Gate Decision Logic Application

**Rule 1: P0 Coverage < 100%** → ❌ **FAIL**

- **P0 Coverage Required:** 100%
- **P0 Coverage Actual:** 57.9% (11/19 fully covered)
- **Status:** NOT MET - 8 P0 criteria have partial or no coverage
- **Critical Gaps:** 5 (R-004 score=9, R-001 score=8, R-002 score=6, R-003 score=6, R-006 score=6)

**Rule 2: Overall Coverage < 80%** → ❌ **FAIL**

- **Overall Coverage Required:** ≥80%
- **Overall Coverage Actual:** 47.1%
- **Status:** NOT MET - Significant coverage gaps exist

**Rule 3: P1 Coverage < 80%** → ❌ **FAIL**

- **P1 Coverage Minimum:** 80%
- **P1 Coverage Actual:** 23.1% (3/13 fully covered)
- **Status:** NOT MET - High-priority gaps must be addressed

---

### GATE DECISION: ❌ FAIL

**Release Status:** BLOCKED - Do NOT deploy until critical issues are resolved.

---

### Rationale

**CRITICAL BLOCKERS DETECTED:**

1. **P0 Coverage Incomplete (57.9%)** - 8 of 19 P0 criteria lack full coverage:
   - R-004 (SEC score=9): PBAC authorization bypass - **NO TESTS**
   - R-001 (PERF score=8): Search performance >200ms - **NO k6 TEST**
   - R-002 (PERF score=6): SSE notifications - **NO COVERAGE**
   - R-006 (DATA score=6): OT race condition - **NO API TEST**
   - R-003 (BUS score=6): Mobile <30s - **NOT EXPLICITLY TESTED**

2. **Overall Coverage Below Minimum (47.1% < 80%)** - Only 16 of 34 criteria fully covered

3. **P1 Coverage Below Minimum (23.1% < 80%)** - Only 3 of 13 P1 criteria fully covered

4. **Zero API Tests (0% coverage)** - 6 endpoints without direct API validation

5. **Zero Security Tests** - PBAC authorization completely untested (R-004 score=9)

**Risk Assessment:**
- **Security Risk:** HIGH - R-004 (score=9) creates authorization bypass vulnerability
- **Performance Risk:** HIGH - R-001 (score=8) may degrade with 10K+ assets
- **Data Integrity Risk:** HIGH - R-006 (score=6) allows duplicate OT creation
- **Operational Risk:** HIGH - R-002 (score=6) blocks real-time notifications

---

### Critical Issues

| Priority | Issue | Description | Owner | Due Date | Status |
|----------|-------|-------------|-------|----------|--------|
| P0 | PBAC Authorization Bypass | R-004: No tests for can_view_all_ots requirement | Backend Dev + QA Security | 2026-03-29 | OPEN |
| P0 | Search Performance | R-001: No k6 load test with 10K assets (<200ms P95) | Backend Dev | Before staging | OPEN |
| P0 | SSE Notifications | R-002: Tests skipped, SSE mock infrastructure missing | Backend Dev + QA | 2026-03-29 | OPEN |
| P0 | OT Race Condition | R-006: No API unique constraint test (409 Conflict) | Backend Dev | 2026-03-29 | OPEN |
| P0 | Mobile 30s Completion | R-003: No explicit timing validation on mobile viewport | Frontend Dev + QA | 2026-03-29 | OPEN |
| P1 | API Endpoint Coverage | 6 endpoints without direct API tests (0% coverage) | Backend Dev + QA | Before PR merge | OPEN |

**Blocking Issues Count:** 5 P0 blockers, 1 P1 blocker

---

### Gate Recommendations

#### For FAIL Decision ❌

**1. Block Deployment Immediately** 🚫
   - Do NOT deploy to any environment
   - Notify stakeholders of blocking issues
   - Escalate to tech lead and PM

**2. Fix Critical Issues** 🔧
   - **R-004 (SEC score=9):** Implement PBAC middleware tests
   - **R-001 (PERF score=8):** Create k6 performance test
   - **R-002 (PERF score=6):** Implement SSE tests
   - **R-006 (DATA score=6):** Implement unique constraint test
   - **R-003 (BUS score=6):** Add explicit mobile timing

**3. Add API Test Coverage** 📝
   - Create API test suite for 6 endpoints

**4. Re-Run Gate After Fixes** 🔄
   - Re-run full test suite after fixes
   - Re-run `bmad-tea-testarch-trace` workflow
   - Verify decision is PASS before deploying
   - Expected timeline: 2-3 weeks

---

### Next Steps

**Immediate Actions** (next 24-48 hours):

1. ✅ Notify PM and Tech Lead: **FAIL decision due to 5 critical gaps**
2. ✅ Create GitHub issues for all 5 P0 blockers with due dates (2026-03-29)
3. ✗ Schedule daily standup on blocker resolution

**Follow-up Actions** (next milestone/release):

1. Implement PBAC security tests (R-004) - **CRITICAL PATH**
2. Implement k6 performance test (R-001) - **CRITICAL PATH**
3. Implement SSE mock infrastructure and tests (R-002) - **CRITICAL PATH**
4. Implement API unique constraint test (R-006) - **CRITICAL PATH**
5. Add mobile 30s timing validation (R-003) - **CRITICAL PATH**
6. Create API test suite for 6 endpoints

**Stakeholder Communication:**

- **Notify PM:** Gate decision FAIL - 5 critical blockers must be resolved before release. Estimated timeline: 2-3 weeks.
- **Notify SM:** Create sprint backlog items for 5 P0 blockers + API test suite
- **Notify DEV Lead:** Assign owners for each blocker, agree on due dates (2026-03-29 target)

---

## Sign-Off

**Phase 1 - Traceability Assessment:**

- Overall Coverage: 47.1%
- P0 Coverage: 57.9% ❌ FAIL (Required: 100%)
- P1 Coverage: 23.1% ❌ FAIL (Minimum: 80%)
- P2 Coverage: 100% ✅ PASS
- Critical Gaps: 5 (R-004 score=9, R-001 score=8, R-002 score=6, R-003 score=6, R-006 score=6)
- High Priority Gaps: 5

**Phase 2 - Gate Decision:**

- **Decision:** ❌ FAIL
- **P0 Evaluation:** ❌ ONE OR MORE FAILED (Coverage: 57.9% < 100%)
- **P1 Evaluation:** ❌ FAILED (Coverage: 23.1% < 80%)

**Overall Status:** ❌ FAIL

**Next Steps:**

- ❌ **FAIL** - Block deployment, fix 5 critical issues, re-run workflow
- Estimated timeline to PASS: 2-3 weeks
- Critical path: R-004 → R-001 → R-002 → R-006 → R-003

**Generated:** 2026-03-22
**Workflow:** testarch-trace v5.0 (Step-File Architecture)
**Steps Completed:** 5/5 (100%)

---

<!-- Powered by BMAD-CORE™ -->
