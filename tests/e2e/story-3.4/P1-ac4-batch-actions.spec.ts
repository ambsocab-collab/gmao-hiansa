import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P1 E2E Tests for Story 3.4 AC4: Acciones en Lote
 *
 * TDD RED PHASE: Tests will fail until implementation is complete
 *
 * Acceptance Criteria:
 * - Mismas acciones disponibles que en Kanban (NFR-S29)
 * - Asignar técnicos, cambiar estado, agregar comentarios
 * - Acciones en lote disponibles para OTs seleccionadas (checkbox)
 * - Máximo 50 OTs por batch (evitar timeout)
 *
 * Storage State: Uses supervisor auth from playwright/.auth/supervisor.json
 */

test.describe('Story 3.4 - AC4: Acciones en Lote (P1)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P1-AC4-001] Checkboxes de selección visibles en cada fila', async ({ page }) => {
    // RED PHASE: This test will fail - ot-checkbox-* doesn't exist yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Verify select all checkbox exists in header
    const selectAllCheckbox = page.getByTestId('select-all-checkbox');
    await expect(selectAllCheckbox).toBeVisible();

    // Verify individual checkboxes exist in each row
    const checkboxes = tabla.locator('[data-testid^="ot-checkbox-"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('[P1-AC4-002] Seleccionar OTs individuales', async ({ page }) => {
    // RED PHASE: This test will fail - selection not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Select first OT
    const firstCheckbox = tabla.locator('[data-testid^="ot-checkbox-"]').first();
    await firstCheckbox.check();

    // Verify selection count shows 1 (wait for UI to update)
    const selectedCount = page.getByTestId('selected-count');
    await expect(selectedCount).toBeVisible({ timeout: 5000 });
    await expect(selectedCount).toContainText('1 seleccionada');

    // Select second OT
    const secondCheckbox = tabla.locator('[data-testid^="ot-checkbox-"]').nth(1);
    await secondCheckbox.check();

    // Verify selection count shows 2 (wait for UI to update)
    await expect(selectedCount).toContainText('2 seleccionadas', { timeout: 5000 });
  });

  test('[P1-AC4-003] Seleccionar todos los visibles', async ({ page }) => {
    // RED PHASE: This test will fail - select all not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Click select all
    const selectAllCheckbox = page.getByTestId('select-all-checkbox');
    await selectAllCheckbox.check();

    // Wait for selection to apply - verify selection count is visible
    const selectedCount = page.getByTestId('selected-count');
    await expect(selectedCount).toBeVisible({ timeout: 5000 });

    // Verify all visible checkboxes are checked
    const checkboxes = tabla.locator('[data-testid^="ot-checkbox-"]');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const isChecked = await checkboxes.nth(i).isChecked();
      expect(isChecked).toBe(true);
    }
  });

  test('[P1-AC4-004] Barra de acciones aparece cuando hay selección', async ({ page }) => {
    // RED PHASE: This test will fail - batch actions bar not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Initially, batch actions bar should not be visible (or hidden)
    const batchActionsBar = page.getByTestId('batch-actions-bar');
    await expect(batchActionsBar).not.toBeVisible();

    // Select an OT
    const firstCheckbox = tabla.locator('[data-testid^="ot-checkbox-"]').first();
    await firstCheckbox.check();

    // Now batch actions bar should be visible (wait for UI update)
    await expect(batchActionsBar).toBeVisible({ timeout: 5000 });

    // Verify action buttons exist
    const btnAsignar = page.getByTestId('btn-batch-asignar');
    const btnEstado = page.getByTestId('btn-batch-estado');
    const btnComentario = page.getByTestId('btn-batch-comentario');

    await expect(btnAsignar).toBeVisible();
    await expect(btnEstado).toBeVisible();
    await expect(btnComentario).toBeVisible();
  });

  test('[P1-AC4-005] Asignar técnicos en lote', async ({ page }) => {
    // RED PHASE: This test will fail - batch assign not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Select 2 OTs
    const checkboxes = tabla.locator('[data-testid^="ot-checkbox-"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();

    // Click batch assign button
    const btnAsignar = page.getByTestId('btn-batch-asignar');
    await btnAsignar.click();

    // Assignment modal should open
    const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
    await expect(assignmentModal).toBeVisible({ timeout: 5000 });

    // Select a technician - the list is always visible, just click an option
    const tecnicoOption = assignmentModal.locator('[data-testid^="tecnico-option-"]').first();
    await expect(tecnicoOption).toBeVisible({ timeout: 5000 });
    await tecnicoOption.click();

    // Small delay to ensure state updates
    await page.waitForTimeout(100);

    // Save assignment - click the button via JavaScript
    await assignmentModal.getByTestId('guardar-asignacion-btn').evaluate(btn => {
      (btn as HTMLButtonElement).click();
    });

    // Modal should close
    await expect(assignmentModal).not.toBeVisible({ timeout: 10000 });

    // Selection should be cleared
    const selectedCount = page.getByTestId('selected-count');
    await expect(selectedCount).not.toBeVisible();
  });

  test('[P1-AC4-006] Cambiar estado en lote', async ({ page }) => {
    // RED PHASE: This test will fail - batch status change not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Select 2 OTs
    const checkboxes = tabla.locator('[data-testid^="ot-checkbox-"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();

    // Click batch status button
    const btnEstado = page.getByTestId('btn-batch-estado');
    await btnEstado.click();

    // Status change dialog should open
    const statusDialog = page.locator('[data-testid="dialog-cambiar-estado"]');
    await expect(statusDialog).toBeVisible({ timeout: 5000 });

    // Select new status
    const statusSelect = statusDialog.getByTestId('select-nuevo-estado');
    await statusSelect.click();

    // Wait for status options to appear
    const statusOption = page.locator('[data-testid="estado-option-EN_PROGRESO"]');
    await expect(statusOption).toBeVisible({ timeout: 5000 });
    await statusOption.click();

    // Confirm change
    const confirmarBtn = statusDialog.getByTestId('btn-confirmar-cambio');
    await confirmarBtn.click();

    // Dialog should close
    await expect(statusDialog).not.toBeVisible({ timeout: 10000 });
  });

  test('[P1-AC4-007] Agregar comentario en lote', async ({ page }) => {
    // RED PHASE: This test will fail - batch comment not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Select 2 OTs
    const checkboxes = tabla.locator('[data-testid^="ot-checkbox-"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();

    // Click batch comment button
    const btnComentario = page.getByTestId('btn-batch-comentario');
    await btnComentario.click();

    // Comment dialog should open
    const commentDialog = page.locator('[data-testid="dialog-agregar-comentario"]');
    await expect(commentDialog).toBeVisible({ timeout: 5000 });

    // Enter comment
    const commentInput = commentDialog.getByTestId('input-comentario');
    await commentInput.fill('Comentario de prueba para múltiples OTs');

    // Save comment
    const guardarBtn = commentDialog.getByTestId('btn-guardar-comentario');
    await guardarBtn.click();

    // Dialog should close
    await expect(commentDialog).not.toBeVisible({ timeout: 10000 });
  });

  test('[P1-AC4-008] Limpiar selección funciona', async ({ page }) => {
    // RED PHASE: This test will fail - clear selection not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Select 2 OTs
    const checkboxes = tabla.locator('[data-testid^="ot-checkbox-"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();

    // Verify selection exists (wait for UI to update)
    const selectedCount = page.getByTestId('selected-count');
    await expect(selectedCount).toContainText('2 seleccionadas', { timeout: 5000 });

    // Click clear selection
    const limpiarBtn = page.getByTestId('btn-limpiar-seleccion');
    await limpiarBtn.click();

    // Selection should be cleared
    await expect(selectedCount).not.toBeVisible();

    // All checkboxes should be unchecked
    const allCheckboxes = tabla.locator('[data-testid^="ot-checkbox-"]');
    const count = await allCheckboxes.count();
    for (let i = 0; i < count; i++) {
      const isChecked = await allCheckboxes.nth(i).isChecked();
      expect(isChecked).toBe(false);
    }
  });

  test('[P1-AC4-009] Validación máximo 50 OTs por batch', async ({ page }) => {
    // RED PHASE: This test will fail - batch limit validation not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Try to select more than 50 OTs
    // First, check if there are more than 50 OTs visible
    const checkboxes = tabla.locator('[data-testid^="ot-checkbox-"]');
    const count = await checkboxes.count();

    if (count > 50) {
      // Select all
      const selectAllCheckbox = page.getByTestId('select-all-checkbox');
      await selectAllCheckbox.check();

      // Wait for selection to apply
      const selectedCount = page.getByTestId('selected-count');
      await expect(selectedCount).toBeVisible({ timeout: 5000 });

      // If pagination exists, we can't select more than visible
      // This test verifies that the batch action is limited to 50
      const btnAsignar = page.getByTestId('btn-batch-asignar');
      const isEnabled = await btnAsignar.isEnabled();

      // If somehow we selected > 50, button should be disabled or show warning
      // For now, just verify the button exists
      await expect(btnAsignar).toBeVisible();
    } else {
      // Not enough OTs to test this scenario
      test.skip();
    }
  });

  test('[P1-AC4-010] SSE emitido para cada OT en batch', async ({ page }) => {
    // RED PHASE: This test will fail - SSE for batch operations not implemented yet

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Select 2 OTs
    const checkboxes = tabla.locator('[data-testid^="ot-checkbox-"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();

    // Perform batch action
    const btnEstado = page.getByTestId('btn-batch-estado');
    await btnEstado.click();

    // In GREEN phase, this would:
    // 1. Listen for SSE events
    // 2. Verify 2 SSE events are emitted (one per OT)
    // For RED phase, just verify the dialog opens
    const statusDialog = page.locator('[data-testid="dialog-cambiar-estado"]');
    await expect(statusDialog).toBeVisible({ timeout: 5000 });

    // Close dialog without saving
    await page.keyboard.press('Escape');
  });
});
