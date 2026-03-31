import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.4 AC3: Ordenamiento por cualquier columna
 *
 * TDD RED PHASE: Tests will fail until implementation is complete
 *
 * Acceptance Criteria:
 * - Ordenamiento por cualquier columna (NFR-S28)
 * - Toggle ascendente/descendente
 * - Indicador visual de columna ordenada (icono ↑/↓)
 * - Sorting mantenido cuando cambio de página
 *
 * Storage State: Uses supervisor auth from playwright/.auth/supervisor.json
 */

test.describe('Story 3.4 - AC3: Ordenamiento por cualquier columna (P0)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P0-AC3-001] Headers de columnas son clickeables para ordenar', async ({ page }) => {
    // RED PHASE: This test will fail - sort-header-* doesn't exist yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Verify sortable headers exist
    const sortableHeaders = [
      'sort-header-numero',
      'sort-header-equipo',
      'sort-header-estado',
      'sort-header-tipo',
      'sort-header-asignados',
      'sort-header-fecha'
    ];

    for (const headerId of sortableHeaders) {
      const header = page.getByTestId(headerId);
      await expect(header).toBeVisible();
      await expect(header).toBeEnabled();
    }
  });

  test('[P0-AC3-002] Click en header ordena ascendente', async ({ page }) => {
    // RED PHASE: This test will fail - sorting not implemented yet

    const fechaHeader = page.getByTestId('sort-header-fecha');
    await expect(fechaHeader).toBeVisible({ timeout: 10000 });

    // Click to sort ascending
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Verify URL has sort params
    const url = page.url();
    expect(url).toMatch(/sortBy=|sortOrder=/);

    // Verify ascending indicator (↑)
    const sortIndicator = fechaHeader.locator('[data-testid="sort-indicator"]');
    await expect(sortIndicator).toBeVisible();

    // Should show ascending icon
    const indicatorText = await sortIndicator.textContent();
    expect(indicatorText).toContain('↑');
  });

  test('[P0-AC3-003] Segundo click toggle a descendente', async ({ page }) => {
    // RED PHASE: This test will fail - sorting toggle not implemented yet

    const fechaHeader = page.getByTestId('sort-header-fecha');
    await expect(fechaHeader).toBeVisible({ timeout: 10000 });

    // First click - ascending
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Second click - descending
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Verify descending indicator (↓)
    const sortIndicator = fechaHeader.locator('[data-testid="sort-indicator"]');
    const indicatorText = await sortIndicator.textContent();
    expect(indicatorText).toContain('↓');

    // Verify URL has sortOrder=desc
    const url = page.url();
    expect(url).toMatch(/sortOrder=desc/i);
  });

  test('[P0-AC3-004] Tercer click remueve ordenamiento', async ({ page }) => {
    // RED PHASE: This test will fail - sorting toggle cycle not implemented yet

    const fechaHeader = page.getByTestId('sort-header-fecha');
    await expect(fechaHeader).toBeVisible({ timeout: 10000 });

    // First click - ascending
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Second click - descending
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Third click - no sorting
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Verify no sort indicator or neutral indicator (↕)
    const sortIndicator = fechaHeader.locator('[data-testid="sort-indicator"]');
    const indicatorText = await sortIndicator.textContent();
    expect(indicatorText).toContain('↕');

    // URL should not have sort params (or default sort)
    const url = page.url();
    // Either no sort params or default sort
    expect(url).not.toMatch(/sortBy=fecha.*sortOrder=desc/);
  });

  test('[P0-AC3-005] Ordenar por columna Número', async ({ page }) => {
    // RED PHASE: This test will fail - sorting by numero not implemented yet

    const numeroHeader = page.getByTestId('sort-header-numero');
    await expect(numeroHeader).toBeVisible({ timeout: 10000 });

    // Click to sort
    await numeroHeader.click();
    await page.waitForLoadState('networkidle');

    // Get all OT numbers from the table
    const tabla = page.getByTestId('ots-lista-tabla');
    const numeroCells = tabla.locator('tbody tr td:first-child');
    const count = await numeroCells.count();

    if (count > 1) {
      const numbers: string[] = [];
      for (let i = 0; i < count; i++) {
        const text = await numeroCells.nth(i).textContent();
        if (text) numbers.push(text);
      }

      // Verify ascending order
      const sortedNumbers = [...numbers].sort();
      expect(numbers).toEqual(sortedNumbers);
    }
  });

  test('[P0-AC3-006] Ordenar por columna Fecha Creación', async ({ page }) => {
    // RED PHASE: This test will fail - sorting by fecha not implemented yet

    const fechaHeader = page.getByTestId('sort-header-fecha');
    await expect(fechaHeader).toBeVisible({ timeout: 10000 });

    // Click to sort descending (most recent first)
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Verify URL has sortBy=created_at&sortOrder=desc
    const url = page.url();
    expect(url).toMatch(/sortBy=.*fecha|created_at/);
    expect(url).toMatch(/sortOrder=desc/);
  });

  test('[P0-AC3-007] Sorting se mantiene al cambiar de página', async ({ page }) => {
    // RED PHASE: This test will fail - sorting persistence not implemented yet

    const fechaHeader = page.getByTestId('sort-header-fecha');
    await expect(fechaHeader).toBeVisible({ timeout: 10000 });

    // Sort by fecha descending
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Verify sort is applied
    let url = page.url();
    expect(url).toMatch(/sortOrder=desc/);

    // Go to next page if available
    const nextButton = page.getByTestId('btn-next-page');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // Verify sort is still applied
      url = page.url();
      expect(url).toMatch(/sortOrder=desc/);

      // Verify sort indicator still shows
      const sortIndicator = fechaHeader.locator('[data-testid="sort-indicator"]');
      await expect(sortIndicator).toBeVisible();
    }
  });

  test('[P0-AC3-008] Cambiar columna de ordenamiento resetea toggle', async ({ page }) => {
    // RED PHASE: This test will fail - sorting reset not implemented yet

    const fechaHeader = page.getByTestId('sort-header-fecha');
    const numeroHeader = page.getByTestId('sort-header-numero');

    await expect(fechaHeader).toBeVisible({ timeout: 10000 });

    // Sort by fecha descending
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Now sort by numero (should start at ascending)
    await numeroHeader.click();
    await page.waitForLoadState('networkidle');

    // Verify URL shows sortBy=numero and sortOrder=asc
    const url = page.url();
    expect(url).toMatch(/sortBy=numero|number/);
    expect(url).toMatch(/sortOrder=asc/);

    // Fecha header should show neutral indicator
    const fechaIndicator = fechaHeader.locator('[data-testid="sort-indicator"]');
    const fechaIndicatorText = await fechaIndicator.textContent();
    expect(fechaIndicatorText).toContain('↕');
  });

  test('[P0-AC3-009] URL compartible con sorting', async ({ page }) => {
    // RED PHASE: This test will fail - URL sort params not implemented yet

    // Navigate directly to URL with sort params
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista?sortBy=created_at&sortOrder=desc`);
    await page.waitForLoadState('networkidle');

    // Verify sort is applied from URL
    const fechaHeader = page.getByTestId('sort-header-fecha');
    const sortIndicator = fechaHeader.locator('[data-testid="sort-indicator"]');
    await expect(sortIndicator).toBeVisible();

    const indicatorText = await sortIndicator.textContent();
    expect(indicatorText).toContain('↓');
  });

  test('[P0-AC3-010] Sorting con filtros aplicados', async ({ page }) => {
    // RED PHASE: This test will fail - combined filters + sorting not implemented yet

    // Apply a filter first
    const filtroTipo = page.getByTestId('filtro-tipo');
    await filtroTipo.click();

    // Wait for dropdown to open and options to be visible
    const tipoOption = page.getByTestId('tipo-option-CORRECTIVO');
    await expect(tipoOption).toBeVisible({ timeout: 5000 });
    await tipoOption.click();
    await page.waitForLoadState('networkidle');

    // Now apply sorting
    const fechaHeader = page.getByTestId('sort-header-fecha');
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Verify URL has both filter and sort params
    const url = page.url();
    expect(url).toMatch(/tipo=/);
    expect(url).toMatch(/sortBy=/);
  });
});
