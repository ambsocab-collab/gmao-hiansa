# Plan de Remedición de Tests - Epic 2
**Fecha:** 2026-03-22
**Estado Actual:** FAIL - 47.1% coverage (requerido: ≥80%)
**Objetivo:** Alcanzar PASS - ≥80% coverage, 100% P0 coverage

---

## Resumen Ejecutivo

**Gaps Críticos Identificados:** 5 (P0)
**Gaps High Priority:** 5 (P1)
**Estimated Time to Complete:** 2-3 semanas
**Critical Path:** R-004 → R-001 → R-002 → R-006 → R-003

### Aclaración Importante: Testing Strategy del Proyecto

Según `project-context.md`, el proyecto utiliza una **estrategia de testing multicapa**:

1. ✅ **E2E Tests (Playwright)** - PRINCIPAL estrategia para user journeys
2. ✅ **Integration Tests (Vitest)** - Para Server Actions, middleware, business logic
3. ✅ **Unit Tests (Vitest)** - Para utilities y pure functions
4. ❌ **API Tests (MINIMALES)** - Solo endpoints públicos (NextAuth hace muy difícil API tests autenticados)

**Por qué NO crear API tests para endpoints autenticados:**
- NextAuth usa JWT + CSRF tokens complejos de manejar en API-only tests
- Los E2E tests manejan auth, cookies y session automáticamente
- Los Integration tests cubren Server Actions y business logic

**Estrategia de Remedición:** Usar **E2E + Integration tests**, NO API tests para endpoints autenticados.

---

## Análisis de Gaps: Reales vs. Malentendidos

### ✅ Gaps Resueltos (No requieren acción)

| Gap | Estado | Razón |
|-----|--------|-------|
| **"Zero API tests"** | ✅ Por diseño | Project-context establece API tests MINIMALES |
| **"Zero security tests"** | ✅ Parcialmente resuelto | `story-1.1-pbac-access-denial.test.ts` cubre PBAC middleware |
| **"Photo fixture not available"** | ✅ Existe | `tests/fixtures/test-photo.jpg` existe |

### ❌ Gaps Reales (Requieren acción)

| ID | Prioridad | Score | Gap | Acción Requerida |
|----|-----------|-------|-----|------------------|
| **R-004** | P0 | 9 (SEC) | PBAC authorization para Epic 2 endpoints | E2E tests: 403 scenarios |
| **R-001** | P0 | 8 (PERF) | Search performance >200ms | k6 load test con 10K assets |
| **R-002** | P0 | 6 (PERF) | SSE notifications Epic 2 | E2E test específico |
| **R-006** | P0 | 6 (DATA) | OT race condition | E2E test: conversión concurrente |
| **R-003** | P0 | 6 (BUS) | Mobile <30s completion | Timing explícito en E2E |
| **P0-E2E-005** | P0 | - | Photo upload test | Habilitar test (fixture existe) |
| **AC2.7** | P1 | - | Filtros y ordenamiento | E2E test nuevo |
| **P1-E2E-010** | P1 | - | Kanban integration | TODO aceptable (Epic 3) |

---

## Plan Detallado de Acción

### FASE 1: Gaps Críticos P0 (Semana 1-2)

#### 1. R-004 (SEC score=9): PBAC Authorization para Epic 2

**Problema:** No hay tests que verifiquen que usuarios sin capabilities requeridas reciban 403.

**Archivos a Crear:**
- `tests/e2e/story-2.1/pbac-security-epic-2.spec.ts`

**Tests a Implementar:**

```typescript
/**
 * P0-E2E-SEC-001: /averias/triage sin can_view_all_ots → 403
 * P0-E2E-SEC-002: /averias/nuevo sin can_create_failure_report → 403
 * P0-E2E-SEC-003: Convertir a OT sin can_view_all_ots → 403
 * P0-E2E-SEC-004: Descartar aviso sin can_view_all_ots → 403
 */

test.describe('Epic 2: PBAC Security', () => {
  test('[P0-E2E-SEC-001] should deny triage access without can_view_all_ots', async ({ page }) => {
    // Given: Usuario autenticado SIN capability
    await loginAs('operario'); // Solo tiene can_create_failure_report

    // When: Intenta acceder a /averias/triage
    await page.goto('/averias/triage');

    // Then: Redirigido o 403
    await expect(page).toHaveURL(/\/(dashboard|avers\/nuevo)/);
  });

  test('[P0-E2E-SEC-002] should deny report creation without can_create_failure_report', async ({ page }) => {
    // Given: Usuario sin capability
    await page.goto('/login');
    await loginAs('usuario-minimo'); // Sin capabilities de averías

    // When: Intenta acceder a /averias/nuevo
    await page.goto('/averias/nuevo');

    // Then: Redirigido o muestra error
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // ... más tests
});
```

**Estimated Time:** 4-6 horas
**Dependencies:** Ninguna
**Owner:** Backend Dev + QA
**Due Date:** 2026-03-29

---

#### 2. R-001 (PERF score=8): Search Performance <200ms

**Problema:** No hay k6 load test para validar P95 <200ms con 10K assets.

**Archivos a Crear:**
- `tests/performance/baseline/story-2.1-search-load-test.js`

**Script k6:**

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up
    { duration: '1m', target: 50 },     // Sustained load
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<200'], // P95 <200ms
    'errors': ['rate<0.05'],            // Error rate <5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Login first (use admin credentials)
  const loginPayload = JSON.stringify({
    email: 'admin@gmao-hiansa.com',
    password: 'admin123',
  });

  const loginRes = http.post(`${BASE_URL}/api/auth/callback/credentials`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  errorRate.add(loginRes.status !== 200);

  // Extract session cookie
  const sessionCookie = loginRes.cookies.find(c => c.name === 'next-auth.session-token');

  // Search for assets
  const searchTerm = 'pren'; // Partial match
  const searchRes = http.get(
    `${BASE_URL}/api/equipos/search?q=${searchTerm}`,
    {
      cookies: { ...loginRes.cookies },
      headers: { 'Accept': 'application/json' },
    }
  );

  const success = check(searchRes, {
    'status is 200': (r) => r.status === 200,
    'response time <200ms p95': (r) => r.timings.duration < 200,
    'has results': (r) => JSON.parse(r.body).length > 0,
  });

  errorRate.add(!success);

  sleep(1);
}
```

**Estimated Time:** 3-4 horas
**Dependencies:** 10K assets en DB (usar script de seed existente)
**Owner:** Backend Dev
**Due Date:** Before staging deployment

---

#### 3. R-002 (PERF score=6): SSE Notifications para Epic 2

**Problema:** Test P0-E2E-008 está skippeado. No hay E2E test que verifique SSE notifications.

**Aclaración:** Los tests de Story 0.4 (`story-0.4-sse-infrastructure.test.ts`) prueban la infraestructura SSE, pero NO prueban los casos de uso específicos de Epic 2.

**Archivos a Crear:**
- `tests/e2e/story-2.2/sse-notifications.spec.ts`

**Tests a Implementar:**

```typescript
/**
 * P0-E2E-SSE-001: Supervisor recibe notification cuando se crea avería
 * P0-E2E-SSE-002: Técnico recibe notification cuando se asigna a OT
 */

test.describe('Epic 2: SSE Notifications', () => {
  test('[P0-E2E-SSE-001] supervisor receives notification when failure report created', async ({ page, browser }) => {
    // Given: Dos contextos - operario y supervisor
    const operarioContext = await browser.newContext({ storageState: 'playwright/.auth/operario.json' });
    const supervisorContext = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });

    const operarioPage = await operarioContext.newPage();
    const supervisorPage = await supervisorContext.newPage();

    // When: Supervisor conectado a SSE
    await supervisorPage.goto('/dashboard');
    await supervisorPage.evaluate(() => {
      window.sseEvents = [];
      window.eventSource = new EventSource('/api/v1/sse?channel=work-orders');

      window.eventSource.addEventListener('failure-report-created', (e) => {
        window.sseEvents.push({ type: 'failure-report-created', data: JSON.parse(e.data) });
      });
    });

    // And: Operario crea avería
    await operarioPage.goto('/averias/nuevo');
    await operarioPage.getByTestId('equipo-search').fill('prensa');
    await operarioPage.click('text=Prensa Industrial');
    await operarioPage.getByTestId('averia-descripcion').fill('Fallo en motor');
    await operarioPage.getByTestId('averia-submit').click();
    await operarioPage.waitForURL('/mis-avisos');

    // Then: Supervisor recibe notification en <30s
    const startTime = Date.now();
    await supervisorPage.waitForFunction(
      () => window.sseEvents.some(e => e.type === 'failure-report-created'),
      { timeout: 30000 }
    );
    const endTime = Date.now();

    const duration = endTime - startTime;
    expect(duration).toBeLessThan(30000); // <30s

    // And: Event data contiene avería creada
    const eventData = await supervisorPage.evaluate(() => window.sseEvents[0].data);
    expect(eventData).toHaveProperty('numero');
    expect(eventData).toHaveProperty('equipoNombre', 'Prensa Industrial');

    // Cleanup
    await supervisorPage.evaluate(() => window.eventSource?.close());
    await operarioContext.close();
    await supervisorContext.close();
  });

  // P0-E2E-SSE-002 para técnico asignado a OT
});
```

**Estimated Time:** 6-8 horas
**Dependencies:** Ninguna (SSE infraestructura ya está testeada en Story 0.4)
**Owner:** Backend Dev + QA
**Due Date:** 2026-03-29

---

#### 4. R-006 (DATA score=6): OT Race Condition

**Problema:** No hay test que verifique unique constraint cuando dos supervisores convierten la misma avería simultáneamente.

**Archivos a Crear:**
- `tests/e2e/story-2.3/race-condition-ot-creation.spec.ts`

**Tests a Implementar:**

```typescript
/**
 * P0-E2E-RACE-001: Concurrent conversion - only 1 OT created
 */

test.describe('Epic 2: OT Race Condition', () => {
  test('[P0-E2E-RACE-001] should prevent duplicate OT creation on concurrent conversion', async ({ browser, request }) => {
    // Given: Dos supervisores conectados simultáneamente
    const supervisor1Context = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
    const supervisor2Context = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });

    const page1 = await supervisor1Context.newPage();
    const page2 = await supervisor2Context.newPage();

    // And: Avería existente
    await page1.goto('/averias/triage');
    await page2.goto('/averias/triage');

    // When: Ambos supervisores abren la misma avería
    const cards = page1.locator('[data-testid^="failure-report-card-"]').first();
    const cardText = await cards.textContent();
    const averiaId = cardText?.match(/AV-\d{4}-\d{3}/)?.[0];

    await cards.click();
    await page2.locator(`[data-testid="failure-report-card-${averiaId}"]`).click();

    // And: Ambos clickan "Convertir a OT" simultáneamente
    const promise1 = page1.getByTestId('convertir-a-ot-btn').click();
    const promise2 = page2.getByTestId('convertir-a-ot-btn').click();

    await Promise.all([promise1, promise2]);

    // Then: Solo una OT creada
    await page1.waitForTimeout(2000); // Wait for both requests to complete

    // Verificar en DB via API call
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    const response = await request.get(`${baseURL}/api/v1/work-orders?failureReportId=${averiaId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();

    // CRITICAL: Solo 1 OT debe existir
    expect(body.workOrders.length).toBe(1);

    // And: Uno de los supervisores ve mensaje de error
    const toast1 = page1.getByText(/ya fue convertida|ya existe OT/i);
    const toast2 = page2.getByText(/ya fue convertida|ya existe OT/i);

    const toastVisible = await toast1.isVisible().catch(() => false) ||
                         await toast2.isVisible().catch(() => false);

    expect(toastVisible).toBeTruthy();

    // Cleanup
    await supervisor1Context.close();
    await supervisor2Context.close();
  });
});
```

**Estimated Time:** 4-6 horas
**Dependencies:** Ninguna
**Owner:** Backend Dev + QA
**Due Date:** 2026-03-29

---

#### 5. R-003 (BUS score=6): Mobile <30s Completion

**Problema:** P0-E2E-009 existe pero NO valida explícitamente el tiempo de 30 segundos en mobile.

**Archivos a Modificar:**
- `tests/e2e/story-2.2/reporte-averia-submit-performance.spec.ts`

**Cambio Requerido:**

```typescript
test('[P0-E2E-009] should complete entire report flow in <30s on mobile', async ({ page, loginAs }) => {
  // Given: Usuario en móvil (<768px)
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  await loginAs('operario');
  await page.goto('/averias/nuevo');

  // When: Completa formulario completo
  const startTime = Date.now();

  // Seleccionar equipo
  await page.getByTestId('equipo-search').fill('pren');
  await page.waitForSelector('[data-testid="equipo-search-results"]');
  await page.click('text=Prensa Industrial');

  // Llenar descripción
  await page.getByTestId('averia-descripcion').fill('Fallo en motor principal');

  // Submit
  await page.getByTestId('averia-submit').click();

  // Then: Completado en <30s
  await expect(page.getByText(/AV-\d{4}-\d{3}/)).toBeVisible({ timeout: 30000 });

  const endTime = Date.now();
  const duration = endTime - startTime;

  // CRITICAL: Validación explícita de <30s
  expect(duration).toBeLessThan(30000);

  console.log(`✅ Reporte completado en ${duration}ms (${(duration/1000).toFixed(1)}s)`);
});
```

**Estimated Time:** 1-2 horas
**Dependencies:** Ninguna
**Owner:** Frontend Dev + QA
**Due Date:** 2026-03-29

---

#### 6. P0-E2E-005: Photo Upload Test

**Problema:** Test está skippeado pero el fixture `tests/fixtures/test-photo.jpg` YA EXISTE.

**Archivos a Modificar:**
- `tests/e2e/story-2.2/reporte-averia-validaciones.spec.ts`

**Acción:** Remover `test.skip` y verificar que el test funcione.

**Estimated Time:** 1 hora
**Dependencies:** Ninguna
**Owner:** QA
**Due Date:** 2026-03-29

---

### FASE 2: Gaps High Priority P1 (Semana 2-3)

#### 7. AC2.7: Filtros y Ordenamiento

**Problema:** No hay tests para filtrar y ordenar avisos en triage.

**Archivos a Crear:**
- `tests/e2e/story-2.3/filtros-ordenamiento.spec.ts`

**Tests a Implementar:**

```typescript
/**
 * P1-E2E-FILTROS-001: Filtrar avisos por fecha, reporter, equipo
 * P1-E2E-FILTROS-002: Ordenar por fecha (más reciente primero)
 */

test.describe('Epic 2: Filtros y Ordenamiento', () => {
  test('[P1-E2E-FILTROS-001] should filter avisos by equipo', async ({ page, loginAs }) => {
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // Given: Múltiples avisos visibles
    const initialCount = await page.locator('[data-testid^="failure-report-card-"]').count();

    // When: Filtro por equipo "Prensa"
    await page.getByTestId('filter-equipo-select').selectOption('Prensa');

    // Then: Solo avisos de Prensa visibles
    const filteredCards = page.locator('[data-testid^="failure-report-card-"]');
    const count = await filteredCards.count();

    for (let i = 0; i < count; i++) {
      const cardText = await filteredCards.nth(i).textContent();
      expect(cardText).toContain('Prensa');
    }
  });

  test('[P1-E2E-FILTROS-002] should sort avisos by fecha (most recent first)', async ({ page, loginAs }) => {
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // When: Ordeno por fecha
    await page.getByTestId('sort-select').selectOption('fecha-desc');

    // Then: Primer tarjeta tiene fecha más reciente
    const firstCardTime = await page.locator('[data-testid^="failure-report-card-"]').first()
      ..getByTestId('report-timestamp').textContent();

    const secondCardTime = await page.locator('[data-testid^="failure-report-card-"]').nth(1)
      . getByTestId('report-timestamp').textContent();

    expect(new Date(firstCardTime!).getTime()).toBeGreaterThan(new Date(secondCardTime!).getTime());
  });

  // More filter tests: reporter, fecha range, multiple filters
});
```

**Estimated Time:** 4-6 horas
**Dependencies:** UI de filtros debe estar implementada
**Owner:** Frontend Dev + QA
**Due Date:** Before GA (acceptable to defer)

---

### FASE 3: Gaps Acceptable to Defer

#### 8. P1-E2E-010: Kanban Integration

**Estado:** TODO válido - depende de Epic 3.

**Acción:** Documentar dependencia en issue tracker. NO implementar hasta Epic 3.

**Estimated Time:** 0 (deferred)
**Dependencies:** Epic 3 implementation
**Due Date:** Epic 3

---

## Resumen de Tiempos y Dependencies

### Critical Path (P0 - MUST COMPLETE)

| Task | Time | Dependencies | Due Date |
|------|------|--------------|----------|
| R-004 PBAC Security | 4-6h | None | 2026-03-29 |
| R-001 k6 Search Performance | 3-4h | 10K assets | Before staging |
| R-002 SSE Notifications | 6-8h | None | 2026-03-29 |
| R-006 OT Race Condition | 4-6h | None | 2026-03-29 |
| R-003 Mobile 30s | 1-2h | None | 2026-03-29 |
| P0-E2E-005 Photo Upload | 1h | None | 2026-03-29 |

**Total P0:** 19-33 horas (~2.5-4 días)

### High Priority (P1 - SHOULD COMPLETE)

| Task | Time | Dependencies | Due Date |
|------|------|--------------|----------|
| AC2.7 Filtros y Ordenamiento | 4-6h | UI implementation | Before GA |

**Total P1:** 4-6 horas (~1 día)

### Acceptable to Defer

| Task | Time | Dependencies | Due Date |
|------|------|--------------|----------|
| P1-E2E-010 Kanban Integration | - | Epic 3 | Epic 3 |

**Total Estimated Time:** 23-39 horas (~3-5 días de trabajo)

---

## Checklist de Implementación

### Week 1: P0 Critical Gaps

- [ ] **R-004 PBAC Security** (4-6h)
  - [ ] Create `tests/e2e/epic-2-pbac-security.spec.ts`
  - [ ] Implement 4 tests: triage, nuevo, convertir, descartar
  - [ ] Verify all 403 scenarios work
  - [ ] Run tests: `npm run test:e2e -- epic-2-pbac-security`

- [ ] **R-001 k6 Search Performance** (3-4h)
  - [ ] Create `tests/performance/baseline/story-2.1-search-load-test.js`
  - [ ] Verify 10K assets exist in DB (run seed if needed)
  - [ ] Run k6 test: `npm run test:perf:asset-search`
  - [ ] Verify P95 <200ms threshold passes

- [ ] **P0-E2E-005 Photo Upload** (1h)
  - [ ] Remove `test.skip` from `reporte-averia-validaciones.spec.ts:158`
  - [ ] Run test: `npm run test:e2e -- reporte-averia-validaciones`
  - [ ] Fix any issues with photo upload

### Week 2: P0 Critical Gaps (Continued)

- [ ] **R-002 SSE Notifications** (6-8h)
  - [ ] Create `tests/e2e/story-2.2/sse-notifications.spec.ts`
  - [ ] Implement 2 tests: supervisor notification, technician notification
  - [ ] Run tests: `npm run test:e2e -- story-2.2/sse-notifications`
  - [ ] Verify <30s notification delivery

- [ ] **R-006 OT Race Condition** (4-6h)
  - [ ] Create `tests/e2e/story-2.3/race-condition-ot-creation.spec.ts`
  - [ ] Implement concurrent conversion test
  - [ ] Run test: `npm run test:e2e -- race-condition-ot-creation`
  - [ ] Verify unique constraint prevents duplicate OTs

- [ ] **R-003 Mobile 30s** (1-2h)
  - [ ] Modify `reporte-averia-submit-performance.spec.ts`
  - [ ] Add explicit <30s timing assertion
  - [ ] Add mobile viewport setup
  - [ ] Run test: `npm run test:e2e -- reporte-averia-submit-performance`

### Week 3: P1 High Priority

- [ ] **AC2.7 Filtros y Ordenamiento** (4-6h)
  - [ ] Create `tests/e2e/story-2.3/filtros-ordenamiento.spec.ts`
  - [ ] Implement 2+ tests: filter by equipo, sort by fecha
  - [ ] Run tests: `npm run test:e2e -- filtros-ordenamiento`

---

## Plan de Ejecución

### Día 1-2: R-004 + P0-E2E-005
- Mañana: R-004 PBAC Security tests
- Tarde: Habilitar photo upload test

### Día 3: R-001 k6 Performance
- Crear script k6
- Ejecutar load test
- Validar threshold <200ms

### Día 4-5: R-002 SSE Notifications
- Implementar test de supervisor notification
- Implementar test de technician notification
- Validar <30s delivery

### Día 6-7: R-006 Race Condition
- Implementar test de conversión concurrente
- Verificar unique constraint
- Validar prevención de duplicates

### Día 8: R-003 Mobile 30s
- Agregar timing assertion explícito
- Validar en mobile viewport

### Día 9-10: AC2.7 Filtros
- Implementar tests de filtros
- Implementar tests de ordenamiento

### Día 11-12: Re-Run Traceability Workflow
- Ejecutar `bmad-tea-testarch-trace` workflow
- Validar que todos los gaps estén resueltos
- Verificar que gate decision cambie a PASS

---

## Métricas de Éxito

### Before (Estado Actual):
- P0 Coverage: 57.9% (11/19)
- P1 Coverage: 23.1% (3/13)
- Overall Coverage: 47.1% (16/34)
- Gate Decision: ❌ FAIL
- Critical Blockers: 5

### After (Objetivo):
- P0 Coverage: 100% (19/19) ✅
- P1 Coverage: ≥80% (≥10/13) ✅
- Overall Coverage: ≥80% (≥27/34) ✅
- Gate Decision: ✅ PASS
- Critical Blockers: 0

---

## Communication Plan

### Immediate Actions (Next 24h):
1. ✅ Share this plan with PM and Tech Lead
2. ✅ Create GitHub issues for all 5 P0 blockers
3. ✅ Schedule daily standup on blocker resolution

### Stakeholder Updates:
- **PM:** Gate decision FAIL - 5 critical blockers must be resolved. ETA: 2-3 weeks.
- **Tech Lead:** Assign owners for each blocker. Critical path: R-004 → R-001 → R-002 → R-006 → R-003.
- **Team:** Daily progress updates on blocker resolution.

---

## Appendix: Aclaraciones sobre Testing Strategy

### Por qué NO API Tests para Epic 2 Endpoints?

**Reason 1: NextAuth Complexity**
```typescript
// Required flow for authenticated API calls (complex and error-prone):
// 1. GET /api/auth/csrf → Get CSRF token
// 2. POST /api/auth/callback/credentials → Login with CSRF + credentials
// 3. Extract cookies from response headers
// 4. Pass cookies to subsequent API requests
// This is brittle compared to E2E tests that handle auth automatically
```

**Reason 2: E2E Tests Cover Authenticated Endpoints Better**
```typescript
// E2E tests naturally handle:
// - Login flow (credentials form)
// - Session management (cookies)
// - CSRF tokens (automatic)
// - UI interaction (complete user journey)

// Example: Testing POST /api/averias/create
test('should create failure report', async ({ page }) => {
  await page.goto('/averias/nuevo');
  await page.getByTestId('equipo-search').fill('prensa');
  await page.click('text=Prensa Industrial');
  await page.getByTestId('averia-descripcion').fill('Fallo');
  await page.getByTestId('averia-submit').click();

  // This tests the endpoint, auth, AND UI integration
  await expect(page.getByText(/AV-\d{4}-\d{3}/)).toBeVisible();
});
```

**Reason 3: Integration Tests Cover Business Logic**
```typescript
// Integration tests (Vitest) test Server Actions directly:
import { createFailureReport } from '@/app/actions/failure-reports'

test('should create failure report with valid data', async () => {
  const result = await createFailureReport({
    equipoId: 'eq-123',
    descripcion: 'Fallo en motor',
  })

  expect(result.success).toBe(true)
  expect(result.data?.numero).toMatch(/^AV-\d{4}-\d{3}$/)
})
```

**Conclusion:** E2E + Integration tests provide better coverage for authenticated endpoints than API tests would.

---

**Generated:** 2026-03-22
**Author:** Dev Agent (Amelia) 💻
**Workflow:** Test Remediation Plan v1.0
**Status:** READY FOR IMPLEMENTATION

<!-- Powered by BMAD-CORE™ -->
