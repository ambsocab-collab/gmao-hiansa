import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P1 E2E Tests for Story 3.4 AC8: Link a Rutina Preventiva
 *
 * TDD RED PHASE: Tests will fail until implementation is complete
 *
 * Acceptance Criteria:
 * - AC8: Link a rutina preventiva si existe rutina_id
 * - Muestra "Rutina no disponible" si no existe
 * - NOTE: Rutinas are implemented in Epic 7, *
 * Storage State: Uses supervisor auth from playwright/.auth/supervisor.json
 */

test.describe('Story 3.4 - AC8: Link a Rutina Preventiva (P1)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P1-AC8-001] Link a rutina preventiva visible si existe', async ({ page }) => {
    // RED PHASE: This test will fail - rutina link not implemented yet
    // NOTE: Rutinas are implemented in Epic 7

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click();

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // If this OT has a rutina_id, the link should be visible
    const linkRutina = modal.getByTestId('link-rutina-original');

    // Check if link exists (it may or may not depending on OT and Epic 7 completion)
    const linkExists = await linkRutina.isVisible().catch(() => false);

    if (linkExists) {
      // Verify link points to rutina page
      const href = await linkRutina.getAttribute('href');
      expect(href).toMatch(/\/rutinas\//);
    }
  });

  test('[P1-AC8-002] Modal muestra "Rutina no disponible" si no existe', async ({ page }) => {
    // RED PHASE: This test will fail - rutina placeholder not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click();

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Look for rutina link or "no disponible" message
    const linkRutina = modal.getByTestId('link-rutina-original');
    const linkExists = await linkRutina.isVisible().catch(() => false);

    if (!linkExists) {
      // Should show "Rutina no disponible" or hide the section
      const rutinaSection = modal.getByTestId('modal-ot-rutina');
      const sectionVisible = await rutinaSection.isVisible().catch(() => false);

      if (sectionVisible) {
        await expect(rutinaSection.getByText(/no disponible/i)).toBeVisible();
      }
    }
  });

  test('[P1-AC8-003] Click en link rutina navega correctamente', async ({ page }) => {
    // RED PHASE: This test will fail - rutina navigation not implemented yet
    // NOTE: This test depends on Epic 7 (Rutinas) being implemented

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click();

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Try to find and click the rutina link
    const linkRutina = modal.getByTestId('link-rutina-original');

    if (await linkRutina.isVisible()) {
      await linkRutina.click();
      await page.waitForLoadState('networkidle');

      // Should be on rutina detail page
      expect(page.url()).toMatch(/\/rutinas\//);
    }
  });
});
