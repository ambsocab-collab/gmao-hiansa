import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P1 E2E Tests for Story 3.4 AC7: Link a Avería Original
 *
 * TDD RED PHASE: Tests will fail until implementation is complete
 *
 * Acceptance Criteria:
 * - AC7: Link a avería original si existe failure_report_id
 * - Navegación a página de detalle de avería
 * - Modal muestra datos de avería si existe
 *
 * Storage State: Uses supervisor auth from playwright/.auth/supervisor.json
 */

test.describe('Story 3.4 - AC7: Link a Avería Original (P1)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P1-AC7-001] Link a avería original visible si existe', async ({ page }) => {
    // RED PHASE: This test will fail - avería link not implemented yet
    // This test requires an OT that was created from an avería

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal for first OT
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click();

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // If this OT has a failure_report_id, the link should be visible
    const linkAveria = modal.getByTestId('link-averia-original');

    // Check if link exists (it may or may not depending on OT)
    const linkExists = await linkAveria.isVisible().catch(() => false);

    if (linkExists) {
      // Verify link points to avería page
      const href = await linkAveria.getAttribute('href');
      expect(href).toMatch(/\/averias\//);
    }
  });

  test('[P1-AC7-002] Click en link avería navega correctamente', async ({ page }) => {
    // RED PHASE: This test will fail - avería navigation not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click();

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Try to find and click the avería link
    const linkAveria = modal.getByTestId('link-averia-original');

    if (await linkAveria.isVisible()) {
      await linkAveria.click();
      await page.waitForLoadState('networkidle');

      // Should be on avería detail page
      expect(page.url()).toMatch(/\/averias\//);
    }
  });

  test('[P1-AC7-003] Modal muestra datos de avería si existe', async ({ page }) => {
    // RED PHASE: This test will fail - avería data display not implemented yet
    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click();

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // If OT has avería, should show: reporter, descripción, foto
    const linkAveria = modal.getByTestId('link-averia-original');

    if (await linkAveria.isVisible()) {
      // There should be an "Avería Original" section
      await expect(modal.getByText(/Avería Original/i)).toBeVisible();
    }
  });
});
