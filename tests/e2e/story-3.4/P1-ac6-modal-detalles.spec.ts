import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P1 E2E Tests for Story 3.4 AC6: Modal de Detalles
 *
 * TDD RED PHASE: Tests will fail until implementation is complete
 *
 * Acceptance Criteria:
 * - AC6: Modal informativo con detalles completos (NFR-S24)
 * - Modal puede cerrarse con click en "X", ESC key, o click fuera
 *
 * Storage State: Uses supervisor auth from playwright/.auth/supervisor.json
 */

test.describe('Story 3.4 - AC6: Modal de Detalles (P1)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P1-AC6-001] Modal se abre al hacer click en "Ver Detalles"', async ({ page }) => {
    // RED PHASE: This test will fail - modal not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Find first OT row
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    await expect(firstRow).toBeVisible();

    // Click "Ver Detalles" button
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click();

    // Modal should open
    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('[P1-AC6-002] Modal muestra secciones de información', async ({ page }) => {
    // RED PHASE: This test will fail - modal sections not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click();

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Verify sections exist
    const secciones = [
      'modal-ot-fechas',
      'modal-ot-origen',
      'modal-ot-asignados',
      'modal-ot-repuestos',
      'modal-ot-comentarios'
    ];

    for (const seccion of secciones) {
      const section = modal.getByTestId(seccion);
      await expect(section).toBeVisible();
    }
  });

  test('[P1-AC6-003] Sección fechas muestra datos correctos', async ({ page }) => {
    // RED PHASE: This test will fail - fecha section not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click()

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Verify fecha section has expected labels
    const fechasSection = modal.getByTestId('modal-ot-fechas');
    await expect(fechasSection).toBeVisible();

    // Should show: Creación, Asignación, Última actualización
    await expect(fechasSection.getByText(/Creación/i)).toBeVisible();
    await expect(fechasSection.getByText(/Actualización/i)).toBeVisible();
  });

  test('[P1-AC6-004] Sección origen muestra datos correctos', async ({ page }) => {
    // RED PHASE: This test will fail - origen section not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click()

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Verify origen section
    const origenSection = modal.getByTestId('modal-ot-origen');
    await expect(origenSection).toBeVisible();

    // Should show tipo de origen: avería, rutina, o manual
    await expect(origenSection.getByText(/Origen/i)).toBeVisible();
  });

  test('[P1-AC6-005] Modal cierra con click en X', async ({ page }) => {
    // RED PHASE: This test will fail - close button not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click();

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Click X button
    const closeBtn = modal.getByTestId('btn-cerrar-modal');
    await closeBtn.click();

    // Modal should close
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test('[P1-AC6-006] Modal cierra con tecla ESC', async ({ page }) => {
    // RED PHASE: This test will fail - ESC close not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click()

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Press ESC
    await page.keyboard.press('Escape');

    // Modal should close
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test('[P1-AC6-007] Modal cierra con click fuera', async ({ page }) => {
    // RED PHASE: This test will fail - click outside close not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click()

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Click outside modal (on overlay)
    const overlay = page.locator('[data-state="open"]').first();
    await overlay.click({ position: { x: 0, y: 0 } });

    // Modal should close
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test('[P1-AC6-008] Sección asignados muestra técnicos', async ({ page }) => {
    // RED PHASE: This test will fail - asignados section not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click()

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Verify asignados section
    const asignadosSection = modal.getByTestId('modal-ot-asignados');
    await expect(asignadosSection).toBeVisible();

    // Should show either assigned technicians or "Sin asignar"
    const content = await asignadosSection.textContent();
    expect(content).toBeTruthy();
  });

  test('[P1-AC6-009] Sección repuestos muestra lista', async ({ page }) => {
    // RED PHASE: This test will fail - repuestos section not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click()

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Verify repuestos section
    const repuestosSection = modal.getByTestId('modal-ot-repuestos');
    await expect(repuestosSection).toBeVisible();

    // Should show list of repuestos or "Sin repuestos"
    const content = await repuestosSection.textContent();
    expect(content).toBeTruthy();
  });

  test('[P1-AC6-010] Sección comentarios muestra historial', async ({ page }) => {
    // RED PHASE: This test will fail - comments section not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Open modal
    const firstRow = tabla.locator('[data-testid^="ot-row-"]').first();
    const verDetallesBtn = firstRow.getByTestId('btn-ver-detalles');
    await verDetallesBtn.click()

    const modal = page.locator('[data-testid^="modal-ot-info-"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Verify comentarios section
    const comentariosSection = modal.getByTestId('modal-ot-comentarios');
    await expect(comentariosSection).toBeVisible();

    // Should show comments or "Sin comentarios"
    const content = await comentariosSection.textContent();
    expect(content).toBeTruthy();
  });
});
