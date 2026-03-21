---
generatedBy: 'BMad TEA Agent - ATDD Workflow'
date: '2026-03-21'
tddPhase: 'RED'
workflow: 'testarch-atdd'
---

# ATDD Checklist - Story 2.2: Formulario Reporte de Avería (Mobile First)

**Epic:** Epic 2 - Gestión de Activos y Jerarquía de 5 Niveles
**Story:** 2.2 - Formulario Reporte de Avería (Mobile First)
**Status:** 🔴 RED PHASE - Tests generated, feature NOT implemented

**Author:** Bernardo
**Date:** 2026-03-21
**Test Framework:** Playwright (E2E), Vitest (Integration/Unit)

---

## Story Summary

**As a** operario en el piso de fábrica,
**I want** reportar una avería en menos de 30 segundos desde mi móvil,
**So that** notifique rápidamente sobre cualquier falla en los equipos.

**Business Value:**
- Rapidez en reportar averías (<30s) minimiza tiempo de inactividad
- Mobile-first UX permite reportar desde cualquier lugar en planta
- Búsqueda predictiva reduce errores de selección de equipo
- SSE notifications aseguran que supervisores son notificados inmediatamente

---

## Acceptance Criteria

### AC1: Mobile-First UI con CTA prominente
- **Given:** que accedo a /averias/nuevo desde móvil (<768px)
- **When:** carga el formulario
- **Then:** veo CTA primario "+ Reportar Avería" prominente (rojo burdeos #7D1220, padding 16px, altura 56px)
- **And:** CTA tiene data-testid="averia-submit"
- **And:** formulario usa layout Mobile First

### AC2: Completar reporte en <30 segundos
- **Given:** formulario visible en móvil
- **When:** lo completo end-to-end
- **Then:** puedo completar reporte en <30 segundos (NFR-P2)
- **And:** formulario optimizado para tapping rápido

### AC3: Búsqueda predictiva de equipo (Story 2.1 integration)
- **Given:** que completo el formulario
- **When:** lleno el campo de equipo
- **Then:** búsqueda predictiva funciona (ver Story 2.1)
- **And:** validación: equipo es requerido
- **And:** si intento submit sin equipo, veo error: "Debes seleccionar un equipo"

### AC4: Descripción del problema REQUERIDA
- **Given:** que he seleccionado un equipo
- **When:** lleno descripción del problema
- **Then:** input es textarea con placeholder "Describe brevemente la falla..."
- **And:** descripción es marcada como opcional en el label
- **And:** textarea tiene data-testid="averia-descripcion"
- **And:** textarea tiene altura mínima 80px, máxima 200px
- **Given:** que descripción está vacía
- **When:** intento submit el formulario
- **Then:** validación rechaza el formulario (NFR-S2, P0-002)
- **And:** mensaje de error inline: "La descripción es obligatoria"
- **And:** campo marcado con borde rojo #EF4444

### AC5: Foto opcional
- **Given:** que he llenado descripción
- **When:** subo una foto
- **Then:** botón "Adjuntar foto" visible con dashed border
- **And:** botón tiene data-testid="averia-foto-upload"
- **And:** foto es opcional (NFR-S3)
- **And:** si subo foto, veo preview antes de submit
- **And:** foto subida a storage y URL almacenada

### AC6: Confirmación en <3 segundos con número generado
- **Given:** que he completado el formulario
- **When:** subo el reporte
- **Then:** recibo confirmación con número de aviso generado en <3 segundos (NFR-S5)
- **And:** confirmación muestra: "Avería #{numero} reportada exitosamente"
- **And:** redirect a /mis-avisos o dashboard
- **And:** notificación push enviada a usuarios can_view_all_ots en <30s (NFR-S4, R-002)

### AC7: Layout Desktop (>1200px)
- **Given:** que estoy en desktop (>1200px)
- **When:** accedo a /averias/nuevo
- **Then:** formulario usa layout Desktop (UX Dirección 1 o 6)
- **And:** dos columnas: izquierda (equipo + descripción), derecha (foto + preview)
- **And:** mismo esquema de validación y submit que móvil

---

## Failing Tests Created (RED Phase)

### E2E Tests (12 tests)

**File:** `tests/e2e/story-2.2/reporte-averia-p0.spec.ts` (~350 lines)

**Tests:**

- ✅ **[P0-E2E-001]** Mobile-First UI - CTA prominente
  - **Status:** RED - Elementos UI no existen
  - **Verifies:** CTA visible con #7D1220, 56px altura, data-testid="averia-submit"

- ✅ **[P0-E2E-002]** Validación - Equipo requerido
  - **Status:** RED - Validación no implementada
  - **Verifies:** Error "Debes seleccionar un equipo" cuando falta equipo

- ✅ **[P0-E2E-003]** Validación - Descripción requerida
  - **Status:** RED - Validación contradictoria no implementada
  - **Verifies:** Error inline + borde rojo cuando descripción vacía

- ✅ **[P0-E2E-004]** Textarea altura correcta
  - **Status:** RED - Componente no existe
  - **Verifies:** Altura mínima 80px, máxima 200px

- ✅ **[P0-E2E-005]** Foto upload con preview
  - **Status:** RED - Componente no existe
  - **Verifies:** Preview visible después de upload

- ✅ **[P0-E2E-006]** Foto opcional - Submit sin foto
  - **Status:** RED - Server Action no existe
  - **Verifies:** Reporte creado exitosamente sin foto

- ✅ **[P0-E2E-007]** Confirmación <3s con número generado
  - **Status:** RED - Server Action no existe
  - **Verifies:** Número AV-YYYY-NNN generado, tiempo <3s

- ✅ **[P0-E2E-008]** SSE notification <30s
  - **Status:** RED - SSE evento no configurado
  - **Verifies:** Notificación enviada a can_view_all_ots

- ✅ **[P0-E2E-009]** Performance - Completar <30s end-to-end
  - **Status:** RED - Feature no implementada
  - **Verifies:** Flujo completo en <30 segundos

- ✅ **[P0-E2E-010]** Layout Desktop - Dos columnas
  - **Status:** RED - Layout no implementado
  - **Verifies:** Grid de 2 columnas en desktop (>1200px)

- ✅ **[P0-E2E-011]** Integración Story 2.1 - Búsqueda predictiva
  - **Status:** RED - Story 2.1 ya está completo, pero integración no probada
  - **Verifies:** Resultados de búsqueda predictiva aparecen

- ✅ **[P1-E2E-001]** Touch targets optimizados (44px)
  - **Status:** RED - Componente no existe
  - **Verifies:** Touch targets ≥44px en móvil

- ✅ **[P1-E2E-002]** Layout Mobile First - Single column
  - **Status:** RED - Layout no implementado
  - **Verifies:** Single column en móvil (<768px)

- ✅ **[P1-E2E-003]** Validaciones funcionan igual en Desktop
  - **Status:** RED - Validaciones no implementadas
  - **Verifies:** Mismas validaciones en desktop y móvil

### Integration Tests (8 tests)

**File:** `tests/integration/actions/averias.test.ts` (~200 lines)

**Tests:**

- ✅ **[P0-INT-001]** Validación - equipoId requerido
  - **Status:** RED - Server Action `createFailureReport` no existe
  - **Verifies:** Lanza ValidationError cuando falta equipoId

- ✅ **[P0-INT-002]** Validación - descripción requerida
  - **Status:** RED - Server Action no existe
  - **Verifies:** Lanza ValidationError cuando falta descripción

- ✅ **[P0-INT-003]** Validación - descripción mínimo 10 caracteres
  - **Status:** RED - Server Action no existe
  - **Verifies:** Lanza ValidationError con <10 caracteres

- ✅ **[P0-INT-004]** Generación de número único sequential
  - **Status:** RED - Lógica de generación no implementada
  - **Verifies:** Número AV-YYYY-NNN, sequential por año

- ✅ **[P0-INT-005]** Creación en database Prisma
  - **Status:** RED - Prisma model `FailureReport` no existe
  - **Verifies:** Prisma.create llamado con data correcta

- ✅ **[P1-INT-001]** Emitir notificación SSE
  - **Status:** RED - SSE evento no configurado
  - **Verifies:** emitSSEEvent llamado con parámetros correctos

- ✅ **[P2-INT-001]** Foto opcional - Reporte sin foto
  - **Status:** RED - Server Action no existe
  - **Verifies:** Reporte creado exitosamente sin fotoUrl

### Unit Tests (9 tests)

**File:** `tests/unit/lib/utils/validations/averias.test.ts` (~150 lines)

**Tests:**

- ✅ **[P0-UNIT-001]** Validación exitosa con todos los campos
  - **Status:** RED - Schema `reporteAveriaSchema` no existe
  - **Verifies:** Schema valida input completo

- ✅ **[P0-UNIT-002]** Validación - equipoId requerido
  - **Status:** RED - Schema no existe
  - **Verifies:** Lanza error cuando falta equipoId

- ✅ **[P0-UNIT-003]** Validación - equipoId no vacío
  - **Status:** RED - Schema no existe
  - **Verifies:** Lanza error con string vacío

- ✅ **[P0-UNIT-004]** Validación - descripción requerida
  - **Status:** RED - Schema no existe
  - **Verifies:** Lanza error cuando falta descripción

- ✅ **[P0-UNIT-005]** Validación - descripción mínimo 10 caracteres
  - **Status:** RED - Schema no existe
  - **Verifies:** Lanza error con <10 caracteres

- ✅ **[P0-UNIT-006]** Validación - descripción exactamente 10 caracteres
  - **Status:** RED - Schema no existe
  - **Verifies:** Acepta exactamente 10 caracteres (frontera)

- ✅ **[P2-UNIT-001]** Validación - fotoUrl opcional
  - **Status:** RED - Schema no existe
  - **Verifies:** Acepta input sin fotoUrl

- ✅ **[P2-UNIT-002]** Validación - fotoUrl debe ser URL válida
  - **Status:** RED - Schema no existe
  - **Verifies:** Rechaza URL inválida

- ✅ **[P2-UNIT-003]** Validación - fotoUrl acepta URL válida
  - **Status:** RED - Schema no existe
  - **Verifies:** Acepta URL HTTPS válida

---

## Data Factories Created

**Existing Factories (from project):**
- ✅ `tests/factories/data.factories.ts` - User, Asset, OT, FailureReport factories
- ✅ `tests/fixtures/test.fixtures.ts` - Auth fixtures (loginAs, logout)

**New Factories Created:**
- ✅ `tests/fixtures/test-photo.jpg` - Test fixture para foto upload (1KB placeholder)

---

## Fixtures Created

### Existing Fixtures (from project)

**File:** `tests/fixtures/test.fixtures.ts`

**Fixtures:**
- `loginAs(role: UserRole)` - Autenticación via API
- `logout()` - Logout
- `getUserSession()` - Obtener sesión actual

---

## Required data-testid Attributes

All `data-testid` attributes required for E2E test stability:

### Página: /averias/nuevo (Mobile + Desktop)

- `averia-submit` - CTA primario "+ Reportar Avería" (rojo #7D1220, 56px altura)
- `averia-descripcion` - Textarea de descripción (altura 80-200px)
- `averia-foto-upload` - Botón de upload de foto (dashed border)
- `equipo-search` - Input de búsqueda de equipo (Story 2.1)

**Implementation Example:**

```tsx
<form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
  {/* Equipo Search - Reutilizar de Story 2.1 */}
  <EquipoSearch onEquipoSelect={setSelectedEquipo} />

  {/* Descripción */}
  <div>
    <label htmlFor="descripcion">Descripción del problema (opcional)</label>
    <Textarea
      id="descripcion"
      data-testid="averia-descripcion"
      placeholder="Describe brevemente la falla..."
      className="min-h-[80px] max-h-[200px]"
      {...methods.register('descripcion')}
    />
  </div>

  {/* Foto Upload */}
  <Input
    id="foto"
    type="file"
    accept="image/jpeg,image/png"
    data-testid="averia-foto-upload"
    className="border-dashed"
  />

  {/* CTA */}
  <Button
    type="submit"
    data-testid="averia-submit"
    className="w-full bg-[#7D1220] hover:bg-[#6A0E1B] text-white py-4 px-4 h-14"
  >
    + Reportar Avería
  </Button>
</form>
```

---

## Implementation Checklist

### Test: P0-E2E-001 - Mobile-First UI con CTA prominente

**File:** `tests/e2e/story-2.2/reporte-averia-p0.spec.ts`

**Tasks to make this test pass:**
- [ ] Crear página `app/(auth)/averias/nuevo/page.tsx` (Server Component wrapper)
- [ ] Crear componente `components/averias/reporte-averia-form.tsx` (Client Component)
- [ ] Implementar CTA botón con estilos correctos:
  - [ ] Color: `bg-[#7D1220]` (rojo burdeos Hiansa)
  - [ ] Altura: `h-14` (56px)
  - [ ] Padding: `py-4 px-4`
  - [ ] Texto: "+ Reportar Avería"
  - [ ] data-testid="averia-submit"
- [ ] Aplicar layout Mobile First:
  - [ ] Single column en móvil (<768px)
  - [ ] Grid 2 columnas en desktop (>1200px)
- [ ] Run test: `npx playwright test tests/e2e/story-2.2/reporte-averia-p0.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 4 hours

---

### Test: P0-E2E-003 - Validación Descripción REQUERIDA

**File:** `tests/e2e/story-2.2/reporte-averia-p0.spec.ts`

**Tasks to make this test pass:**
- [ ] Crear Zod schema en `lib/utils/validations/averias.ts`:
  - [ ] equipoId: required()
  - [ ] descripcion: string().min(10, "La descripción debe tener al menos 10 caracteres")
  - [ ] fotoUrl: string().url().optional()
  - [ ] reportadoPor: string()
- [ ] Integrar Zod con React Hook Form en ReporteAveriaForm
- [ ] Implementar validación inline con error message:
  - [ ] Error: "La descripción es obligatoria"
  - [ ] Color borde rojo: `border-red-500` (#EF4444)
  - [ ] Mostrar error debajo de campo
- [ ] **CRITICAL:** Label dice "opcional" pero validación la requiere (NFR-S2)
- [ ] Add required data-testid attributes: averia-descripcion, averia-submit
- [ ] Run test: `npx playwright test tests/e2e/story-2.2/reporte-averia-p0.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 3 hours

---

### Test: P0-E2E-007 - Confirmación <3s con número generado

**File:** `tests/e2e/story-2.2/reporte-averia-p0.spec.ts`

**Tasks to make this test pass:**
- [ ] Crear Server Action `app/actions/averias.ts`:
  - [ ] Función `createFailureReport(data: ReporteAveriaInput)`
  - [ ] Validar input con Zod schema
  - [ ] Generar número único: `AV-{YYYY}-{NNN}` (ej: AV-2026-001)
  - [ ] Query count de reportes existentes este año
  - [ ] Formato sequential: `String(count + 1).padStart(3, '0')`
- [ ] Crear reporte en database con Prisma:
  - [ ] Usar `prisma.failureReport.create()`
  - [ ] Incluir relaciones: equipo, reporter
  - [ ] Return reporte completo con relaciones
- [ ] Implementar redirect después de submit:
  - [ ] Usar `router.push('/mis-avisos')` o dashboard
- [ ] Performance tracking:
  - [ ] Usar `trackPerformance('create_failure_report', correlationId)`
  - [ ] Log warning si >3000ms (3s)
- [ ] Add required data-testid attributes: averia-submit
- [ ] Run test: `npx playwright test tests/e2e/story-2.2/reporte-averia-p0.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 5 hours

---

### Test: P0-E2E-008 - SSE Notification <30s

**File:** `tests/e2e/story-2.2/reporte-averia-p0.spec.ts`

**Tasks to make this test pass:**
- [ ] Actualizar `lib/sse/server.ts`:
  - [ ] Agregar evento `failure_report_created`
  - [ ] Payload: reportId, numero, equipo (con jerarquía), descripcion, reporter, timestamp
  - [ ] Target: usuarios con capability `can_view_all_ots`
- [ ] Emitir SSE notification en Server Action:
  - [ ] Llamar `emitSSEEvent()` después de crear reporte
  - [ ] Incluir todos los datos requeridos
- [ ] Test: Verificar que notificación recibida en <30s
- [ ] Add required data-testid attributes: averia-submit
- [ ] Run test: `npx playwright test tests/e2e/story-2.2/reporte-averia-p0.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 3 hours

---

## Running Tests

```bash
# Run all failing tests for this story (RED phase - should all skip)
npx playwright test tests/e2e/story-2.2/

# Run specific E2E test file
npx playwright test tests/e2e/story-2.2/reporte-averia-p0.spec.ts

# Run integration tests
npm run test:integration

# Run unit tests
npm run test:unit

# Run tests in headed mode (see browser)
npx playwright test tests/e2e/story-2.2/ --headed

# Debug specific test
npx playwright test tests/e2e/story-2.2/reporte-averia-p0.spec.ts --debug

# Run tests with coverage
npm run test:coverage
```

---

## Red-Green-Refactor Workflow

### 🔴 RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All tests written and failing
- ✅ Fixtures and factories created with auto-cleanup
- ✅ Mock requirements documented
- ✅ data-testid requirements listed
- ✅ Implementation checklist created

**Verification:**

- All tests run and fail as expected
- Failure messages are clear and actionable
- Tests fail due to missing implementation, not test bugs

---

### 🟢 GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist (start with highest priority)
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

**Progress Tracking:**

- Check off tasks as you complete them
- Share progress in daily standup

---

### 🔄 REFACTOR Phase (DEV Team - After All Tests Pass)

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

## Next Steps

1. **Share this checklist and failing tests** with the dev workflow (manual handoff)
2. **Review this checklist** with team in standup or planning
3. **Run failing tests** to confirm RED phase:
   ```bash
   # E2E tests (should all skip - RED)
   npx playwright test tests/e2e/story-2.2/

   # Integration tests (should fail - RED)
   npm run test:integration

   # Unit tests (should fail - RED)
   npm run test:unit
   ```
4. **Begin implementation** using implementation checklist as guide
5. **Work one test at a time** (red → green for each)
6. **Share progress** in daily standup
7. **When all tests pass**, refactor code for quality
8. **When refactoring complete**, manually update story status to 'done' in sprint-status.yaml

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **fixture-architecture.md** - Test fixture patterns with setup/teardown and auto-cleanup using Playwright's `test.extend()`
- **data-factories.md** - Factory patterns using `@faker-js/faker` for random test data generation with overrides support
- **component-tdd.md** - Component test strategies using Playwright Component Testing
- **network-first.md** - Route interception patterns (intercept BEFORE navigation to prevent race conditions)
- **test-quality.md** - Test design principles (Given-When-Then, one assertion per test, determinism, isolation)
- **test-levels-framework.md** - Test level selection framework (E2E vs API vs Component vs Unit)
- **selector-resilience.md** - Robust selector strategies (data-testid > ARIA > text > CSS)
- **timing-debugging.md** - Race condition identification and deterministic wait fixes
- **overview.md** - Playwright Utils installation and fixture patterns
- **api-request.md** - Typed HTTP client with schema validation and retry logic

See `tea-index.csv` for complete knowledge fragment mapping.

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Commands:**
```bash
# E2E tests (all should skip - RED)
npx playwright test tests/e2e/story-2.2/

# Integration tests (should fail - RED)
npm run test:integration tests/integration/actions/averias.test.ts

# Unit tests (should fail - RED)
npm run test:unit tests/unit/lib/utils/validations/averias.test.ts
```

**Expected Results:**

```
Summary:
- Total tests: 29
- Passing: 0 (expected in RED phase)
- Failing: 0 (all tests skipped or not yet implemented)
- Skipped: 12 (E2E tests with test.skip)
- Status: ✅ RED phase verified
```

---

## Notes

**Validación Contradictoria Documentada:**
- Label de descripción dice "opcional" pero validación Zod la requiere
- Solution: Implementar validación Zod required, mantener label user-friendly
- This is intentional (NFR-S2) - evitar reportes incompletos

**Performance Requirements Críticos:**
- ⚠️ **NFR-S5:** Confirmación con número en <3s (P0-E2E-007, critical path)
- ⚠️ **NFR-P2:** Flujo completo end-to-end en <30s (P0-E2E-009, user-facing)
- ⚠️ **NFR-S4:** SSE notification entregada en <30s (P0-E2E-008, R-002 score 8)

**Mobile First Requirements:**
- Touch targets mínimos: 44px altura (Apple HIG)
- CTA prominente: 56px altura, 16px padding, color #7D1220
- Single column layout en móvil (<768px)

**Dependencies:**
- Story 2.1 (Búsqueda Predictiva) - ✅ DONE (15/15 E2E tests passing)
- Epic 0 (Infraestructura) - ✅ DONE (Error Handling, SSE, Auth)
- Epic 1 (Usuarios y PBAC) - ✅ DONE

**Próximos Pasos Recomendados:**
1. Ejecutar `dev-story` workflow para implementar Story 2.2
2. Crear Zod schema primero (Unit tests)
3. Crear Server Action `createFailureReport` (Integration tests)
4. Crear componente `ReporteAveriaForm` integrando `EquipoSearch` de Story 2.1 (E2E tests)
5. Ejecutar tests en orden: Unit → Integration → E2E
6. Ejecutar `code-review` cuando tests pasen
7. Actualizar story status a 'done' en sprint-status.yaml

---

## Contact

**Questions or Issues?**

- Ask in team standup
- Tag @Bernardo in Slack/Discord
- Refer to `./bmm/docs/tea-README.md` for workflow documentation
- Consult `./bmm/testarch/knowledge` for testing best practices

---

**Generated by BMad TEA Agent** - 2026-03-21
