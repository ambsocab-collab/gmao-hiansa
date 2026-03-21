/**
 * E2E Tests: Story 2.2 - Formulario Reporte de Avería (Submit y Performance)
 * TDD RED PHASE: All tests will FAIL until implementation is complete
 *
 * Tests cover:
 * - Submit exitoso sin foto
 * - Confirmación <3 segundos con número generado
 * - Performance <30s end-to-end
 * - SSE notification <30s
 *
 * Quality Fixes Applied:
 * - Network-first pattern implemented (intercept-before-navigate)
 * - Hard waits eliminated (replaced with waitForResponse)
 * - Describe blocks for organization
 * - Auth fixtures integrated (loginAs)
 */

import { test, expect } from '../../fixtures/test.fixtures';

/**
 * Helper: Network-first setup for búsqueda de equipos
 *
 * Pattern: Intercept BEFORE navigate to prevent race conditions
 * Knowledge Base: timing-debugging.md (race condition prevention)
 */
async function setupEquipoSearchMock(page) {
  await page.route('**/api/equipos/search* pq=prensa*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'equipo-123',
          name: 'Prensa Hidráulica A',
          codigo: 'PRE-001',
          linea: { id: 'linea-1', name: 'Línea 1', planta: { id: 'planta-1', name: 'Planta Principal' } }
        }
      ])
    });
  });
}

/**
 * Helper: Network-first setup para submit exitoso de avería
 */
async function setupAveriaSubmitSuccessMock(page) {
  await page.route('**/api/averias/create', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'report-123',
        numero: 'AV-2026-001',
        descripcion: 'Fallo en motor principal',
        equipoId: 'equipo-123',
        equipo: {
          id: 'equipo-123',
          name: 'Prensa Hidráulica A',
          linea: { id: 'linea-1', name: 'Línea 1', planta: { id: 'planta-1', name: 'Planta Principal' } }
        },
        reportadoPor: 'user-123',
        createdAt: new Date().toISOString()
      })
    });
  });
}

test.describe('Reporte Avería - Submit Exitoso', () => {
  /**
   * P0-E2E-006: Foto opcional - Submit funciona sin foto
   *
   * AC5: Given que completo formulario sin foto
   *       When submit
   *       Then reporte creado exitosamente
   */
  test('[P0-E2E-006] should create report without photo', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Network-first: Setup mocks BEFORE navigation
    await setupAveriaSubmitSuccessMock(page);
    await setupEquipoSearchMock(page);

    // Given: Usuario en formulario
    await page.goto('/averias/nuevo');

    // When: Completo formulario sin foto
    // Setup response promise for deterministic wait
    const searchResponse = page.waitForResponse('**/api/equipos/search*');
    const submitResponse = page.waitForResponse('**/api/averias/create');

    const equipoSearch = page.getByTestId('equipo-search');
    await equipoSearch.fill('prensa');
    await searchResponse; // ✅ Deterministic wait

    const firstResult = page.locator('[role="option"]').first();
    await firstResult.click();

    await page.getByTestId('averia-descripcion').fill('Fallo en motor principal');
    await page.getByTestId('averia-submit').click();
    await submitResponse; // ✅ Deterministic wait for submit

    // Then: Reporte creado exitosamente
    const successMessage = page.getByText(/Avería #AV-\d{4}-\d{3} reportada exitosamente/);
    await expect(successMessage).toBeVisible();

    // And: Redirect a /mis-avisos o dashboard
    await expect(page).toHaveURL(/\/mis-avisos|\/dashboard/);
  });
});

test.describe('Reporte Avería - Performance Requirements', () => {
  /**
   * P0-E2E-007: Confirmación <3 segundos con número generado
   *
   * AC6: Given que completo formulario correctamente
   *       When submit
   *       Then recibo confirmación con número AV-YYYY-NNN en <3 segundos
   */
  test('[P0-E2E-007] should show confirmation with number in <3 seconds', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Network-first: Setup mocks BEFORE navigation
    await setupAveriaSubmitSuccessMock(page);
    await setupEquipoSearchMock(page);

    // Given: Usuario en formulario
    await page.goto('/averias/nuevo');

    // When: Completo formulario y submit (measure time)
    const startTime = Date.now();

    // Deterministic waits for network calls
    const searchResponse = page.waitForResponse('**/api/equipos/search*');
    const submitResponse = page.waitForResponse('**/api/averias/create');

    const equipoSearch = page.getByTestId('equipo-search');
    await equipoSearch.fill('prensa');
    await searchResponse; // ✅ Wait for search (deterministic)

    const firstResult = page.locator('[role="option"]').first();
    await firstResult.click();

    await page.getByTestId('averia-descripcion').fill('Fallo en motor principal');
    await page.getByTestId('averia-submit').click();
    await submitResponse; // ✅ Wait for submit (deterministic)

    // Then: Confirmación con número generado
    const successMessage = page.getByText(/Avería #AV-\d{4}-\d{3} reportada exitosamente/);
    await expect(successMessage).toBeVisible();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // And: Confirmación en <3 segundos (3000ms)
    expect(duration).toBeLessThan(3000);
  });

  /**
   * P0-E2E-009: Performance - Completar reporte en <30 segundos
   *
   * AC2: Given que completo reporte end-to-end
   *       When mido tiempo
   *       Then completa en <30 segundos
   */
  test('[P0-E2E-009] should complete report in <30 seconds', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Network-first: Setup mocks BEFORE navigation
    await setupAveriaSubmitSuccessMock(page);
    await setupEquipoSearchMock(page);

    // Given: Usuario en formulario
    await page.goto('/averias/nuevo');

    const startTime = Date.now();

    // When: Completo flujo completo con deterministic waits
    const searchResponse = page.waitForResponse('**/api/equipos/search*');
    const submitResponse = page.waitForResponse('**/api/averias/create');

    // 1. Buscar equipo
    const equipoSearch = page.getByTestId('equipo-search');
    await equipoSearch.fill('prensa');
    await searchResponse; // ✅ Deterministic

    const firstResult = page.locator('[role="option"]').first();
    await firstResult.click();

    // 2. Llenar descripción
    await page.getByTestId('averia-descripcion').fill('Fallo en motor principal');

    // 3. Submit
    await page.getByTestId('averia-submit').click();
    await submitResponse; // ✅ Deterministic

    // Then: Flujo completado
    const successMessage = page.getByText(/Avería #AV-\d{4}-\d{3} reportada exitosamente/);
    await expect(successMessage).toBeVisible();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // And: Completado en <30 segundos (30000ms)
    expect(duration).toBeLessThan(30000);
  });

  /**
   * P0-E2E-008: SSE notification enviada <30s
   *
   * AC6: Given que creo reporte
   *       Then notificación SSE enviada a usuarios can_view_all_ots en <30s
   *
   * NOTE: SSE testing requires special handling. Using mock SSE endpoint approach
   * to avoid EventSource issues in browser context.
   */
  test.skip('[P0-E2E-008] should send SSE notification to supervisors', async ({ page, context, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // ⚠️ SSE test marked as skip - requires SSE mock infrastructure
    // Recommended approach: Use integration test or mock SSE endpoint

    // Network-first: Setup mocks BEFORE navigation
    await setupAveriaSubmitSuccessMock(page);
    await setupEquipoSearchMock(page);

    // Mock SSE endpoint
    await page.route('**/api/v1/sse', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: `data: {"type":"failure_report_created","data":{"id":"report-123","numero":"AV-2026-001"}}\n\n`
      });
    });

    // Given: Usuario en formulario
    await page.goto('/averias/nuevo');

    // When: Creo reporte
    const searchResponse = page.waitForResponse('**/api/equipos/search*');
    const submitResponse = page.waitForResponse('**/api/averias/create');

    const equipoSearch = page.getByTestId('equipo-search');
    await equipoSearch.fill('prensa');
    await searchResponse;

    const firstResult = page.locator('[role="option"]').first();
    await firstResult.click();

    await page.getByTestId('averia-descripcion').fill('Fallo en motor principal');

    const startTime = Date.now();
    await page.getByTestId('averia-submit').click();
    await submitResponse;

    // Then: Verificar que submit fue exitoso (SSE verification en integration test)
    const successMessage = page.getByText(/Avería #AV-\d{4}-\d{3} reportada exitosamente/);
    await expect(successMessage).toBeVisible();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // And: Submit completado en tiempo razonable (<30s)
    expect(duration).toBeLessThan(30000);

    // NOTE: Full SSE notification verification should be in integration test
    // where SSE connection can be properly mocked and verified
  });
});
