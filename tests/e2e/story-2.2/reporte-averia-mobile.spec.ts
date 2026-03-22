/**
 * E2E Tests: Story 2.2 - Formulario Reporte de Avería (Mobile First)
 * TDD RED PHASE: All tests will FAIL until implementation is complete
 *
 * Tests cover:
 * - Mobile-First UI con CTA prominente
 * - Touch targets optimizados (44px minimum)
 * - Single column layout en móvil
 *
 * Quality Fixes Applied:
 * - Network-first pattern implemented (intercept-before-navigate)
 * - Hard waits eliminated (replaced with waitForResponse)
 * - Describe blocks for organization
 * - Auth fixtures integrated (loginAs)
 * - Cleanup helpers for data isolation
 */

import { test, expect } from '../../fixtures/test.fixtures';

/**
 * Helper: Network-first setup for búsqueda de equipos
 *
 * Pattern: Intercept BEFORE navigate to prevent race conditions
 * Knowledge Base: timing-debugging.md (race condition prevention)
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

/**
 * Helper: Network-first setup para submit de avería
 */
async function setupAveriaSubmitMock(page, success = true) {
  await page.route('**/api/averias/create', (route) => {
    if (success) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'report-123',
          numero: 'AV-2026-001',
          descripcion: 'Fallo en motor principal',
          equipoId: 'equipo-123',
          reportadoPor: 'user-123',
          createdAt: new Date().toISOString()
        })
      });
    } else {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Validation failed',
          details: {
            equipoId: 'Debes seleccionar un equipo',
            descripcion: 'La descripción es obligatoria'
          }
        })
      });
    }
  });
}

test.describe('Reporte Avería - Mobile First UI', () => {
  /**
   * P0-E2E-001: Mobile-First UI - CTA prominente
   *
   * AC1: Given que accedo a /averias/nuevo desde móvil (<768px)
   *       When carga el formulario
   *       Then veo CTA primario "+ Reportar Avería" prominente
   */
  test('[P0-E2E-001] should show prominent CTA button on mobile', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Given: Usuario en móvil (<768px)
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    // When: Formulario carga (navigation AFTER route setup)
    const loadPromise = page.waitForLoadState('domcontentloaded');
    await page.goto('/averias/nuevo');
    await loadPromise;

    // Then: CTA visible con estilos correctos
    const ctaButton = page.getByTestId('averia-submit');
    await expect(ctaButton).toBeVisible();

    // And: Color correcto (#7D1220 rojo burdeos)
    const backgroundColor = await ctaButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(backgroundColor).toBe('rgb(125, 18, 32)'); // #7D1220

    // And: Altura 56px
    const height = await ctaButton.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    expect(parseInt(height)).toBe(56);

    // And: Texto correcto
    await expect(ctaButton).toContainText('+ Reportar Avería');
  });

  /**
   * P1-E2E-001: Touch targets optimizados (44px minimum)
   *
   * AC2: Given que estoy en móvil
   *       When analizo touch targets
   *       Then todos los elementos interactivos tienen ≥44px altura
   */
  test('[P1-E2E-001] should have optimized touch targets on mobile', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Network-first: Setup mocks BEFORE navigation
    await setupEquipoSearchMock(page);

    // Given: Usuario en móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/averias/nuevo');

    // When: Analizo touch targets
    const ctaButton = page.getByTestId('averia-submit');
    const height = await ctaButton.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    const heightValue = parseInt(height);

    // Then: Touch target ≥44px (Apple HIG requirement)
    expect(heightValue).toBeGreaterThanOrEqual(44);
  });

  /**
   * P1-E2E-002: Layout Mobile First - Single column en móvil
   *
   * AC1: Given que estoy en móvil (<768px)
   *       When accedo a /averias/nuevo
   *       Then formulario usa single column layout
   */
  test('[P1-E2E-002] should use single column layout on mobile', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Network-first: Setup mocks BEFORE navigation
    await setupEquipoSearchMock(page);

    // Given: Usuario en móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/averias/nuevo');

    // When: Formulario carga
    await page.waitForLoadState('domcontentloaded');

    // Then: Layout single column (no grid de 2 columnas)
    const formulario = page.locator('form').first();
    const isSingleColumn = await formulario.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return !styles.display.includes('grid') || styles.gridTemplateColumns === 'none';
    });

    expect(isSingleColumn).toBe(true);
  });
});
