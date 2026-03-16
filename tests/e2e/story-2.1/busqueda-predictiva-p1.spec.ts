/**
 * P1 Tests: Búsqueda Predictiva de Equipos - Additional Coverage
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * TDD RED PHASE: These tests are INTENTIONALLY FAILING
 * Tests will be enabled (test.skip removed) after implementation is complete
 *
 * Test Coverage: P1-E2E-001 through P1-E2E-007
 *
 * Priority: High - Important features + Common workflows
 * Risk: R-001 (Performance score=8) - Search <200ms validated in P0
 */

import { test, expect } from '@playwright/test';
import { authenticatedAPICall } from '../../helpers/auth.helpers';

test.describe('Story 2.1 - P1: Búsqueda Predictiva Additional', () => {
  // Cleanup form state between tests to prevent state pollution
  test.afterEach(async ({ page }) => {
    // Clear form state by reloading the page
    await page.goto('/averias/nuevo');
    await page.waitForLoadState('domcontentloaded');
  });
  /**
   * P1-E2E-001: Borde izquierdo #7D1220 visible en resultados
   *
   * AC2: Given que se muestran resultados del autocomplete
   *       When veo cada resultado
   *       Then resultado tiene borde izquierdo rojo burdeos #7D1220
   */
  test.skip('[P1-E2E-001] should show red border on results', async ({ page }) => {
    await page.goto('/averias/nuevo');
    const searchInput = page.getByTestId('equipo-search');

    const searchPromise = page.waitForResponse('**/api/**/equipos/search**');
    await searchInput.fill('pren');
    await searchPromise;

    // Then: Borde izquierdo #7D1220
    const firstResult = page.locator('[role="option"]').first();
    await expect(firstResult).toHaveCSS('border-left-color', 'rgb(125, 18, 32)'); // #7D1220
    await expect(firstResult).toHaveCSS('border-left-width', '4px');
  });

  /**
   * P1-E2E-002: Input tiene placeholder "Buscar equipo..."
   *
   * AC1: Given que estoy en el formulario de reporte de avería
   *       When veo el input de búsqueda
   *       Then placeholder es "Buscar equipo..."
   */
  test.skip('[P1-E2E-002] should show correct placeholder', async ({ page }) => {
    await page.goto('/averias/nuevo');
    const searchInput = page.getByTestId('equipo-search');

    // Then: Placeholder correcto
    await expect(searchInput).toHaveAttribute('placeholder', 'Buscar equipo...');
  });

  /**
   * P1-E2E-003: Debouncing funciona (no spam server)
   *
   * AC1: Given que estoy escribiendo en el input
   *       When escribo rápidamente 5 caracteres
   *       Then solo se hace 1 llamada al server (después de 300ms)
   */
  test.skip('[P1-E2E-003] should debounce search input', async ({ page }) => {
    await page.goto('/averias/nuevo');
    const searchInput = page.getByTestId('equipo-search');

    // Track number of API calls
    let apiCallCount = 0;
    page.on('request', (request) => {
      if (request.url().includes('/equipos/search')) {
        apiCallCount++;
      }
    });

    // Type rápidamente (sin esperar entre keystrokes)
    await searchInput.fill('pren', { delay: 50 }); // 50ms entre keystrokes

    // Wait for debounced call to complete
    await page.waitForResponse('**/api/**/equipos/search**', { timeout: 1000 });

    // Then: Solo 1 llamada al server (debouncing funciona)
    // Nota: Si debouncing NO funciona, habrían 4 llamadas (p, pr, pre, pren)
    expect(apiCallCount).toBeLessThanOrEqual(1);
  });

  /**
   * P1-E2E-004: Resultados limitados a 10 máximo
   *
   * AC2: Given que hay más de 10 equipos que coinciden
   *       When se muestran resultados
   *       Then máximo 10 resultados visibles
   */
  test.skip('[P1-E2E-004] should limit results to 10', async ({ page }) => {
    await page.goto('/averias/nuevo');
    const searchInput = page.getByTestId('equipo-search');

    // Búsqueda amplia que puede tener >10 resultados
    const searchPromise = page.waitForResponse('**/api/**/equipos/search**');
    await searchInput.fill('p');
    await searchPromise;

    // Then: Máximo 10 resultados
    const results = page.locator('[role="option"]');
    const count = await results.count();
    expect(count).toBeLessThanOrEqual(10);
  });

  /**
   * P1-E2E-005: Jerarquía visible en formato correcto
   *
   * AC2: Given que selecciono un equipo
   *       When veo el badge del equipo seleccionado
   *       Then jerarquía visible: "División → Planta → Línea → Equipo"
   */
  test.skip('[P1-E2E-005] should show hierarchy in correct format', async ({ page }) => {
    await page.goto('/averias/nuevo');
    const searchInput = page.getByTestId('equipo-search');

    const searchPromise = page.waitForResponse('**/api/**/equipos/search**');
    await searchInput.fill('pren');
    await searchPromise;

    // Seleccionar equipo
    const firstResult = page.locator('[role="option"]').first();
    await firstResult.click();

    // Then: Badge muestra jerarquía completa
    const badge = page.locator('[data-testid="selected-equipo-badge"]');
    await expect(badge).toBeVisible();

    // Formato: "División → Planta → Línea → Equipo"
    // Ejemplo: "HiRock → HiRock → Línea 1 → Prensa PH-500"
    await expect(badge).toContainText('→');
  });

  /**
   * P1-E2E-006: Autocomplete se cierra al hacer click fuera
   *
   * AC3: Given que resultados de autocomplete visibles
   *       When hago click fuera del componente
   *       Then autocomplete se cierra
   */
  test.skip('[P1-E2E-006] should close autocomplete when clicking outside', async ({ page }) => {
    await page.goto('/averias/nuevo');
    const searchInput = page.getByTestId('equipo-search');

    const searchPromise = page.waitForResponse('**/api/**/equipos/search**');
    await searchInput.fill('pren');
    await searchPromise;

    // Autocomplete abierto
    await expect(page.locator('[role="listbox"]')).toBeVisible();

    // Click fuera del componente
    await page.locator('body').click({ position: { x: 100, y: 100 } });

    // Then: Autocomplete cerrado
    await expect(page.locator('[role="listbox"]')).not.toBeVisible();
  });

  /**
   * P1-E2E-007: Navegación con teclado funciona
   *
   * AC1, AC3: Given que resultados visibles
   *        When uso arrow keys y Enter
   *        Then puedo navegar y seleccionar con teclado
   */
  test.skip('[P1-E2E-007] should support keyboard navigation', async ({ page }) => {
    await page.goto('/averias/nuevo');
    const searchInput = page.getByTestId('equipo-search');

    const searchPromise = page.waitForResponse('**/api/**/equipos/search**');
    await searchInput.fill('pren');
    await searchPromise;

    // Navegar al segundo resultado con Arrow Down
    await searchInput.press('ArrowDown');
    await searchInput.press('ArrowDown');

    // Seleccionar con Enter
    await searchInput.press('Enter');

    // Then: Input completado con segundo resultado
    await expect(searchInput).not.toHaveValue('');

    // And: Autocomplete cerrado
    await expect(page.locator('[role="listbox"]')).not.toBeVisible();
  });
});
