/**
 * E2E Tests: Story 2.3 - AC1: Columna "Por Revisar"
 *
 * Tests cover:
 * - AC1: Columna "Por Revisar" con avisos nuevos (color coding)
 *
 * Storage State: Uses admin auth from playwright.config.ts
 * Auth Fixture: loginAs (no-op, runs as admin with can_view_all_ots)
 */

import { test, expect } from '../../fixtures/test.fixtures';

// NOTA: Tests usan storageState global (playwright/.auth/admin.json)
// loginAs fixture es no-op por ahora - todos corren como admin

/**
 * Reset failure reports before each test to ensure test independence
 */
test.beforeEach(async ({ request }) => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  const response = await request.post(`${baseURL}/api/v1/test/reset-failure-reports`);

  if (!response.ok()) {
    const error = await response.text();
    throw new Error(`Failed to reset failure reports: ${error}`);
  }

  console.log('✅ Database reset: Failure reports restored to initial state');
});

test.describe('Triage de Averías - AC1: Columna Por Revisar', () => {
  /**
   * P0-E2E-001: Columna "Por Revisar" visible con tarjetas
   *
   * AC1: Given supervisor con can_view_all_ots
   *       When accede a /averias/triage
   *       Then ve columna "Por Revisar" con todos los avisos nuevos
   *       And cada aviso mostrado como tarjeta con: número, equipo, descripción, reportado por, fecha/hora
   *       And columna tiene data-testid="averias-triage"
   */
  test('[P0-E2E-001] should show por revisar column with failure report cards', async ({ page, loginAs }) => {
    // Given: Supervisor autenticado con can_view_all_ots
    await loginAs('supervisor');

    // When: Accede a /averias/triage
    await page.goto('/averias/triage');

    // Then: Columna "Por Revisar" visible
    const triageColumn = page.getByTestId('averias-triage');
    await expect(triageColumn).toBeVisible();

    // And: Header de columna visible
    await expect(page.getByText('Por Revisar')).toBeVisible();

    // And: Tarjetas de avería visibles (si hay datos seedeados)
    const cards = page.locator('[data-testid^="failure-report-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0); // Asumimos al menos 1 aviso en seed

    // And: Primera tarjeta tiene datos correctos
    const firstCard = cards.first();
    await expect(firstCard.getByTestId(/numero/i)).toBeVisible();
    await expect(firstCard.getByTestId(/equipo/i)).toBeVisible();
    await expect(firstCard.getByTestId(/descripcion/i)).toBeVisible();
    await expect(firstCard.getByTestId(/reporter/i)).toBeVisible();
    await expect(firstCard.getByTestId(/fecha/i)).toBeVisible();
  });

  /**
   * P1-E2E-002: Color coding correcto (rosa para avería, blanco para reparación)
   *
   * AC1: Given tarjetas visibles
   *       Then tarjetas de avería tienen color rosa #FFC0CB
   *       And tarjetas de reparación tienen color blanco #FFFFFF
   */
  test('[P1-E2E-002] should have correct color coding for averia vs reparacion', async ({ page, loginAs }) => {
    // Given: Supervisor autenticado
    await loginAs('supervisor');

    // And: En página de triage
    await page.goto('/averias/triage');

    // When: Obtengo todas las tarjetas
    const cards = page.locator('[data-testid^="failure-report-card-"]');
    const count = await cards.count();

    // Then: Verifico que hay tarjetas
    expect(count).toBeGreaterThan(0);

    // When: Busco una tarjeta de avería (rosa #FFC0CB)
    let averiaFound = false;
    let reparacionFound = false;

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const backgroundColor = await card.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // rgb(255, 192, 203) = #FFC0CB (avería)
      if (backgroundColor === 'rgb(255, 192, 203)') {
        averiaFound = true;
      }

      // rgb(255, 255, 255) = #FFFFFF (reparación)
      if (backgroundColor === 'rgb(255, 255, 255)') {
        reparacionFound = true;
      }
    }

    // Then: Verifico que hay al menos una tarjeta de avería
    expect(averiaFound).toBe(true);

    // And: Verifico que hay al menos una tarjeta de reparación
    expect(reparacionFound).toBe(true);
  });

  /**
   * P2-E2E-003: Datos de tarjeta correctos
   *
   * AC1: Given tarjeta visible
   *       Then muestra: número (ej: AV-2026-001), equipo, descripción truncada, reporter, fecha/hora
   */
  test('[P2-E2E-003] should display correct card data', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // When: Veo primera tarjeta
    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();

    // Then: Todos los campos visibles
    await expect(firstCard.getByText(/AV-\d{4}-\d{3}/)).toBeVisible(); // Número
    await expect(firstCard.locator('[data-testid="equipo"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="descripcion"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="reporter"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="fecha"]')).toBeVisible();
  });

  /**
   * P2-E2E-004: Count badge en columna
   *
   * AC5: Given múltiples avisos en triage
   *       Then veo indicador de count: "Por Revisar (3)"
   */
  test('[P2-E2E-004] should show count badge in column header', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // Then: Count badge visible
    const countBadge = page.getByText(/Por Revisar \(\d+\)/);
    await expect(countBadge).toBeVisible();
  });
});
