import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.4 AC1: Tabla de OTs con Paginación
 *
 * TDD RED PHASE: Tests will fail until implementation is complete
 *
 * Acceptance Criteria:
 * - Tabla con todas las OTs de la organización (NFR-S21)
 * - Columnas: Número, Equipo, Estado, Tipo, Asignados, Fecha Creación, Acciones
 * - data-testid="ots-lista-tabla"
 * - Paginación: 100 OTs por página (NFR-SC4)
 *
 * Storage State: Uses supervisor auth from playwright/.auth/supervisor.json
 */

test.describe('Story 3.4 - AC1: Tabla de OTs con Paginación (P0)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P0-AC1-001] Tabla de OTs visible con columnas correctas', async ({ page }) => {
    // RED PHASE: This test will fail - ots-lista-tabla doesn't exist yet

    // Verify table exists
    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Verify header row exists
    const headerRow = tabla.locator('thead tr');
    await expect(headerRow).toBeVisible();

    // Verify required columns exist
    const expectedColumns = [
      'Número',
      'Equipo',
      'Estado',
      'Tipo',
      'Asignaciones',
      'Fecha Creación',
      'Acciones'
    ];

    for (const columnName of expectedColumns) {
      const header = tabla.locator('th', { hasText: columnName });
      await expect(header).toBeVisible();
    }
  });

  test('[P0-AC1-002] Tabla muestra OTs con datos correctos', async ({ page }) => {
    // RED PHASE: This test will fail - ot-row-* doesn't exist yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Verify at least one OT row exists
    const otRows = tabla.locator('[data-testid^="ot-row-"]');
    const rowCount = await otRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Verify first row has required cells
    const firstRow = otRows.first();

    // Check for OT number format (OT-YYYY-NNN)
    // Note: First cell is checkbox, second cell is OT number
    const numeroCell = firstRow.locator('td').nth(1);
    const numeroText = await numeroCell.textContent();
    expect(numeroText).toMatch(/OT-\d{4}-\d{3}/);

    // Check for estado badge
    const estadoBadge = firstRow.locator('[data-testid^="estado-badge-"]');
    await expect(estadoBadge).toBeVisible();

    // Check for actions column
    const accionesCell = firstRow.locator('[data-testid="acciones-ot"]');
    await expect(accionesCell).toBeVisible();
  });

  test('[P0-AC1-003] Paginación funciona correctamente (100 por página)', async ({ page }) => {
    // RED PHASE: This test will fail - pagination-controls doesn't exist yet

    // Verify pagination controls exist
    const paginationControls = page.getByTestId('pagination-controls');
    await expect(paginationControls).toBeVisible({ timeout: 10000 });

    // Verify pagination info shows format "Mostrando X-Y de Z"
    const paginationInfo = page.getByTestId('pagination-info');
    await expect(paginationInfo).toBeVisible();
    const infoText = await paginationInfo.textContent();
    expect(infoText).toMatch(/Mostrando \d+-\d+ de \d+/);

    // If more than 100 OTs exist, verify pagination buttons work
    const nextButton = page.getByTestId('btn-next-page');

    if (await nextButton.isEnabled()) {
      // Get current page info
      const initialInfo = await paginationInfo.textContent();

      // Click next page
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // Verify page changed
      const newInfo = await paginationInfo.textContent();
      expect(newInfo).not.toBe(initialInfo);

      // Verify previous button is now enabled
      const prevButton = page.getByTestId('btn-prev-page');
      await expect(prevButton).toBeEnabled();
    }
  });

  test('[P0-AC1-004] Navegación entre páginas funciona', async ({ page }) => {
    // RED PHASE: This test will fail - pagination buttons don't exist yet

    const paginationControls = page.getByTestId('pagination-controls');
    await expect(paginationControls).toBeVisible({ timeout: 10000 });

    const nextButton = page.getByTestId('btn-next-page');
    const prevButton = page.getByTestId('btn-prev-page');
    const firstButton = page.getByTestId('btn-first-page');
    const lastButton = page.getByTestId('btn-last-page');

    // First page: prev and first should be disabled
    await expect(prevButton).toBeDisabled();
    await expect(firstButton).toBeDisabled();

    // If multiple pages exist, test navigation
    if (await nextButton.isEnabled()) {
      // Go to next page
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // Prev and first should now be enabled
      await expect(prevButton).toBeEnabled();
      await expect(firstButton).toBeEnabled();

      // Go to last page
      await lastButton.click();
      await page.waitForLoadState('networkidle');

      // Next and last should be disabled
      await expect(nextButton).toBeDisabled();
      await expect(lastButton).toBeDisabled();

      // Go back to first page
      await firstButton.click();
      await page.waitForLoadState('networkidle');

      // Verify back at first page
      await expect(prevButton).toBeDisabled();
      await expect(firstButton).toBeDisabled();
    }
  });

  test('[P0-AC1-005] URL refleja página actual', async ({ page }) => {
    // RED PHASE: This test will fail - pagination URL params not implemented yet

    const nextButton = page.getByTestId('btn-next-page');

    if (await nextButton.isEnabled()) {
      // Initial URL should not have page param or page=1
      const initialUrl = page.url();
      const initialPageMatch = initialUrl.match(/page=(\d+)/);
      const initialPage = initialPageMatch ? parseInt(initialPageMatch[1]) : 1;
      expect(initialPage).toBe(1);

      // Click next
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // URL should now have page=2
      const newUrl = page.url();
      expect(newUrl).toContain('page=2');
    }
  });

  test('[P0-AC1-006] Supervisor sin can_view_all_ots no puede ver lista', async ({ page, context }) => {
    // This test verifies PBAC - uses a different auth context
    // Skip if we don't have a tecnico auth file
    // This is tested separately in PBAC tests
    test.skip();
  });
});
