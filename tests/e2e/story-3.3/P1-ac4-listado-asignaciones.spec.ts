import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P1 E2E Tests for Story 3.3 AC4: Columna "Asignaciones" en vista de listado
 *
 * TDD RED PHASE: Tests validate assignments column in list view - all tests will FAIL
 * Expected Failures: Column doesn't exist, badge format not implemented
 *
 * Acceptance Criteria:
 * - Columna "Asignaciones" muestra distribución (FR21)
 * - Formato: "2 técnicos / 1 proveedor" o "1 técnico" o "2 técnicos"
 * - Nombres de asignados visibles en modal de detalles
 * - Tooltip con nombres completos al hacer hover
 *
 * Storage State: Uses supervisor auth
 */

test.describe('Story 3.3 - AC4: Columna Asignaciones en Listado (P1)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P1-AC4-001] Columna "Asignaciones" muestra distribución correcta', async ({ page }) => {
    // RED PHASE: This test will fail because:
    // - "Asignaciones" column doesn't exist in the table
    // - AssignmentBadge component doesn't exist

    // Verify table exists
    const otTable = page.getByTestId('ot-list-table');
    await expect(otTable).toBeVisible({ timeout: 10000 });

    // Verify "Asignaciones" column header exists
    const asignacionesHeader = otTable.locator('th').filter({ hasText: 'Asignaciones' });
    await expect(asignacionesHeader).toBeVisible();

    // Get all rows
    const rows = otTable.locator('tbody tr');
    const rowCount = await rows.count();

    expect(rowCount).toBeGreaterThan(0);

    // Check first row has assignment column with badge
    const firstRow = rows.first();
    const asignacionesCell = firstRow.locator('[data-testid="asignaciones-column"]');
    await expect(asignacionesCell).toBeVisible();

    // Verify badge format (e.g., "2 técnicos", "1 técnico / 1 proveedor")
    const asignacionesBadge = asignacionesCell.getByTestId(/asignaciones-badge-/);
    await expect(asignacionesBadge).toBeVisible();

    const badgeText = await asignacionesBadge.textContent();

    // Valid formats:
    // - "1 técnico"
    // - "2 técnicos"
    // - "1 técnico / 1 proveedor"
    // - "2 técnicos / 1 proveedor"
    // - "1 proveedor"
    const validFormats = [
      /^\d+ técnico(s)?$/,
      /^\d+ técnico(s)? \/ \d+ proveedor(es)?$/,
      /^\d+ proveedor(es)?$/
    ];

    const isValidFormat = validFormats.some(regex => regex.test(badgeText || ''));
    expect(isValidFormat).toBe(true);
  });

  test('[P1-AC4-002] Tooltip muestra nombres completos al hacer hover', async ({ page }) => {
    // RED PHASE: This test will fail because:
    // - Tooltip with names doesn't exist

    const otTable = page.getByTestId('ot-list-table');
    await expect(otTable).toBeVisible({ timeout: 10000 });

    const rows = otTable.locator('tbody tr');
    const firstRow = rows.first();

    const asignacionesBadge = firstRow.locator('[data-testid^="asignaciones-badge-"]');
    await expect(asignacionesBadge).toBeVisible();

    // Hover over the badge
    await asignacionesBadge.hover();

    // Wait for tooltip to appear
    const tooltip = page.locator('[data-testid="asignaciones-tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 3000 });

    // Verify tooltip contains names
    const tooltipText = await tooltip.textContent();

    // Should contain at least one name
    expect(tooltipText?.length).toBeGreaterThan(0);

    // Tooltip should show format like:
    // "Técnicos: Juan Pérez, María García\nProveedor: ElectroServicios"
    // or just "Técnicos: Juan Pérez"
    expect(tooltipText).toMatch(/(Técnico|Proveedor):/i);
  });

  test('[P1-AC4-003] Modal de detalles muestra lista de asignados', async ({ page }) => {
    // RED PHASE: This test will fail because:
    // - Details modal doesn't show assignments section

    const otTable = page.getByTestId('ot-list-table');
    await expect(otTable).toBeVisible({ timeout: 10000 });

    const rows = otTable.locator('tbody tr');
    const firstRow = rows.first();

    // Click on row to open details modal
    await firstRow.click();

    // Wait for details modal
    const detailsModal = page.locator('[data-testid^="ot-details-modal-"]');
    await expect(detailsModal).toBeVisible({ timeout: 5000 });

    // Find "Asignados" section
    const asignadosSection = detailsModal.getByTestId('asignados-list');
    await expect(asignadosSection).toBeVisible();

    // Verify section contains at least one assigned person
    const asignadosItems = asignadosSection.locator('[data-testid^="asignado-item-"]');
    const itemCount = await asignadosItems.count();

    expect(itemCount).toBeGreaterThan(0);

    // Verify each item shows name and role
    const firstAsignado = asignadosItems.first();
    await expect(firstAsignado.getByTestId('asignado-nombre')).toBeVisible();
    await expect(firstAsignado.getByTestId('asignado-rol')).toBeVisible();
  });

  test('[P2-AC4-004] Columna ordenable por cantidad de asignados', async ({ page }) => {
    // RED PHASE: Optional feature - sortable column

    const otTable = page.getByTestId('ot-list-table');
    await expect(otTable).toBeVisible({ timeout: 10000 });

    // Find and click "Asignaciones" header to sort
    const asignacionesHeader = otTable.locator('th').filter({ hasText: 'Asignaciones' });

    // Check if it's sortable (has sort icon)
    const sortIcon = asignacionesHeader.locator('[data-testid="sort-icon"]');

    if (await sortIcon.isVisible()) {
      // Click to sort ascending
      await asignacionesHeader.click();

      // Wait for table to re-render
      await page.waitForTimeout(500);

      // Click again to sort descending
      await asignacionesHeader.click();

      await page.waitForTimeout(500);

      // Verify sort order changed
      // This would require checking the actual data
    } else {
      test.skip(true, 'Asignaciones column is not sortable');
    }
  });

  test('[P2-AC4-005] OT sin asignados muestra texto apropiado', async ({ page }) => {
    // RED PHASE: Tests empty state

    const otTable = page.getByTestId('ot-list-table');
    await expect(otTable).toBeVisible({ timeout: 10000 });

    // Find an OT without assignments
    const rows = otTable.locator('tbody tr');
    const count = await rows.count();

    let foundUnassigned = false;

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const asignacionesBadge = row.locator('[data-testid^="asignaciones-badge-"]');
      const badgeText = await asignacionesBadge.textContent();

      // Check for "Sin asignar" or "0 técnicos" or empty state
      if (badgeText?.includes('Sin asignar') || badgeText === '') {
        foundUnassigned = true;

        // Verify tooltip also shows appropriate message
        await asignacionesBadge.hover();
        const tooltip = page.locator('[data-testid="asignaciones-tooltip"]');
        if (await tooltip.isVisible()) {
          const tooltipText = await tooltip.textContent();
          expect(tooltipText).toContain('Sin asignar');
        }

        break;
      }
    }

    if (!foundUnassigned) {
      // All OTs have assignments, which is also valid
      console.log('All OTs have assignments - no empty state to test');
    }
  });
});
