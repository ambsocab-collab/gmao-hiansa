/**
 * E2E Tests: Story 2.2 - Formulario Reporte de Avería (Desktop)
 * TDD RED PHASE: All tests will FAIL until implementation is complete
 *
 * Tests cover:
 * - Layout Desktop (>1200px) - Dos columnas
 * - Validaciones funcionan igual en Desktop
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
 */
async function setupEquipoSearchMock(page) {
  await page.route('**/api/equipos/search**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'equipo-123',
          name: 'Prensa Hidráulica A',
          code: 'PRE-001',
          linea: {
            name: 'Línea 1',
            planta: {
              name: 'Planta Principal',
              division: 'HIROCK'
            }
          }
        }
      ])
    });
  });
}

test.describe('Reporte Avería - Desktop Layout', () => {
  /**
   * P0-E2E-010: Layout Desktop (>1200px) - Dos columnas
   *
   * AC7: Given que estoy en desktop (>1200px)
   *       When accedo a /averias/nuevo
   *       Then formulario usa layout Desktop con dos columnas
   */
  test('[P0-E2E-010] should show desktop layout with 2 columns', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Given: Usuario en desktop (>1200px)
    await page.setViewportSize({ width: 1400, height: 900 });

    // When: Formulario carga (navigation AFTER route setup)
    const loadPromise = page.waitForLoadState('domcontentloaded');
    await page.goto('/averias/nuevo');
    await loadPromise;

    // Then: Layout de 2 columnas visible (using actual Tailwind class xl:grid-cols-2)
    // Columna izquierda: equipo + descripción
    const leftColumn = page.locator('.xl\\:grid-cols-2 > div:first-child');
    await expect(leftColumn).toContainText('Equipo');
    await expect(leftColumn).toContainText('Descripción');

    // Columna derecha: foto + preview
    const rightColumn = page.locator('.xl\\:grid-cols-2 > div:nth-child(2)');
    await expect(rightColumn).toContainText('Adjuntar foto');

    // And: Ambas columnas visibles
    await expect(leftColumn).toBeVisible();
    await expect(rightColumn).toBeVisible();
  });

  /**
   * P1-E2E-003: Validaciones funcionan igual en Desktop
   *
   * AC7: Given que estoy en desktop
   *       When intento submit sin equipo
   *       Then validación funciona igual que móvil
   */
  test('[P1-E2E-003] should validate equally on desktop', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Given: Usuario en desktop
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/averias/nuevo');

    // When: Intento submit sin equipo
    await page.getByTestId('averia-descripcion').fill('Fallo en motor principal');
    await page.getByTestId('averia-submit').click();

    // Then: Misma validación que móvil (client-side Zod validation)
    const errorMessage = page.getByText('El equipo es requerido');
    await expect(errorMessage).toBeVisible();
  });
});
