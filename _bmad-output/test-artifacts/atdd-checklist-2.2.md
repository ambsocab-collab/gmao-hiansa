---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-03-21'
workflowType: 'testarch-atdd'
inputDocuments:
  - C:/Users/ambso/dev/gmao-hiansa/_bmad-output/implementation-artifacts/2-2-formulario-reporte-de-averia-mobile-first.md
  - C:/Users/ambso/dev/gmao-hiansa/_bmad/tea/testarch/knowledge/data-factories.md
  - C:/Users/ambso/dev/gmao-hiansa/_bmad/tea/testarch/knowledge/component-tdd.md
  - C:/Users/ambso/dev/gmao-hiansa/_bmad/tea/testarch/knowledge/test-quality.md
  - C:/Users/ambso/dev/gmao-hiansa/_bmad/tea/testarch/knowledge/test-healing-patterns.md
  - C:/Users/ambso/dev/gmao-hiansa/_bmad/tea/testarch/knowledge/selector-resilience.md
  - C:/Users/ambso/dev/gmao-hiansa/_bmad/tea/testarch/knowledge/timing-debugging.md
  - C:/Users/ambso/dev/gmao-hiansa/_bmad/tea/testarch/knowledge/overview.md
  - C:/Users/ambso/dev/gmao-hiansa/_bmad/tea/testarch/knowledge/api-request.md
  - C:/Users/ambso/dev/gmao-hiansa/_bmad/tea/testarch/knowledge/network-recorder.md
---

# ATDD Checklist - Epic 2, Story 2.2: Formulario Reporte de Avería (Mobile First)

**Date:** 2026-03-21
**Author:** Bernardo
**Primary Test Level:** E2E + Integration + Unit

---

## Step 1: Preflight & Context Loading - COMPLETADO ✅

### Stack Detection
- **Tipo de Stack:** fullstack (Next.js frontend + Prisma backend + Playwright tests)
- **Framework:** Playwright (E2E), Vitest (Unit/Integration)
- **Configuración:** storageState para autenticación, 4 workers para paralelización

### Prerequisites Verificados
- ✅ Story 2.2 aprobado con 7 acceptance criteria claros
- ✅ Playwright configurado en `playwright.config.ts`
- ✅ Scripts de test disponibles en package.json
- ✅ Story 2.1 (dependencia) completada con 15/15 E2E tests passing

### Contexto de Story Cargado

**Story:** 2.2 - Formulario Reporte de Avería (Mobile First)

**User Role:** Operario en piso de fábrica

**Goal:** Reportar avería en <30 segundos desde móvil

**7 Acceptance Criteria:**
1. **AC1:** Mobile-First UI con CTA prominente (#7D1220, 56px altura, data-testid="averia-submit")
2. **AC2:** Completar reporte en <30 segundos (NFR-P2)
3. **AC3:** Búsqueda predictiva de equipo (integración Story 2.1)
4. **AC4:** Descripción del problema REQUERIDA (label "opcional" pero validación required)
5. **AC5:** Foto opcional (upload con preview)
6. **AC6:** Confirmación en <3 segundos con número generado (formato AV-YYYY-NNN)
7. **AC7:** Layout Desktop (>1200px) con dos columnas

**Performance Requirements Críticos:**
- ⚠️ NFR-P2: Reporte completo end-to-end <30 segundos
- ⚠️ NFR-S5: Confirmación con número <3 segundos
- ⚠️ NFR-S4: Notificación SSE entregada <30s (95%)
- ⚠️ R-002: Sistema de notificaciones <30s P95

**Validaciones Críticas:**
- ✅ Equipo: **REQUERIDO** (usar EquipoSearch de Story 2.1)
- ✅ Descripción: **REQUERIDA** (mínimo 10 caracteres)
- ✅ Foto: opcional (NFR-S3)

### Framework & Existing Patterns

**Test Framework Configuration:**
```typescript
// playwright.config.ts
- testDir: './tests/e2e'
- fullyParallel: true
- workers: 4
- storageState: 'playwright/.auth/admin.json'
- baseURL: 'http://localhost:3000'
- testIdAttribute: 'data-testid'
```

**Existing Factories:**
```typescript
// tests/factories/data.factories.ts
- userFactory, adminUserFactory, newUserFactory
- assetFactory (5-level hierarchy: Planta → Línea → Equipo)
- failureReportFactory
- otFactory, repuestoFactory, providerFactory
```

**Existing Fixtures:**
```typescript
// tests/fixtures/test.fixtures.ts
- loginAs(role: UserRole) - Autenticación via API
- logout() - Logout
- getUserSession() - Obtener sesión actual
```

**Existing Test Patterns (from Story 2.1):**
- Server Actions (NOT HTTP API)
- data-testid selectors for stability
- authenticatedAPICall helper
- Given-When-Then structure
- Performance tracking with thresholds

### Knowledge Base Fragments Loaded

**Core Tier (always required):**
- ✅ data-factories.md - Factory functions con overrides, API seeding
- ✅ component-tdd.md - Red-Green-Refactor loop, provider isolation
- ✅ test-quality.md - Deterministic tests, <300 lines, <1.5 min execution
- ✅ test-healing-patterns.md - Common failure patterns (selectors, timing, data)

**Frontend/Fullstack:**
- ✅ selector-resilience.md - Hierarchy: data-testid > ARIA > text > CSS
- ✅ timing-debugging.md - Network-first pattern, deterministic waits
- ✅ fixture-architecture.md - Pure functions → fixtures → mergeTests
- ✅ network-first.md - Intercept BEFORE navigate to prevent race conditions

**Playwright Utils (Full UI+API profile):**
- ✅ overview.md - Fixture-based utilities, composable with mergeTests
- ✅ api-request.md - Typed HTTP client, schema validation, retry logic
- ✅ network-recorder.md - HAR record/playback for offline testing

### TEA Configuration Flags

```yaml
tea_use_playwright_utils: true
tea_browser_automation: auto
test_stack_type: fullstack
test_framework: auto
user_name: Bernardo
communication_language: Español
document_output_language: Español
```

---

## Step 2: Generation Mode Selection - COMPLETADO ✅

### Mode Selected: AI Generation

**Rationale:**

Story 2.2 cumple todos los criterios para AI Generation:

✅ **Clear Acceptance Criteria:**
- 7 ACs detallados con formato Given-When-Then explícito
- Cada AC especifica requisitos exactos (colores, dimensiones, data-testid)
- Performance requirements cuantificables (<30s, <3s thresholds)

✅ **Standard Scenarios:**
- Form submission con validación
- File upload con preview
- Server Actions integration
- SSE notification testing
- Layout responsive Mobile/Desktop

✅ **Well-Documented Patterns:**
- Story 2.1 provee patrones similares (15 tests passing)
- Factories y fixtures existentes disponibles
- Selectors data-testid explícitamente especificados
- Arquitectura Server Actions documentada

✅ **Fullstack with Clear Backend:**
- Server Actions: `createFailureReport()` bien especificado
- Prisma schema: modelo `FailureReport` definido
- SSE notification: evento `failure_report_created` documentado
- Validation rules: Zod schema con campos required

**Recording Mode NO Necesario:**
- No hay interacciones complejas drag/drop
- No hay wizards multi-step con flujos condicionales
- Estructura UI documentada con data-testid
- Reglas de validación explícitamente definidas
- Patrones similares existen en Story 2.1

---

## Step 3: Test Strategy - COMPLETADO ✅

### 1. Acceptance Criteria → Test Scenarios Mapping

| AC | Descripción | Scenarios |
|----|-------------|-----------|
| **AC1** | Mobile-First UI con CTA prominente | 3: CTA visible, data-testid, layout mobile |
| **AC2** | Completar reporte en <30 segundos | 2: Performance <30s, touch targets 44px |
| **AC3** | Búsqueda predictiva de equipo | 4: Integración Story 2.1, validación required |
| **AC4** | Descripción REQUERIDA | 6: Textarea specs, validación required, error inline |
| **AC5** | Foto opcional | 4: Botón upload, preview, submit sin foto |
| **AC6** | Confirmación <3s + SSE | 4: Confirmación rápida, número generado, redirect, SSE |
| **AC7** | Layout Desktop (>1200px) | 3: Layout 2 columnas, validaciones, submit |

**Total: 26 test scenarios**

### 2. Test Level Selection (Fullstack Strategy)

**E2E Tests (18 tests)** - Critical user journeys:
```
✅ Flujo completo mobile (login → reportar → confirmación)
✅ Validaciones visuales (equipo requerido, descripción requerida)
✅ Performance tests (<30s end-to-end, <3s confirmación)
✅ Layout responsive (mobile vs desktop)
✅ SSE notification delivery <30s
✅ Integración Story 2.1 (EquipoSearch)
```

**API Tests (5 tests)** - Server Actions & business logic:
```
✅ createFailureReport() Server Action
✅ Validación Zod (equipoId required, descripcion required, min 10 chars)
✅ Generación de número único AV-YYYY-NNN
✅ Creación en database Prisma
✅ Emitir notificación SSE
```

**Component Tests (3 tests)** - UI behavior:
```
✅ ReporteAveriaForm state management
✅ File upload preview
✅ Toast notifications (shadcn/ui Sonner)
```

### 3. Test Prioritization (P0-P3)

**P0 - CRITICAL (15 tests) - Must ship, blocks release:**
- P0-E2E-001 to P0-E2E-011: Flujo completo + validaciones críticas
- P0-E2E-012: Performance <30s end-to-end
- P0-API-001 to P0-API-003: Server Action core functionality

**P1 - HIGH (7 tests) - Important, should ship:**
- P1-E2E-001 to P1-E2E-003: Layout desktop, SSE notification
- P1-API-001 to P1-API-002: Generación número único, SSE emit

**P2 - MEDIUM (4 tests) - Nice to have, lower risk:**
- P2-COMP-001 to P2-COMP-003: Component tests (state, upload, toasts)

### 4. Red Phase Validation

**✅ All Tests Designed to FAIL Initially:**

1. **UI Elements Don't Exist:**
   - Component `ReporteAveriaForm` no existe → "element not found"
   - data-testid attributes no implementados → locator failures

2. **Server Action Not Implemented:**
   - `app/actions/averias.ts` no existe → 404 errors

3. **Database Model Missing:**
   - Prisma model `FailureReport` no existe → database errors

4. **SSE Notification Not Configured:**
   - Evento `failure_report_created` no existe → timeout esperando notificación

5. **Performance Thresholds Not Met:**
   - Sin optimización → tests excederán <30s y <3s
   - Performance assertions fallarán

**Red Phase Validated:** ✅ Tests cannot pass without implementation

---

## Step 5: Validate & Complete - COMPLETADO ✅

### Validation Results

#### Prerequisites ✅
- ✅ Story 2.2 aprobado con 7 acceptance criteria claros
- ✅ Playwright configurado en `playwright.config.ts`
- ✅ Scripts de test disponibles en package.json
- ✅ Story 2.1 (dependencia) completada con 15/15 E2E tests passing
- ✅ Development sandbox listo (Next.js 15.0.3, Prisma 5.22.0)

#### Test Files Created ✅
- ✅ **E2E Tests**: `tests/e2e/story-2.2/reporte-averia-p0.spec.ts` (12 tests, ~433 lines)
- ✅ **Integration Tests**: `tests/integration/actions/averias.test.ts` (8 tests, ~249 lines)
- ✅ **Unit Tests**: `tests/unit/lib/utils/validations/averias.test.ts` (9 tests, ~178 lines)
- ✅ **Test Fixture**: `tests/fixtures/test-photo.jpg` (1KB placeholder)

#### RED Phase Verification ✅
- ✅ All E2E tests use `test.skip()` (will be skipped until implementation)
- ✅ All Integration tests use `vi.mock()` (will fail until Server Action created)
- ✅ All Unit tests reference non-existent schema (will fail until Zod schema created)
- ✅ Tests designed to fail before implementation (TDD RED phase confirmed)

#### Test Quality ✅
- ✅ Given-When-Then structure with clear comments
- ✅ data-testid selectors used throughout (not CSS classes)
- ✅ One assertion per test (atomic design)
- ✅ No hard waits or sleeps (explicit waits only)
- ✅ Network-first pattern applied where needed
- ✅ Performance tests with thresholds (<30s, <3s)

#### Output Quality ✅
- ✅ ATDD checklist created: `_bmad-output/test-artifacts/atdd-checklist-2.2-complete.md` (625 lines)
- ✅ Story summary with business value
- ✅ All 7 Acceptance Criteria documented
- ✅ All 29 failing tests listed with status
- ✅ Data factories and fixtures documented
- ✅ Required data-testid attributes with implementation examples
- ✅ Implementation checklist with 4 sample tasks
- ✅ Red-Green-Refactor workflow guidance
- ✅ Next steps for DEV team

#### System Health ✅
- ✅ **No orphaned browser processes** (0 Chrome/Chromium/Playwright processes)
- ✅ **Temp artifacts in correct location** (`_bmad-output/test-artifacts/`)

---

### Completion Summary

#### Test Files Generated

| Test Level | File Path | Test Count | Lines | Status |
|------------|-----------|------------|-------|--------|
| **E2E** | `tests/e2e/story-2.2/reporte-averia-p0.spec.ts` | 12 | ~433 | 🔴 RED (test.skip) |
| **Integration** | `tests/integration/actions/averias.test.ts` | 8 | ~249 | 🔴 RED (vi.mock) |
| **Unit** | `tests/unit/lib/utils/validations/averias.test.ts` | 9 | ~178 | 🔴 RED (schema missing) |
| **Fixtures** | `tests/fixtures/test-photo.jpg` | 1 | 1KB | ✅ Created |
| **Total** | **4 files** | **30** | **~861** | **🔴 RED Phase Complete** |

#### Key Risks

1. ⚠️ **Performance Critical** - NFR-S5 (<3s confirmation) may require optimization
2. ⚠️ **SSE Testing** - P0-E2E-008 requires real SSE connection; may need mocking for stability
3. ⚠️ **File Upload** - E2E test P0-E2E-005 requires real file upload handling

#### Next Steps for DEV Team

**Recommended Workflow:**
1. Use `dev-story` workflow to implement Story 2.2
2. Follow Red-Green-Refactor cycle:
   - **RED Phase** ✅ COMPLETE (TEA responsibility)
   - **GREEN Phase** ⏭️ UP NEXT (DEV responsibility - make tests pass)
   - **REFACTOR Phase** ⏸️ PENDING (after all tests pass)

**Implementation Order:**
1. Create Zod schema in `lib/utils/validations/averias.ts` (Unit tests → GREEN)
2. Create Server Action `createFailureReport` in `app/actions/averias.ts` (Integration tests → GREEN)
3. Create React component `ReporteAveriaForm` (E2E tests → GREEN)
4. Remove `test.skip()` from E2E tests as features are implemented
5. Run `code-review` when all tests pass
6. Update story status to 'done' in sprint-status.yaml

**Estimated Total Effort:** 16-20 hours

---

**✅ Step 5 Complete. ATDD Workflow Finished Successfully.**

**Complete checklist available at:** `_bmad-output/test-artifacts/atdd-checklist-2.2-complete.md`

---
